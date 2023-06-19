// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useId,
    useEffect,
    useRef,
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
        >
{
    productName: string
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
        
        
        
        productName,
    ...restContentProps} = props;
    
    
    
    // identifiers:
    const editorId     = useId().toLowerCase();
    const dragDataType = `application/${editorId}`;
    
    
    
    // states:
    const isControllableImages                    = (images !== undefined);
    const [imagesDn, setImagesDn]                 = useState<string[]>(defaultImages ?? []);
    const imagesFn : string[]                     = (images /*controllable*/ ?? imagesDn /*uncontrollable*/);
    
    const [draggedItemIndex, setDraggedItemIndex] = useState<number>(-1);
    const [droppedItemIndex, setDroppedItemIndex] = useState<number>(-1);
    
    const [draftImages, setDraftImages]           = useState<string[]>([]);
    const previewMovedCache                       = useRef<{draggedItemIndex: number, droppedItemIndex: number, newDraftImages: string[]}|undefined>(undefined);
    
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
    
    const handlePreviewMoved = useEvent((draggedItemIndex: number, droppedItemIndex: number): string[]|undefined => {
        if (draggedItemIndex === droppedItemIndex) { // no change => nothing to shift => return the (original) *source of truth* images
            // reset the preview:
            return handleRevertPreview();
        } // if
        
        
        
        // retrieve from cache:
        const cached = previewMovedCache.current;
        if (cached && (cached.draggedItemIndex === draggedItemIndex) && (cached.droppedItemIndex === droppedItemIndex)) return cached.newDraftImages;
        
        
        
        // create a new local draftImages:
        const newDraftImages = imagesFn.slice(0); // clone (copy and then modify) the *source of truth* images
        
        
        
        // backup the fromItem's image before shifting (destructing the data):
        const fromItemImage = newDraftImages[draggedItemIndex];
        
        
        
        // shift the images:
        if (draggedItemIndex < droppedItemIndex) {
            // shift the images [draggedItemIndex ...up_to... beforeToItemIndex]:
            for (let shiftedItemIndex = draggedItemIndex; shiftedItemIndex < droppedItemIndex; shiftedItemIndex++) {
                newDraftImages[shiftedItemIndex] = newDraftImages[shiftedItemIndex + 1];
            } // for
        }
        else {
            // shift the images [draggedItemIndex ...down_to... afterToItemIndex]:
            for (let shiftedItemIndex = draggedItemIndex; shiftedItemIndex > droppedItemIndex; shiftedItemIndex--) {
                newDraftImages[shiftedItemIndex] = newDraftImages[shiftedItemIndex - 1];
            } // for
        } // if
        
        
        
        // and replace the target's image with origin's image:
        newDraftImages[droppedItemIndex] = fromItemImage;
        
        
        
        // update the preview:
        setDraftImages(newDraftImages);
        
        
        
        // update the dropped index:
        setDroppedItemIndex(droppedItemIndex);
        
        
        
        // update the cache:
        previewMovedCache.current = {
            draggedItemIndex,
            droppedItemIndex,
            newDraftImages,
        };
        
        
        
        // return the modified:
        return newDraftImages;
    });
    const handleMoved = useEvent((draggedItemIndex: number, droppedItemIndex: number) => {
        const newDraftImages = handlePreviewMoved(draggedItemIndex, droppedItemIndex);
        if (!newDraftImages) return; // no change => ignore
        
        
        
        if (handleChange) scheduleTriggerEvent(() => { // runs the `onChange` event *next after* current macroTask completed
            // fire `onChange` react event:
            handleChange(newDraftImages);
        });
    });
    const handleRevertPreview = useEvent(() => {
        // reset the preview:
        if (draftImages !== imagesFn) setDraftImages(imagesFn);
        
        
        
        // reset the dropped index:
        if (droppedItemIndex !== -1) setDroppedItemIndex(-1);
        
        
        
        // clear the cache:
        previewMovedCache.current = undefined;
        
        
        
        // return the original:
        return imagesFn;
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
            {draftImages.map((image, itemIndex) =>
                <Image
                    // identifiers:
                    key={itemIndex}
                    
                    
                    
                    // classes:
                    className={((): string|undefined => {
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
                        return undefined;
                    })()}
                    
                    
                    
                    // images:
                    alt={''}
                    src={image ? `/products/${productName}/${image}` : undefined}
                    sizes={`calc((${gedits.itemMinColumnWidth} * 2) + ${gedits.gapInline})`}
                    
                    
                    
                    // draggable:
                    draggable={true}
                    onDragStart={(event) => {
                        // events:
                        event.dataTransfer.effectAllowed = 'move';
                        // event.dataTransfer.setDragImage(event.currentTarget.children?.[0] ?? event.currentTarget, 0 , 0);
                        
                        event.dataTransfer.setData(dragDataType, ''); // we don't store the data here, just for marking purpose
                        
                        
                        
                        // actions:
                        setDraggedItemIndex(itemIndex);               // rather, we store the data here
                    }}
                    onDragEnd={(event) => {
                        // actions:
                        setDraggedItemIndex(-1);                      // clear selection
                    }}
                    
                    
                    
                    // droppable:
                    // onDragEnter // useless
                    onDragOver={(event) => {
                        // conditions:
                        const isValidDragObject = event.dataTransfer.types.includes(dragDataType);
                        if (!isValidDragObject) return; // unknown drag object => ignore
                        
                        
                        
                        // events:
                        event.preventDefault(); // prevents the default behavior to *disallow* for dropping here
                        
                        
                        
                        // actions:
                        handlePreviewMoved(draggedItemIndex, /*droppedItemIndex = */itemIndex);
                    }}
                    onDragLeave={(event) => {
                        // actions:
                        handleRevertPreview();
                    }}
                    onDrop={(event) => {
                        // conditions:
                        const isValidDragObject = event.dataTransfer.types.includes(dragDataType);
                        if (!isValidDragObject) return; // unknown drag object => ignore
                        
                        
                        
                        // events:
                        event.preventDefault();
                        event.stopPropagation(); // do not bubble event to the <parent>
                        
                        
                        
                        // actions:
                        handleMoved(draggedItemIndex, /*droppedItemIndex = */itemIndex);
                    }}
                />
            )}
        </Content>
    );
};
export {
    GalleryEditor,
    GalleryEditor as default,
}
