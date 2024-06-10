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
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    Generic,
    
    
    
    // composite-components:
    TabPanel,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    TextEditor,
}                           from '@/components/editors/TextEditor'
import {
    NameEditor,
}                           from '@/components/editors/NameEditor'
import {
    VisibilityEditor,
}                           from '@/components/editors/VisibilityEditor'
import {
    ShippingWeightEditor,
}                           from '@/components/editors/ShippingWeightEditor'
import {
    ShippingRateEditor,
}                           from '@/components/editors/ShippingRateEditor'
import {
    ShippingRatePreview,
}                           from '@/components/views/ShippingRatePreview'
import {
    // types:
    UpdateHandler,
    
    DeleteHandler,
    
    ConfirmDeleteHandler,
    ConfirmUnsavedHandler,
    
    
    
    // react components:
    ImplementedComplexEditModelDialogProps,
    ComplexEditModelDialog,
}                           from '@/components/dialogs/ComplexEditModelDialog'

// models:
import type {
    ShippingVisibility,
    Stock,
}                           from '@prisma/client'
import {
    // types:
    type ShippingDetail,
    type ShippingRate,
}                           from '@/models'

// stores:
import {
    // hooks:
    useUpdateShipping,
    useDeleteShipping,
}                           from '@/store/features/api/apiSlice'

// configs:
import {
    PAGE_SHIPPING_TAB_INFORMATIONS,
    PAGE_SHIPPING_TAB_RATES,
    PAGE_SHIPPING_TAB_DELETE,
}                           from '@/website.config'



// styles:
const useEditShippingDialogStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./EditShippingDialogStyles')
, { id: 'kpxedelumf' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
import './EditShippingDialogStyles';



// react components:
export interface EditShippingDialogProps
    extends
        // bases:
        ImplementedComplexEditModelDialogProps<ShippingDetail>
{
}
const EditShippingDialog = (props: EditShippingDialogProps): JSX.Element|null => {
    // styles:
    const styleSheet = useEditShippingDialogStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        model = null,
        
        
        
        // states:
        defaultExpandedTabIndex = 0,
    ...restComplexEditModelDialogProps} = props;
    
    
    
    // states:
    const [isModified   , setIsModified   ] = useState<boolean>(false);
    
    const [visibility   , setVisibility   ] = useState<ShippingVisibility>(model?.visibility     ?? 'DRAFT');
    const [name         , setName         ] = useState<string            >(model?.name           ?? ''     );
    
    const [weightStep   , setWeightStep   ] = useState<number            >(model?.weightStep     ?? 1      );
    const [estimate     , setEstimate     ] = useState<string            >(model?.estimate       ?? ''     );
    const [shippingRates, setShippingRates] = useState<ShippingRate[]    >(model?.shippingRates  ?? []     );
    
    
    
    // sessions:
    const { data: session } = useSession();
    const role = session?.role;
    
    
    
    // stores:
    const [updateShipping    , {isLoading : isLoadingUpdate           }] = useUpdateShipping();
    const [deleteShipping    , {isLoading : isLoadingDelete           }] = useDeleteShipping();
    
    
    
    // refs:
    const firstEditorRef = useRef<HTMLInputElement|null>(null); // TODO: finish this
    
    
    
    // handlers:
    const handleUpdate               = useEvent<UpdateHandler<ShippingDetail>>(async ({id, whenAdd, whenUpdate}) => {
        return await updateShipping({
            id             : id ?? '',
            
            visibility     : (whenUpdate.visibility  || whenAdd) ? visibility         : undefined,
            name           : (whenUpdate.description || whenAdd) ? name               : undefined,
            
            weightStep     : (whenUpdate.price       || whenAdd) ? weightStep         : undefined,
            estimate       : (whenUpdate.description || whenAdd) ? (estimate || null) : undefined,
        }).unwrap();
    });
    
    const handleDelete               = useEvent<DeleteHandler<ShippingDetail>>(async ({id}) => {
        await deleteShipping({
            id : id,
        }).unwrap();
    });
    
    const handleConfirmDelete        = useEvent<ConfirmDeleteHandler<ShippingDetail>>(({model}) => {
        return {
            title   : <h1>Delete Confirmation</h1>,
            message : <>
                <p>
                    Are you sure to delete shipping <strong>{model.name}</strong>?
                </p>
                <p>
                    The associated shipping in existing orders will be marked as <strong>DELETED SHIPPING</strong>.
                </p>
            </>,
        };
    });
    const handleConfirmUnsaved       = useEvent<ConfirmUnsavedHandler<ShippingDetail>>(() => {
        return {
            title   : <h1>Unsaved Data</h1>,
            message : <p>
                Do you want to save the changes?
            </p>,
        };
    });
    
    
    
    // privileges:
    const privilegeAdd    = !!role?.shipping_c;
    const privilegeUpdate = useMemo(() => ({
        description : !!role?.shipping_ud,
        price       : !!role?.shipping_up,
        visibility  : !!role?.shipping_uv,
    }), [role]);
    const privilegeDelete = !!role?.shipping_d;
    
    
    
    // jsx:
    return (
        <ComplexEditModelDialog<ShippingDetail>
            // other props:
            {...restComplexEditModelDialogProps}
            
            
            
            // data:
            modelName='Shipping'
            modelEntryName={model?.name}
            model={model}
            
            
            
            // privileges:
            privilegeAdd    = {privilegeAdd   }
            privilegeUpdate = {privilegeUpdate}
            privilegeDelete = {privilegeDelete}
            
            
            
            // stores:
            isModified  = {isModified}
            
            isCommiting = {isLoadingUpdate}
            isDeleting  = {isLoadingDelete}
            
            
            
            // tabs:
            tabDelete={PAGE_SHIPPING_TAB_DELETE}
            
            
            
            // states:
            defaultExpandedTabIndex={defaultExpandedTabIndex}
            
            
            
            // auto focusable:
            autoFocusOn={props.autoFocusOn ?? firstEditorRef}
            
            
            
            // handlers:
            onUpdate={handleUpdate}
            // onAfterUpdate={handleAfterUpdate}
            
            onDelete={handleDelete}
            // onAfterDelete={undefined}
            
            onConfirmDelete={handleConfirmDelete}
            onConfirmUnsaved={handleConfirmUnsaved}
        >{({whenAdd, whenUpdate}) => <>
            <TabPanel label={PAGE_SHIPPING_TAB_INFORMATIONS} panelComponent={<Generic className={styleSheet.infoTab} />}>
                <form>
                    <span className='name label'>Name:</span>
                    <NameEditor
                        // refs:
                        elmRef={(defaultExpandedTabIndex === 0) ? firstEditorRef : undefined}
                        
                        
                        
                        // classes:
                        className='name editor'
                        
                        
                        
                        // accessibilities:
                        enabled={whenUpdate.description || whenAdd}
                        
                        
                        
                        // values:
                        value={name}
                        onChange={(value) => {
                            setName(value);
                            setIsModified(true);
                        }}
                    />
                    
                    <span className='visibility label'>Visibility:</span>
                    <VisibilityEditor
                        // variants:
                        theme='primaryAlt'
                        
                        
                        
                        // classes:
                        className='visibility editor'
                        
                        
                        
                        // accessibilities:
                        modelName='shipping'
                        enabled={whenUpdate.visibility || whenAdd}
                        
                        
                        
                        // values:
                        optionHidden={false}
                        value={visibility}
                        onChange={(value) => {
                            setVisibility(value);
                            setIsModified(true);
                        }}
                    />
                </form>
            </TabPanel>
            <TabPanel label={PAGE_SHIPPING_TAB_RATES} panelComponent={<Generic className={styleSheet.ratesTab} />}>
                <form>
                    <span className='weightStep label'>Weight Step:</span>
                    <ShippingWeightEditor
                        // classes:
                        className='weightStep editor'
                        
                        
                        
                        // accessibilities:
                        aria-label='Weight Step'
                        min={0.01}
                        max={20}
                        enabled={whenUpdate.price || whenAdd}
                        
                        
                        
                        // validations:
                        required={true}
                        
                        
                        
                        // values:
                        value={weightStep}
                        onChange={(value) => {
                            setWeightStep(value || 1); // zero -or- null is not allowed => defaults to 1
                            setIsModified(true);
                        }}
                    />
                    
                    <span className='estimate label'>Estimated Delivery Time:</span>
                    <TextEditor
                        // classes:
                        className='estimate editor'
                        
                        
                        
                        // accessibilities:
                        aria-label='Estimated Delivery Time'
                        enabled={whenUpdate.description || whenAdd}
                        
                        
                        
                        // validations:
                        required={false}
                        
                        
                        
                        // values:
                        value={estimate}
                        onChange={(value) => {
                            setEstimate(value);
                            setIsModified(true);
                        }}
                    />
                    
                    <span className='rate label'>Rate:</span>
                    <ShippingRateEditor
                        // classes:
                        className='rate editor'
                        
                        
                        
                        // accessibilities:
                        aria-label='Rate'
                        enabled={whenUpdate.price || whenAdd}
                        
                        
                        
                        // values:
                        value={shippingRates}
                        onChange={(value) => {
                            setShippingRates(value);
                            setIsModified(true);
                        }}
                        
                        
                        
                        // components:
                        modelPreviewComponent={
                            <ShippingRatePreview
                                // data:
                                model={undefined as any}
                            />
                        }
                    />
                </form>
            </TabPanel>
        </>}</ComplexEditModelDialog>
    );
};
export {
    EditShippingDialog,
    EditShippingDialog as default,
}