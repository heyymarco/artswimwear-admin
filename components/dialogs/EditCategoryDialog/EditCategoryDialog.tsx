'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useState,
}                           from 'react'

// styles:
import {
    useEditCategoryDialogStyleSheet,
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
    type CategoryStateProps,
    CategoryStateProvider,
    CategoryEditor,
}                           from '@/components/editors/CategoryEditor'
import {
    PaginationStateProvider,
}                           from '@/components/explorers/Pagination'
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
    CategoryPreview,
}                           from '@/components/views/CategoryPreview'

// models:
import {
    // types:
    type PaginationArgs,
    
    type ProductVisibility,
    type CategoryDetail,
}                           from '@/models'

// stores:
import {
    // hooks:
    useUpdateCategory,
    useDeleteCategory,
    
    useCategoryAvailablePath,
    
    useGetCategoryPage as _useGetCategoryPage,
    
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
    PAGE_CATEGORY_TAB_INFORMATIONS,
    PAGE_CATEGORY_TAB_IMAGES,
    PAGE_CATEGORY_TAB_DESCRIPTION,
    PAGE_CATEGORY_TAB_SUBCATEGORIES,
    PAGE_CATEGORY_TAB_DELETE,
}                           from '@/website.config'



// hooks:
const useUseGetSubCategoryPage = (parentCategoryId : string|null) => {
    return (arg: PaginationArgs) => {
        return _useGetCategoryPage({
            ...arg,
            parent : parentCategoryId,
        });
    };
};



// react components:
export interface EditCategoryDialogProps
    extends
        // bases:
        Omit<ImplementedComplexEditModelDialogProps<CategoryDetail>,
            // values:
            |'value'
            |'onChange'
        >
{
    categoryState : CategoryStateProps
}
const EditCategoryDialog = (props: EditCategoryDialogProps): JSX.Element|null => {
    // styles:
    const styleSheet = useEditCategoryDialogStyleSheet();
    
    
    
    // stores:
    const draftDifferentialImages = useDraftDifferentialImages();
    
    
    
    // rest props:
    const {
        // data:
        model = null,
        
        
        
        // states:
        categoryState,
        defaultExpandedTabIndex = 0,
        
        
        
        // other props:
        ...restEditCategoryDialogProps
    } = props;
    
    
    
    // states:
    const {
        // privileges:
        privilegeAdd,
        privilegeUpdate,
        privilegeDelete,
        
        
        
        // images:
        registerAddedImage   = draftDifferentialImages.registerAddedImage,
        registerDeletedImage = draftDifferentialImages.registerDeletedImage,
        
        
        
        // data:
        parentCategoryId     = null,
        
        
        
        // values:
        value,
        onChange,
    } = categoryState;
    
    const nestedCategoryState : CategoryStateProps = {
        ...categoryState,
        
        
        
        // data:
        parentCategoryId : model?.id ?? null, // creates the sub_categories of current_category_dialog
    };
    
    
    
    if (process.env.NODE_ENV === 'development') {
        if (parentCategoryId === model?.id) {
            throw new Error('invalid logic');
        } // if
    } // if
    
    
    
    // states:
    const [isModified      , setIsModified    ] = useState<boolean>(false);
    const [isPathModified  , setIsPathModified] = useState<boolean>(false);
    
    const [visibility      , setVisibility    ] = useState<ProductVisibility      >(model?.visibility     ?? 'DRAFT');
    const [name            , setName          ] = useState<string                 >(model?.name           ?? ''     );
    const [path            , setPath          ] = useState<string                 >(model?.path           ?? ''     );
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
    
    
    
    // stores:
    const [updateCategory   , {isLoading : isLoadingUpdate           }] = useUpdateCategory();
    const [deleteCategory   , {isLoading : isLoadingDelete           }] = useDeleteCategory();
    const [postImage                                                  ] = usePostImage();
    const [commitDeleteImage, {isLoading : isLoadingCommitDeleteImage}] = useDeleteImage();
    const [revertDeleteImage, {isLoading : isLoadingRevertDeleteImage}] = useDeleteImage();
    const [commitMoveImage  , {isLoading : isLoadingCommitMoveImage  }] = useMoveImage();
    
    const _useGetSubCategoryPage = useUseGetSubCategoryPage(model?.id ?? null); // views the sub_categories of current_category_dialog
    
    
    
    // refs:
    const firstEditorRef = useRef<HTMLInputElement|null>(null);
    
    
    
    // handlers:
    const handleUpdate               = useEvent<UpdateHandler<CategoryDetail>>(async ({id, whenAdd, whenUpdate}) => {
        const immigratedImages : string[] = [];
        let updatedImages = images;
        if (updatedImages.length) {
            try {
                const movedResponse = await commitMoveImage({
                    imageId : updatedImages,
                    // folder  : 'testing/helloh',
                    folder  : `categories/${name || '__unnamed__'}`,
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
            return await updateCategory({
                parent         : parentCategoryId,
                
                id             : id ?? '',
                
                visibility     : (whenUpdate.visibility  || whenAdd) ? visibility                                        : undefined,
                name           : (whenUpdate.description || whenAdd) ? name                                              : undefined,
                path           : (whenUpdate.description || whenAdd) ? path                                              : undefined,
                images         : (whenUpdate.images      || whenAdd) ? updatedImages                                     : undefined,
                description    : (whenUpdate.description || whenAdd) ? ((description?.toJSON?.() ?? description) as any) : undefined,
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
    
    const handleDelete               = useEvent<DeleteHandler<CategoryDetail>>(async ({id}) => {
        await deleteCategory({
            parent         : parentCategoryId,
            
            id             : id,
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
    
    const handleConfirmDelete        = useEvent<ConfirmDeleteHandler<CategoryDetail>>(({model}) => {
        return {
            title   : <h1>Delete Confirmation</h1>,
            message : <>
                <p>
                    Are you sure to delete category <strong>{model.name}</strong>?
                </p>
            </>,
        };
    });
    const handleConfirmUnsaved       = useEvent<ConfirmUnsavedHandler<CategoryDetail>>(() => {
        return {
            title   : <h1>Unsaved Data</h1>,
            message : <p>
                Do you want to save the changes?
            </p>,
        };
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
    } = restEditCategoryDialogProps;
    
    
    
    // jsx:
    return (
        <ComplexEditModelDialog<CategoryDetail>
            // other props:
            {...restComplexEditModelDialogProps}
            
            
            
            // data:
            modelName='Category'
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
            tabDelete={PAGE_CATEGORY_TAB_DELETE}
            
            
            
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
        >{({whenAdd, whenUpdate}) => <>
            <TabPanel label={PAGE_CATEGORY_TAB_INFORMATIONS}  panelComponent={<Generic className={styleSheet.infoTab} />}>
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
                        useModelAvailablePath={useCategoryAvailablePath}
                        
                        
                        
                        // classes:
                        className='path editor'
                        
                        
                        
                        // appearances:
                        modelSlug='/categories/'
                        
                        
                        
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
            <TabPanel label={PAGE_CATEGORY_TAB_IMAGES}        panelComponent={<Generic className={styleSheet.imagesTab} />}>
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
                                folder           : `categories/${name || '__unnamed__'}`,
                                onUploadProgress : reportProgress,
                                abortSignal      : abortSignal,
                            }).unwrap();
                            
                            // register to actual_delete the new_image when reverted:
                            registerAddedImage(imageId);
                            
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
                        registerDeletedImage(imageId);
                        
                        return true;
                    }}
                    onResolveImageUrl={resolveMediaUrl<never>}
                />
            </TabPanel>
            <TabPanel label={PAGE_CATEGORY_TAB_DESCRIPTION}   panelComponent={<Generic className={styleSheet.descriptionTab} />}>
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
                        placeholder='Type category description here...'
                    />
                </WysiwygEditor>
            </TabPanel>
            <TabPanel label={PAGE_CATEGORY_TAB_SUBCATEGORIES} panelComponent={<Generic className={styleSheet.categoriesTab} />}>
                <PaginationStateProvider<CategoryDetail>
                    // states:
                    initialPerPage={10}
                    
                    
                    
                    // data:
                    useGetModelPage={_useGetSubCategoryPage}
                >
                    <CategoryStateProvider
                        {...nestedCategoryState}
                    >
                        <CategoryEditor
                            // appearances:
                            showPaginationTop={false}
                            autoHidePagination={true}
                            
                            
                            
                            // values:
                            value={value}
                            onChange={onChange}
                            
                            
                            
                            // privileges:
                            privilegeAdd    = {                                              privilegeAdd   }
                            /*
                                when edit_mode (update):
                                    * the editing  capability follows the `privilegeUpdate`
                                    * the deleting capability follows the `privilegeDelete`
                                
                                when create_mode (add):
                                    * ALWAYS be ABLE to edit   the Category (because the data is *not_yet_exsist* on the database)
                                    * ALWAYS be ABLE to delete the Category (because the data is *not_yet_exsist* on the database)
                            */
                            privilegeUpdate = {whenAdd ? privilegeCategoryUpdateFullAccess : privilegeUpdate}
                            privilegeDelete = {whenAdd ?               true                : privilegeDelete}
                            
                            
                            
                            // images:
                            registerAddedImage   = {registerAddedImage  }
                            registerDeletedImage = {registerDeletedImage}
                            
                            
                            
                            // components:
                            modelPreviewComponent={
                                <CategoryPreview
                                    // data:
                                    model={undefined as any}
                                />
                            }
                            modelCreateComponent={
                                privilegeAdd
                                ?
                                <EditCategoryDialog
                                    // data:
                                    model={null} // create a new model
                                    
                                    
                                    
                                    // workaround for penetrating <CategoryStateProvider> to showDialog():
                                    // states:
                                    categoryState={{
                                        ...nestedCategoryState,
                                        
                                        
                                        
                                        // privileges:
                                        /*
                                            when create_mode (add):
                                            * ALWAYS be ABLE to edit   the Category (because the data is *not_yet_exsist* on the database)
                                            * ALWAYS be ABLE to delete the Category (because the data is *not_yet_exsist* on the database)
                                        */
                                        privilegeAdd    : privilegeAdd,
                                        privilegeUpdate : privilegeCategoryUpdateFullAccess,
                                        privilegeDelete : true,
                                    }}
                                />
                                : undefined
                            }
                        />
                    </CategoryStateProvider>
                </PaginationStateProvider>
            </TabPanel>
        </>}</ComplexEditModelDialog>
    );
};
export {
    EditCategoryDialog,
    EditCategoryDialog as default,
}
