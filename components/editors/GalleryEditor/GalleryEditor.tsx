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
    
    const [draftImages, setDraftImages]           = useState<string[]>([]);
    const previewMovedCache                       = useRef<{fromItemIndex: number, toItemIndex: number, newDraftImages: string[]}|undefined>(undefined);
    
    useIsomorphicLayoutEffect(() => {
        setDraftImages(imagesFn);              // copy the *source of truth* images
        previewMovedCache.current = undefined; // clear the cache
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
    
    const handlePreviewMoved = useEvent((fromItemIndex: number, toItemIndex: number): string[]|undefined => {
        if (fromItemIndex === toItemIndex) { // no change => nothing to shift => return the (original) *source of truth* images
            // reset the preview:
            if (draftImages !== imagesFn) setDraftImages(imagesFn);
            
            
            
            // clear the cache:
            previewMovedCache.current = undefined;
            
            
            
            // return the original:
            return imagesFn;
        } // if
        
        
        
        // retrieve from cache:
        const cached = previewMovedCache.current;
        if (cached && (cached.fromItemIndex === fromItemIndex) && (cached.toItemIndex === toItemIndex)) return cached.newDraftImages;
        
        
        
        // create a new local draftImages:
        const newDraftImages = imagesFn.slice(0); // clone (copy and then modify) the *source of truth* images
        
        
        
        // backup the fromItem's image before shifting (destructing the data):
        const fromItemImage = newDraftImages[fromItemIndex];
        
        
        
        // shift the images:
        if (fromItemIndex < toItemIndex) {
            // shift the images [fromItemIndex ...up_to... beforeToItemIndex]:
            for (let shiftItemIndex = fromItemIndex; shiftItemIndex < toItemIndex; shiftItemIndex++) {
                newDraftImages[shiftItemIndex] = newDraftImages[shiftItemIndex + 1];
            } // for
        }
        else {
            // shift the images [fromItemIndex ...down_to... afterToItemIndex]:
            for (let shiftItemIndex = fromItemIndex; shiftItemIndex > toItemIndex; shiftItemIndex--) {
                newDraftImages[shiftItemIndex] = newDraftImages[shiftItemIndex - 1];
            } // for
        } // if
        
        
        
        // and replace the target's image with origin's image:
        newDraftImages[toItemIndex] = fromItemImage;
        
        
        
        // update the preview:
        setDraftImages(newDraftImages);
        
        
        
        // update the cache:
        previewMovedCache.current = {
            fromItemIndex,
            toItemIndex,
            newDraftImages,
        };
        
        
        
        // return the modified:
        return newDraftImages;
    });
    const handleMoved = useEvent((fromItemIndex: number, toItemIndex: number) => {
        const newDraftImages = handlePreviewMoved(fromItemIndex, toItemIndex);
        if (!newDraftImages) return; // no change => ignore
        
        
        
        if (handleChange) scheduleTriggerEvent(() => { // runs the `onChange` event *next after* current macroTask completed
            // fire `onChange` react event:
            handleChange(newDraftImages);
        });
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
                    className={
                        (image === imagesFn[draggedItemIndex])
                        ? 'dropped'
                        : (image !== imagesFn[itemIndex])
                            ? 'shifted'
                            : undefined
                    }
                    
                    
                    
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
                        handlePreviewMoved(draggedItemIndex, /*toItemIndex = */itemIndex);
                    }}
                    onDragLeave={(event) => {
                        // actions:
                    }}
                    onDrop={(event) => {
                        // conditions:
                        const isValidDragObject = event.dataTransfer.types.includes(dragDataType);
                        if (!isValidDragObject) return; // unknown drag object => ignore
                        
                        
                        
                        // events:
                        event.preventDefault();
                        event.stopPropagation(); // do not bubble event to the <parent>
                        
                        
                        
                        // actions:
                        handleMoved(draggedItemIndex, /*toItemIndex = */itemIndex);
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
