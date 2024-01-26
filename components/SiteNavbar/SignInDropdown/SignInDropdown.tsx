'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// next-auth:
import {
    useSession,
}                           from 'next-auth/react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    Icon,
    
    
    
    // layout-components:
    ListItem,
    ListSeparatorItem,
    
    ListProps,
    List,
    
    
    
    // menu-components:
    Dropdown,
    DropdownListExpandedChangeEvent,
    DropdownListProps,
    DropdownList,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    EditButton,
}                           from '@/components/EditButton'
import {
    ProfileImage,
}                           from '@/components/ProfileImage'

// internals:
import {
    useSignInMenuStyleSheet,
}                           from '../styles/loader'
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'



// react components:
export type SignInDropdownResult =
    |'editProfile'
    |'signOut'
export interface SignInDropdownProps<TElement extends Element = HTMLElement, TDropdownListExpandedChangeEvent extends DropdownListExpandedChangeEvent<SignInDropdownResult> = DropdownListExpandedChangeEvent<SignInDropdownResult>>
    extends
        // bases:
        DropdownListProps<TElement, TDropdownListExpandedChangeEvent>
{
    // states:
    navbarExpanded : boolean // out of <NavbarContextProvider>, we need to drill props the navbar's state
}
const SignInDropdown = (props: SignInDropdownProps): JSX.Element|null => {
    // styles:
    const styleSheet = useSignInMenuStyleSheet();
    
    
    
    // rest props:
    const {
        // states:
        navbarExpanded,
        
        
        
        // components:
        listComponent = (<List /> as React.ReactComponentElement<any, ListProps>),
    ...restDropdownListProps} = props;
    
    
    
    // sessions:
    const { data: session } = useSession();
    const { name: userName, email: userEmail, image: userImage } = session?.user ?? {};
    
    
    
    // handlers:
    const handleClose = useEvent((event: React.MouseEvent<HTMLElement, MouseEvent>, data: SignInDropdownResult): void => {
        props.onExpandedChange?.({ expanded: false, actionType: 'ui', data: data });
        event.preventDefault();
    });
    
    
    
    // jsx:
    return (
        <DropdownList
            // other props:
            {...restDropdownListProps}
            
            
            
            // classes:
            className={styleSheet.signInDropdown}
            
            
            
            // components:
            listComponent={listComponent}
            dropdownComponent={
                <Dropdown
                    // classes:
                    className={`${styleSheet.signInDropdownDropdown} ${!navbarExpanded ? 'navbarCollapsed' : ''}`}
                >
                    {listComponent}
                </Dropdown>
            }
        >
            <ListItem
                // classes:
                className={styleSheet.signInEditProfile}
                
                
                
                // behaviors:
                actionCtrl={false}
            >
                <ProfileImage
                    // appearances:
                    src={resolveMediaUrl(userImage ?? undefined)}
                    
                    
                    
                    // variants:
                    profileImageStyle='circle'
                    
                    
                    
                    // classes:
                    className='image'
                />
                <span
                    // classes:
                    className='name'
                >
                    {userName}
                </span>
                <span
                    // classes:
                    className='email'
                >
                    {userEmail}
                </span>
                <EditButton
                    // classes:
                    className='edit'
                    
                    
                    
                    // handlers:
                    onClick={(event) => handleClose(event, 'editProfile')}
                >
                    Edit Profile
                </EditButton>
            </ListItem>
            <ListSeparatorItem />
            <ListItem onClick={(event) => handleClose(event, 'signOut')}>
                <Icon icon='logout' size='md' />
                <span>
                    Sign Out
                </span>
            </ListItem>
        </DropdownList>
    );
};
export {
    SignInDropdown,
    SignInDropdown as default,
}