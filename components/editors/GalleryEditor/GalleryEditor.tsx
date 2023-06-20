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
    useScheduleTriggerEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // react components:
    ContentProps,
    Content,
    ButtonIcon,
    Progress,
    ProgressBar,
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



// react components:
interface GalleryEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Pick<EditorProps<TElement, string[]>,
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
        UploadImageProps,
        UploadingImageProps
{
    // paths:
    productName: string
}
const GalleryEditor = <TElement extends Element = HTMLElement>(props: GalleryEditorProps<TElement>): JSX.Element|null => {
    // styles:
    const styleSheet = useGalleryEditorStyleSheet();
    
    
    
    // rest props:
    const {
        // paths:
        productName,
        
        
        
        // values:
        defaultValue : defaultImages,
        value        : images,
        onChange,
        
        
        
        // upload images:
        uploadImageTitle,
        uploadImageSelectImage,
        uploadImageDropImage,
        uploadImageType,
        
        
        
        // uploading images:
        uploadingImageTitle,
        uploadingImageCancel,
        uploadingImageProgress,
        
        
        
        // components:
        uploadImageButtonComponent,
        
        uploadingImageProgressComponent,
        uploadingImageProgressBarComponent,
        uploadingImageCancelButtonComponent,
    ...restContentProps} = props;
    
    
    
    // identifiers:
    const editorId     = useId().toLowerCase();
    const dragDataType = `application/${editorId}`;
    
    
    
    // states:
    const isControllableImages                    = (images !== undefined);
    const [imagesDn, setImagesDn]                 = useState<string[]>(defaultImages ?? []);
    const imagesFn : string[]                     = (images /*controllable*/ ?? imagesDn /*uncontrollable*/);
    
    const [draggedItemIndex, setDraggedItemIndex] = useState<number>(-1);
    let   [droppedItemIndex, setDroppedItemIndex] = useState<number>(-1);
    
    const [draftImages, setDraftImages]           = useState<string[]>([]);
    
    useIsomorphicLayoutEffect(() => {
        // reset the preview:
        handleRevertPreview();
    }, [imagesFn]); // (re)update the draft images every time the *source of truth* images updated
    
    
    
    // events:
    const scheduleTriggerEvent = useScheduleTriggerEvent();
    
    
    
    // handlers:
    const handleChangeInternal = useEvent<EditorChangeEventHandler<string[]>>((images) => {
        // update state:
        if (!isControllableImages) setImagesDn(images);
    });
    const handleChange         = useMergeEvents(
        // preserves the original `onChange` from `props`:
        onChange,
        
        
        
        // actions:
        handleChangeInternal,
    );
    
    const handlePreviewMoved   = useEvent((newDroppedItemIndex: number): string[]|undefined => {
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
        setDroppedItemIndex(droppedItemIndex /* instant update without waiting for re-render */ = newDroppedItemIndex);
        
        
        
        // return the modified:
        return newDraftImages;
    });
    const handleMoved          = useEvent((newDroppedItemIndex: number) => {
        const newDraftImages = handlePreviewMoved(newDroppedItemIndex);
        if (!newDraftImages) return; // no change => ignore
        
        
        
        if (handleChange) scheduleTriggerEvent(() => { // runs the `onChange` event *next after* current macroTask completed
            // fire `onChange` react event:
            handleChange(newDraftImages);
        });
    });
    const handleRevertPreview  = useEvent(() => {
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
            {draftImages.map((image, itemIndex) =>
                <DraggableImage
                    // identifiers:
                    key={itemIndex}
                    
                    
                    
                    // positions:
                    itemIndex={itemIndex}
                    
                    
                    
                    // components:
                    imageComponent={<Image
                        // images:
                        alt={''}
                        src={image ? `/products/${productName}/${image}` : undefined}
                        sizes={`calc((${gedits.itemMinColumnWidth} * 2) + ${gedits.gapInline})`}
                    />}
                    
                    
                    
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
            <UploadingImage
                {...{
                    // uploading images:
                    uploadingImageTitle,
                    uploadingImageCancel,
                    uploadingImageProgress,
                    
                    
                    
                    // components:
                    uploadingImageProgressComponent,
                    uploadingImageProgressBarComponent,
                    uploadingImageCancelButtonComponent,
                }}
            />
            <UploadImage
                {...{
                    // upload images:
                    uploadImageTitle,
                    uploadImageSelectImage,
                    uploadImageDropImage,
                    uploadImageType,
                    
                    
                    
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
