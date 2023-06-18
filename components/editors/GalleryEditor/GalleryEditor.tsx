// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useId,
    useEffect,
}                           from 'react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'           // writes css in react hook

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    EventHandler,
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
    const isControllableImages    = (images !== undefined);
    const [imagesDn, setImagesDn] = useState<string[]>(defaultImages ?? []);
    const imagesFn : string[]     = (images /*controllable*/ ?? imagesDn /*uncontrollable*/);
    
    const [draftImages, setDraftImages] = useState<string[]>([]);
    useEffect(() => {
        setDraftImages(imagesFn.slice(0)); // clone the image
    }, [imagesFn]);
    
    
    
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
    
    const handlePreviewMoved = useEvent((fromItemIndex: number, toItemIndex: number) => {
        if (fromItemIndex === toItemIndex) return; // no change => nothing to shift => ignore
        
        
        
        // backup the fromItem's image before shifting (destructing the data):
        const fromItemImage = draftImages[fromItemIndex];
        
        
        
        // shift the images:
        if (fromItemIndex < toItemIndex) {
            // shift the images [fromItemIndex ...up_to... beforeToItemIndex]:
            for (let shiftItemIndex = fromItemIndex; shiftItemIndex < toItemIndex; shiftItemIndex++) {
                draftImages[shiftItemIndex] = draftImages[shiftItemIndex + 1];
            } // for
        }
        else {
            // shift the images [fromItemIndex ...down_to... afterToItemIndex]:
            for (let shiftItemIndex = fromItemIndex; shiftItemIndex > toItemIndex; shiftItemIndex--) {
                draftImages[shiftItemIndex] = draftImages[shiftItemIndex - 1];
            } // for
        } // if
        
        
        
        // and replace the target's image with origin's image:
        draftImages[toItemIndex] = fromItemImage;
        
        
        
        // notify changes by supplying a copy of the modified array:
        setDraftImages(draftImages.slice(0));
    });
    const handleDropped = useEvent((fromItemIndex: number, toItemIndex: number) => {
        handlePreviewMoved(fromItemIndex, toItemIndex);
        
        
        
        if (handleChange) scheduleTriggerEvent(() => { // runs the `onChange` event *next after* current macroTask completed
            // fire `onChange` react event:
            handleChange(draftImages);
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
            {imagesFn.map((image, itemIndex) =>
                <Image
                    key={itemIndex}
                    
                    alt={''}
                    src={image ? `/products/${productName}/${image}` : undefined}
                    sizes={`calc((${gedits.itemMinColumnWidth} * 2) + ${gedits.gapInline})`}
                    
                    // draggable:
                    draggable={true}
                    onDragStart={(event) => {
                        // event.currentTarget.style.opacity = '0.4';
                        
                        event.dataTransfer.effectAllowed = 'move';
                        event.dataTransfer.setData(dragDataType, `${itemIndex}`);
                        // event.dataTransfer.setDragImage(event.currentTarget.children?.[0] ?? event.currentTarget, 0 , 0);
                    }}
                    onDragEnd={(event) => {
                        // event.currentTarget.style.opacity = '1';
                    }}
                    
                    // droppable:
                    onDragOver={(event) => {
                        // conditions:
                        const isValidDragObject = event.dataTransfer.types.includes(dragDataType);
                        if (!isValidDragObject) return; // unknown drag object => ignore
                        
                        
                        
                        // actions:
                        event.preventDefault(); // prevents the default behavior to *disallow* for dropping here
                    }}
                    onDragEnter={(event) => {
                        // conditions:
                        const dragData = event.dataTransfer.getData(dragDataType);
                        if (!dragData) return; // unknown drag object => ignore
                        
                        
                        
                        // todo: setup drop target styling
                        event.dataTransfer.dropEffect = 'move';
                    }}
                    onDragLeave={(event) => {
                        // todo: restore drop target styling
                        console.log('LEAVE')
                    }}
                    onDrop={(event) => {
                        // conditions:
                        const fromItemIndex = Number.parseInt(event.dataTransfer.getData(dragDataType));
                        if (isNaN(fromItemIndex)) return; // unknown drag object => ignore
                        
                        
                        
                        // actions:
                        event.preventDefault();
                        event.stopPropagation(); // do not bubble event to the <parent>
                        handleDropped(fromItemIndex, /*toItemIndex = */itemIndex);
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
