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
    // react components:
    ImplementedComplexEditModelDialogProps,
    ComplexEditModelDialog,
}                           from '@/components/dialogs/ComplexEditModelDialog'

// models:
import {
    type ModelConfirmUnsavedEventHandler,
    type ModelConfirmDeleteEventHandler,
    type ModelUpsertingEventHandler,
    type ModelDeletingEventHandler,
    type ModelUpsertEventHandler,
    
    type RoleDetail,
}                           from '@/models'

// stores:
import {
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
    const [isModified , setIsModified ] = useState<boolean>(false);
    
    const [name       , setName       ] = useState<string >(model?.name       ?? ''   );
    
    const [product_r  , setProduct_r  ] = useState<boolean>(model?.product_r  ?? false);
    const [product_c  , setProduct_c  ] = useState<boolean>(model?.product_c  ?? false);
    const [product_ud , setProduct_ud ] = useState<boolean>(model?.product_ud ?? false);
    const [product_ui , setProduct_ui ] = useState<boolean>(model?.product_ui ?? false);
    const [product_up , setProduct_up ] = useState<boolean>(model?.product_up ?? false);
    const [product_us , setProduct_us ] = useState<boolean>(model?.product_us ?? false);
    const [product_uv , setProduct_uv ] = useState<boolean>(model?.product_uv ?? false);
    const [product_d  , setProduct_d  ] = useState<boolean>(model?.product_d  ?? false);
    
    const [category_r , setCategory_r ] = useState<boolean>(model?.category_r  ?? false);
    const [category_c , setCategory_c ] = useState<boolean>(model?.category_c  ?? false);
    const [category_ud, setCategory_ud] = useState<boolean>(model?.category_ud ?? false);
    const [category_ui, setCategory_ui] = useState<boolean>(model?.category_ui ?? false);
    const [category_uv, setCategory_uv] = useState<boolean>(model?.category_uv ?? false);
    const [category_d , setCategory_d ] = useState<boolean>(model?.category_d  ?? false);
    
    const [order_r    , setOrder_r    ] = useState<boolean>(model?.order_r     ?? false);
    const [order_us   , setOrder_us   ] = useState<boolean>(model?.order_us    ?? false);
    const [order_usa  , setOrder_usa  ] = useState<boolean>(model?.order_usa   ?? false);
    const [order_upmu , setOrder_upmu ] = useState<boolean>(model?.order_upmu  ?? false);
    const [order_upmp , setOrder_upmp ] = useState<boolean>(model?.order_upmp  ?? false);
    
    const [shipping_r , setShipping_r ] = useState<boolean>(model?.shipping_r  ?? false);
    const [shipping_c , setShipping_c ] = useState<boolean>(model?.shipping_c  ?? false);
    const [shipping_ud, setShipping_ud] = useState<boolean>(model?.shipping_ud ?? false);
    const [shipping_up, setShipping_up] = useState<boolean>(model?.shipping_up ?? false);
    const [shipping_uv, setShipping_uv] = useState<boolean>(model?.shipping_uv ?? false);
    const [shipping_d , setShipping_d ] = useState<boolean>(model?.shipping_d  ?? false);
    
    const [admin_r    , setAdmin_r    ] = useState<boolean>(model?.admin_r     ?? false);
    const [admin_c    , setAdmin_c    ] = useState<boolean>(model?.admin_c     ?? false);
    const [admin_un   , setAdmin_un   ] = useState<boolean>(model?.admin_un    ?? false);
    const [admin_uu   , setAdmin_uu   ] = useState<boolean>(model?.admin_uu    ?? false);
    const [admin_ue   , setAdmin_ue   ] = useState<boolean>(model?.admin_ue    ?? false);
    const [admin_up   , setAdmin_up   ] = useState<boolean>(model?.admin_up    ?? false);
    const [admin_ui   , setAdmin_ui   ] = useState<boolean>(model?.admin_ui    ?? false);
    const [admin_ur   , setAdmin_ur   ] = useState<boolean>(model?.admin_ur    ?? false);
    const [admin_d    , setAdmin_d    ] = useState<boolean>(model?.admin_d     ?? false);
    
    const [role_c     , setRole_c     ] = useState<boolean>(model?.role_c      ?? false);
    const [role_u     , setRole_u     ] = useState<boolean>(model?.role_u      ?? false);
    const [role_d     , setRole_d     ] = useState<boolean>(model?.role_d      ?? false);
    
    
    
    // sessions:
    const { data: session, update : updateSession} = useSession();
    const role = session?.role;
    
    
    
    // stores:
    const [updateRole, {isLoading : isLoadingUpdate}] = useUpdateRole();
    const [deleteRole, {isLoading : isLoadingDelete}] = useDeleteRole();
    
    
    
    // refs:
    const firstEditorRef = useRef<HTMLInputElement|null>(null);
    
    
    
    // handlers:
    const handleModelConfirmUnsaved = useEvent<ModelConfirmUnsavedEventHandler<RoleDetail>>(() => {
        return {
            title   : <h1>Unsaved Data</h1>,
            message : <p>
                Do you want to save the changes?
            </p>,
        };
    });
    const handleModelConfirmDelete  = useEvent<ModelConfirmDeleteEventHandler<RoleDetail>>(({ draft }) => {
        return {
            title   : <h1>Delete Confirmation</h1>,
            message : <>
                <p>
                    Are you sure to delete <strong>{draft.name}</strong> role?
                </p>
                <p>
                    The admins associated with the {draft.name} role will still be logged in but will not have any access.<br />
                    You can re-assign their roles later.
                </p>
            </>,
        };
    });
    
    const handleModelUpserting      = useEvent<ModelUpsertingEventHandler<RoleDetail>>(async ({ id }) => {
        return await updateRole({
            id : id ?? '',
            
            name,
            
            product_r,
            product_c,
            product_ud,
            product_ui,
            product_up,
            product_us,
            product_uv,
            product_d,
            
            category_r,
            category_c,
            category_ud,
            category_ui,
            category_uv,
            category_d,
            
            order_r,
            order_us,
            order_usa,
            order_upmu,
            order_upmp,
            
            shipping_r,
            shipping_c,
            shipping_ud,
            shipping_up,
            shipping_uv,
            shipping_d,
            
            admin_r,
            admin_c,
            admin_un,
            admin_uu,
            admin_ue,
            admin_up,
            admin_ui,
            admin_ur,
            admin_d,
            
            role_c,
            role_u,
            role_d,
        }).unwrap();
    });
    const handleModelDeleting       = useEvent<ModelDeletingEventHandler<RoleDetail>>(async ({ draft: { id } }) => {
        await deleteRole({
            id : id,
        }).unwrap();
    });
    
    const handleModelUpsert         = useEvent<ModelUpsertEventHandler<RoleDetail>>(async () => {
        const currentRoleId = session?.role?.id;
        if (!!currentRoleId && (currentRoleId === model?.id)) await updateSession(); // update the session if updated current role
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
            onModelConfirmUnsaved={handleModelConfirmUnsaved}
            onModelConfirmDelete={handleModelConfirmDelete}
            
            onModelUpserting={handleModelUpserting}
            onModelDeleting={handleModelDeleting}
            
            onModelUpsert={handleModelUpsert}
        >{({whenAdd, whenUpdate}) => <>
            <TabPanel label={PAGE_ROLE_TAB_ROLE} panelComponent={<Generic className={styleSheet.roleTab} />}>
                <form>
                    <span className='name label'>Name:</span>
                    <UniqueRolenameEditor
                        // refs:
                        elmRef={firstEditorRef}
                        
                        
                        
                        // classes:
                        className='name editor'
                        
                        
                        
                        // accessibilities:
                        enabled={whenUpdate.update || whenAdd}
                        
                        
                        
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
                        <ExclusiveAccordion className='privileges list' defaultExpandedListIndex={0}>
                            <AccordionItem label='Products' inheritEnabled={false}>
                                <AccessibilityProvider
                                    // accessibilities:
                                    /* enable|disable accessibility for all <Check> */
                                    enabled={whenUpdate.update || whenAdd}
                                >
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
                                </AccessibilityProvider>
                            </AccordionItem>
                            
                            <AccordionItem label='Categories' inheritEnabled={false}>
                                <AccessibilityProvider
                                    // accessibilities:
                                    /* enable|disable accessibility for all <Check> */
                                    enabled={whenUpdate.update || whenAdd}
                                >
                                    <Check className='check editor' active={category_r}  onActiveChange={({active}) => { setCategory_r(active);  setIsModified(true); }}>
                                        View
                                    </Check>
                                    <Check className='check editor' active={category_c}  onActiveChange={({active}) => { setCategory_c(active);  setIsModified(true); }}>
                                        Add New
                                    </Check>
                                    <Check className='check editor' active={category_ud} onActiveChange={({active}) => { setCategory_ud(active); setIsModified(true); }}>
                                        Change Name, Path &amp; Description
                                    </Check>
                                    <Check className='check editor' active={category_ui} onActiveChange={({active}) => { setCategory_ui(active); setIsModified(true); }}>
                                        Change Images
                                    </Check>
                                    <Check className='check editor' active={category_uv} onActiveChange={({active}) => { setCategory_uv(active); setIsModified(true); }}>
                                        Change Visibility
                                    </Check>
                                    <Check className='check editor' active={category_d}  onActiveChange={({active}) => { setCategory_d(active);  setIsModified(true); }}>
                                        Delete
                                    </Check>
                                </AccessibilityProvider>
                            </AccordionItem>
                            
                            <AccordionItem label='Orders'    inheritEnabled={false}>
                                <AccessibilityProvider
                                    // accessibilities:
                                    /* enable|disable accessibility for all <Check> */
                                    enabled={whenUpdate.update || whenAdd}
                                >
                                    <Check className='check editor' active={order_r}    onActiveChange={({active}) => { setOrder_r(active);    setIsModified(true); }}>
                                        View
                                    </Check>
                                    <Check className='check editor' active={order_us}   onActiveChange={({active}) => { setOrder_us(active);   setIsModified(true); }}>
                                        Change Status
                                    </Check>
                                    <Check className='check editor' active={order_usa}  onActiveChange={({active}) => { setOrder_usa(active);  setIsModified(true); }}>
                                        Change Shipping Address
                                    </Check>
                                    <Check className='check editor' active={order_upmu} onActiveChange={({active}) => { setOrder_upmu(active); setIsModified(true); }}>
                                        Approve Manual Payment
                                    </Check>
                                    <Check className='check editor' active={order_upmp} onActiveChange={({active}) => { setOrder_upmp(active); setIsModified(true); }}>
                                        Change Manual Payment
                                    </Check>
                                </AccessibilityProvider>
                            </AccordionItem>
                            
                            <AccordionItem label='Shippings' inheritEnabled={false}>
                                <AccessibilityProvider
                                    // accessibilities:
                                    /* enable|disable accessibility for all <Check> */
                                    enabled={whenUpdate.update || whenAdd}
                                >
                                    <Check className='check editor' active={shipping_r}  onActiveChange={({active}) => { setShipping_r(active);  setIsModified(true); }}>
                                        View
                                    </Check>
                                    <Check className='check editor' active={shipping_c}  onActiveChange={({active}) => { setShipping_c(active);  setIsModified(true); }}>
                                        Add New
                                    </Check>
                                    <Check className='check editor' active={shipping_ud} onActiveChange={({active}) => { setShipping_ud(active); setIsModified(true); }}>
                                        Change Name &amp; Estimated Delivery Time
                                    </Check>
                                    <Check className='check editor' active={shipping_up} onActiveChange={({active}) => { setShipping_up(active); setIsModified(true); }}>
                                        Change Rates, ETAs, Weight Step, Areas, Auto Update, and/or Origin
                                    </Check>
                                    <Check className='check editor' active={shipping_uv} onActiveChange={({active}) => { setShipping_uv(active); setIsModified(true); }}>
                                        Change Visibility
                                    </Check>
                                    <Check className='check editor' active={shipping_d}  onActiveChange={({active}) => { setShipping_d(active);  setIsModified(true); }}>
                                        Delete
                                    </Check>
                                </AccessibilityProvider>
                            </AccordionItem>
                            
                            <AccordionItem label='Admins'    inheritEnabled={false}>
                                <AccessibilityProvider
                                    // accessibilities:
                                    /* enable|disable accessibility for all <Check> */
                                    enabled={whenUpdate.update || whenAdd}
                                >
                                    <Check className='check editor' active={admin_r}    onActiveChange={({active}) => { setAdmin_r(active);    setIsModified(true); }}>
                                        View
                                    </Check>
                                    <Check className='check editor' active={admin_c}    onActiveChange={({active}) => { setAdmin_c(active);    setIsModified(true); }}>
                                        Add New
                                    </Check>
                                    <Check className='check editor' active={admin_un}   onActiveChange={({active}) => { setAdmin_un(active);   setIsModified(true); }}>
                                        Change Name
                                    </Check>
                                    <Check className='check editor' active={admin_uu}   onActiveChange={({active}) => { setAdmin_uu(active);   setIsModified(true); }}>
                                        Change Username
                                    </Check>
                                    <Check className='check editor' active={admin_ue}   onActiveChange={({active}) => { setAdmin_ue(active);   setIsModified(true); }}>
                                        Change Email
                                    </Check>
                                    <Check className='check editor' active={admin_up}   onActiveChange={({active}) => { setAdmin_up(active);   setIsModified(true); }}>
                                        Change Password
                                    </Check>
                                    <Check className='check editor' active={admin_ui}   onActiveChange={({active}) => { setAdmin_ui(active);   setIsModified(true); }}>
                                        Change Image
                                    </Check>
                                    <Check className='check editor' active={admin_ur}   onActiveChange={({active}) => { setAdmin_ur(active);   setIsModified(true); }}>
                                        Change Role
                                    </Check>
                                    <Check className='check editor' active={admin_d}    onActiveChange={({active}) => { setAdmin_d(active);    setIsModified(true); }}>
                                        Delete
                                    </Check>
                                </AccessibilityProvider>
                            </AccordionItem>
                            
                            <AccordionItem label='Roles'    inheritEnabled={false}>
                                <AccessibilityProvider
                                    // accessibilities:
                                    /* enable|disable accessibility for all <Check> */
                                    enabled={whenUpdate.update || whenAdd}
                                >
                                    <Check className='check editor' active={role_c}     onActiveChange={({active}) => { setRole_c(active);     setIsModified(true); }}>
                                        Add New
                                    </Check>
                                    <Check className='check editor' active={role_u}     onActiveChange={({active}) => { setRole_u(active);     setIsModified(true); }}>
                                        Change
                                    </Check>
                                    <Check className='check editor' active={role_d}     onActiveChange={({active}) => { setRole_d(active);     setIsModified(true); }}>
                                        Delete
                                    </Check>
                                </AccessibilityProvider>
                            </AccordionItem>
                        </ExclusiveAccordion>
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
