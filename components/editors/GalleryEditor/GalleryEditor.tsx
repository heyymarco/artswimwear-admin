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
    useTriggerRender,
    useEvent,
    useMergeClasses,
    useMountedFlag,
    useScheduleTriggerEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// heymarco:
import {
    // utilities:
    useControllableAndUncontrollable,
}                           from '@heymarco/events'

// reusable-ui components:
import {
    // base-components:
    GenericProps,
    BasicProps,
    Basic,
    Content,
    
    
    
    // utility-components:
    getFetchErrorMessage,
}                           from '@reusable-ui/components'

// internals:
import type {
    // react components:
    EditorProps,
}                           from '@/components/editors/Editor'
import {
    // configs:
    galleryEditors,
}                           from './styles/config'
import {
    // react components:
    ElementWithActionsProps,
    ElementWithActions,
}                           from './ElementWithActions'
import {
    // react components:
    ElementWithDraggable,
}                           from './ElementWithDraggable'
import {
    // react components:
    ElementWithDroppable,
}                           from './ElementWithDroppable'
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
, { specificityWeight: 2, id: 'd3yn00z8kw' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



// utilities:
const resolveSrc = <TValue extends ImageData = ImageData>(imageData: TValue, onResolveImageUrl: ((imageData: TValue) => URL|string)|undefined): string => {
    if (!onResolveImageUrl) return (typeof(imageData) === 'string') ? imageData : imageData.url;
    const resolved = onResolveImageUrl(imageData);
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
    imageFile   : File
    percentage  : number|null
    uploadError : React.ReactNode
    onRetry     : () => void
    onCancel    : () => void
}



// react components:
export interface GalleryEditorProps<TElement extends Element = HTMLElement, TValue extends ImageData = ImageData>
    extends
        // bases:
        Pick<EditorProps<TElement, TValue[]>,
            // accessibilities:
            |'readOnly'
            
            // values:
            |'defaultValue'
            |'value'
            |'onChange'
        >,
        Omit<BasicProps<TElement>,
            // values:
            |'defaultValue' // not supported
            |'value'        // not supported
            |'onChange'     // not supported
            
            // children:
            |'children'     // already taken over
        >,
        
        // sub components:
        Omit<ElementWithActionsProps<TElement>,
            // bases
            |keyof React.HTMLAttributes<HTMLElement>
            
            
            
            // positions:
            |'itemIndex'                  // already handled internally
            
            
            
            // actions:
            |'onDeleteImage'              // enhanced with return Promise<boolean>
            
            
            
            // components:
            |'elementComponent'           // already handled internally
            
            
            
            // children:
            |'children'                   // already handled internally
        >,
        Omit<UploadImageProps,
            // upload activities:
            |'onUploadImage'              // enhanced with return Promise<TValue>
        >,
        Omit<UploadingImageProps,
            // upload activities:
            |'uploadingImageFile'         // already handled internally
            |'uploadingImagePercentage'   // already handled internally
            |'uploadingImageErrorMessage' // already handled internally
            |'onUploadImageRetry'         // already handled internally
            |'onUploadImageCancel'        // already handled internally
            
            
            
            // components:
            |'imageComponent'             // already handled internally
        >
{
    // actions:
    onDeleteImage       ?: (args: { imageData: TValue }) => boolean|Error|Promise<boolean|Error>
    
    
    
    // upload activities:
    onUploadImage       ?: (args: { imageFile: File, reportProgress: (percentage: number) => void, abortSignal: AbortSignal }) => TValue|Error|null|Promise<TValue|Error|null>
    
    
    
    // components:
    bodyComponent       ?: React.ReactComponentElement<any, BasicProps<TElement>>
    
    mediaGroupComponent ?: React.ReactComponentElement<any, GenericProps<Element>>
    imageComponent      ?: React.ReactComponentElement<any, React.ImgHTMLAttributes<HTMLImageElement>>
    
    
    
    // handlers:
    onResolveImageUrl   ?: (imageData: TValue) => URL|string
}
const GalleryEditor = <TElement extends Element = HTMLElement, TValue extends ImageData = ImageData>(props: GalleryEditorProps<TElement, TValue>): JSX.Element|null => {
    // styles:
    const styleSheet = useGalleryEditorStyleSheet();
    
    
    
    // rest props:
    const {
        // accessibilities:
        readOnly = false,
        
        
        
        // values:
        defaultValue : defaultUncontrollableValue = [],
        value        : controllableValue,
        onChange     : onControllableValueChange,
        
        
        
        // actions:
        deletingImageTitle,
        deleteButtonTitle,
        onDeleteImage,
        
        
        
        // upload images:
        uploadImageTitle,
        selectButtonText,
        uploadImageMessage,
        uploadImageType,
        
        
        
        // uploading images:
        uploadingImageTitle,
        uploadingImageErrorTitle,
        uploadingImageRetryText,
        uploadingImageCancelText,
        
        
        
        // upload activities:
        onUploadImage,
        onUploadImageProgress,
        
        
        
        // components:
        bodyComponent          = (<Content<TElement>           /> as React.ReactComponentElement<any, BasicProps<TElement>>),
        
        mediaGroupComponent    = (<Basic tag='div' mild={true} /> as React.ReactComponentElement<any, GenericProps<Element>>),
        imageComponent         = (<img                         /> as React.ReactComponentElement<any, React.ImgHTMLAttributes<HTMLImageElement>>),
        
        actionGroupComponent,
        
        deletingImageTitleComponent,
        busyComponent,
        deleteButtonComponent,
        
        previewImageComponent,
        
        uploadImageTitleComponent,
        selectButtonComponent,
        uploadingImageTitleComponent,
        progressComponent,
        progressBarComponent,
        uploadErrorComponent,
        uploadingImageErrorTitleComponent,
        retryButtonComponent,
        cancelButtonComponent,
        
        
        
        // handlers:
        onResolveImageUrl,
    ...restBasicProps} = props;
    
    
    
    // identifiers:
    const editorId     = useId().toLowerCase();
    const dragDataType = `application/${editorId}`;
    
    
    
    // states:
    let {
        value              : value,
        triggerValueChange : triggerValueChange,
    } = useControllableAndUncontrollable<TValue[]>({
        defaultValue       : defaultUncontrollableValue,
        value              : controllableValue,
        onValueChange      : onControllableValueChange,
    });
    
    const [triggerRender] = useTriggerRender();
    
    const [draggedItemIndex, setDraggedItemIndex] = useState<number>(-1);
    let   [droppedItemIndex, setDroppedItemIndex] = useState<number>(-1);
    
    const [draftImages     , setDraftImages     ] = useState<TValue[]>([]);
    const [uploadingImages , setUploadingImages ] = useState<UploadingImageData[]>([]);
    
    useIsomorphicLayoutEffect(() => {
        // reset the preview:
        handleRevertPreview();
    }, [value]); // (re)update the draft images every time the *source of truth* images updated
    
    
    
    // events:
    const scheduleTriggerEvent = useScheduleTriggerEvent();
    
    
    
    // dom effects:
    const isMounted = useMountedFlag();
    
    
    
    // handlers:
    const handlePreviewMoved   = useEvent((newDroppedItemIndex: number): TValue[]|undefined => {
        if (draggedItemIndex === newDroppedItemIndex) { // no change => nothing to shift => return the (original) *source of truth* images
            // reset the preview:
            return handleRevertPreview();
        } // if
        
        
        
        // create a new local draftImages:
        const newDraftImages = value.slice(0); // clone (copy and then modify) the *source of truth* images
        
        
        
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
        triggerValueChange(newDraftImages, { triggerAt: 'macrotask' }); // then at the *next re-render*, the *controllable* `images` will change and trigger the `handleRevertPreview` and the `droppedItemIndex` will be reset
    });
    const handleRevertPreview  = useEvent((): TValue[] => {
        // reset the preview:
        if (draftImages !== value) setDraftImages(value);
        
        
        
        // reset the dropped index:
        if (droppedItemIndex !== -1) setDroppedItemIndex(droppedItemIndex /* instant update without waiting for (slow|delayed) re-render */ = -1);
        
        
        
        // return the original:
        return value;
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
    const handleDeleteImage    = useEvent(async (args: { itemIndex: number }): Promise<void> => {
        // params:
        const {
            itemIndex,
        ...restParams} = args;
        
        
        
        // conditions:
        if (itemIndex >= value.length) return; // out of range => ignore
        const imageData = value[itemIndex];
        if (onDeleteImage) {
            try {
                const result = await onDeleteImage({
                    ...restParams,
                    
                    imageData : imageData,
                });
                if (result instanceof Error) return; // error => abort
                if (result === false)        return; // the delete action was prevented by <parent> => ignore
            }
            catch {
                return; // error => abort
            } // try
        } // if
        
        
        
        // successfully deleted:
        
        
        
        // remove an image from collection by its index:
        const newDraftImages = value.slice(0); // clone (copy and then modify) the *source of truth* images
        newDraftImages.splice(itemIndex, 1);
        
        
        
        // update the preview:
        if (droppedItemIndex !== -1) handlePreviewMoved(droppedItemIndex);
        
        
        
        // notify the gallery's images changed:
        triggerValueChange(newDraftImages, { triggerAt: 'macrotask' }); // then at the *next re-render*, the *controllable* `images` will change and trigger the `handleRevertPreview` and the `droppedItemIndex` will be reset
        
        
        
        // update:
        /*
            uncontrollable:
                The `uncontrollableValue` and `value` has been updated and the `setUncontrollableValue()` has been invoked when the `triggerValueChange()` called.
                Then the *next re-render* will happen shortly (maybe delayed).
            
            controllable:
                We need to ensure the *next re-render* will happen shortly (maybe delayed) by calling `triggerRender()`, in case of calling `triggerValueChange()` won't cause <parent> to update the *controllable* `images` prop.
                When the *next re-render* occured, the `value` will reflect the `controllableValue`.
        */
        value = newDraftImages; // a temporary update regradless of (/*controllable*/ ?? /*uncontrollable*/), will be re-updated on *next re-render*
        if (controllableValue !== undefined) triggerRender(); // force to re-render
    });
    const handleUploadImage    = useEvent((args: { imageFile: File }): void => {
        // conditions:
        if (!onUploadImage) return; // the upload image handler is not configured => ignore
        
        
        
        // params:
        const {
            imageFile,
        ...restParams} = args;
        
        
        
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
            if (isUploadCanceled()) return; // the uploader was canceled => do nothing
            
            
            
            // resets:
            uploadingImageData.percentage  = null; // reset progress
            uploadingImageData.uploadError = null; // reset error
            setUploadingImages((current) => current.slice(0)); // force to re-render
            
            
            
            // actions:
            performUpload();
        };
        const handleUploadCancel = (): void => {
            // conditions:
            if (isUploadCanceled()) return; // the uploader was canceled => do nothing
            
            
            
            // abort the upload progress:
            abortController.abort();
            
            
            
            // remove the uploading status:
            performRemove();
        };
        const uploadingImageData : UploadingImageData = {
            imageFile   : imageFile,
            percentage  : null,
            uploadError : null,
            onRetry     : handleUploadRetry,
            onCancel    : handleUploadCancel,
        };
        setUploadingImages((current) => [...current, uploadingImageData]); // append a new uploading status
        
        
        
        // uploading progress:
        const handleReportProgress = (percentage: number): void => {
            // conditions:
            if (!isMounted.current) return; // the component was unloaded => do nothing
            if (uploadingImageData.percentage === percentage)  return; // already the same => do nothing
            
            
            
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
            let imageData : TValue|Error|null|undefined = undefined;
            try {
                imageData = await onUploadImage({
                    ...restParams,
                    
                    imageFile      : imageFile,
                    reportProgress : handleReportProgress,
                    abortSignal    : abortSignal,
                });
                if (imageData instanceof Error) throw imageData;
                
                
                
                // conditions:
                if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
            }
            catch (fetchError: any) {
                // conditions:
                if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
                
                // it's OK not to check the uploadingImageData in uploadingImages:
                // if (!uploadingImages.includes(uploadingImageData)) return; // upload was not started or aborted => do nothing
                
                
                
                uploadingImageData.uploadError = getFetchErrorMessage(fetchError);
                setUploadingImages((current) => current.slice(0)); // force to re-render
                return; // failed => no further actions
            } // try
            
            
            
            // successfully uploaded:
            if (imageData) {
                // append the new image into a new draft images:
                const newDraftImages = [
                    ...value, // clone (copy and then modify) the *source of truth* images
                    imageData,                    // the change
                ];
                
                
                
                // update the preview:
                if (droppedItemIndex !== -1) handlePreviewMoved(droppedItemIndex);
                
                
                
                // notify the gallery's images changed:
                triggerValueChange(newDraftImages, { triggerAt: 'macrotask' }); // then at the *next re-render*, the *controllable* `images` will change and trigger the `handleRevertPreview` and the `droppedItemIndex` will be reset
                
                
                
                // update:
                /*
                    uncontrollable:
                        The `uncontrollableValue` and `value` has been updated and the `setUncontrollableValue()` has been invoked when the `triggerValueChange()` called.
                        Then the *next re-render* will happen shortly (maybe delayed).
                    
                    controllable:
                        We have called the `performRemove()`, so it's guaranteed the *next re-render* will happen shortly (maybe delayed), even if the <parent> won't update the *controllable* `images` prop.
                        When the *next re-render* occured, the `value` will reflect the `controllableValue`.
                */
                value = newDraftImages; // a temporary update regradless of (/*controllable*/ ?? /*uncontrollable*/), will be re-updated on *next re-render*
            } // if
            
            
            
            // remove the uploading status:
            scheduleTriggerEvent(performRemove); // runs the `performRemove` function *next after* `onChange` event fired (to avoid blinking of previous image issue)
        };
        performUpload();
    });
    
    
    
    // classes:
    const classes = useMergeClasses(
        // preserves the original `classes` from `bodyComponent`:
        bodyComponent.props.classes,
        
        
        
        // preserves the original `classes` from `props`:
        props.classes,
        
        
        
        // classes:
        styleSheet.main,
    );
    
    
    
    // jsx:
    return React.cloneElement<BasicProps<TElement>>(bodyComponent,
        // props:
        {
            // other props:
            ...restBasicProps,
            ...bodyComponent.props, // overwrites restBasicProps (if any conflics)
            
            
            
            // variants:
            mild    : bodyComponent.props.mild ?? props.mild ?? true,
            
            
            
            // classes:
            classes : classes,
        },
        
        
        
        // children:
        bodyComponent.props.children ?? <>
            {/* <ElementWithDraggable> <ElementWithActions> <Image> */}
            {draftImages.map((imageData, itemIndex) => {
                // jsx:
                /* <MediaGroup> */
                const mediaGroup : React.ReactNode = React.cloneElement<GenericProps<Element>>(mediaGroupComponent,
                    // props:
                    {
                        // identifiers:
                        key       : mediaGroupComponent.key             ?? `img:${itemIndex}`,
                        
                        
                        
                        // classes:
                        className : mediaGroupComponent.props.className ?? (!readOnly ? 'mediaGroup draggable' : 'mediaGroup'),
                    },
                    
                    
                    
                    // children:
                    (mediaGroupComponent.props.children ?? <ElementWithActions
                        // positions:
                        itemIndex={itemIndex}
                        
                        
                        
                        // actions:
                        deletingImageTitle={deletingImageTitle}
                        deleteButtonTitle={deleteButtonTitle}
                        onDeleteImage={handleDeleteImage}
                        
                        
                        
                        // components:
                        elementComponent={
                            /* <Image> */
                            React.cloneElement<React.ImgHTMLAttributes<HTMLImageElement>>(imageComponent,
                                // props:
                                {
                                    // classes:
                                    className : imageComponent.props.className ?? 'image',
                                    
                                    
                                    
                                    // images:
                                    alt       : imageComponent.props.alt   ??  resolveAlt(imageData),
                                    src       : imageComponent.props.src   ?? (resolveSrc(imageData, onResolveImageUrl) || undefined), // convert empty string to undefined
                                    sizes     : imageComponent.props.sizes ?? `calc((${galleryEditors.itemMinColumnWidth} * 2) + ${galleryEditors.gapInline})`,
                                },
                            )
                        }
                        
                        actionGroupComponent={actionGroupComponent}
                        deletingImageTitleComponent={deletingImageTitleComponent}
                        busyComponent={busyComponent}
                        deleteButtonComponent={!readOnly ? deleteButtonComponent : null}
                    />),
                );
                if (readOnly) return mediaGroup;
                return (
                    <ElementWithDraggable
                        // identifiers:
                        key={`img:${itemIndex}`}
                        
                        
                        
                        // positions:
                        itemIndex={itemIndex}
                        
                        
                        
                        // draggable:
                        dragDataType = {dragDataType   }
                        onDragStart  = {handleDragStart}
                        onDragEnd    = {handleDragEnd  }
                        
                        
                        
                        // components:
                        elementComponent={
                            <ElementWithDroppable
                                // positions:
                                itemIndex        = {itemIndex       }
                                draggedItemIndex = {draggedItemIndex}
                                droppedItemIndex = {droppedItemIndex}
                                
                                
                                
                                // draggable:
                                dragDataType = {dragDataType   }
                                
                                
                                
                                // droppable:
                                onDragEnter  = {handleDragEnter}
                                onDragLeave  = {handleDragLeave}
                                onDrop       = {handleDrop     }
                                
                                
                                
                                // components:
                                elementComponent={mediaGroup}
                            />
                        }
                    />
                );
            })}
            
            {/* <UploadingImage> */}
            {uploadingImages.map(({imageFile, percentage, uploadError, onRetry, onCancel}, uploadingItemIndex) =>
                <UploadingImage
                    // identifiers:
                    key={`upl:${uploadingItemIndex}`}
                    
                    
                    
                    {...{
                        // uploading images:
                        uploadingImageTitle,
                        uploadingImageErrorTitle,
                        uploadingImageRetryText,
                        uploadingImageCancelText,
                        
                        
                        
                        // upload activities:
                        uploadingImageFile         : imageFile,
                        uploadingImagePercentage   : percentage,
                        uploadingImageErrorMessage : uploadError,
                        onUploadImageProgress,
                        onUploadImageRetry         : onRetry,
                        onUploadImageCancel        : onCancel,
                        
                        
                        
                        // components:
                        imageComponent,
                        previewImageComponent,
                        
                        actionGroupComponent,
                        uploadingImageTitleComponent,
                        progressComponent,
                        progressBarComponent,
                        uploadErrorComponent,
                        uploadingImageErrorTitleComponent,
                        retryButtonComponent,
                        cancelButtonComponent,
                    }}
                />
            )}
            
            {!readOnly && <UploadImage
                {...{
                    // upload images:
                    uploadImageTitle,
                    selectButtonText,
                    uploadImageMessage,
                    uploadImageType,
                    
                    
                    
                    // upload activities:
                    onUploadImage : handleUploadImage,
                    
                    
                    
                    // components:
                    actionGroupComponent,
                    uploadImageTitleComponent,
                    selectButtonComponent,
                }}
            />}
        </>,
    );
};
export {
    GalleryEditor,
    GalleryEditor as default,
}
