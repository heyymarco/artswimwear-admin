// react:
import {
    // react:
    default as React,
}                           from 'react'

// internals:
import {
    // react components:
    TabProps,
    Tab,
    TabOption,
}                           from '@/components/Tab'

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
        Omit<TabProps<TElement, ProductVisibility>,
            // children:
            |'children'              // already taken over
        >
{
}
const VisibilityEditor = <TElement extends Element = HTMLElement>(props: VisibilityEditorProps<TElement>): JSX.Element|null => {
    // jsx:
    return (
        <Tab<TElement, ProductVisibility>
            // other props:
            {...props}
        >
            <TabOption value='published' label={PAGE_PRODUCTS_VISIBILITY_PUBLISHED}>
                <p>
                    The product is <em>shown</em> on the webiste.
                </p>
            </TabOption>
            <TabOption value='hidden'    label={PAGE_PRODUCTS_VISIBILITY_HIDDEN}>
                <p>
                    The product can only be viewed via <em>a (bookmarked) link</em>.
                </p>
            </TabOption>
            <TabOption value='draft'     label={PAGE_PRODUCTS_VISIBILITY_DRAFT}>
                <p>
                    The product <em>cannot be viewed</em> on the entire website.
                </p>
            </TabOption>
        </Tab>
    );
};
export {
    VisibilityEditor,
    VisibilityEditor as default,
}
