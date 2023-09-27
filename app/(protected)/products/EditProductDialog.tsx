'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useState,
    useEffect,
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
    useMountedFlag,
    
    
    
    // an accessibility management system:
    AccessibilityProvider,
    
    
    
    // a validation management system:
    ValidationProvider,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    Generic,
    
    
    
    // base-content-components:
    Content,
    
    
    
    // simple-components:
    ButtonIcon,
    CloseButton,
    
    
    
    // layout-components:
    List,
    CardHeader,
    CardFooter,
    
    
    
    // composite-components:
    TabPanel,
    Tab,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    Image,
}                           from '@heymarco/image'

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
    
    usePostImage,
    useDeleteImage,
}                           from '@/store/features/api/apiSlice'

// internals:
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'

// configs:
import {
    STORE_WEBSITE_URL,
    
    PAGE_PRODUCT_TAB_INFORMATIONS,
    PAGE_PRODUCT_TAB_IMAGES,
    PAGE_PRODUCT_TAB_DESCRIPTION,
    PAGE_PRODUCT_TAB_DELETE,
}                           from '@/website.config'



// styles:
const useEditProductDialogStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./EditProductDialogStyles')
, { id: 'pkeb1tledn' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



// utilities:
const emptyProduct : ProductDetail = {
    id             : '',
    
    visibility     : 'DRAFT',
    
    name           : '',
    
    price          : 0,
    shippingWeight : null,
    
    stock          : null,
    
    path           : '',
    
    excerpt        : null,
    description    : null,
    
    images         : [],
};



// react components:
export interface EditProductDialogProps {
    // data:
    product                 ?: ProductDetail
    defaultExpandedTabIndex ?: number
    
    
    
    // handlers:
    onClose                  : () => void
}
export const EditProductDialog = (props: EditProductDialogProps): JSX.Element|null => {
    // styles:
    const styleSheet = useEditProductDialogStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        product = emptyProduct,
        defaultExpandedTabIndex,
        
        
        
        // handlers:
        onClose,
    } = props;
    
    
    
    // states:
    const [isPathModified  , setIsPathModified  ] = useState<boolean>(false);
    const [isModified      , setIsModified      ] = useState<boolean>(false);
    
    const [enableValidation, setEnableValidation] = useState<boolean>(false);
    const [visibility      , setVisibility      ] = useState<ProductVisibility>(product.visibility as ProductVisibility);
    const [name            , setName            ] = useState<string>(product.name);
    const [path            , setPath            ] = useState<string>(product.path);
    const [price           , setPrice           ] = useState<number>(product.price);
    const [shippingWeight  , setShippingWeight  ] = useState<number|null>(product.shippingWeight ?? null);
    const [stock           , setStock           ] = useState<number|null>(product.stock          ?? null);
    const [images          , setImages          ] = useState<string[]>(product.images);
    const [description     , setDescription     ] = useState<WysiwygEditorState|null>(() => {
        const description = product.description;
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
    const [updateProduct    , {isLoading : isLoadingModelUpdate      }] = useUpdateProduct();
    const [deleteProduct    , {isLoading : isLoadingModelDelete      }] = useDeleteProduct();
    const [postImage                                                  ] = usePostImage();
    const [commitDeleteImage, {isLoading : isLoadingCommitDeleteImage}] = useDeleteImage();
    const [revertDeleteImage, {isLoading : isLoadingRevertDeleteImage}] = useDeleteImage();
    const isCommiting = isLoadingModelUpdate || isLoadingCommitDeleteImage;
    const isReverting = isLoadingRevertDeleteImage;
    const isLoading   = isCommiting || isReverting || isLoadingModelDelete;
    
    
    
    // refs:
    const firstEditorRef = useRef<HTMLInputElement|null>(null); // TODO: finish this
    const editorFormRef  = useRef<HTMLFormElement|null>(null);
    
    
    
    // dom effects:
    const isMounted = useMountedFlag();
    
    
    
    // dialogs:
    const {
        showMessage,
        showMessageFieldError,
        showMessageFetchError,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handleNameChange = useEvent((name: string) => {
        // conditions:
        if (isPathModified) return; // path is already modified by user, do not perform *auto* modify
        
        
        
        // sync path:
        setPath(
            name.trim().toLowerCase().replace(/(\s|_|-)+/ig, '-')
        );
    });
    const handleSave = useEvent(async () => {
        setEnableValidation(true);
        await new Promise<void>((resolve) => { // wait for a validation state applied
            setTimeout(() => {
                setTimeout(() => {
                    resolve();
                }, 0);
            }, 0);
        });
        const fieldErrors = editorFormRef?.current?.querySelectorAll?.(':is(.invalidating, .invalidated)');
        if (fieldErrors?.length) { // there is an/some invalid field
            showMessageFieldError(fieldErrors);
            return;
        } // if
        
        
        
        try {
            const updatingProductTask = updateProduct({
                id             : product.id,
                
                visibility,
                name,
                path,
                price          : price,
                shippingWeight : shippingWeight,
                stock          : stock,
                images,
                description    : (description?.toJSON?.() ?? description) as any,
            }).unwrap();
            
            await handleClose(/*commitImages = */true, [updatingProductTask]);
        }
        catch (error: any) {
            showMessageFetchError(error);
        } // try
    });
    const handleDelete = useEvent(async () => {
        // conditions:
        if (
            (await showMessage<'yes'|'no'>({
                theme    : 'warning',
                title    : <h1>Delete Confirmation</h1>,
                message  : <>
                    <p>
                        Are you sure to delete product <strong>{product.name}</strong>?
                    </p>
                    <p>
                        The associated product in existing orders will be marked as <strong>DELETED PRODUCT</strong>.
                    </p>
                </>,
                options  : {
                    yes  : <ButtonIcon icon='check'          theme='primary'>Yes</ButtonIcon>,
                    no   : <ButtonIcon icon='not_interested' theme='secondary' autoFocus={true}>No</ButtonIcon>,
                },
            }))
            !==
            'yes'
        ) return false;
        if (!isMounted.current) return false; // the component was unloaded before awaiting returned => do nothing
        
        
        
        // actions:
        try {
            await deleteProduct({
                id : product.id,
            }).unwrap();
            
            await handleClose(/*commitImages = */false);
        }
        catch (error: any) {
            showMessageFetchError(error);
        } // try
    });
    const handleClosing = useEvent(async () => {
        if (isModified || isPathModified) {
            // conditions:
            const answer = await showMessage<'save'|'dontSave'|'continue'>({
                theme         : 'warning',
                title         : <h1>Unsaved Data</h1>,
                message       : <p>
                    Do you want to save the changes?
                </p>,
                options       : {
                    save      : <ButtonIcon icon='save'   theme='success' autoFocus={true}>Save</ButtonIcon>,
                    dontSave  : <ButtonIcon icon='cancel' theme='danger' >Don&apos;t Save</ButtonIcon>,
                    continue  : <ButtonIcon icon='edit'   theme='secondary'>Continue Editing</ButtonIcon>,
                },
                backdropStyle : 'static',
            });
            if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
            
            
            
            // actions:
            switch (answer) {
                case 'save':
                    // then do a save (it will automatically close the editor after successfully saving):
                    handleSave();
                    break;
                case 'dontSave':
                    // then close the editor (without saving):
                    await handleClose(/*commitImages = */false);
                    break;
                default:
                    // do nothing (continue editing)
                    break;
            } // switch
        }
        else {
            await handleClose(/*commitImages = */false);
        } // if
    });
    const handleSaveImages = useEvent(async (commitImages : boolean) => {
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
    const handleClose = useEvent(async (commitImages : boolean, otherTasks : Promise<any>[] = []) => {
        await Promise.all([
            handleSaveImages(commitImages),
            ...otherTasks,
        ]);
        onClose();
    });
    const handleKeyDown : React.KeyboardEventHandler<HTMLElement> = useEvent((event) => {
        switch (event.key) {
            // case 'Enter':
            //     event.preventDefault();
            //     handleSave();
            //     break;
            
            case 'Escape':
                event.preventDefault();
                // handleClosing();
                break;
        } // switch
    });
    
    
    
    // dom effects:
    useEffect(() => {
        // setups:
        const cancelFocus = setTimeout(() => {
            // conditions:
            const firstEditorElm = firstEditorRef.current;
            if (!firstEditorElm) return;
            
            
            
            firstEditorElm.setSelectionRange(0, -1);
            firstEditorElm.focus({ preventScroll: true });
        }, 100);
        
        
        
        // cleanups:
        return () => {
            clearTimeout(cancelFocus);
        };
    }, []);
    
    
    
    // jsx:
    return (
        <AccessibilityProvider enabled={!isLoading}>
            <CardHeader
                // handlers:
                onKeyDown={handleKeyDown}
            >
                <h1>{name || ((product === emptyProduct) ? 'Create New Product' : 'Edit Product')}</h1>
                <CloseButton onClick={handleClosing} />
            </CardHeader>
            <ValidationProvider enableValidation={enableValidation} inheritValidation={false}>
                <Tab
                    // variants:
                    mild='inherit'
                    
                    
                    
                    // classes:
                    className={styleSheet.cardBody}
                    
                    
                    
                    // values:
                    defaultExpandedTabIndex={defaultExpandedTabIndex}
                    
                    
                    
                    // components:
                    listComponent={<List className={styleSheet.tabList} />}
                    bodyComponent={<Content className={styleSheet.tabBody} />}
                    
                    
                    
                    // handlers:
                    onKeyDown={handleKeyDown}
                >
                    <TabPanel label={PAGE_PRODUCT_TAB_INFORMATIONS} panelComponent={<Generic className={styleSheet.infoTab} />}>
                        <form ref={editorFormRef}>
                            <span className='name label'>Name:</span>
                            <NameEditor
                                // refs:
                                elmRef={((defaultExpandedTabIndex ?? 0) === 0) ? firstEditorRef : undefined}
                                
                                
                                
                                // classes:
                                className='name editor'
                                
                                
                                
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
                                
                                
                                
                                // values:
                                currentValue={product.path}
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
                                
                                
                                
                                // values:
                                value={visibility}
                                onChange={(value) => {
                                    setVisibility(value);
                                    setIsModified(true);
                                }}
                            />
                        </form>
                    </TabPanel>
                    <TabPanel label={PAGE_PRODUCT_TAB_IMAGES}       panelComponent={<Generic className={styleSheet.imagesTab} />}>
                        <GalleryEditor<HTMLElement, string>
                            // variants:
                            nude={true}
                            
                            
                            
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
                                        folder           : '@@user',
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
                            elmRef={((defaultExpandedTabIndex ?? 0) === 2) ? firstEditorRef : undefined}
                            
                            
                            
                            // classes:
                            className={styleSheet.editDescription}
                            
                            
                            
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
                    {!!role?.product_d && <TabPanel label={PAGE_PRODUCT_TAB_DELETE} panelComponent={<Content theme='warning' className={styleSheet.deleteTab} />}>
                        <ButtonIcon icon={isLoadingModelDelete ? 'busy' : 'delete'} theme='danger' onClick={handleDelete}>
                            Delete Product <strong>{product.name}</strong>
                        </ButtonIcon>
                    </TabPanel>}
                </Tab>
            </ValidationProvider>
            <CardFooter onKeyDown={handleKeyDown}>
                <ButtonIcon className='btnSave'   icon={isCommiting ? 'busy' : 'save'  } theme='success' onClick={handleSave}>Save</ButtonIcon>
                <ButtonIcon className='btnCancel' icon={isReverting ? 'busy' : 'cancel'} theme='danger'  onClick={handleClosing}>{isReverting ? 'Reverting' : 'Cancel'}</ButtonIcon>
            </CardFooter>
        </AccessibilityProvider>
    );
}
