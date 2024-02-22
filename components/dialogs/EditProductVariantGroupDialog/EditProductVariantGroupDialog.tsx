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
    // react components:
    EditProductVariantDialog,
}                           from '@/components/dialogs/EditProductVariantDialog'

import {
    VariantEditor,
}                           from '@/components/editors/VariantEditor'
import {
    VariantPreview,
}                           from '@/components/views//VariantPreview'
import {
    // types:
    UpdateHandler,
    
    ConfirmDeleteHandler,
    ConfirmUnsavedHandler,
    
    
    
    // react components:
    ImplementedComplexEditModelDialogProps,
    ComplexEditModelDialog,
}                           from '@/components/dialogs/ComplexEditModelDialog'

// internals:
import type {
    PartialModel,
}                           from '@/libs/types'

// others:
import {
    customAlphabet,
}                           from 'nanoid/async'

// stores:
import type {
    // types:
    ProductVariantDetail,
    ProductVariantGroupDetail,
}                           from '@/store/features/api/apiSlice'

// configs:
import {
    PAGE_VARIANT_GROUP_TAB_INFORMATIONS,
    PAGE_VARIANT_GROUP_TAB_DELETE,
}                           from '@/website.config'



// styles:
const useEditProductVariantGroupDialogStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./EditProductVariantGroupDialogStyles')
, { id: 'w9r17m435e' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
import './EditProductVariantGroupDialogStyles';



// react components:
export interface EditProductVariantGroupDialogProps
    extends
        // bases:
        ImplementedComplexEditModelDialogProps<ProductVariantGroupDetail>
{
    // data:
    productId : string
}
const EditProductVariantGroupDialog = (props: EditProductVariantGroupDialogProps): JSX.Element|null => {
    // styles:
    const styleSheet = useEditProductVariantGroupDialogStyleSheet();
    
    
    
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
    
    const [name      , setName      ] = useState<string>(model?.name ?? '');
    
    
    
    // sessions:
    const { data: session } = useSession();
    const role = session?.role;
    
    
    
    // stores:
    const variantList = model?.productVariants;
    const [unmodifiedVariants, setUnmodifiedVariants] = useState<ProductVariantDetail[]|undefined>(variantList);
    const [variants, setVariants] = useState<ProductVariantDetail[]|undefined>(variantList);
    if ((unmodifiedVariants?.length !== variantList?.length) || unmodifiedVariants?.some((item, index) => (item !== variantList?.[index]))) {
        setUnmodifiedVariants(variantList); // tracks the new changes
        setVariants(variantList);           // discard the user changes
    } // if
    
    
    
    // refs:
    const firstEditorRef = useRef<HTMLInputElement|null>(null); // TODO: finish this
    
    
    
    // handlers:
    const handleUpdate               = useEvent<UpdateHandler<ProductVariantGroupDetail>>(async ({id, privilegeAdd, privilegeUpdate}) => {
        return {
            ...model,
            
            id   : id ?? await (async () => {
                const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 16);
                return ` ${await nanoid()}`; // starts with space{random-temporary-id}
            })(),
            
            name : (privilegeUpdate.description || privilegeAdd) ? name : undefined,
            
            ...((variants === unmodifiedVariants) ? null : ({
                productVariants : variants,
            } satisfies Partial<ProductVariantGroupDetail>)),
        };
    });
    
    const handleConfirmDelete        = useEvent<ConfirmDeleteHandler<ProductVariantGroupDetail>>(({model}) => {
        return {
            title   : <h1>Delete Confirmation</h1>,
            message : <>
                <p>
                    Are you sure to delete variant group <strong>{model.name}</strong>?
                </p>
                <p>
                    The associated product variant in existing orders will be marked as <strong>DELETED VARIANT</strong>.
                </p>
            </>,
        };
    });
    const handleConfirmUnsaved       = useEvent<ConfirmUnsavedHandler<ProductVariantGroupDetail>>(() => {
        return {
            title   : <h1>Unsaved Data</h1>,
            message : <p>
                Do you want to save the changes?
            </p>,
        };
    });
    
    
    
    // jsx:
    return (
        <ComplexEditModelDialog<ProductVariantGroupDetail>
            // other props:
            {...restComplexEditModelDialogProps}
            
            
            
            // data:
            modelName='Variant Group'
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
            tabDelete={PAGE_VARIANT_GROUP_TAB_DELETE}
            
            
            
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
            <TabPanel label={PAGE_VARIANT_GROUP_TAB_INFORMATIONS} panelComponent={<Generic className={styleSheet.infoTab} />}>
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
                    
                    <span className='variants label'>Variants:</span>
                    <VariantEditor
                        // classes:
                        className='variants editor'
                        
                        
                        
                        // accessibilities:
                        /*
                            edit mode   (having model) : readOnly when no privilege update_product_description
                            create mode     (no model) : readOnly when no privilege create_product
                        */
                        readOnly={!(!!model && privilegeUpdate.description) && !(!model && privilegeAdd)}
                        
                        
                        
                        // values:
                        value={variants}
                        onChange={(value) => {
                            setVariants(value);
                            setIsModified(true);
                        }}
                        
                        
                        
                        // components:
                        modelPreviewComponent={
                            <VariantPreview
                                // data:
                                model={undefined as any}
                                productId={model?.id ?? ''} // the related product of the productVariant
                                
                                
                                
                                // privileges:
                                /*
                                    edit mode   (having model) : editable when has privilege update_product_description
                                    create mode     (no model) : editable when has privilege create_product
                                */
                                privilegeEdit = {(!!model && privilegeUpdate.description) || (!model && privilegeAdd)}
                            />
                        }
                        modelCreateComponent={
                            !!role?.product_c
                            ? <EditProductVariantDialog
                                // data:
                                model={null} // create a new model
                                // TODO: if product is create_new, the productId will be empty, thus creating productVariant will be fail
                                productId={model?.id ?? ''} // the related product of the productVariant
                            />
                            : undefined
                        }
                    />
                </form>
            </TabPanel>
        </>}</ComplexEditModelDialog>
    );
};
export {
    EditProductVariantGroupDialog,
    EditProductVariantGroupDialog as default,
}
