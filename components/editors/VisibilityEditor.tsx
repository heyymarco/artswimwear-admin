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
    TabControlOption,
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
            // children:
            |'children'              // already taken over
        >
{
}
const VisibilityEditor = <TElement extends Element = HTMLElement>(props: VisibilityEditorProps<TElement>): JSX.Element|null => {
    // jsx:
    return (
        <TabControl<TElement, ProductVisibility>
            // other props:
            {...props}
        >
            <TabControlOption value='published' label={PAGE_PRODUCTS_VISIBILITY_PUBLISHED}>
                <p>
                    The product is <em>shown</em> on the webiste.
                </p>
            </TabControlOption>
            <TabControlOption value='hidden'    label={PAGE_PRODUCTS_VISIBILITY_HIDDEN}>
                <p>
                    The product can only be viewed via <em>a (bookmarked) link</em>.
                </p>
            </TabControlOption>
            <TabControlOption value='draft'     label={PAGE_PRODUCTS_VISIBILITY_DRAFT}>
                <p>
                    The product <em>cannot be viewed</em> on the entire website.
                </p>
            </TabControlOption>
        </TabControl>
    );
};
export {
    VisibilityEditor,
    VisibilityEditor as default,
}
