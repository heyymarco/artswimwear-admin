'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useMemo,
}                           from 'react'

// next-auth:
import {
    useSession,
}                           from 'next-auth/react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'               // writes css in react hook

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // status-components:
    Badge,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    Main,
    Section,
}                           from '@heymarco/section'

// internal components:
import {
    ProfileImage,
}                           from '@/components/ProfileImage'
import {
    EditButton,
}                           from '@/components/EditButton'
import {
    CompoundWithBadge,
}                           from '@/components/CompoundWithBadge'
import {
    NameEditor,
}                           from '@/components/editors/NameEditor'
import {
    UniqueUsernameEditor,
}                           from '@/components/editors/UniqueUsernameEditor'
import {
    SimpleEditModelDialogResult,
    SimpleEditModelDialog,
}                           from '@/components/dialogs/SimpleEditModelDialog'
import {
    SimpleEditUserImageDialog,
}                           from '@/components/dialogs/SimpleEditUserImageDialog'

// stores:
import {
    // types:
    UserDetail,
    
    
    
    // hooks:
    useUpdateUser,
}                           from '@/store/features/api/apiSlice'

// internals:
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'



// styles:
const useProfilePageStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './page-styles')
, { id: 'pmmu5ep2va' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



export function ProfilePageContent() {
    // styles:
    const styleSheet = useProfilePageStyleSheet();
    
    
    
    // sessions:
    const { data: session, update: updateSession } = useSession();
    const user = session?.user;
    const userUsername = session?.credentials?.username ?? null;
    const userModel = useMemo<Omit<UserDetail, 'roleId'>|null>(() => {
        if (!user) return null;
        
        
        
        return {
            id       : user.id,
            name     : user.name,
            email    : user.email,
            image    : user.image,
            username : userUsername,
        } satisfies Omit<UserDetail, 'roleId'>;
    }, [user, userUsername]);
    const { name: userHumanName, email: userEmail, image: userImage } = userModel ?? {};
    
    
    
    // dialogs:
    const {
        showDialog,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handleEdit = useEvent(async (edit: 'image'|'name'|'username') => {
        const updatedUserModel = await showDialog<SimpleEditModelDialogResult<Omit<UserDetail, 'roleId'>>>(
            (edit === 'image')
            ? <SimpleEditUserImageDialog
                // data:
                model={userModel!}
                edit={edit}
                
                
                
                // stores:
                updateModelApi={useUpdateUser as any}
            />
            : <SimpleEditModelDialog<Omit<UserDetail, 'roleId'>>
                // data:
                model={userModel!}
                edit={edit}
                
                
                
                // stores:
                updateModelApi={useUpdateUser as any}
                
                
                
                // components:
                editorComponent={(() => {
                    switch (edit) {
                        case 'name'     : return <NameEditor />;
                        case 'username' : return <UniqueUsernameEditor currentValue={userModel!['username'] ?? ''} />;
                        default         : throw Error('app error');
                    } // switch
                })()}
            />
        );
        if (updatedUserModel === undefined) return;
        updateSession();
    });
    
    
    
    // jsx:
    return (
        <Main className={styleSheet.main}>
            <Section className='fill-self'>
                {/* profile image + edit button */}
                <CompoundWithBadge
                    // components:
                    wrapperComponent={<React.Fragment />}
                    badgeComponent={
                        <Badge
                            // variants:
                            nude={true}
                            
                            
                            
                            // floatable:
                            floatingPlacement='left-start'
                            floatingShift={8}
                            floatingOffset={-26}
                        >
                            <EditButton className='edit overlay' onClick={() => handleEdit('image')}>
                                <></>
                            </EditButton>
                        </Badge>
                    }
                    elementComponent={
                        <ProfileImage
                            // appearances:
                            src={resolveMediaUrl(userImage ?? undefined)}
                            
                            
                            
                            // variants:
                            theme='primary'
                            // profileImageStyle='circle'
                            
                            
                            
                            // classes:
                            className='image'
                        />
                    }
                />
                
                <h3 className='name'>
                    <span className='label'>
                        Name:
                    </span>
                    {userHumanName}
                    <EditButton onClick={() => handleEdit('name')} />
                </h3>
                
                <p className='username'>
                    <span className='label'>
                        Username:
                    </span>
                    {userUsername || <span className='noValue'>No Username</span>}
                    <EditButton onClick={() => handleEdit('username')} />
                </p>
                
                <p className='email'>
                    <span className='label'>
                        Email:
                    </span>
                    {userEmail}
                </p>
            </Section>
        </Main>
    );
}
