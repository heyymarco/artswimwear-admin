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

// styles:
import {
    useEditProductDialogStyleSheet,
}                           from './styles/loader'

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

// heymarco components:
import {
    Image,
}                           from '@heymarco/image'
import {
    NameEditor,
}                           from '@heymarco/name-editor'

// internal components:
import {
    UniquePathEditor,
}                           from '@/components/editors/UniquePathEditor'
import {
    PriceEditor,
}                           from '@/components/editors/PriceEditor'
import {
    ShippingWeightEditor,
}                           from '@/components/editors/ShippingWeightEditor'
import {
    StockListEditor,
}                           from '@/components/editors/StockListEditor'
import {
    KeywordEditor,
}                           from '@/components/editors/KeywordEditor'
import {
    VisibilityEditor,
}                           from '@/components/editors/VisibilityEditor'
import {
    GalleryEditor,
}                           from '@/components/editors/GalleryEditor'
import {
    WysiwygEditorState,
    ToolbarPlugin,
    EditorPlugin,
    WysiwygEditor,
}                           from '@/components/editors/WysiwygEditor'
import {
    // utilities:
    privilegeCategoryUpdateFullAccess,
    
    
    
    // react components:
    CategoryStateProps,
    CategoryStateProvider,
    CategoryEditor,
}                           from '@/components/editors/CategoryEditor'
import {
    // react components:
    ImplementedComplexEditModelDialogProps,
    ComplexEditModelDialog,
}                           from '@/components/dialogs/ComplexEditModelDialog'
import {
    // react components:
    EditVariantGroupDialog,
}                           from '@/components/dialogs/EditVariantGroupDialog'
import {
    // react components:
    EditCategoryDialog,
}                           from '@/components/dialogs/EditCategoryDialog'
import {
    // utilities:
    privilegeVariantUpdateFullAccess,
    
    
    
    // react components:
    VariantGroupEditor,
}                           from '@/components/editors/VariantEditor'
import {
    VariantGroupPreview,
}                           from '@/components/views/VariantGroupPreview'
import {
    StockPreview,
}                           from '@/components/views/StockPreview'
import {
    CategoryPreview,
}                           from '@/components/views/CategoryPreview'
import {
    PaginationStateProvider,
}                           from '@/components/explorers/Pagination'

// models:
import {
    // types:
    type PaginationArgs,
    
    type ModelConfirmUnsavedEventHandler,
    type ModelConfirmDeleteEventHandler,
    type ModelUpsertingEventHandler,
    type ModelDeletingEventHandler,
    
    type ProductVisibility,
    type Stock,
    type ProductDetail,
    type VariantGroupDetail,
    type StockDetail,
    type CategoryDetail,
    
    
    
    // utilities:
    createVariantGroupDiff,
    createStockMap,
}                           from '@/models'

// stores:
import {
    // hooks:
    useUpdateProduct,
    useDeleteProduct,
    
    useProductAvailablePath,
    
    useGetCategoryPage,
    
    usePostImage,
    useDeleteImage,
    useMoveImage,
}                           from '@/store/features/api/apiSlice'

// internals:
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'
import {
    useDraftDifferentialImages,
}                           from '@/states/draftDifferentialImages'

// configs:
import {
    PAGE_PRODUCT_TAB_INFORMATIONS,
    PAGE_PRODUCT_TAB_VARIANTS,
    PAGE_PRODUCT_TAB_STOCKS,
    PAGE_PRODUCT_TAB_IMAGES,
    PAGE_PRODUCT_TAB_DESCRIPTION,
    PAGE_PRODUCT_TAB_CATEGORIES,
    PAGE_PRODUCT_TAB_DELETE,
}                           from '@/website.config'



// utilities:
const noVariantStockList : StockDetail[] = [{
    id         : ' emptyId',
    value      : null,
    variantIds : [],
}];



// hooks:
const useGetRootCategoryPage = (arg: PaginationArgs) => {
    return useGetCategoryPage({
        ...arg,
        parent : null,
    });
};



// react components:
export interface EditProductDialogProps
    extends
        // bases:
        ImplementedComplexEditModelDialogProps<ProductDetail>
{
}
const EditProductDialog = (props: EditProductDialogProps): JSX.Element|null => {
    // styles:
    const styleSheet = useEditProductDialogStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        model = null,
        
        
        
        // states:
        defaultExpandedTabIndex = 0,
        
        
        
        // other props:
        ...restEditProductDialogProps
    } = props;
    
    
    
    // states:
    const [isModified      , setIsModified    ] = useState<boolean>(false);
    const [isPathModified  , setIsPathModified] = useState<boolean>(false);
    
    const [visibility      , setVisibility    ] = useState<ProductVisibility      >(model?.visibility     ?? 'DRAFT');
    const [name            , setName          ] = useState<string                 >(model?.name           ?? ''     );
    const [path            , setPath          ] = useState<string                 >(model?.path           ?? ''     );
    const [price           , setPrice         ] = useState<number                 >(model?.price          ?? 0      );
    const [shippingWeight  , setShippingWeight] = useState<number            |null>(model?.shippingWeight ?? null   ); // optional field
    const [images          , setImages        ] = useState<string[]               >(model?.images         ?? []     );
    const [description     , setDescription   ] = useState<WysiwygEditorState|null>(() => {                            // optional field
        const description = model?.description;
        if (!description) return null;
        if (typeof(description) === 'object') return description as any;
        try {
            return JSON.parse(description.toString());
        }
        catch {
            return null;
        } // try
    });
    const [keywords        , setKeywords      ] = useState<string[]               >(model?.keywords       ?? []     );
    const [categories      , setCategories    ] = useState<Set<string>            >(() => new Set<string>(model?.categories));
    
    const draftDifferentialImages               = useDraftDifferentialImages();
    
    
    
    // sessions:
    const { data: session } = useSession();
    const role = session?.role;
    
    
    
    // privileges:
    const privilegeAdd    = !!role?.product_c;
    const privilegeUpdate = useMemo(() => ({
        description : !!role?.product_ud,
        images      : !!role?.product_ui,
        price       : !!role?.product_up,
        stock       : !!role?.product_us,
        visibility  : !!role?.product_uv,
    }), [role]);
    const privilegeDelete = !!role?.product_d;
    
    const privilegeCategoryRead   = !!role?.category_r;
    const privilegeCategoryAdd    = !!role?.category_c;
    const privilegeCategoryUpdate = useMemo(() => ({
        description : !!role?.category_ud,
        images      : !!role?.category_ui,
        visibility  : !!role?.category_uv,
    }), [role]);
    const privilegeCategoryDelete = !!role?.category_d;
    
    
    
    // stores:
    const [updateProduct    , {isLoading : isLoadingUpdate           }] = useUpdateProduct();
    const [deleteProduct    , {isLoading : isLoadingDelete           }] = useDeleteProduct();
    const [postImage                                                  ] = usePostImage();
    const [commitDeleteImage, {isLoading : isLoadingCommitDeleteImage}] = useDeleteImage();
    const [revertDeleteImage, {isLoading : isLoadingRevertDeleteImage}] = useDeleteImage();
    const [commitMoveImage  , {isLoading : isLoadingCommitMoveImage  }] = useMoveImage();
    
    const variantGroupList = model?.variantGroups;
    const [unmodifiedVariantGroups, setUnmodifiedVariantGroups] = useState<VariantGroupDetail[]|undefined>(variantGroupList);
    const [variantGroups          , setVariantGroups          ] = useState<VariantGroupDetail[]|undefined>(variantGroupList);
    if ((unmodifiedVariantGroups?.length !== variantGroupList?.length) || unmodifiedVariantGroups?.some((item, index) => (item !== variantGroupList?.[index]))) {
        setUnmodifiedVariantGroups(variantGroupList); // tracks the new changes
        setVariantGroups(variantGroupList);           // discard the user changes
    } // if
    
    
    
    const stockList : StockDetail[] = model?.stocks ?? noVariantStockList;
    const [unmodifiedStocks, setUnmodifiedStocks] = useState<StockDetail[]>(stockList);
    const [stocks          , setStocks          ] = useState<StockDetail[]>(stockList);
    if ((unmodifiedStocks.length !== stockList.length) || unmodifiedStocks.some((item, index) => (item !== stockList[index]))) {
        setUnmodifiedStocks(stockList); // tracks the new changes
        setStocks(stockList);           // discard the user changes
    } // if
    
    
    
    const prevVariantGroups = useRef<VariantGroupDetail[]|undefined>(variantGroups);
    if (prevVariantGroups.current !== variantGroups) {
        const variantGroupDiff = createVariantGroupDiff(variantGroups ?? [], prevVariantGroups.current ?? []);
        const currentStocks : Pick<Stock, 'value'|'variantIds'>[] = stocks ?? [];
        const stockMap = createStockMap(variantGroupDiff, currentStocks, variantGroups ?? []);
        
        const idSuffix = Date.now(); // use completely different id to the prev, so the prev state gone
        setStocks(
            stockMap
            .map((stockItem, index) => ({
                ...stockItem,
                id : ` ${index}-${idSuffix}`, // starts with space{id-counter}
            }))
        );
        
        
        
        prevVariantGroups.current = variantGroups; // tracks the new changes
    } // if
    
    
    
    const handleSetCategories = useEvent((newCategories: Set<string>) => {
        setCategories(newCategories);
        setIsModified(true);
    });
    const rootCategoryState : CategoryStateProps = {
        // values:
        value    : categories,
        onChange : handleSetCategories,
    };
    const categoryCreateComponent : CategoryStateProps['modelCreateComponent'] = (
        privilegeCategoryAdd
        ?
        <EditCategoryDialog
            // data:
            model={null} // create a new model
            
            
            
            // workaround for penetrating <CategoryStateProvider> to showDialog():
            // states:
            categoryState={{
                ...rootCategoryState,
                
                
                
                // privileges:
                /*
                    when create_mode (add):
                    * ALWAYS be ABLE to edit   the Category (because the data is *not_yet_exsist* on the database)
                    * ALWAYS be ABLE to delete the Category (because the data is *not_yet_exsist* on the database)
                */
                privilegeAdd    : privilegeCategoryAdd,
                privilegeUpdate : privilegeCategoryUpdateFullAccess,
                privilegeDelete : true,
            }}
        />
        : undefined
    );
    rootCategoryState.modelCreateComponent = categoryCreateComponent;
    
    
    
    // refs:
    const firstEditorRef = useRef<HTMLInputElement|null>(null);
    
    
    
    // handlers:
    const handleModelConfirmUnsaved  = useEvent<ModelConfirmUnsavedEventHandler<ProductDetail>>(() => {
        return {
            title   : <h1>Unsaved Data</h1>,
            message : <p>
                Do you want to save the changes?
            </p>,
        };
    });
    const handleModelConfirmDelete   = useEvent<ModelConfirmDeleteEventHandler<ProductDetail>>(({ draft }) => {
        return {
            title   : <h1>Delete Confirmation</h1>,
            message : <>
                <p>
                    Are you sure to delete product <strong>{draft.name}</strong>?
                </p>
                <p>
                    The associated product in existing orders will be marked as <strong>DELETED PRODUCT</strong>.
                </p>
            </>,
        };
    });
    
    const handleModelUpserting       = useEvent<ModelUpsertingEventHandler<ProductDetail>>(async ({ id, options: { addPermission, updatePermissions } }) => {
        const immigratedImages : string[] = [];
        let updatedImages = images;
        if (updatedImages.length) {
            try {
                const movedResponse = await commitMoveImage({
                    imageId : updatedImages,
                    // folder  : 'testing/helloh',
                    folder  : `products/${name || '__unnamed__'}`,
                }).unwrap();
                const movedMap = new Map<string, string>(
                    movedResponse.map(({from, to}) => [from, to])
                );
                
                
                
                if (movedMap.size) {
                    updatedImages = updatedImages.map((image) => {
                        // conditions:
                        const movedImage = movedMap.get(image);
                        if (movedImage === undefined) return image;
                        
                        
                        
                        // actions:
                        immigratedImages.push(image);
                        return movedImage;
                    });
                } // if
            }
            catch {
                // ignore any moveImages error
            } // try
        } // if
        
        
        
        try {
            return await updateProduct({
                id             : id ?? '',
                
                visibility     : (updatePermissions.visibility  || addPermission) ? visibility                                        : undefined,
                name           : (updatePermissions.description || addPermission) ? name                                              : undefined,
                path           : (updatePermissions.description || addPermission) ? path                                              : undefined,
                price          : (updatePermissions.price       || addPermission) ? price                                             : undefined,
                shippingWeight : (updatePermissions.price       || addPermission) ? shippingWeight                                    : undefined,
                images         : (updatePermissions.images      || addPermission) ? updatedImages                                     : undefined,
                description    : (updatePermissions.description || addPermission) ? ((description?.toJSON?.() ?? description) as any) : undefined,
                keywords       : (updatePermissions.description || addPermission) ? keywords                                          : undefined,
                
                variantGroups  : (variantGroups !== unmodifiedVariantGroups)      ? variantGroups                                     : undefined,
                stocks         : (stocks        !== unmodifiedStocks       )      ? stocks.map(({value}) => value)                    : undefined,
                categories     : (updatePermissions.description || addPermission) ? Array.from(categories)                            : undefined,
            }).unwrap();
        }
        finally {
            if (immigratedImages.length) {
                try {
                    await commitDeleteImage({
                        imageId : immigratedImages,
                    }).unwrap();
                }
                catch {
                    // ignore any deleteImages error
                } // try
            } // if
        } // try
    });
    const handleModelDeleting        = useEvent<ModelDeletingEventHandler<ProductDetail>>(async ({ draft: { id } }) => {
        await deleteProduct({
            id : id,
        }).unwrap();
    });
    
    const handleSideModelSave        = useEvent(async (commitImages : boolean): Promise<void> => {
        // search for unused image(s) and delete them:
        const {unusedImages} = draftDifferentialImages.commitChanges(commitImages);
        
        
        
        try {
            if (unusedImages.length) {
                await (commitImages ? commitDeleteImage : revertDeleteImage)({
                    imageId : unusedImages,
                }).unwrap();
            } // if
        }
        catch {
            // ignore any error
            return; // but do not clear the draft
        } // try
    });
    const handleSideModelCommitting  = useEvent(async (): Promise<void> => {
        await handleSideModelSave(/*commitImages = */true);
    });
    const handleSideModelDiscarding  = useEvent(async (): Promise<void> => {
        await handleSideModelSave(/*commitImages = */false);
    });
    
    const handleNameChange           = useEvent((name: string) => {
        // conditions:
        if (isPathModified) return; // path is already modified by user, do not perform *auto* modify
        
        
        
        // sync path:
        setPath(
            name.trim().toLowerCase().replace(/(\s|_|-)+/ig, '-')
        );
    });
    
    
    
    // default props:
    const {
        // variants:
        horzAlign = 'stretch',
        vertAlign = 'center',
        
        
        
        // classes:
        className = styleSheet.dialog,
        
        
        
        // other props:
        ...restComplexEditModelDialogProps
    } = restEditProductDialogProps;
    
    
    
    // jsx:
    return (
        <ComplexEditModelDialog<ProductDetail>
            // other props:
            {...restComplexEditModelDialogProps}
            
            
            
            // data:
            modelName='Product'
            modelEntryName={model?.name}
            model={model}
            
            
            
            // privileges:
            privilegeAdd    = {privilegeAdd   }
            privilegeUpdate = {privilegeUpdate}
            privilegeDelete = {privilegeDelete}
            
            
            
            // stores:
            isModified     = {isModified}
            
            isCommiting    = {isLoadingUpdate || isLoadingCommitDeleteImage || isLoadingCommitMoveImage}
            isReverting    = {                   isLoadingRevertDeleteImage}
            isDeleting     = {isLoadingDelete || isLoadingCommitDeleteImage}
            
            
            
            // variants:
            horzAlign = {horzAlign}
            vertAlign = {vertAlign}
            
            
            
            // classes:
            className = {className}
            
            
            
            // tabs:
            tabDelete={PAGE_PRODUCT_TAB_DELETE}
            
            
            
            // states:
            defaultExpandedTabIndex={defaultExpandedTabIndex}
            
            
            
            // auto focusable:
            autoFocusOn={props.autoFocusOn ?? firstEditorRef}
            
            
            
            // handlers:
            onModelConfirmUnsaved={handleModelConfirmUnsaved}
            onModelConfirmDelete={handleModelConfirmDelete}
            
            onModelUpserting={handleModelUpserting}
            onModelDeleting={handleModelDeleting}
            
            onSideModelCommitting={handleSideModelCommitting}
            onSideModelDiscarding={handleSideModelDiscarding}
        >{({whenAdd, whenUpdate}) => <>
            <TabPanel label={PAGE_PRODUCT_TAB_INFORMATIONS} panelComponent={<Generic className={styleSheet.infoTab} />}>
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
                            handleNameChange(value);
                        }}
                        
                        
                        
                        // validations:
                        required={true}
                    />
                    
                    <span className='path label'>Path:</span>
                    <UniquePathEditor
                        // data:
                        useModelAvailablePath={useProductAvailablePath}
                        
                        
                        
                        // classes:
                        className='path editor'
                        
                        
                        
                        // appearances:
                        modelSlug='/products/'
                        
                        
                        
                        // accessibilities:
                        enabled={whenUpdate.description || whenAdd}
                        
                        
                        
                        // values:
                        currentValue={model?.path ?? ''}
                        value={path}
                        onChange={(value) => {
                            setPath(value);
                            setIsPathModified(true);
                        }}
                    />
                    
                    <span className='price label'>Price:</span>
                    <PriceEditor
                        // classes:
                        className='price editor'
                        
                        
                        
                        // accessibilities:
                        enabled={whenUpdate.price || whenAdd}
                        
                        
                        
                        // values:
                        value={price}
                        onChange={(value) => {
                            setPrice(value ?? 0);
                            setIsModified(true);
                        }}
                    />
                    
                    <span className='sWeight label'>Shipping Weight:</span>
                    <ShippingWeightEditor
                        // classes:
                        className='sWeight editor'
                        
                        
                        
                        // accessibilities:
                        enabled={whenUpdate.price || whenAdd}
                        
                        
                        
                        // values:
                        value={shippingWeight}
                        onChange={(value) => {
                            setShippingWeight(value);
                            setIsModified(true);
                        }}
                    />
                    
                    <span className='keywords label'>Keywords:</span>
                    <KeywordEditor
                        // classes:
                        className='keywords editor'
                        
                        
                        
                        // accessibilities:
                        enabled={whenUpdate.description || whenAdd}
                        
                        
                        
                        // values:
                        value={keywords}
                        onChange={(value) => {
                            setKeywords(value);
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
                        enabled={whenUpdate.visibility || whenAdd}
                        
                        
                        
                        // values:
                        value={visibility}
                        onChange={(value) => {
                            setVisibility(value);
                            setIsModified(true);
                        }}
                    />
                </form>
            </TabPanel>
            <TabPanel label={PAGE_PRODUCT_TAB_VARIANTS}     panelComponent={<Generic className={styleSheet.variantsTab} />}>
                <VariantGroupEditor
                    // values:
                    value={variantGroups}
                    onChange={(value) => {
                        setVariantGroups(value);
                        setIsModified(true);
                    }}
                    
                    
                    
                    // privileges:
                    privilegeAdd    = {                                             privilegeAdd   }
                    /*
                        when edit_mode (update):
                            * the editing  capability follows the `privilegeProductUpdate`
                            * the deleting capability follows the `privilegeProductDelete`
                        
                        when create_mode (add):
                            * ALWAYS be ABLE to edit   the VariantGroup and the Variant (because the data is *not_yet_exsist* on the database)
                            * ALWAYS be ABLE to delete the VariantGroup and the Variant (because the data is *not_yet_exsist* on the database)
                    */
                    privilegeUpdate = {whenAdd ? privilegeVariantUpdateFullAccess : privilegeUpdate}
                    privilegeDelete = {whenAdd ?               true               : privilegeDelete}
                    
                    
                    
                    // images:
                    registerAddedImage   = {draftDifferentialImages.registerAddedImage  }
                    registerDeletedImage = {draftDifferentialImages.registerDeletedImage}
                    
                    
                    
                    // components:
                    modelPreviewComponent={
                        <VariantGroupPreview
                            // data:
                            model={undefined as any}
                        />
                    }
                    modelCreateComponent={
                        privilegeAdd
                        ? <EditVariantGroupDialog
                            // data:
                            model={null} // create a new model
                            
                            
                            
                            /* the variantState will be overriden by <VariantGroupEditor> */
                        />
                        : undefined
                    }
                />
            </TabPanel>
            <TabPanel label={PAGE_PRODUCT_TAB_STOCKS}       panelComponent={<Generic className={styleSheet.stocksTab} />}>
                <StockListEditor
                    // models:
                    variantGroups={variantGroups}
                    
                    
                    
                    // variants:
                    listStyle='flush'
                    
                    
                    
                    // accessibilities:
                    readOnly={!(whenUpdate.stock || whenAdd)}
                    
                    
                    
                    // values:
                    value={stocks}
                    onChange={(value) => {
                        setStocks(value);
                        setIsModified(true);
                    }}
                    
                    
                    
                    // components:
                    modelPreviewComponent={
                        <StockPreview
                            // data:
                            model={undefined as any}
                        />
                    }
                />
            </TabPanel>
            <TabPanel label={PAGE_PRODUCT_TAB_IMAGES}       panelComponent={<Generic className={styleSheet.imagesTab} />}>
                <GalleryEditor<HTMLElement, string>
                    // variants:
                    nude={true}
                    
                    
                    
                    // accessibilities:
                    readOnly={!(whenUpdate.images || whenAdd)}
                    
                    
                    
                    // values:
                    value={images}
                    onChange={(value) => {
                        setImages(value);
                        setIsModified(true);
                    }}
                    
                    
                    
                    // components:
                    imageComponent={
                        // @ts-ignore
                        <Image
                            priority={true}
                        />
                    }
                    
                    
                    
                    // handlers:
                    onUploadImage={async ({ imageFile, reportProgress, abortSignal }) => {
                        try {
                            const imageId = await postImage({
                                image            : imageFile,
                                folder           : `products/${name || '__unnamed__'}`,
                                onUploadProgress : reportProgress,
                                abortSignal      : abortSignal,
                            }).unwrap();
                            
                            // register to actual_delete the new_image when reverted:
                            draftDifferentialImages.registerAddedImage(imageId);
                            
                            return imageId;
                        }
                        catch (error : any) {
                            if (error.status === 0) { // non_standard HTTP status code: a request was aborted
                                // TODO: try to cleanup a prematurely image (if any)
                                
                                return null; // prevents showing error
                            } // if
                            
                            throw error;     // shows the error detail
                        } // try
                    }}
                    onDeleteImage={async ({ imageData: imageId }) => {
                        // register to actual_delete the deleted_image when committed:
                        draftDifferentialImages.registerDeletedImage(imageId);
                        
                        return true;
                    }}
                    onResolveImageUrl={resolveMediaUrl<never>}
                />
            </TabPanel>
            <TabPanel label={PAGE_PRODUCT_TAB_DESCRIPTION}  panelComponent={<Generic className={styleSheet.descriptionTab} />}>
                <WysiwygEditor
                    // refs:
                    elmRef={(defaultExpandedTabIndex === 2) ? firstEditorRef : undefined}
                    
                    
                    
                    // classes:
                    className={styleSheet.editDescription}
                    
                    
                    
                    // accessibilities:
                    enabled={whenUpdate.description || whenAdd}
                    
                    
                    
                    // values:
                    value={description}
                    onChange={(value) => {
                        setDescription(value);
                        setIsModified(true);
                    }}
                >
                    <ToolbarPlugin className='solid' theme='primary' />
                    <EditorPlugin
                        // accessibilities:
                        placeholder='Type product description here...'
                    />
                </WysiwygEditor>
            </TabPanel>
            {privilegeCategoryRead && <TabPanel label={PAGE_PRODUCT_TAB_CATEGORIES}   panelComponent={<Generic className={styleSheet.categoriesTab} />}>
                <PaginationStateProvider<CategoryDetail>
                    // states:
                    initialPerPage={10}
                    
                    
                    
                    // data:
                    useGetModelPage={useGetRootCategoryPage}
                >
                    <CategoryStateProvider
                        {...rootCategoryState}
                    >
                        <CategoryEditor
                            // appearances:
                            showPaginationTop={false}
                            autoHidePagination={true}
                            
                            
                            
                            // behaviors:
                            selectable={true}
                            
                            
                            
                            // values:
                            // value={categories} // already handled in <CategoryStateProvider>
                            // onChange={setCategories} // already handled in <CategoryStateProvider>
                            
                            
                            
                            // privileges:
                            privilegeAdd    = {                                              privilegeCategoryAdd   }
                            /*
                                when edit_mode (update):
                                    * the editing  capability follows the `privilegeCategoryUpdate`
                                    * the deleting capability follows the `privilegeCategoryDelete`
                                
                                when create_mode (add):
                                    * ALWAYS be ABLE to edit   the Category (because the data is *not_yet_exsist* on the database)
                                    * ALWAYS be ABLE to delete the Category (because the data is *not_yet_exsist* on the database)
                            */
                            privilegeUpdate = {whenAdd ? privilegeCategoryUpdateFullAccess : privilegeCategoryUpdate}
                            privilegeDelete = {whenAdd ?               true                : privilegeCategoryDelete}
                            
                            
                            
                            // images:
                            registerAddedImage   = {undefined} // no need to intercept the images of root_categories
                            registerDeletedImage = {undefined} // no need to intercept the images of root_categories
                            
                            
                            
                            // components:
                            modelPreviewComponent={
                                <CategoryPreview
                                    // data:
                                    model={undefined as any}
                                />
                            }
                            modelCreateComponent={categoryCreateComponent}
                        />
                    </CategoryStateProvider>
                </PaginationStateProvider>
            </TabPanel>}
        </>}</ComplexEditModelDialog>
    );
};
export {
    EditProductDialog,
    EditProductDialog as default,
}
