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
    NameEditor,
}                           from '@/components/editors/NameEditor'
import {
    PriceEditor,
}                           from '@/components/editors/PriceEditor'
import {
    ShippingWeightEditor,
}                           from '@/components/editors/ShippingWeightEditor'
import {
    // types:
    UpdateHandler,
    
    ConfirmDeleteHandler,
    ConfirmUnsavedHandler,
    
    
    
    // react components:
    ImplementedComplexEditModelDialogProps,
    ComplexEditModelDialog,
}                           from '@/components/dialogs/ComplexEditModelDialog'

// others:
import {
    customAlphabet,
}                           from 'nanoid/async'

// stores:
import type {
    // types:
    ProductVariantDetail,
}                           from '@/store/features/api/apiSlice'

// configs:
import {
    PAGE_VARIANT_TAB_INFORMATIONS,
    PAGE_VARIANT_TAB_DELETE,
}                           from '@/website.config'



// styles:
const useEditProductVariantDialogStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./EditProductVariantDialogStyles')
, { id: 'b4kzha6i3y' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
import './EditProductVariantDialogStyles';



// react components:
export interface EditProductVariantDialogProps
    extends
        // bases:
        ImplementedComplexEditModelDialogProps<ProductVariantDetail>
{
    // data:
    productId : string
}
const EditProductVariantDialog = (props: EditProductVariantDialogProps): JSX.Element|null => {
    // styles:
    const styleSheet = useEditProductVariantDialogStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        productId,
        model = null,
        
        
        
        // states:
        defaultExpandedTabIndex = 0,
    ...restComplexEditModelDialogProps} = props;
    
    
    
    // states:
    const [isModified, setIsModified] = useState<boolean>(false);
    
    const [name          , setName          ] = useState<string>(model?.name ?? '');
    const [price         , setPrice         ] = useState<number            |null>(model?.price          || null   ); // converts 0 to empty
    const [shippingWeight, setShippingWeight] = useState<number            |null>(model?.shippingWeight ?? null   ); // optional field
    
    
    
    // sessions:
    const { data: session } = useSession();
    const role = session?.role;
    
    
    
    // refs:
    const firstEditorRef = useRef<HTMLInputElement|null>(null); // TODO: finish this
    
    
    
    // handlers:
    const handleUpdate               = useEvent<UpdateHandler<ProductVariantDetail>>(async ({id, privilegeAdd, privilegeUpdate}) => {
        return {
            ...model,
            
            id             : id ?? await (async () => {
                const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 16);
                return ` ${await nanoid()}`; // starts with space{random-temporary-id}
            })(),
            
            name           : (privilegeUpdate.description || privilegeAdd) ? name           : undefined,
            price          : (privilegeUpdate.price       || privilegeAdd) ? price          : undefined,
            shippingWeight : (privilegeUpdate.price       || privilegeAdd) ? shippingWeight : undefined,
    };
    });
    
    const handleConfirmDelete        = useEvent<ConfirmDeleteHandler<ProductVariantDetail>>(({model}) => {
        return {
            title   : <h1>Delete Confirmation</h1>,
            message : <>
                <p>
                    Are you sure to delete variant <strong>{model.name}</strong>?
                </p>
                <p>
                    The associated product variant in existing orders will be marked as <strong>DELETED VARIANT</strong>.
                </p>
            </>,
        };
    });
    const handleConfirmUnsaved       = useEvent<ConfirmUnsavedHandler<ProductVariantDetail>>(() => {
        return {
            title   : <h1>Unsaved Data</h1>,
            message : <p>
                Do you want to save the changes?
            </p>,
        };
    });
    
    
    
    // jsx:
    return (
        <ComplexEditModelDialog<ProductVariantDetail>
            // other props:
            {...restComplexEditModelDialogProps}
            
            
            
            // data:
            modelName='Variant'
            modelEntryName={model?.name}
            model={model}
            
            
            
            // privileges:
            privilegeAdd    = {!!role?.product_c}
            privilegeUpdate = {useMemo(() => ({
                description : !!role?.product_ud,
            }), [role])}
            privilegeDelete = {!!role?.product_d}
            
            
            
            // stores:
            isModified  = {isModified}
            
            // isCommiting = {isLoadingUpdate}
            // isDeleting  = {isLoadingDelete}
            
            
            
            // tabs:
            tabDelete={PAGE_VARIANT_TAB_DELETE}
            
            
            
            // states:
            defaultExpandedTabIndex={defaultExpandedTabIndex}
            
            
            
            // auto focusable:
            autoFocusOn={props.autoFocusOn ?? firstEditorRef}
            
            
            
            // handlers:
            onUpdate={handleUpdate}
            // onAfterUpdate={handleAfterUpdate}
            
            // onDelete={handleDelete}
            // onAfterDelete={undefined}
            
            onConfirmDelete={handleConfirmDelete}
            onConfirmUnsaved={handleConfirmUnsaved}
        >{({privilegeAdd, privilegeUpdate}) => <>
            <TabPanel label={PAGE_VARIANT_TAB_INFORMATIONS} panelComponent={<Generic className={styleSheet.infoTab} />}>
                <form>
                    <span className='name label'>Name:</span>
                    <NameEditor
                        // refs:
                        elmRef={(defaultExpandedTabIndex === 0) ? firstEditorRef : undefined}
                        
                        
                        
                        // classes:
                        className='name editor'
                        
                        
                        
                        // accessibilities:
                        enabled={privilegeUpdate.description || privilegeAdd}
                        
                        
                        
                        // values:
                        value={name}
                        onChange={(value) => {
                            setName(value);
                            setIsModified(true);
                        }}
                    />
                    
                    <span className='price label'>Additional Price:</span>
                    <span className='price label optional'>(Optional: will be added to base price)</span>
                    <PriceEditor
                        // classes:
                        className='price editor'
                        
                        
                        
                        // accessibilities:
                        enabled={privilegeUpdate.price || privilegeAdd}
                        
                        
                        
                        // validations:
                        required={false}
                        
                        
                        
                        // values:
                        value={price}
                        onChange={(value) => {
                            setPrice(value || null); // converts 0 to empty
                            setIsModified(true);
                        }}
                    />
                    
                    <span className='sWeight label'>Additional Shipping Weight:</span>
                    <span className='sWeight label optional'>(Optional: will be added to base weight)</span>
                    <ShippingWeightEditor
                        // classes:
                        className='sWeight editor'
                        
                        
                        
                        // accessibilities:
                        enabled={privilegeUpdate.price || privilegeAdd}
                        
                        
                        
                        // values:
                        value={shippingWeight}
                        onChange={(value) => {
                            setShippingWeight(value);
                            setIsModified(true);
                        }}
                    />
                </form>
            </TabPanel>
        </>}</ComplexEditModelDialog>
    );
};
export {
    EditProductVariantDialog,
    EditProductVariantDialog as default,
}
