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
    
    
    
    // states:
    const [imagesDn, setImagesDn] = useState<string[]>(defaultImages ?? []);
    const imagesFn : string[] = (images /*controllable*/ ?? imagesDn /*uncontrollable*/);
    
    
    
    const editorId     = useId().toLowerCase();
    const dragDataType = `application/${editorId}`;
    
    
    
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
                    }}
                    onDrop={(event) => {
                        // conditions:
                        const dragData = event.dataTransfer.getData(dragDataType);
                        if (!dragData) return; // unknown drag object => ignore
                        
                        
                        
                        // actions:
                        console.log({ dragData });
                        event.preventDefault();
                        event.stopPropagation(); // do not bubble event to the <parent>
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
