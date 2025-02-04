'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useState,
}                           from 'react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheets,
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
    
    
    
    // simple-components:
    Check,
    
    
    
    // composite-components:
    TabPanel,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    NameEditor,
}                           from '@heymarco/name-editor'

// internal components:
import {
    // react components:
    EditVariantDialog,
}                           from '@/components/dialogs/EditVariantDialog'

import {
    // types:
    VariantState,
    
    
    
    // react components:
    VariantStateProvider,
    VariantEditor,
}                           from '@/components/editors/VariantEditor'
import {
    VariantPreview,
}                           from '@/components/views/VariantPreview'
import {
    // react components:
    ComplexEditModelDialogProps,
    ImplementedComplexEditModelDialogProps,
    ComplexEditModelDialog,
}                           from '@/components/dialogs/ComplexEditModelDialog'

// others:
import {
    customAlphabet,
}                           from 'nanoid/async'

// models:
import {
    // types:
    type ModelConfirmUnsavedEventHandler,
    type ModelConfirmDeleteEventHandler,
    type ModelCreatingOrUpdatingEventHandler,
    type ModelCreatingOrUpdatingOfDraftEventHandler,
    
    type VariantDetail,
    type VariantGroupDetail,
}                           from '@/models'

// configs:
import {
    PAGE_VARIANT_GROUP_TAB_INFORMATIONS,
    PAGE_VARIANT_GROUP_TAB_DELETE,
}                           from '@/website.config'



// styles:
const useEditVariantGroupDialogStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./EditVariantGroupDialogStyles')
, { id: 'w9r17m435e' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
import './EditVariantGroupDialogStyles';



// react components:
export interface EditVariantGroupDialogProps
    extends
        // bases:
        ImplementedComplexEditModelDialogProps<VariantGroupDetail>,
        Partial<Pick<ComplexEditModelDialogProps<VariantGroupDetail>,
            // data:
            |'modelName'
            
            
            
            // stores:
            |'isCommiting'
            |'isReverting'
            |'isDeleting'
            
            
            
            // handlers:
            // |'onUpdating' // replace from `ModelCreatingOrUpdatingEventHandler<VariantGroupDetail>` to `ModelCreatingOrUpdatingOfDraftEventHandler<VariantGroupDetail>`
            |'onUpdate'
            
            |'onDeleting'
            |'onDeleted'
            
            |'onSideModelCommitting'
            |'onSideModelDiscarding'
        >>,
        
        // privileges & states:
        VariantState
{
    // handlers
    onUpdating       ?: ModelCreatingOrUpdatingOfDraftEventHandler<VariantGroupDetail>
}
const EditVariantGroupDialog = (props: EditVariantGroupDialogProps): JSX.Element|null => {
    // styles:
    const styleSheet = useEditVariantGroupDialogStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        model = null,
        
        
        
        // privileges:
        privilegeAdd,
        privilegeUpdate,
        privilegeDelete,
        
        
        
        // images:
        registerAddedImage,
        registerDeletedImage,
        
        
        
        // states:
        defaultExpandedTabIndex = 0,
        
        
        
        // handlers:
        onUpdating,
    ...restComplexEditModelDialogProps} = props;
    
    
    
    // states:
    const [isModified        , setIsModified        ] = useState<boolean>(false);
    
    const [name              , setName              ] = useState<string>(model?.name ?? '');
    const [hasDedicatedStocks, setHasDedicatedStocks] = useState<boolean>(model?.hasDedicatedStocks ?? false);
    
    
    
    // stores:
    const variantList = model?.variants;
    const [unmodifiedVariants, setUnmodifiedVariants] = useState<VariantDetail[]|undefined>(variantList);
    const [variants, setVariants] = useState<VariantDetail[]|undefined>(variantList);
    if ((unmodifiedVariants?.length !== variantList?.length) || unmodifiedVariants?.some((item, index) => (item !== variantList?.[index]))) {
        setUnmodifiedVariants(variantList); // tracks the new changes
        setVariants(variantList);           // discard the user changes
    } // if
    
    
    
    // refs:
    const firstEditorRef = useRef<HTMLInputElement|null>(null); // TODO: finish this
    
    
    
    // handlers:
    const handleUpdating             = useEvent<ModelCreatingOrUpdatingEventHandler<VariantGroupDetail>>(async ({ id, event, options: { addPermission, updatePermissions } }) => {
        const draft : VariantGroupDetail = {
            ...model,
            
            sort               : model?.sort ?? 0,
            
            id                 : id ?? await (async () => {
                const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 10);
                return ` ${await nanoid()}`; // starts with space{random-temporary-id}
            })(),
            
            name               : (updatePermissions.description || addPermission)  ? name               : (model?.name               ?? ''   ),
            hasDedicatedStocks : (updatePermissions.stock       || addPermission)  ? hasDedicatedStocks : (model?.hasDedicatedStocks ?? false),
            
            variants           : (!!variants && (variants !== unmodifiedVariants)) ? variants           : (unmodifiedVariants        ?? []   ),
        };
        return (onUpdating !== undefined) ? onUpdating({ draft, event, options: { addPermission, updatePermissions} }) : draft;
    });
    
    const handleConfirmDelete        = useEvent<ModelConfirmDeleteEventHandler<VariantGroupDetail>>(({ draft }) => {
        return {
            title   : <h1>Delete Confirmation</h1>,
            message : <>
                <p>
                    Are you sure to delete variant group <strong>{draft.name}</strong>?
                </p>
                <p>
                    The associated product variant in existing orders will be marked as <strong>DELETED VARIANT</strong>.
                </p>
            </>,
        };
    });
    const handleConfirmUnsaved       = useEvent<ModelConfirmUnsavedEventHandler<VariantGroupDetail>>(() => {
        return {
            title   : <h1>Unsaved Data</h1>,
            message : <p>
                Do you want to save the changes?
            </p>,
        };
    });
    
    
    
    // jsx:
    return (
        <ComplexEditModelDialog<VariantGroupDetail>
            // other props:
            {...restComplexEditModelDialogProps}
            
            
            
            // data:
            modelName={props.modelName ?? 'Variant Group'}
            modelEntryName={model?.name}
            model={model}
            
            
            
            // privileges:
            privilegeAdd    = {privilegeAdd   }
            privilegeUpdate = {privilegeUpdate}
            privilegeDelete = {privilegeDelete}
            
            
            
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
            onUpdating={handleUpdating}
            // onUpdate={handleUpdate}
            
            // onDeleting={handleDeleting}
            // onDeleted={undefined}
            
            onConfirmDelete={handleConfirmDelete}
            onConfirmUnsaved={handleConfirmUnsaved}
        >{({whenAdd, whenUpdate}) => <>
            <TabPanel label={PAGE_VARIANT_GROUP_TAB_INFORMATIONS} panelComponent={<Generic className={styleSheet.infoTab} />}>
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
                        
                        
                        
                        // validations:
                        required={true}
                    />
                    
                    <span className='hasStock label'>Dedicated Stocks:</span>
                    <Check
                        // classes:
                        className='hasStock editor'
                        
                        
                        
                        // accessibilities:
                        enabled={whenUpdate.stock || whenAdd}
                        
                        
                        
                        // values:
                        active={hasDedicatedStocks}
                        onActiveChange={({active}) => {
                            setHasDedicatedStocks(active);
                            setIsModified(true);
                        }}
                    >
                        Has dedicated stock for each variant
                    </Check>
                    
                    <span className='variants label'>Variants:</span>
                    <VariantStateProvider
                        // privileges:
                        privilegeAdd    = {privilegeAdd   }
                        privilegeUpdate = {privilegeUpdate}
                        privilegeDelete = {privilegeDelete}
                        
                        
                        
                        // images:
                        registerAddedImage   = {registerAddedImage  }
                        registerDeletedImage = {registerDeletedImage}
                    >
                        <VariantEditor
                            // classes:
                            className='variants editor'
                            
                            
                            
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
                                />
                            }
                            modelCreateComponent={
                                privilegeAdd
                                ? <EditVariantDialog
                                    // data:
                                    model={null} // create a new model
                                    
                                    
                                    
                                    /* the variantState will be overriden by <VariantEditor> */
                                />
                                : undefined
                            }
                        />
                    </VariantStateProvider>
                </form>
            </TabPanel>
        </>}</ComplexEditModelDialog>
    );
};
export {
    EditVariantGroupDialog,
    EditVariantGroupDialog as default,
}
