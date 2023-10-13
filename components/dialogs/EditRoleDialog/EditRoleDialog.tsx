'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useState,
    useMemo,
}                           from 'react'

// next-auth:
import {
    useSession,
}                           from 'next-auth/react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheets,
}                           from '@cssfn/cssfn-react'               // writes css in react hook

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    
    
    
    // an accessibility management system:
    AccessibilityProvider,
    
    
    
    // a validation management system:
    ValidationProvider,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    Generic,
    
    
    
    // simple-components:
    Check,
    
    
    
    // composite-components:
    AccordionItem,
    ExclusiveAccordion,
    TabPanel,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    UniqueRolenameEditor,
}                           from '@/components/editors/UniqueRolenameEditor'
import {
    // types:
    UpdateModelHandler,
    AfterUpdateModelHandler,
    
    DeleteModelHandler,
    
    DeleteModelConfirmHandler,
    UnsavedModelConfirmHandler,
    
    
    
    // react components:
    ImplementedComplexEditModelDialogProps,
    ComplexEditModelDialog,
}                           from '@/components/dialogs/ComplexEditModelDialog'

// stores:
import {
    // types:
    RoleDetail,
    
    
    
    // hooks:
    useUpdateRole,
    useDeleteRole,
}                           from '@/store/features/api/apiSlice'

// configs:
import {
    PAGE_ROLE_TAB_ROLE,
    PAGE_ROLE_TAB_DELETE,
}                           from '@/website.config'



// styles:
const useEditRoleDialogStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./EditRoleDialogStyles')
, { id: 'vsc19zuymv' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
import './EditRoleDialogStyles';



// react components:

/* <EditRoleDialog> */
export interface EditRoleDialogProps
    extends
        // bases:
        ImplementedComplexEditModelDialogProps<RoleDetail>
{
}
const EditRoleDialog = (props: EditRoleDialogProps): JSX.Element|null => {
    // styles:
    const styleSheet = useEditRoleDialogStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        model = null,
        
        
        
        // states:
        defaultExpandedTabIndex = 0,
    ...restComplexEditModelDialogProps} = props;
    
    
    
    // states:
    const [isModified, setIsModified] = useState<boolean>(false);
    
    const [name      , setName      ] = useState<string >(model?.name       ?? ''   );
    
    const [product_r , setProduct_r ] = useState<boolean>(model?.product_r  ?? false);
    const [product_c , setProduct_c ] = useState<boolean>(model?.product_c  ?? false);
    const [product_ud, setProduct_ud] = useState<boolean>(model?.product_ud ?? false);
    const [product_ui, setProduct_ui] = useState<boolean>(model?.product_ui ?? false);
    const [product_up, setProduct_up] = useState<boolean>(model?.product_up ?? false);
    const [product_us, setProduct_us] = useState<boolean>(model?.product_us ?? false);
    const [product_uv, setProduct_uv] = useState<boolean>(model?.product_uv ?? false);
    const [product_d , setProduct_d ] = useState<boolean>(model?.product_d  ?? false);
    
    const [user_r    , setUser_r    ] = useState<boolean>(model?.user_r     ?? false);
    const [user_c    , setUser_c    ] = useState<boolean>(model?.user_c     ?? false);
    const [user_un   , setUser_un   ] = useState<boolean>(model?.user_un    ?? false);
    const [user_uu   , setUser_uu   ] = useState<boolean>(model?.user_uu    ?? false);
    const [user_ue   , setUser_ue   ] = useState<boolean>(model?.user_ue    ?? false);
    const [user_up   , setUser_up   ] = useState<boolean>(model?.user_up    ?? false);
    const [user_ui   , setUser_ui   ] = useState<boolean>(model?.user_ui    ?? false);
    const [user_ur   , setUser_ur   ] = useState<boolean>(model?.user_ur    ?? false);
    const [user_d    , setUser_d    ] = useState<boolean>(model?.user_d     ?? false);
    
    const [role_c    , setRole_c    ] = useState<boolean>(model?.role_c     ?? false);
    const [role_u    , setRole_u    ] = useState<boolean>(model?.role_u     ?? false);
    const [role_d    , setRole_d    ] = useState<boolean>(model?.role_d     ?? false);
    
    
    
    // sessions:
    const { data: session, update : updateSession} = useSession();
    const role = session?.role;
    
    
    
    // stores:
    const [updateRole, {isLoading : isLoadingUpdate}] = useUpdateRole();
    const [deleteRole, {isLoading : isLoadingDelete}] = useDeleteRole();
    
    
    
    // refs:
    const firstEditorRef = useRef<HTMLInputElement|null>(null);
    
    
    
    // handlers:
    const handleUpdate         = useEvent<UpdateModelHandler>(async () => {
        return (await updateRole({
            id : model?.id ?? '',
            
            name,
            
            product_r,
            product_c,
            product_ud,
            product_ui,
            product_up,
            product_us,
            product_uv,
            product_d,
            
            user_r,
            user_c,
            user_un,
            user_uu,
            user_ue,
            user_up,
            user_ui,
            user_ur,
            user_d,
            
            role_c,
            role_u,
            role_d,
        }).unwrap()).id;
    });
    const handleAfterUpdate    = useEvent<AfterUpdateModelHandler>(async () => {
        const currentRoleId = session?.role?.id;
        if (!!currentRoleId && (currentRoleId === model?.id)) await updateSession(); // update the session if updated current role
    });
    
    const handleDelete         = useEvent<DeleteModelHandler>(async ({id}) => {
        await deleteRole({
            id : id,
        }).unwrap();
    });
    
    const handleConfirmDelete  = useEvent<DeleteModelConfirmHandler<RoleDetail>>(({model}) => {
        return {
            title   : <h1>Delete Confirmation</h1>,
            message : <>
                <p>
                    Are you sure to delete <strong>{model.name}</strong> role?
                </p>
                <p>
                    The users associated with the {model.name} role will still be logged in but will not have any access.<br />
                    You can re-assign their roles later.
                </p>
            </>,
        };
    });
    const handleConfirmUnsaved = useEvent<UnsavedModelConfirmHandler<RoleDetail>>(() => {
        return {
            title   : <h1>Unsaved Data</h1>,
            message : <p>
                Do you want to save the changes?
            </p>,
        };
    });
    
    
    
    // jsx:
    return (
        <ComplexEditModelDialog<RoleDetail>
            // other props:
            {...restComplexEditModelDialogProps}
            
            
            
            // data:
            modelName='Role'
            modelEntryName={model?.name}
            model={model}
            
            
            
            // privileges:
            privilegeAdd    = {!!role?.role_c}
            privilegeUpdate = {useMemo(() => ({
                update : !!role?.role_u,
            }), [role])}
            privilegeDelete = {!!role?.role_d}
            
            
            
            // stores:
            isModified  = {isModified}
            
            isCommiting = {isLoadingUpdate}
            isDeleting  = {isLoadingDelete}
            
            
            
            // tabs:
            tabDelete={PAGE_ROLE_TAB_DELETE}
            
            
            
            // states:
            defaultExpandedTabIndex={defaultExpandedTabIndex}
            
            
            
            // auto focusable:
            autoFocusOn={props.autoFocusOn ?? firstEditorRef}
            
            
            
            // handlers:
            onUpdate={handleUpdate}
            onAfterUpdate={handleAfterUpdate}
            
            onDelete={handleDelete}
            // onAfterDelete={undefined}
            
            onConfirmDelete={handleConfirmDelete}
            onConfirmUnsaved={handleConfirmUnsaved}
        >{({privilegeAdd, privilegeUpdate}) => <>
            <TabPanel label={PAGE_ROLE_TAB_ROLE} panelComponent={<Generic className={styleSheet.roleTab} />}>
                <form>
                    <span className='name label'>Name:</span>
                    <UniqueRolenameEditor
                        // refs:
                        elmRef={firstEditorRef}
                        
                        
                        
                        // classes:
                        className='name editor'
                        
                        
                        
                        // accessibilities:
                        enabled={privilegeUpdate.update || privilegeAdd}
                        
                        
                        
                        // values:
                        currentValue={model?.name ?? ''}
                        value={name}
                        onChange={(value) => {
                            setName(value);
                            setIsModified(true);
                        }}
                    />
                    
                    <span className='privileges label'>Privileges:</span>
                    <ValidationProvider
                        // validations:
                        /* disable validation for all <Check> */
                        enableValidation={false}
                        inheritValidation={false}
                    >
                        <AccessibilityProvider
                            // accessibilities:
                            /* enable|disable accessibility for all <Check> */
                            enabled={privilegeUpdate.update || privilegeAdd}
                        >
                            <ExclusiveAccordion className='privileges list' defaultExpandedListIndex={0}>
                                <AccordionItem label='Products' inheritEnabled={false}>
                                    <Check className='check editor' active={product_r}  onActiveChange={({active}) => { setProduct_r(active);  setIsModified(true); }}>
                                        View
                                    </Check>
                                    <Check className='check editor' active={product_c}  onActiveChange={({active}) => { setProduct_c(active);  setIsModified(true); }}>
                                        Add New
                                    </Check>
                                    <Check className='check editor' active={product_ud} onActiveChange={({active}) => { setProduct_ud(active); setIsModified(true); }}>
                                        Change Name, Path &amp; Description
                                    </Check>
                                    <Check className='check editor' active={product_ui} onActiveChange={({active}) => { setProduct_ui(active); setIsModified(true); }}>
                                        Change Images
                                    </Check>
                                    <Check className='check editor' active={product_up} onActiveChange={({active}) => { setProduct_up(active); setIsModified(true); }}>
                                        Change Price &amp; Shipping Weight
                                    </Check>
                                    <Check className='check editor' active={product_us} onActiveChange={({active}) => { setProduct_us(active); setIsModified(true); }}>
                                        Change Stock
                                    </Check>
                                    <Check className='check editor' active={product_uv} onActiveChange={({active}) => { setProduct_uv(active); setIsModified(true); }}>
                                        Change Visibility
                                    </Check>
                                    <Check className='check editor' active={product_d}  onActiveChange={({active}) => { setProduct_d(active);  setIsModified(true); }}>
                                        Delete
                                    </Check>
                                </AccordionItem>
                                <AccordionItem label='Users'    inheritEnabled={false}>
                                    <Check className='check editor' active={user_r}     onActiveChange={({active}) => { setUser_r(active);     setIsModified(true); }}>
                                        View
                                    </Check>
                                    <Check className='check editor' active={user_c}     onActiveChange={({active}) => { setUser_c(active);     setIsModified(true); }}>
                                        Add New
                                    </Check>
                                    <Check className='check editor' active={user_un}    onActiveChange={({active}) => { setUser_un(active);    setIsModified(true); }}>
                                        Change Name
                                    </Check>
                                    <Check className='check editor' active={user_uu}    onActiveChange={({active}) => { setUser_uu(active);    setIsModified(true); }}>
                                        Change Username
                                    </Check>
                                    <Check className='check editor' active={user_ue}    onActiveChange={({active}) => { setUser_ue(active);    setIsModified(true); }}>
                                        Change Email
                                    </Check>
                                    <Check className='check editor' active={user_up}    onActiveChange={({active}) => { setUser_up(active);    setIsModified(true); }}>
                                        Change Password
                                    </Check>
                                    <Check className='check editor' active={user_ui}    onActiveChange={({active}) => { setUser_ui(active);    setIsModified(true); }}>
                                        Change Image
                                    </Check>
                                    <Check className='check editor' active={user_ur}    onActiveChange={({active}) => { setUser_ur(active);    setIsModified(true); }}>
                                        Change Role
                                    </Check>
                                    <Check className='check editor' active={user_d}     onActiveChange={({active}) => { setUser_d(active);     setIsModified(true); }}>
                                        Delete
                                    </Check>
                                </AccordionItem>
                                <AccordionItem label='Roles'    inheritEnabled={false}>
                                    <Check className='check editor' active={role_c}     onActiveChange={({active}) => { setRole_c(active);     setIsModified(true); }}>
                                        Add New
                                    </Check>
                                    <Check className='check editor' active={role_u}     onActiveChange={({active}) => { setRole_u(active);     setIsModified(true); }}>
                                        Change
                                    </Check>
                                    <Check className='check editor' active={role_d}     onActiveChange={({active}) => { setRole_d(active);     setIsModified(true); }}>
                                        Delete
                                    </Check>
                                </AccordionItem>
                            </ExclusiveAccordion>
                        </AccessibilityProvider>
                    </ValidationProvider>
                </form>
            </TabPanel>
        </>}</ComplexEditModelDialog>
    );
};
export {
    EditRoleDialog,
    EditRoleDialog as default,
}
