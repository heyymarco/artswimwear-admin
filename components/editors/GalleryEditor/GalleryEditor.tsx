// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useId,
}                           from 'react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'           // writes css in react hook

// reusable-ui core:
import {
    // react helper hooks:
    useIsomorphicLayoutEffect,
    useEvent,
    useMergeEvents,
    useMountedFlag,
    useScheduleTriggerEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // react components:
    ContentProps,
    Content,
}                           from '@reusable-ui/components'

// internals:
import type {
    // types:
    EditorChangeEventHandler,
    
    
    
    // react components:
    EditorProps,
}                           from '@/components/editors/Editor'
import {
    // configs:
    galleryEditors,
}                           from './styles/config'
import {
    // react components:
    ActionsContainerProps,
    ActionsContainer,
}                           from './ActionsContainer'
import {
    // react components:
    ElementWithDraggable,
}                           from './ElementWithDraggable'
import {
    // react components:
    UploadImageProps,
    UploadImage,
}                           from './UploadImage'
import {
    // react components:
    UploadingImageProps,
    UploadingImage,
}                           from './UploadingImage'



// styles:
export const useGalleryEditorStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles/styles')
, { id: 'd3yn00z8kw' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



// utilities:
const resolveSrc = <TValue extends ImageData = ImageData>(imageData: TValue, onResolveUrl: ((imageData: TValue) => URL|string)|undefined): string => {
    if (!onResolveUrl) return (typeof(imageData) === 'string') ? imageData : imageData.url;
    const resolved = onResolveUrl(imageData);
    return (typeof(resolved) === 'string') ? resolved : resolved.href;
};
const resolveAlt = <TValue extends ImageData = ImageData>(imageData: TValue): string => {
    return ((typeof(imageData) === 'string') ? '' : imageData.title) || '';
};



// types:
export type DetailedImageData = {
    url    : string
    title ?: string
}
export type ImageData =
    |string
    |DetailedImageData

type UploadingImageData = {
    file        : File
    percentage  : number|null
    uploadError : string
    onRetry     : () => void
    onCancel    : () => void
}



// react components:
export interface GalleryEditorProps<TElement extends Element = HTMLElement, TValue extends ImageData = ImageData>
    extends
        // bases:
        Pick<EditorProps<TElement, TValue[]>,
            // values:
            |'defaultValue'
            |'value'
            |'onChange'
        >,
        Omit<ContentProps<TElement>,
            // values:
            |'defaultValue' // not supported
            |'value'        // not supported
            |'onChange'     // not supported
            
            // children:
            |'children'     // already taken over
        >,
        
        // sub components:
        Omit<ActionsContainerProps,
            // bases
            |keyof React.HTMLAttributes<HTMLElement>
            
            
            
            // positions:
            |'itemIndex'                  // already handled internally
            
            
            
            // actions:
            |'onActionDelete'             // enhanced with return Promise<boolean>
            
            
            // children:
            |'children'                   // already handled internally
        >,
        Omit<UploadImageProps,
            // upload activities:
            |'onUploadImageStart'         // enhanced with return Promise<TValue>
        >,
        Omit<UploadingImageProps,
            // positions:
            |'uploadingItemIndex'         // already handled internally
            
            
            
            // uploading activities:
            |'uploadingImageFile'         // already handled internally
            |'uploadingImagePercentage'   // already handled internally
            |'uploadingImageErrorMessage' // already handled internally
            |'onUploadingImageRetry'      // already handled internally
            |'onUploadingImageCancel'     // already handled internally
            
            
            
            // components:
            |'imageComponent'             // already handled internally
        >
{
    // actions:
    onActionDelete     ?: (imageData: TValue) => Promise<boolean>
    
    
    
    // upload activities:
    onUploadImageStart ?: (imageFile: File, reportProgress: (percentage: number) => void, abortSignal: AbortSignal) => Promise<TValue|null>
    
    
    
    // components:
    imageComponent     ?: React.ReactComponentElement<any, React.ImgHTMLAttributes<HTMLImageElement>>
    
    
    
    // handlers:
    onResolveUrl       ?: (imageData: TValue) => URL|string
}
const GalleryEditor = <TElement extends Element = HTMLElement, TValue extends ImageData = ImageData>(props: GalleryEditorProps<TElement, TValue>): JSX.Element|null => {
    // styles:
    const styleSheet = useGalleryEditorStyleSheet();
    
    
    
    // rest props:
    const {
        // values:
        defaultValue : defaultImages,
        value        : images,
        onChange,
        
        
        
        // actions:
        actionDelete,
        onActionDelete,
        
        
        
        // upload images:
        uploadImageTitle,
        uploadImageSelectImage,
        uploadImageDropImage,
        uploadImageType,
        
        
        
        // uploading images:
        uploadingImageTitle,
        uploadingImageErrorTitle,
        uploadingImageRetry,
        uploadingImageCancel,
        
        
        
        // upload/uploading activities:
        onUploadImageStart,
        onUploadingImageProgress,
        
        
        
        // components:
        imageComponent = (<img /> as React.ReactComponentElement<any, React.ImgHTMLAttributes<HTMLImageElement>>),
        
        deleteButtonComponent,
        
        uploadImageButtonComponent,
        
        uploadingImageProgressComponent,
        uploadingImageProgressBarComponent,
        uploadingImageRetryButtonComponent,
        uploadingImageCancelButtonComponent,
        
        
        
        // handlers:
        onResolveUrl,
    ...restContentProps} = props;
    
    
    
    // identifiers:
    const editorId     = useId().toLowerCase();
    const dragDataType = `application/${editorId}`;
    
    
    
    // states:
    const isControllableImages                    = (images !== undefined);
    let   [imagesDn, setImagesDn]                 = useState<TValue[]>(defaultImages ?? []);
    let   imagesFn : TValue[]                     = (images /*controllable*/ ?? imagesDn /*uncontrollable*/);
    
    const [draggedItemIndex, setDraggedItemIndex] = useState<number>(-1);
    let   [droppedItemIndex, setDroppedItemIndex] = useState<number>(-1);
    
    const [draftImages     , setDraftImages     ] = useState<TValue[]>([]);
    const [uploadingImages , setUploadingImages ] = useState<UploadingImageData[]>([]);
    
    useIsomorphicLayoutEffect(() => {
        // reset the preview:
        handleRevertPreview();
    }, [imagesFn]); // (re)update the draft images every time the *source of truth* images updated
    
    
    
    // events:
    const scheduleTriggerEvent = useScheduleTriggerEvent();
    
    
    
    // dom effects:
    const isMounted = useMountedFlag();
    
    
    
    // handlers:
    const handleChangeInternal = useEvent<EditorChangeEventHandler<TValue[]>>((images) => {
        // update state:
        if (!isControllableImages) {
            setImagesDn(imagesDn /* instant update without waiting for (slow|delayed) re-render */ = images);
            imagesFn =  imagesDn /*uncontrollable*/; // instant update the computed variable too, without waiting for (slow|delayed) re-render
        } // if
    });
    const handleChange         = useMergeEvents(
        // preserves the original `onChange` from `props`:
        onChange,
        
        
        
        // actions:
        handleChangeInternal,
    );
    const triggerChange        = useEvent((newDraftImages: TValue[]): void => {
        if (handleChange) scheduleTriggerEvent(() => { // runs the `onChange` event *next after* current macroTask completed
            // fire `onChange` react event:
            handleChange(newDraftImages);
        });
    });
    
    const handlePreviewMoved   = useEvent((newDroppedItemIndex: number): TValue[]|undefined => {
        if (draggedItemIndex === newDroppedItemIndex) { // no change => nothing to shift => return the (original) *source of truth* images
            // reset the preview:
            return handleRevertPreview();
        } // if
        
        
        
        // create a new local draftImages:
        const newDraftImages = imagesFn.slice(0); // clone (copy and then modify) the *source of truth* images
        
        
        
        // backup the fromItem's image before shifting (destructing the data):
        const fromItemImage = newDraftImages[draggedItemIndex];
        
        
        
        // shift the images:
        if (draggedItemIndex < newDroppedItemIndex) {
            // shift the images [draggedItemIndex ...up_to... beforeToItemIndex]:
            for (let shiftedItemIndex = draggedItemIndex; shiftedItemIndex < newDroppedItemIndex; shiftedItemIndex++) {
                newDraftImages[shiftedItemIndex] = newDraftImages[shiftedItemIndex + 1];
            } // for
        }
        else {
            // shift the images [draggedItemIndex ...down_to... afterToItemIndex]:
            for (let shiftedItemIndex = draggedItemIndex; shiftedItemIndex > newDroppedItemIndex; shiftedItemIndex--) {
                newDraftImages[shiftedItemIndex] = newDraftImages[shiftedItemIndex - 1];
            } // for
        } // if
        
        
        
        // and replace the target's image with origin's image:
        newDraftImages[newDroppedItemIndex] = fromItemImage;
        
        
        
        // update the preview:
        setDraftImages(newDraftImages);
        
        
        
        // update the dropped index:
        setDroppedItemIndex(droppedItemIndex /* instant update without waiting for (slow|delayed) re-render */ = newDroppedItemIndex);
        
        
        
        // return the modified:
        return newDraftImages;
    });
    const handleMoved          = useEvent((newDroppedItemIndex: number): void => {
        // update the preview:
        const newDraftImages = handlePreviewMoved(newDroppedItemIndex);
        if (!newDraftImages) return; // no change => ignore
        
        
        
        // notify the gallery's images changed:
        triggerChange(newDraftImages); // then at the *next re-render*, the *controllable* `images` will change and trigger the `handleRevertPreview` and the `droppedItemIndex` will be reset
    });
    const handleRevertPreview  = useEvent((): TValue[] => {
        // reset the preview:
        if (draftImages !== imagesFn) setDraftImages(imagesFn);
        
        
        
        // reset the dropped index:
        if (droppedItemIndex !== -1) setDroppedItemIndex(droppedItemIndex /* instant update without waiting for (slow|delayed) re-render */ = -1);
        
        
        
        // return the original:
        return imagesFn;
    });
    
    // draggable handlers:
    const handleDragStart      = setDraggedItemIndex;
    const handleDragEnd        = useEvent((itemIndex: number): void => {
        // actions:
        setDraggedItemIndex(-1); // clear selection
    });
    
    // droppable handlers:
    const handleDragEnter      = handlePreviewMoved;
    const handleDragLeave      = useEvent((itemIndex: number): void => {
        // conditions:
        if (droppedItemIndex !== itemIndex) return; // the last preview is already updated by another item => no need to revert
        
        
        
        // actions:
        handleRevertPreview();
    });
    const handleDrop           = handleMoved;
    
    // handlers:
    const actionsContainerHandleActionDelete = useEvent(async (itemIndex: number): Promise<void> => {
        // conditions:
        if (itemIndex >= imagesFn.length) return; // out of range => ignore
        const imageData = imagesFn[itemIndex];
        if (onActionDelete) {
            try {
                if (await onActionDelete(imageData) === false) return; // the delete action was prevented by <parent> => ignore
            }
            catch {
                return; // error => abort
            } // try
        } // if
        
        
        
        // remove an image from collection by its index:
        const newDraftImages = imagesFn.slice(0); // clone (copy and then modify) the *source of truth* images
        newDraftImages.splice(itemIndex, 1);
        
        
        
        // update the preview:
        if (droppedItemIndex !== -1) handlePreviewMoved(droppedItemIndex);
        
        
        
        // notify the gallery's images changed:
        triggerChange(newDraftImages); // then at the *next re-render*, the *controllable* `images` will change and trigger the `handleRevertPreview` and the `droppedItemIndex` will be reset
        
        
        
        // update:
        /*
            uncontrollable:
                The `imagesDn` and `imagesFn` has been updated and the `setImagesDn()` has been invoked when the `triggerChange()` called.
                Then the *next re-render* will happen shortly (maybe delayed).
            
            controllable:
                We need to ensure the *next re-render* will happen shortly (maybe delayed) by calling `setImagesDn(force to re-render)`, in case of calling `triggerChange()` won't cause <parent> to update the *controllable* `images` prop.
                When the *next re-render* occured, the `imagesFn` will reflect the *controllable* `images`'s value.
        */
        imagesFn = newDraftImages; // a temporary update regradless of (/*controllable*/ ?? /*uncontrollable*/), will be re-updated on *next re-render*
        if (isControllableImages) setImagesDn((current) => current.slice(0)); // force to re-render
    });
    const uploadImageHandleUploadImageStart  = useEvent((imageFile: File): void => {
        // conditions:
        if (!onUploadImageStart) return; // the upload image handler is not configured => ignore
        
        
        
        // add a new uploading status:
        const abortController    = new AbortController();
        const abortSignal        = abortController.signal;
        const isUploadCanceled   = (): boolean => {
            return (
                !isMounted.current
                ||
                abortSignal.aborted
            );
        };
        const handleUploadRetry  = (): void => {
            // conditions:
            if (isUploadCanceled()) return; // the uploader was canceled => ignore
            
            
            
            uploadingImageData.percentage  = null; // reset progress
            uploadingImageData.uploadError = '';   // reset error
            setUploadingImages((current) => current.slice(0)); // force to re-render
            performUpload();
        };
        const handleUploadCancel = (): void => {
            // conditions:
            if (isUploadCanceled()) return; // the uploader was canceled => ignore
            
            
            
            // abort the upload progress:
            abortController.abort();
            
            
            
            // remove the uploading status:
            performRemove();
        };
        const uploadingImageData : UploadingImageData = { file: imageFile, percentage: null, uploadError: '', onRetry: handleUploadRetry, onCancel: handleUploadCancel };
        setUploadingImages((current) => [...current, uploadingImageData]); // append a new uploading status
        
        
        
        // uploading progress:
        let imageData : TValue|null|undefined = undefined;
        const handleReportProgress = (percentage: number): void => {
            // conditions:
            if (isUploadCanceled()) return; // the uploader was canceled => ignore
            if (uploadingImageData.percentage === percentage)  return; // already the same => ignore
            
            
            
            // updates:
            uploadingImageData.percentage = percentage; // update the percentage
            setUploadingImages((current) => current.slice(0)); // force to re-render
        };
        const performRemove        = (): void => {
            // remove the uploading status:
            setUploadingImages((current) => {
                const foundIndex = current.findIndex((search) => (uploadingImageData === search));
                if (foundIndex < 0) return current;
                current.splice(foundIndex, 1); // remove the `uploadingImageData`
                return current.slice(0); // force to re-render
            });
        };
        const performUpload        = async (): Promise<void> => {
            try {
                imageData = await onUploadImageStart(imageFile, handleReportProgress, abortSignal);
                
                
                
                // conditions:
                if (isUploadCanceled()) return; // the uploader was canceled => ignore
            }
            catch (error: any) {
                // conditions:
                if (isUploadCanceled()) return; // the uploader was canceled => ignore
                
                
                
                uploadingImageData.uploadError = `${error?.message ?? error}` || 'Failed to upload image.';
                setUploadingImages((current) => current.slice(0)); // force to re-render
                return; // failed => no further actions
            } // try
            
            
            
            // remove the uploading status:
            performRemove();
            
            
            
            // successfully uploaded:
            if (imageData) {
                // append the new image into a new draft images:
                const newDraftImages = [
                    ...imagesFn, // clone (copy and then modify) the *source of truth* images
                    imageData,                    // the change
                ];
                
                
                
                // update the preview:
                if (droppedItemIndex !== -1) handlePreviewMoved(droppedItemIndex);
                
                
                
                // notify the gallery's images changed:
                triggerChange(newDraftImages); // then at the *next re-render*, the *controllable* `images` will change and trigger the `handleRevertPreview` and the `droppedItemIndex` will be reset
                
                
                
                // update:
                /*
                    uncontrollable:
                        The `imagesDn` and `imagesFn` has been updated and the `setImagesDn()` has been invoked when the `triggerChange()` called.
                        Then the *next re-render* will happen shortly (maybe delayed).
                    
                    controllable:
                        We have called the `performRemove()`, so it's guaranteed the *next re-render* will happen shortly (maybe delayed), even if the <parent> won't update the *controllable* `images` prop.
                        When the *next re-render* occured, the `imagesFn` will reflect the *controllable* `images`'s value.
                */
                imagesFn = newDraftImages; // a temporary update regradless of (/*controllable*/ ?? /*uncontrollable*/), will be re-updated on *next re-render*
            } // if
        };
        performUpload();
    });
    
    
    
    // jsx:
    return (
        <Content<TElement>
            // other props:
            {...restContentProps}
            
            
            
            // variants:
            nude={props.nude ?? true}
            
            
            
            // classes:
            mainClass={props.mainClass ?? styleSheet.main}
        >
            {draftImages.map((imageData, itemIndex) =>
                <ElementWithDraggable
                    // identifiers:
                    key={`img:${itemIndex}`}
                    
                    
                    
                    // positions:
                    itemIndex={itemIndex}
                    
                    
                    
                    // draggable:
                    dragDataType = {dragDataType   }
                    onDragStart  = {handleDragStart}
                    onDragEnd    = {handleDragEnd  }
                    
                    
                    
                    // droppable:
                    onDragEnter  = {handleDragEnter}
                    onDragLeave  = {handleDragLeave}
                    onDrop       = {handleDrop     }
                    
                    
                    
                    // components:
                    elementComponent={
                        <ActionsContainer
                            // positions:
                            itemIndex={itemIndex}
                            
                            
                            
                            // classes:
                            className={'image actionsContainer ' + ((): string|undefined => {
                                // dropped item:
                                if (itemIndex === droppedItemIndex) return 'dropped';
                                
                                
                                
                                // shifted item(s):
                                if ((draggedItemIndex !== -1) && (droppedItemIndex !== -1)) {
                                    if (draggedItemIndex < droppedItemIndex) {
                                        if ((itemIndex >= draggedItemIndex) && (itemIndex <= droppedItemIndex)) return 'shiftedDown';
                                    }
                                    else if (draggedItemIndex > droppedItemIndex) {
                                        if ((itemIndex <= draggedItemIndex) && (itemIndex >= droppedItemIndex)) return 'shiftedUp';
                                    } // if
                                } // if
                                
                                
                                
                                // dragged item:
                                if ((draggedItemIndex !== -1) && (itemIndex === draggedItemIndex)) return 'dragged';
                                
                                
                                
                                // dropping target:
                                if ((draggedItemIndex !== -1) && (itemIndex !== draggedItemIndex)) return 'dropTarget';
                                
                                
                                
                                // unmoved item(s):
                                return '';
                            })()}
                            
                            
                            
                            {...{
                                // actions:
                                actionDelete,
                                onActionDelete : actionsContainerHandleActionDelete,
                                
                                
                                
                                // components:
                                deleteButtonComponent,
                            }}
                        >
                            {React.cloneElement<React.ImgHTMLAttributes<HTMLImageElement>>(imageComponent,
                                // props:
                                {
                                    // classes:
                                    className : 'content',
                                    
                                    
                                    
                                    // images:
                                    alt       : imageComponent.props.alt   ??  resolveAlt(imageData),
                                    src       : imageComponent.props.src   ?? (resolveSrc(imageData, onResolveUrl) || undefined), // convert empty string to undefined
                                    sizes     : imageComponent.props.sizes ?? `calc((${galleryEditors.itemMinColumnWidth} * 2) + ${galleryEditors.gapInline})`,
                                },
                            )}
                        </ActionsContainer>
                    }
                />
            )}
            {uploadingImages.map(({file, percentage, uploadError, onRetry, onCancel}, uploadingItemIndex) =>
                <UploadingImage
                    // identifiers:
                    key={`upl:${uploadingItemIndex}`}
                    
                    
                    
                    // positions:
                    uploadingItemIndex={uploadingItemIndex}
                    
                    
                    
                    {...{
                        // uploading images:
                        uploadingImageTitle,
                        uploadingImageErrorTitle,
                        uploadingImageRetry,
                        uploadingImageCancel,
                        onUploadingImageProgress,
                        
                        
                        
                        // uploading activities:
                        uploadingImageFile         : file,
                        uploadingImagePercentage   : percentage,
                        uploadingImageErrorMessage : uploadError,
                        onUploadingImageRetry      : onRetry,
                        onUploadingImageCancel     : onCancel,
                        
                        
                        
                        // components:
                        imageComponent : React.cloneElement<React.ImgHTMLAttributes<HTMLImageElement>>(imageComponent,
                            // props:
                            {
                                // images:
                                alt   : imageComponent.props.alt   ?? 'preview',
                                sizes : imageComponent.props.sizes ?? `calc((${galleryEditors.itemMinColumnWidth} * 2) + ${galleryEditors.gapInline})`,
                            },
                        ),
                        uploadingImageProgressComponent,
                        uploadingImageProgressBarComponent,
                        uploadingImageRetryButtonComponent,
                        uploadingImageCancelButtonComponent,
                    }}
                />
            )}
            <UploadImage
                {...{
                    // upload images:
                    uploadImageTitle,
                    uploadImageSelectImage,
                    uploadImageDropImage,
                    uploadImageType,
                    
                    
                    
                    // upload activities:
                    onUploadImageStart : uploadImageHandleUploadImageStart,
                    
                    
                    
                    // components:
                    uploadImageButtonComponent,
                }}
            />
        </Content>
    );
};
export {
    GalleryEditor,
    GalleryEditor as default,
}
