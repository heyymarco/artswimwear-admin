// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import type {
    // react components:
    InputProps,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internals:
import type {
    // react components:
    EditorProps,
}                           from '@/components/editors/Editor'
import {
    // react components:
    TabProps,
    Tab,
    TabPanel,
}                           from '@/components/Tab'

// app configs:
import {
    PAGE_PRODUCTS_VISIBILITY_PUBLISHED,
    PAGE_PRODUCTS_VISIBILITY_HIDDEN,
    PAGE_PRODUCTS_VISIBILITY_DRAFT,
}                           from '@/website.config'



// types:
export type ProductVisibility = 'published'|'hidden'|'draft'



// react components:
interface VisibilityEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<EditorProps<TElement, ProductVisibility>,
            // refs:
            |'elmRef'                  // taken by <Tab>
            |'outerRef'                // taken by <Tab>
            
            // variants:
            |'nude'                    // not supported
            
            // children:
            |'children'                // not supported
            |'dangerouslySetInnerHTML' // not supported
        >,
        Omit<TabProps<TElement>,
            // states:
            |'tabPanels'               // already taken over
            |'defaultExpandedTabIndex' // already taken over
            |'expandedTabIndex'        // already taken over
            |'onExpandedChange'        // already taken over
            
            // children:
            |'children'                // already taken over
        >
{
}
const VisibilityEditor = <TElement extends Element = HTMLElement>(props: VisibilityEditorProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
    ...restTabProps} = props;
    type T1 = typeof restTabProps
    type T2 = Omit<T1, keyof TabProps>
    
    
    
    // jsx:
    return (
        <Tab<TElement>
            // other props:
            {...restTabProps}
        >
            <TabPanel label={PAGE_PRODUCTS_VISIBILITY_PUBLISHED}>
                <p>
                    The product is <em>shown</em> on the webiste.
                </p>
            </TabPanel>
            <TabPanel label={PAGE_PRODUCTS_VISIBILITY_HIDDEN}>
                <p>
                    The product can only be viewed via <em>a (bookmarked) link</em>.
                </p>
            </TabPanel>
            <TabPanel label={PAGE_PRODUCTS_VISIBILITY_DRAFT}>
                <p>
                    The product <em>cannot be viewed</em> on the entire website.
                </p>
            </TabPanel>
        </Tab>
    );
};
export {
    VisibilityEditor,
    VisibilityEditor as default,
}
