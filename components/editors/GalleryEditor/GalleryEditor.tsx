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
import {
    // react components:
    Image,
}                           from '@heymarco/image'

// internals:
import type {
    // types:
    EditorChangeEventHandler,
    
    
    
    // react components:
    EditorProps,
}                           from '@/components/editors/Editor'
import {
    // configs:
    gedits,
}                           from './styles/config'
import {
    // react components:
    DraggableImage,
}                           from './DraggableImage'
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
interface GalleryEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Pick<EditorProps<TElement, ImageData[]>,
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
        Omit<UploadImageProps,
            // upload activities:
            |'onUploadImageStart'         // enhanced with return Promise<ImageData>
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
    // upload activities:
    onUploadImageStart ?: (imageFile: File, reportProgress: (percentage: number) => void, abortSignal: AbortSignal) => Promise<ImageData|null>
    
    
    
    // components:
    imageComponent     ?: React.ReactComponentElement<any, React.ImgHTMLAttributes<HTMLImageElement>>
}
const GalleryEditor = <TElement extends Element = HTMLElement>(props: GalleryEditorProps<TElement>): JSX.Element|null => {
    // styles:
    const styleSheet = useGalleryEditorStyleSheet();
    
    
    
    // rest props:
    const {
        // values:
        defaultValue : defaultImages,
        value        : images,
        onChange,
        
        
        
        // upload images:
        uploadImageTitle,
        uploadImageSelectImage,
        uploadImageDropImage,
        uploadImageType,
        
        
        
        // upload activities:
        onUploadImageStart,
        
        
        
        // uploading images:
        uploadingImageTitle,
        uploadingImageErrorTitle,
        uploadingImageRetry,
        uploadingImageCancel,
        onUploadingImageProgress,
        
        
        
        // components:
        imageComponent = (<img /> as React.ReactComponentElement<any, React.ImgHTMLAttributes<HTMLImageElement>>),
        
        uploadImageButtonComponent,
        
        uploadingImageProgressComponent,
        uploadingImageProgressBarComponent,
        uploadingImageRetryButtonComponent,
        uploadingImageCancelButtonComponent,
    ...restContentProps} = props;
    
    
    
    // identifiers:
    const editorId     = useId().toLowerCase();
    const dragDataType = `application/${editorId}`;
    
    
    
    // states:
    const isControllableImages                    = (images !== undefined);
    const [imagesDn, setImagesDn]                 = useState<ImageData[]>(defaultImages ?? []);
    const imagesFn : ImageData[]                  = (images /*controllable*/ ?? imagesDn /*uncontrollable*/);
    
    const [draggedItemIndex, setDraggedItemIndex] = useState<number>(-1);
    let   [droppedItemIndex, setDroppedItemIndex] = useState<number>(-1);
    
    const [draftImages    , setDraftImages    ]   = useState<ImageData[]>([]);
    const [uploadingImages, setUploadingImages]   = useState<UploadingImageData[]>([]);
    
    useIsomorphicLayoutEffect(() => {
        // reset the preview:
        handleRevertPreview();
    }, [imagesFn]); // (re)update the draft images every time the *source of truth* images updated
    
    
    
    // events:
    const scheduleTriggerEvent = useScheduleTriggerEvent();
    
    
    
    // dom effects:
    const isMounted = useMountedFlag();
    
    
    
    // handlers:
    const handleChangeInternal = useEvent<EditorChangeEventHandler<ImageData[]>>((images) => {
        // update state:
        if (!isControllableImages) setImagesDn(images);
    });
    const handleChange         = useMergeEvents(
        // preserves the original `onChange` from `props`:
        onChange,
        
        
        
        // actions:
        handleChangeInternal,
    );
    const triggerChange        = useEvent((newDraftImages: ImageData[]): void => {
        if (handleChange) scheduleTriggerEvent(() => { // runs the `onChange` event *next after* current macroTask completed
            // fire `onChange` react event:
            handleChange(newDraftImages);
        });
    });
    
    const handlePreviewMoved   = useEvent((newDroppedItemIndex: number, currentImages?: ImageData[]): ImageData[]|undefined => {
        if (draggedItemIndex === newDroppedItemIndex) { // no change => nothing to shift => return the (original) *source of truth* images
            // reset the preview:
            return handleRevertPreview();
        } // if
        
        
        
        // create a new local draftImages:
        const newDraftImages = (currentImages ?? imagesFn).slice(0); // clone (copy and then modify) the *source of truth* images
        
        
        
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
        setDroppedItemIndex(droppedItemIndex /* instant update without waiting for re-render */ = newDroppedItemIndex);
        
        
        
        // return the modified:
        return newDraftImages;
    });
    const handleMoved          = useEvent((newDroppedItemIndex: number): void => {
        // update the preview:
        const newDraftImages = handlePreviewMoved(newDroppedItemIndex);
        if (!newDraftImages) return; // no change => ignore
        
        
        
        // notify the gallery's images changed:
        triggerChange(newDraftImages); // then the *controllable* `images` will change and trigger the `handleRevertPreview` and the `droppedItemIndex` will be reset
    });
    const handleRevertPreview  = useEvent((): ImageData[] => {
        // reset the preview:
        if (draftImages !== imagesFn) setDraftImages(imagesFn);
        
        
        
        // reset the dropped index:
        if (droppedItemIndex !== -1) setDroppedItemIndex(droppedItemIndex /* instant update without waiting for re-render */ = -1);
        
        
        
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
    const uploadImageHandleUploadImageStart = useEvent((imageFile: File): void => {
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
        let imageData : ImageData|null|undefined = undefined;
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
                    imageData,   // the modification
                ];
                
                
                
                // refresh the preview moved:
                if (droppedItemIndex !== -1) handlePreviewMoved(droppedItemIndex);
                
                
                
                // notify the gallery's images changed:
                triggerChange(newDraftImages);
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
                <DraggableImage
                    // identifiers:
                    key={`img:${itemIndex}`}
                    
                    
                    
                    // positions:
                    itemIndex={itemIndex}
                    
                    
                    
                    // components:
                    imageComponent={React.cloneElement<React.ImgHTMLAttributes<HTMLImageElement>>(imageComponent,
                        // props:
                        {
                            // images:
                            alt   : imageComponent.props.alt   ?? (((typeof(imageData) === 'string') ? '' : imageData.title) || ''),
                            src   : imageComponent.props.src   ?? (((typeof(imageData) === 'string') ? imageData : imageData.url) || undefined), // convert empty string to undefined
                            sizes : imageComponent.props.sizes ?? `calc((${gedits.itemMinColumnWidth} * 2) + ${gedits.gapInline})`,
                        },
                    )}
                    
                    
                    
                    // classes:
                    className={'image ' + ((): string|undefined => {
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
                    
                    
                    
                    // draggable:
                    dragDataType = {dragDataType   }
                    onDragStart  = {handleDragStart}
                    onDragEnd    = {handleDragEnd  }
                    
                    
                    
                    // droppable:
                    onDragEnter  = {handleDragEnter}
                    onDragLeave  = {handleDragLeave}
                    onDrop       = {handleDrop     }
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
                                sizes : imageComponent.props.sizes ?? `calc((${gedits.itemMinColumnWidth} * 2) + ${gedits.gapInline})`,
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
