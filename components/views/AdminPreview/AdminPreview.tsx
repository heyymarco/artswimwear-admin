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
    EventHandler,
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
    
    
    
    // dialog-components:
    ModalExpandedChangeEvent,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    ModelPreviewProps,
}                           from '@/components/explorers/PagedModelExplorer'
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
    EditAdminDialog,
}                           from '@/components/dialogs/EditAdminDialog'

// stores:
import {
    // types:
    AdminDetail,
    
    
    
    // hooks:
    useUpdateAdmin,
    
    useGetRoleList,
}                           from '@/store/features/api/apiSlice'

// internals:
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'



// styles:
const useAdminPreviewStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */'./AdminPreviewStyles')
, { specificityWeight: 2, id: 'rue4mgistn' });
import './AdminPreviewStyles';



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
        
        adminRoleId,
        
        username,
    } = model;
    
    
    
    // states:
    type EditMode = Exclude<keyof AdminDetail, 'id'>|'full'
    const [editMode, setEditMode] = useState<EditMode|null>(null);
    
    
    
    // sessions:
    const { data: session } = useSession();
    const role = session?.role;
 // const privilegeAdd               = !!role?.admin_c;
    const privilegeUpdateName        = !!role?.admin_un;
    const privilegeUpdateUsername    = !!role?.admin_uu;
    const privilegeUpdateEmail       = !!role?.admin_ue;
    const privilegeUpdatePassword    = !!role?.admin_up;
    const privilegeUpdateImage       = !!role?.admin_ui;
    const privilegeUpdateRole        = !!role?.admin_ur;
    const privilegeDelete            = !!role?.admin_d;
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
    const handleExpandedChange = useEvent<EventHandler<ModalExpandedChangeEvent>>(({expanded}): void => {
        // conditions:
        if (expanded) return; // ignore if expanded
        
        
        
        // actions:
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
                        className='adminImg'
                        
                        style={{
                            background: `no-repeat center/cover url("${resolveMediaUrl(image)}")`,
                        }}
                    />
                    : <Generic className='adminImg empty'><Icon icon='person' size='xl' /></Generic>
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
                {!isRoleLoadingAndNoData && !!roles && !!adminRoleId && roles?.entities?.[adminRoleId]?.name || <span className='noValue'>No Access</span>}
                {privilegeUpdateRole     && <EditButton onClick={() => setEditMode('adminRoleId')} />}
            </p>
            <p className='fullEditor'>
                {privilegeWrite          && <EditButton buttonStyle='regular' onClick={() => setEditMode('full')}>
                    Open Full Editor
                </EditButton>}
            </p>
            {/* edit dialog: */}
            <CollapsibleSuspense>
                <SimpleEditModelDialog<AdminDetail>
                    // data:
                    model={model}
                    edit='name'
                    
                    
                    
                    // stores:
                    updateModelApi={useUpdateAdmin}
                    
                    
                    
                    // states:
                    expanded={editMode === 'name'}
                    onExpandedChange={handleExpandedChange}
                    
                    
                    
                    // global stackable:
                    viewport={listItemRef}
                    
                    
                    
                    // components:
                    editorComponent={<NameEditor />}
                />
                <SimpleEditModelDialog<AdminDetail>
                    // data:
                    model={model}
                    edit='username'
                    
                    
                    
                    // stores:
                    updateModelApi={useUpdateAdmin}
                    
                    
                    
                    // states:
                    expanded={editMode === 'username'}
                    onExpandedChange={handleExpandedChange}
                    
                    
                    
                    // global stackable:
                    viewport={listItemRef}
                    
                    
                    
                    // components:
                    editorComponent={<UniqueUsernameEditor currentValue={username ?? ''} />}
                />
                <SimpleEditModelDialog<AdminDetail>
                    // data:
                    model={model}
                    edit='email'
                    
                    
                    
                    // stores:
                    updateModelApi={useUpdateAdmin}
                    
                    
                    
                    // states:
                    expanded={editMode === 'email'}
                    onExpandedChange={handleExpandedChange}
                    
                    
                    
                    // global stackable:
                    viewport={listItemRef}
                    
                    
                    
                    // components:
                    editorComponent={<UniqueEmailEditor    currentValue={email} />}
                />
                
                <EditAdminDialog
                    // data:
                    model={model} // modify current model
                    
                    
                    
                    // states:
                    expanded={(editMode === 'image') || (editMode === 'adminRoleId') || (editMode === 'full')}
                    onExpandedChange={handleExpandedChange}
                    defaultExpandedTabIndex={((): number|undefined => {
                        // switch (editMode === 'adminRoleId') ? 2 : undefined
                        switch (editMode) {
                            case 'image'      : return 1;
                            case 'adminRoleId': return 2;
                            default           : return undefined;
                        } // switch
                    })()}
                />
            </CollapsibleSuspense>
        </ListItem>
    );
};
export {
    AdminPreview,
    AdminPreview as default,
}
