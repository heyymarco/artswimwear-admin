// react:
import {
    // react:
    default as React,
}                           from 'react'

// internals:
import {
    // react components:
    TabOptionProps,
    TabOption,
}                           from '@/components/editors/TabOption'

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
        Omit<TabOptionProps<TElement, ProductVisibility>,
            // values:
            |'options' // already defined
        >
{
}
const VisibilityEditor = <TElement extends Element = HTMLElement>(props: VisibilityEditorProps<TElement>): JSX.Element|null => {
    // jsx:
    return (
        <TabOption<TElement, ProductVisibility>
            // other props:
            {...props}
            
            
            
            // values:
            options={[
                { value: 'published', label: PAGE_PRODUCTS_VISIBILITY_PUBLISHED, description: <p>
                    The product is <em>shown</em> on the webiste.
                </p> },
                
                { value: 'hidden'   , label: PAGE_PRODUCTS_VISIBILITY_HIDDEN   , description: <p>
                    The product can only be viewed via <em>a (bookmarked) link</em>.
                </p> },
                
                { value: 'draft'    , label: PAGE_PRODUCTS_VISIBILITY_DRAFT    , description: <p>
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
