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
    type UseGetModelAvailablePathApi,
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
    getNestedCategoryPaths,
    
    
    
    // react components:
    type CategoryStateProps,
    CategoryStateProvider,
    CategoryEditor,
}                           from '@/components/editors/CategoryEditor'
import {
    type UseGetModelPageApi,
    PaginationStateProvider,
}                           from '@/components/explorers/Pagination'
import {
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
    type MutationArgs,
    type PaginationArgs,
    
    type ModelConfirmUnsavedEventHandler,
    type ModelConfirmDeleteEventHandler,
    type ModelUpsertingEventHandler,
    type ModelDeletingEventHandler,
    
    type ProductVisibility,
    type CategoryDetail,
}                           from '@/models'

// stores:
import {
    // hooks:
    useUpdateCategory,
    useDeleteCategory,
    
    useCategoryAvailablePath as _useCategoryAvailablePath,
    
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

// others:
import {
    customAlphabet,
}                           from 'nanoid/async'

// configs:
import {
    PAGE_CATEGORY_TAB_INFORMATIONS,
    PAGE_CATEGORY_TAB_IMAGES,
    PAGE_CATEGORY_TAB_DESCRIPTION,
    PAGE_CATEGORY_TAB_SUBCATEGORIES,
    PAGE_CATEGORY_TAB_DELETE,
}                           from '@/website.config'



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
    
    
    
    // props:
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
    
    const [internalMockSubcategoryDb] = useState<CategoryDetail[]>(() => {
        if (!model) return [];
        return structuredClone(model.subcategories); // deep_clone the real_subcategories that has frozen by immer
    });
    const [internalMockCurrentPaths ] = useState<string[]|undefined>(() => {
        // conditions:
        if (!model) return undefined;
        
        
        
        // mocks:
        return getNestedCategoryPaths(model.subcategories);
    });
    
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
        
        
        
        // databases:
        mockCategoryDb,
        mockCurrentPaths,
        notifyMockModified,
    } = categoryState;
    
    if (process.env.NODE_ENV === 'development') {
        if (parentCategoryId === model?.id) {
            throw new Error('invalid parentCategoryId');
        } // if
        
        if (mockCategoryDb && !Object.isExtensible(mockCategoryDb)) {
            throw new Error('invalid mockCategoryDb');
        } // if
    } // if
    
    const isDbMocked = !!mockCategoryDb;
    const nestedMockCategoryDb = ((): CategoryDetail[] => {
        // conditions:
        const mockModel = (mockCategoryDb && model) ? mockCategoryDb.find(({ id: searchId }) => (searchId === model.id)) : undefined;
        /* the mockModel may be undefined for brief time after deleting the category */
        // if (process.env.NODE_ENV === 'development') {
        //     if (!mockModel && mockCategoryDb && model) {
        //         throw new Error('invalid mockCategoryDb');
        //     } // if
        // } // if
        if (!mockModel) return internalMockSubcategoryDb; // no mock_db provided on <ancestor> => use internal mock_subcategories
        
        
        
        // get the mock_subcategories of current mockModel:
        return mockModel.subcategories;
    })();
    const handleNotifyMockModified = useEvent((): void => {
        setIsModified(true);
    });
    const nestedCategoryState : CategoryStateProps = {
        ...categoryState,
        
        
        
        // data:
        parentCategoryId : model?.id ?? null, // creates the sub_categories of current_category_dialog
        
        
        
        // databases:
        mockCategoryDb     : nestedMockCategoryDb,
        mockCurrentPaths   : internalMockCurrentPaths,
        notifyMockModified : handleNotifyMockModified,
    };
    
    const _useGetMockedSubCategoryPage = useEvent((arg: PaginationArgs): UseGetModelPageApi<CategoryDetail> => {
        return {
            // data:
            data         : {
                total    : nestedMockCategoryDb?.length,
                entities : nestedMockCategoryDb?.slice(arg.page * arg.perPage, (arg.page + 1) * arg.perPage),
            },
            isLoading    : false,
            isFetching   : false,
            isError      : false,
            refetch      : () => {},
        };
    });
    const _useMockedCategoryAvailablePath = useEvent((): UseGetModelAvailablePathApi => {
        const [availablePath, { data, isLoading, isFetching, isError }, { lastArg }] = _useCategoryAvailablePath();
        
        return [
            (path: string) => ({
                unwrap : async (): Promise<boolean> => {
                    if (isDbMocked) {
                        const pathLowercase = path.toLowerCase();
                        
                        const categoryPaths = getNestedCategoryPaths(mockCategoryDb);
                        if (categoryPaths.some((searchPath) => (searchPath.toLowerCase() === pathLowercase))) return false;
                        
                        const currentPaths  = (mockCurrentPaths ?? internalMockCurrentPaths);
                        if (currentPaths?.some((searchPath) => (searchPath.toLowerCase() === pathLowercase))) return true;
                    } // if
                    
                    
                    
                    return availablePath(path).unwrap();
                },
            }),
            
            {
                // data:
                data,
                isLoading,
                isFetching,
                isError,
            },
            
            {
                lastArg,
            },
        ];
    });
    
    
    
    // refs:
    const firstEditorRef = useRef<HTMLInputElement|null>(null);
    
    
    
    // handlers:
    const handleModelUpserting       = useEvent<ModelUpsertingEventHandler<CategoryDetail>>(async ({ id, options: { addPermission, updatePermissions } }) => {
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
        
        
        
        id ??= isDbMocked ? (await (async () => {
            const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 10);
            return ` ${await nanoid()}`; // starts with space{random-temporary-id}
        })()) : '';
        
        const mutatedData : MutationArgs<CategoryDetail> = {
            id             : id,
            
            visibility     : (updatePermissions.visibility  || addPermission) ? visibility                                        : undefined,
            name           : (updatePermissions.description || addPermission) ? name                                              : undefined,
            path           : (updatePermissions.description || addPermission) ? path                                              : undefined,
            images         : (updatePermissions.images      || addPermission) ? updatedImages                                     : undefined,
            description    : (updatePermissions.description || addPermission) ? ((description?.toJSON?.() ?? description) as any) : undefined,
        };
        
        
        
        if (isDbMocked) {
            const recordIndex = mockCategoryDb.findIndex(({id: searchId}) => (searchId === id));
            if (recordIndex >= 0) {
                const currentRecord : CategoryDetail = mockCategoryDb[recordIndex];
                const updatedRecord : CategoryDetail = {
                    ...currentRecord, // the original data
                    ...mutatedData,   // the mutated data
                };
                mockCategoryDb[recordIndex] = updatedRecord;
                return updatedRecord;
            } // if
            
            
            
            const newRecord : CategoryDetail = {
                excerpt       : null,
                subcategories : [], // a new record doesn't have subcategories => assign an empty array
                ...mutatedData as Pick<CategoryDetail, 'id'|'visibility'|'name'|'path'|'images'|'description'>, // the mutated data
            };
            mockCategoryDb.unshift(newRecord);
            notifyMockModified?.();
            return newRecord;
        }
        else {
            try {
                return await updateCategory({
                    parent         : parentCategoryId,
                    
                    ...mutatedData, // the mutated data
                    subcategories  : nestedMockCategoryDb, // the mutated data on deep_nested subcategories
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
        } // if
    });
    
    const handleModelDeleting        = useEvent<ModelDeletingEventHandler<CategoryDetail>>(async ({ draft: { id } }) => {
        if (isDbMocked) {
            const recordIndex = mockCategoryDb.findIndex(({id: searchId}) => (searchId === id));
            if (recordIndex < 0) return;
            mockCategoryDb.splice(recordIndex, 1);
            notifyMockModified?.();
        }
        else {
            await deleteCategory({
                parent         : parentCategoryId,
                
                id             : id,
            }).unwrap();
        } // if
    });
    
    const handleSideModelCommitting  = useEvent(async (): Promise<void> => {
        await handleSideModelSave(/*commitImages = */true);
    });
    const handleSideModelDiscarding  = useEvent(async (): Promise<void> => {
        await handleSideModelSave(/*commitImages = */false);
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
    
    const handleModelConfirmDelete   = useEvent<ModelConfirmDeleteEventHandler<CategoryDetail>>(({ draft }) => {
        return {
            title   : <h1>Delete Confirmation</h1>,
            message : <>
                <p>
                    Are you sure to delete category <strong>{draft.name}</strong>?
                </p>
            </>,
        };
    });
    const handleModelConfirmUnsaved  = useEvent<ModelConfirmUnsavedEventHandler<CategoryDetail>>(() => {
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
            onModelUpserting={handleModelUpserting}
            // onModelUpsert={handleModelUpsert}
            
            onModelDeleting={handleModelDeleting}
            // onModelDelete={undefined}
            
            onSideModelCommitting={handleSideModelCommitting}
            onSideModelDiscarding={handleSideModelDiscarding}
            
            onModelConfirmDelete={handleModelConfirmDelete}
            onModelConfirmUnsaved={handleModelConfirmUnsaved}
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
                        useModelAvailablePath={_useMockedCategoryAvailablePath}
                        
                        
                        
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
                    useGetModelPage={_useGetMockedSubCategoryPage}
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
