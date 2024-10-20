'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
}                           from 'react'

// next-auth:
import {
    useSession,
}                           from 'next-auth/react'

// styles:
import {
    useAdminPreviewStyleSheet,
}                           from './styles/loader'

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
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    NameEditor,
}                           from '@heymarco/name-editor'

// internal components:
import {
    ModelPreviewProps,
}                           from '@/components/explorers/PaginationList'
import {
    EditButton,
}                           from '@/components/EditButton'
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
    DummyDialog,
}                           from '@/components/dialogs/DummyDialog'
import {
    SimpleEditModelDialog,
}                           from '@/components/dialogs/SimpleEditModelDialog'
import {
    EditAdminDialog,
}                           from '@/components/dialogs/EditAdminDialog'

// models:
import {
    // types:
    type AdminDetail,
}                           from '@/models'

// stores:
import {
    // hooks:
    useUpdateAdmin,
    
    useGetRoleList,
}                           from '@/store/features/api/apiSlice'

// internals:
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'



// react components:
export interface AdminPreviewProps extends ModelPreviewProps<AdminDetail> {
    // stores:
    getRolePaginationApi : ReturnType<typeof useGetRoleList>
}
const AdminPreview = (props: AdminPreviewProps): JSX.Element|null => {
    // styles:
    const styleSheet = useAdminPreviewStyleSheet();
    
    
    
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
    
    
    
    // sessions:
    const { data: session } = useSession();
    const role = session?.role;
 // const privilegeAdd               = !!role?.admin_c;
    const privilegeUpdateName        = !!role?.admin_un;
    const privilegeUpdateUsername    = !!role?.admin_uu;
    const privilegeUpdateEmail       = !!role?.admin_ue;
    const privilegeUpdatePassword    = !!role?.admin_up;
    const privilegeUpdateImages      = !!role?.admin_ui;
    const privilegeUpdateRole        = !!role?.admin_ur;
    const privilegeDelete            = !!role?.admin_d;
    const privilegeWrite             = (
        /* privilegeAdd */ // except for add
        privilegeUpdateName
        || privilegeUpdateUsername
        || privilegeUpdateEmail
        || privilegeUpdatePassword
        || privilegeUpdateImages
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
    
    
    
    // dialogs:
    const {
        showDialog,
    } = useDialogMessage();
    
    
    
    // handlers:
    type EditMode = Exclude<keyof AdminDetail, 'id'>|'full'
    const handleEdit = useEvent((editMode: EditMode): void => {
        // just for cosmetic backdrop:
        const dummyPromise = (
            ['full', 'image', 'roleId'].includes(editMode)
            ? showDialog(
                <DummyDialog
                    // global stackable:
                    viewport={listItemRef}
                />
            )
            : undefined
        );
        
        const dialogPromise = showDialog((() => {
            switch (editMode) {
                case 'name'     : return (
                    <SimpleEditModelDialog<AdminDetail>
                        // data:
                        model={model}
                        edit='name'
                        
                        
                        
                        // stores:
                        useUpdateModel={useUpdateAdmin}
                        
                        
                        
                        // global stackable:
                        viewport={listItemRef}
                        
                        
                        
                        // components:
                        editorComponent={<NameEditor
                            // validations:
                            required={true}
                        />}
                    />
                );
                case 'username' : return (
                    <SimpleEditModelDialog<AdminDetail>
                        // data:
                        model={model}
                        edit='username'
                        
                        
                        
                        // stores:
                        useUpdateModel={useUpdateAdmin}
                        
                        
                        
                        // global stackable:
                        viewport={listItemRef}
                        
                        
                        
                        // components:
                        editorComponent={<UniqueUsernameEditor currentValue={username ?? ''} />}
                    />
                );
                case 'email'    : return (
                    <SimpleEditModelDialog<AdminDetail>
                        // data:
                        model={model}
                        edit='email'
                        
                        
                        
                        // stores:
                        useUpdateModel={useUpdateAdmin}
                        
                        
                        
                        // global stackable:
                        viewport={listItemRef}
                        
                        
                        
                        // components:
                        editorComponent={<UniqueEmailEditor    currentValue={email} />}
                    />
                );
                case 'image'    :
                case 'roleId'   :
                case 'full'     : return (
                    <EditAdminDialog
                        // data:
                        model={model} // modify current model
                        
                        
                        
                        // states:
                        defaultExpandedTabIndex={((): number|undefined => {
                            // switch (editMode === 'roleId') ? 2 : undefined
                            switch (editMode) {
                                case 'image'  : return 1;
                                case 'roleId' : return 2;
                                default       : return undefined;
                            } // switch
                        })()}
                    />
                );
                default             : throw new Error('app error');
            } // switch
        })());
        
        if (dummyPromise) {
            dialogPromise.collapseStartEvent().then(() => dummyPromise.closeDialog(undefined));
        } // if
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
                    privilegeUpdateImages
                    ? <Badge
                        // variants:
                        nude={true}
                        
                        
                        
                        // classes:
                        className='floatingEdit'
                        
                        
                        
                        // floatable:
                        floatingPlacement='left-start'
                        floatingShift={0}
                        floatingOffset={0}
                    >
                        <EditButton className='edit overlay' onClick={() => handleEdit('image')} />
                    </Badge>
                    : null
                }
                elementComponent={
                    <Basic
                        // variants:
                        mild={true}
                        
                        
                        
                        // classes:
                        className='preview'
                    >
                        {
                            !image
                            ? <Basic
                                // variants:
                                mild={true}
                                
                                
                                
                                // classes:
                                className='image noImage'
                            >
                                <Icon icon='person' size='xl' />
                            </Basic>
                            : <Basic
                                tag='span'
                                className='image'
                                
                                style={{
                                    background: `no-repeat center/cover url("${resolveMediaUrl(image)}")`,
                                }}
                            />
                        }
                    </Basic>
                }
            />
            
            <h3 className='name'>
                {name}
                {privilegeUpdateName     && <EditButton onClick={() => handleEdit('name')} />}
            </h3>
            <p className='username'>
                {username || <span className='noValue'>No Username</span>}
                {privilegeUpdateUsername && <EditButton onClick={() => handleEdit('username')} />}
            </p>
            <p className='email'>
                {email}
                {privilegeUpdateEmail    && <EditButton onClick={() => handleEdit('email')} />}
            </p>
            <p className='role'>
                { isRoleLoadingAndNoData && <Busy />}
                {!isRoleLoadingAndNoData && !!roles && !!roleId && roles?.entities?.[roleId]?.name || <span className='noValue'>No Access</span>}
                {privilegeUpdateRole     && <EditButton onClick={() => handleEdit('roleId')} />}
            </p>
            <p className='fullEditor'>
                {privilegeWrite          && <EditButton icon='list' title='View the order details' className='fullEditor' buttonStyle='regular' onClick={() => handleEdit('full')}>
                    View Details
                </EditButton>}
            </p>
        </ListItem>
    );
};
export {
    AdminPreview,
    AdminPreview as default,
}
