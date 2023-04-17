// react:
import {
    // react:
    default as React,
}                           from 'react'

// internals:
import {
    // react components:
    TabControlProps,
    TabControl,
}                           from '@/components/editors/TabControl'

// app configs:
import {
    PAGE_PRODUCTS_VISIBILITY_PUBLISHED,
    PAGE_PRODUCTS_VISIBILITY_HIDDEN,
    PAGE_PRODUCTS_VISIBILITY_DRAFT,
}                           from '@/website.config'



// types:
export type ProductVisibility = 'published'|'hidden'|'draft'



interface VisibilityEditorProps<TElement extends Element = HTMLElement>
    extends
        Omit<TabControlProps<TElement, ProductVisibility>,
            // values:
            |'options' // already defined
        >
{
}
const VisibilityEditor = <TElement extends Element = HTMLElement>(props: VisibilityEditorProps<TElement>): JSX.Element|null => {
    // jsx:
    return (
        <TabControl<TElement, ProductVisibility>
            // other props:
            {...props}
            
            
            
            // values:
            options={[
                { value: 'published', label: PAGE_PRODUCTS_VISIBILITY_PUBLISHED, content: <p>
                    The product is <em>shown</em> on the webiste.
                </p> },
                
                { value: 'hidden'   , label: PAGE_PRODUCTS_VISIBILITY_HIDDEN   , content: <p>
                    The product can only be viewed via <em>a (bookmarked) link</em>.
                </p> },
                
                { value: 'draft'    , label: PAGE_PRODUCTS_VISIBILITY_DRAFT    , content: <p>
                    The product <em>cannot be viewed</em> on the entire website.
                </p> },
            ]}
        />
    );
};
export {
    VisibilityEditor,
    VisibilityEditor as default,
}
