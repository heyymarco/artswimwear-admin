'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useState,
}                           from 'react'

// // next-js:
// import type {
//     Metadata,
// }                           from 'next'

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
    // base-components:
    Generic,
    Basic,
    
    
    
    // simple-components:
    Icon,
    
    
    
    // layout-components:
    ListItem,
    
    
    
    // status-components:
    Badge,
    Busy,
    
    
    
    // utility-components:
    ModalStatus,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    ModelPreviewProps,
}                           from '@/components/SectionModelEditor'
import {
    EditButton,
}                           from '@/components/EditButton'
import {
    NameEditor,
}                           from '@/components/editors/NameEditor'
import {
    UniqueUsernameEditor,
}                           from '@/components/editors/UniqueUsernameEditor'
import {
    UniqueEmailEditor,
}                           from '@/components/editors/UniqueEmailEditor'
import {
    CompoundWithBadge,
}                           from '@/components/CompoundWithBadge'
import {
    CollapsibleSuspense,
}                           from '@/components/CollapsibleSuspense'
import {
    SimpleEditModelDialog,
}                           from '@/components/dialogs/SimpleEditModelDialog'
import {
    EditUserDialog,
}                           from '@/components/dialogs/EditUserDialog'

// stores:
import {
    // types:
    UserDetail,
    
    
    
    // hooks:
    useUpdateUser,
    
    useGetRoleList,
}                           from '@/store/features/api/apiSlice'

// internals:
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'



// styles:
const useUserPreviewStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */'./UserPreviewStyles')
, { specificityWeight: 2, id: 'rue4mgistn' });
import './UserPreviewStyles';



// react components:
export interface UserPreviewProps extends ModelPreviewProps<UserDetail> {
    // stores:
    getRolePaginationApi : ReturnType<typeof useGetRoleList>
}
const UserPreview = (props: UserPreviewProps): JSX.Element|null => {
    // styles:
    const styleSheet = useUserPreviewStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        model,
        
        
        
        // stores:
        getRolePaginationApi,
    ...restListItemProps} = props;
    const {
        name,
        email,
        image,
        
        roleId,
        
        username,
    } = model;
    
    
    
    // states:
    type EditMode = Exclude<keyof UserDetail, 'id'>|'full'
    const [editMode, setEditMode] = useState<EditMode|null>(null);
    
    
    
    // sessions:
    const { data: session } = useSession();
    const role = session?.role;
 // const privilegeAdd               = !!role?.user_c;
    const privilegeUpdateName        = !!role?.user_un;
    const privilegeUpdateUsername    = !!role?.user_uu;
    const privilegeUpdateEmail       = !!role?.user_ue;
    const privilegeUpdatePassword    = !!role?.user_up;
    const privilegeUpdateImage       = !!role?.user_ui;
    const privilegeUpdateRole        = !!role?.user_ur;
    const privilegeDelete            = !!role?.user_d;
    const privilegeWrite             = (
        /* privilegeAdd */ // except for add
        privilegeUpdateName
        || privilegeUpdateUsername
        || privilegeUpdateEmail
        || privilegeUpdatePassword
        || privilegeUpdateImage
        || privilegeUpdateRole
        || privilegeDelete
    );
    
    
    
    // stores:
    const {
        data       : roles,
        isLoading  : isRoleLoadingAndNoData,
    } = getRolePaginationApi;
    
    
    
    // refs:
    const listItemRef = useRef<HTMLElement|null>(null);
    
    
    
    // handlers:
    const handleEditDialogClose = useEvent((): void => {
        setEditMode(null);
    });
    
    
    
    // jsx:
    return (
        <ListItem
            // other props:
            {...restListItemProps}
            
            
            
            // refs:
            elmRef={listItemRef}
            
            
            
            // classes:
            className={styleSheet.main}
        >
            {/* profile image + edit button */}
            <CompoundWithBadge
                // components:
                wrapperComponent={<React.Fragment />}
                badgeComponent={
                    privilegeUpdateImage
                    ? <Badge
                        // variants:
                        nude={true}
                        
                        
                        
                        // floatable:
                        floatingPlacement='left-start'
                        floatingShift={10}
                        floatingOffset={-30}
                    >
                        <EditButton className='edit overlay' onClick={() => setEditMode('image')} />
                    </Badge>
                    : null
                }
                elementComponent={
                    !!image
                    ? <Basic
                        tag='span'
                        className='userImg'
                        
                        style={{
                            background: `no-repeat center/cover url("${resolveMediaUrl(image)}")`,
                        }}
                    />
                    : <Generic className='userImg empty'><Icon icon='person' size='xl' /></Generic>
                }
            />
            
            <h3 className='name'>
                {name}
                {privilegeUpdateName     && <EditButton onClick={() => setEditMode('name')} />}
            </h3>
            <p className='username'>
                {username || <span className='noValue'>No Username</span>}
                {privilegeUpdateUsername && <EditButton onClick={() => setEditMode('username')} />}
            </p>
            <p className='email'>
                {email}
                {privilegeUpdateEmail    && <EditButton onClick={() => setEditMode('email')} />}
            </p>
            <p className='role'>
                { isRoleLoadingAndNoData && <Busy />}
                {!isRoleLoadingAndNoData && !!roles && !!roleId && roles?.entities?.[roleId]?.name || <span className='noValue'>No Access</span>}
                {privilegeUpdateRole     && <EditButton onClick={() => setEditMode('roleId')} />}
            </p>
            <p className='fullEditor'>
                {privilegeWrite          && <EditButton buttonStyle='regular' onClick={() => setEditMode('full')}>
                    Open Full Editor
                </EditButton>}
            </p>
            {/* edit dialog: */}
            <ModalStatus theme='primary' viewport={listItemRef} backdropStyle='static' onExpandedChange={({expanded}) => !expanded && setEditMode(null)}>
                {!!editMode && !((editMode === 'image') || (editMode === 'roleId') || (editMode === 'full')) && <>
                    {(editMode === 'name'      ) && <SimpleEditModelDialog<UserDetail> model={model} updateModelApi={useUpdateUser} edit={editMode} onClose={handleEditDialogClose} editorComponent={<NameEditor />} />}
                    {(editMode === 'username'  ) && <SimpleEditModelDialog<UserDetail> model={model} updateModelApi={useUpdateUser} edit={editMode} onClose={handleEditDialogClose} editorComponent={<UniqueUsernameEditor currentValue={username ?? ''} />} />}
                    {(editMode === 'email'     ) && <SimpleEditModelDialog<UserDetail> model={model} updateModelApi={useUpdateUser} edit={editMode} onClose={handleEditDialogClose} editorComponent={<UniqueEmailEditor    currentValue={email} />} />}
                </>}
            </ModalStatus>
            <CollapsibleSuspense>
                <EditUserDialog
                    // data:
                    model={model} // modify current model
                    
                    
                    
                    // states:
                    expanded={(editMode === 'image') || (editMode === 'roleId') || (editMode === 'full')}
                    defaultExpandedTabIndex={((): number|undefined => {
                        // switch (editMode === 'roleId') ? 2 : undefined
                        switch (editMode) {
                            case 'image' : return 1;
                            case 'roleId': return 2;
                            default      : return undefined;
                        } // switch
                    })()}
                    
                    
                    
                    // handlers:
                    onExpandedChange={({expanded}) => !expanded && setEditMode(null)}
                />
            </CollapsibleSuspense>
        </ListItem>
    );
};
export {
    UserPreview,
    UserPreview as default,
}
