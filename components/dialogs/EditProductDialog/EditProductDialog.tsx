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
    
    
    
    // simple-components:
    Button,
    
    
    
    // composite-components:
    TabPanel,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    Image,
}                           from '@heymarco/image'
import {
    LoadingBar,
}                           from '@heymarco/loading-bar'

// internal components:
import {
    NameEditor,
}                           from '@/components/editors/NameEditor'
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
    StockEditor,
}                           from '@/components/editors/StockEditor'
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
    // types:
    UpdateHandler,
    
    DeleteHandler,
    
    UpdateSideHandler,
    DeleteSideHandler,
    
    ConfirmDeleteHandler,
    ConfirmUnsavedHandler,
    
    
    
    // react components:
    ImplementedComplexEditModelDialogProps,
    ComplexEditModelDialog,
}                           from '@/components/dialogs/ComplexEditModelDialog'
import {
    // react components:
    EditProductVariantGroupDialog,
}                           from '@/components/dialogs/EditProductVariantGroupDialog'
import {
    // react components:
    EditProductVariantDialog,
}                           from '@/components/dialogs/EditProductVariantDialog'
import {
    VariantGroupsEditor,
}                           from '@/components/editors/VariantGroupsEditor'
import {
    VariantGroupPreview,
}                           from '@/components/views//VariantGroupPreview'

// models:
import type {
    ProductVisibility,
}                           from '@prisma/client'

// stores:
import {
    // types:
    ProductDetail,
    
    
    
    // hooks:
    useUpdateProduct,
    useDeleteProduct,
    
    useGetProductVariantGroupList,
    
    usePostImage,
    useDeleteImage,
    useMoveImage,
}                           from '@/store/features/api/apiSlice'

// internals:
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'

// configs:
import {
    PAGE_PRODUCT_TAB_INFORMATIONS,
    PAGE_PRODUCT_TAB_VARIANTS,
    PAGE_PRODUCT_TAB_IMAGES,
    PAGE_PRODUCT_TAB_DESCRIPTION,
    PAGE_PRODUCT_TAB_DELETE,
}                           from '@/website.config'



// styles:
const useEditProductDialogStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./EditProductDialogStyles')
, { id: 'pkeb1tledn' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
import './EditProductDialogStyles';



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
    ...restComplexEditModelDialogProps} = props;
    
    
    
    // states:
    const [isModified      , setIsModified      ] = useState<boolean>(false);
    const [isPathModified  , setIsPathModified  ] = useState<boolean>(false);
    
    const [visibility      , setVisibility      ] = useState<ProductVisibility      >(model?.visibility     ?? 'DRAFT');
    const [name            , setName            ] = useState<string                 >(model?.name           ?? ''     );
    const [path            , setPath            ] = useState<string                 >(model?.path           ?? ''     );
    const [price           , setPrice           ] = useState<number                 >(model?.price          ?? 0      );
    const [shippingWeight  , setShippingWeight  ] = useState<number            |null>(model?.shippingWeight ?? null   ); // optional field
    const [stock           , setStock           ] = useState<number            |null>(model?.stock          ?? null   ); // optional field
    const [images          , setImages          ] = useState<string[]               >(model?.images         ?? []     );
    const [description     , setDescription     ] = useState<WysiwygEditorState|null>(() => {                            // optional field
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
    
    const [draftDeletedImages                   ] = useState<Map<string, boolean|null>>(() => new Map<string, boolean|null>());
    
    
    
    // sessions:
    const { data: session } = useSession();
    const role = session?.role;
    
    
    
    // stores:
    const [updateProduct    , {isLoading : isLoadingUpdate           }] = useUpdateProduct();
    const [deleteProduct    , {isLoading : isLoadingDelete           }] = useDeleteProduct();
    const [postImage                                                  ] = usePostImage();
    const [commitDeleteImage, {isLoading : isLoadingCommitDeleteImage}] = useDeleteImage();
    const [revertDeleteImage, {isLoading : isLoadingRevertDeleteImage}] = useDeleteImage();
    const [commitMoveImage  , {isLoading : isLoadingCommitMoveImage  }] = useMoveImage();
    
    const {data: variantGroupList, isLoading: isLoadingVariantGroup, isError: isErrorVariantGroup} = useGetProductVariantGroupList({
        productId : model?.id ?? '', // the related product of the productVariantGroup
    });
    
    
    
    // refs:
    const firstEditorRef = useRef<HTMLInputElement|null>(null); // TODO: finish this
    
    
    
    // dialogs:
    const {
        showDialog,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handleUpdate               = useEvent<UpdateHandler>(async ({id, privilegeAdd, privilegeUpdate}) => {
        const deletedImages : string[] = [];
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
                        deletedImages.push(image);
                        return movedImage;
                    });
                } // if
            }
            catch {
                // ignore any moveImages error
            } // try
        } // if
        
        
        
        try {
            return (await updateProduct({
                id             : id ?? '',
                
                visibility     : (privilegeUpdate.visibility  || privilegeAdd) ? visibility                                        : undefined,
                name           : (privilegeUpdate.description || privilegeAdd) ? name                                              : undefined,
                path           : (privilegeUpdate.description || privilegeAdd) ? path                                              : undefined,
                price          : (privilegeUpdate.price       || privilegeAdd) ? price                                             : undefined,
                shippingWeight : (privilegeUpdate.price       || privilegeAdd) ? shippingWeight                                    : undefined,
                stock          : (privilegeUpdate.stock       || privilegeAdd) ? stock                                             : undefined,
                images         : (privilegeUpdate.images      || privilegeAdd) ? updatedImages                                     : undefined,
                description    : (privilegeUpdate.description || privilegeAdd) ? ((description?.toJSON?.() ?? description) as any) : undefined,
            }).unwrap()).id;
        }
        finally {
            if (deletedImages.length) {
                try {
                    await commitDeleteImage({
                        imageId : deletedImages,
                    }).unwrap();
                }
                catch {
                    // ignore any deleteImages error
                } // try
            } // if
        } // try
    });
    
    const handleDelete               = useEvent<DeleteHandler>(async ({id}) => {
        await deleteProduct({
            id : id,
        }).unwrap();
    });
    
    const handleSideUpdate           = useEvent<UpdateSideHandler>(async () => {
        await handleSideSave(/*commitImages = */true);
    });
    const handleSideDelete           = useEvent<DeleteSideHandler>(async () => {
        await handleSideSave(/*commitImages = */false);
    });
    const handleSideSave             = useEvent(async (commitImages : boolean) => {
        // search for unused image(s) and delete them:
        const unusedImageIds : string[] = [];
        for (const unusedImageId of
            Array.from(draftDeletedImages.entries())
            .filter((draftDeletedImage) => ((draftDeletedImage[1] === commitImages) || (draftDeletedImage[1] === null)))
            .map((draftDeletedImage) => draftDeletedImage[0])
        )
        {
            unusedImageIds.push(unusedImageId);
        } // for
        
        
        
        try {
            if (unusedImageIds.length) {
                await (commitImages ? commitDeleteImage : revertDeleteImage)({
                    imageId : unusedImageIds,
                }).unwrap();
            } // if
        }
        catch {
            // ignore any error
            return; // but do not clear the draft
        } // try
        
        
        
        // substract the drafts:
        for (const unusedImageId of unusedImageIds) draftDeletedImages.delete(unusedImageId);
    });
    
    const handleConfirmDelete        = useEvent<ConfirmDeleteHandler<ProductDetail>>(({model}) => {
        return {
            title   : <h1>Delete Confirmation</h1>,
            message : <>
                <p>
                    Are you sure to delete product <strong>{model.name}</strong>?
                </p>
                <p>
                    The associated product in existing orders will be marked as <strong>DELETED PRODUCT</strong>.
                </p>
            </>,
        };
    });
    const handleConfirmUnsaved       = useEvent<ConfirmUnsavedHandler<ProductDetail>>(() => {
        return {
            title   : <h1>Unsaved Data</h1>,
            message : <p>
                Do you want to save the changes?
            </p>,
        };
    });
    
    const handleNameChange = useEvent((name: string) => {
        // conditions:
        if (isPathModified) return; // path is already modified by user, do not perform *auto* modify
        
        
        
        // sync path:
        setPath(
            name.trim().toLowerCase().replace(/(\s|_|-)+/ig, '-')
        );
    });
    
    
    
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
            privilegeAdd    = {!!role?.product_c}
            privilegeUpdate = {useMemo(() => ({
                description : !!role?.product_ud,
                images      : !!role?.product_ui,
                price       : !!role?.product_up,
                stock       : !!role?.product_us,
                visibility  : !!role?.product_uv,
            }), [role])}
            privilegeDelete = {!!role?.product_d}
            
            
            
            // stores:
            isModified  = {isModified}
            
            isCommiting = {isLoadingUpdate || isLoadingCommitDeleteImage || isLoadingCommitMoveImage}
            isReverting = {                   isLoadingRevertDeleteImage}
            isDeleting  = {isLoadingDelete || isLoadingCommitDeleteImage}
            
            
            
            // tabs:
            tabDelete={PAGE_PRODUCT_TAB_DELETE}
            
            
            
            // states:
            defaultExpandedTabIndex={defaultExpandedTabIndex}
            
            
            
            // auto focusable:
            autoFocusOn={props.autoFocusOn ?? firstEditorRef}
            
            
            
            // handlers:
            onUpdate={handleUpdate}
            // onAfterUpdate={handleAfterUpdate}
            
            onDelete={handleDelete}
            // onAfterDelete={undefined}
            
            onSideUpdate={handleSideUpdate}
            onSideDelete={handleSideDelete}
            
            onConfirmDelete={handleConfirmDelete}
            onConfirmUnsaved={handleConfirmUnsaved}
        >{({privilegeAdd, privilegeUpdate}) => <>
            <TabPanel label={PAGE_PRODUCT_TAB_INFORMATIONS} panelComponent={<Generic className={styleSheet.infoTab} />}>
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
                            handleNameChange(value);
                        }}
                    />
                    
                    <span className='path label'>Path:</span>
                    <UniquePathEditor
                        // classes:
                        className='path editor'
                        
                        
                        
                        // accessibilities:
                        enabled={privilegeUpdate.description || privilegeAdd}
                        
                        
                        
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
                        enabled={privilegeUpdate.price || privilegeAdd}
                        
                        
                        
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
                        enabled={privilegeUpdate.price || privilegeAdd}
                        
                        
                        
                        // values:
                        value={shippingWeight}
                        onChange={(value) => {
                            setShippingWeight(value);
                            setIsModified(true);
                        }}
                    />
                    
                    <span className='stock label'>Stock:</span>
                    <StockEditor
                        // variants:
                        theme='primaryAlt'
                        
                        
                        
                        // classes:
                        className='stock editor'
                        
                        
                        
                        // accessibilities:
                        enabled={privilegeUpdate.stock || privilegeAdd}
                        
                        
                        
                        // values:
                        value={stock}
                        onChange={(value) => {
                            setStock(value);
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
                        enabled={privilegeUpdate.visibility || privilegeAdd}
                        
                        
                        
                        // values:
                        value={visibility}
                        onChange={(value) => {
                            setVisibility(value);
                            setIsModified(true);
                        }}
                    />
                </form>
            </TabPanel>
            <TabPanel label={PAGE_PRODUCT_TAB_VARIANTS}     panelComponent={<Generic className={styleSheet.variantsTab} />}>{
                isLoadingVariantGroup
                ? <LoadingBar />
                : isErrorVariantGroup
                    ? 'Error getting variant data'
                    : <VariantGroupsEditor
                        // values:
                        modelList={variantGroupList}
                        // value={roleId}
                        onChange={(value) => {
                            // setRoleId(value);
                            setIsModified(true);
                        }}
                        
                        
                        
                        // components:
                        modelPreviewComponent={
                            ({id}) => <VariantGroupPreview
                                // data:
                                model={undefined as any}
                                productId={model?.id ?? ''} // the related product of the productVariantGroup
                                
                                
                                
                                // accessibilities:
                                readOnly={!(privilegeUpdate.role /* || privilegeAdd */) && !(!id && privilegeAdd)}
                                
                                
                                
                                // handlers:
                                // onDelete={handleRoleDelete}
                            />
                        }
                        modelCreateComponent={
                            !!role?.role_c
                            ? <EditProductVariantGroupDialog
                                // data:
                                model={null} // create a new model
                                // TODO: if product is create_new, the productId will be empty, thus creating productVariantGroup will be fail
                                productId={model?.id ?? ''} // the related product of the productVariantGroup
                            />
                            : undefined
                        }
                        
                        
                        
                        // handlers:
                        // onCreate={handleRoleCreate}
                    />
            }</TabPanel>
            <TabPanel label={PAGE_PRODUCT_TAB_IMAGES}       panelComponent={<Generic className={styleSheet.imagesTab} />}>
                <GalleryEditor<HTMLElement, string>
                    // variants:
                    nude={true}
                    
                    
                    
                    // accessibilities:
                    readOnly={!(privilegeUpdate.images || privilegeAdd)}
                    
                    
                    
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
                            draftDeletedImages.set(imageId, false /* false: delete when reverted, noop when committed */);
                            
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
                        draftDeletedImages.set(imageId,
                            draftDeletedImages.has(imageId) // if has been created but not saved
                            ? null /* null: delete when committed, delete when reverted */
                            : true /* true: delete when committed, noop when reverted */
                        );
                        
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
                    enabled={privilegeUpdate.description || privilegeAdd}
                    
                    
                    
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
        </>}</ComplexEditModelDialog>
    );
};
export {
    EditProductDialog,
    EditProductDialog as default,
}
