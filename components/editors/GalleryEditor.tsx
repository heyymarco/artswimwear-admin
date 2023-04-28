// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
}                           from 'react'

// reusable-ui core:
import {
    // react components:
    MasonryProps,
    Masonry,
    
    
    
    // configs:
    masonries,
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
        Omit<MasonryProps<TElement>,
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
    // rest props:
    const {
        // values:
        defaultValue : defaultImages,
        value        : images,
        onChange,
        
        
        
        productName,
    ...restMasonryProps} = props;
    
    
    
    // states:
    const [imagesDn, setImagesDn] = useState<string[]>(defaultImages ?? []);
    const imagesFn : string[] = (images /*controllable*/ ?? imagesDn /*uncontrollable*/);
    
    
    
    // jsx:
    return (
        <Masonry<TElement>
            // other props:
            {...restMasonryProps}
            
            
            
            // variants:
            nude={props.nude ?? true}
        >
            {imagesFn.map((image, index) =>
                <Image
                    key={index}
                    
                    alt={''}
                    src={image ? `/products/${productName}/${image}` : undefined}
                    sizes={`calc((${masonries.itemMinColumnWidth} * 2) + ${masonries.gapInline})`}
                />
            )}
        </Masonry>
    );
};
export {
    GalleryEditor,
    GalleryEditor as default,
}
