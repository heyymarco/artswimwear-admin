// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    EventHandler,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// internals:
import type {
    // react components:
    EditorProps,
}                           from '@/components/editors/Editor'
import {
    // react components:
    TabExpandedChangeEvent,
    TabProps,
    Tab,
    TabPanel,
}                           from '@reusable-ui/components'

// app configs:
import {
    PAGE_PRODUCTS_VISIBILITY_PUBLISHED,
    PAGE_PRODUCTS_VISIBILITY_HIDDEN,
    PAGE_PRODUCTS_VISIBILITY_DRAFT,
}                           from '@/website.config'

// models:
import type {
    ProductVisibility,
}                           from '@prisma/client'



// types:
const possibleValues : ProductVisibility[] = ['PUBLISHED', 'HIDDEN', 'DRAFT'];



// react components:
interface VisibilityEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Pick<EditorProps<TElement, ProductVisibility>,
            // values:
            |'defaultValue'
            |'value'
            |'onChange'
        >,
        Omit<TabProps<TElement>,
            // states:
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
        // values:
        defaultValue,
        value,
        onChange,
    ...restTabProps} = props;
    
    
    
    // handlers:
    const handleExpandedChange = useEvent<EventHandler<TabExpandedChangeEvent>>(({tabIndex}) => {
        onChange?.(
            possibleValues[tabIndex]
        );
    });
    
    
    
    // jsx:
    return (
        <Tab<TElement>
            // other props:
            {...restTabProps}
            
            
            
            // states:
            defaultExpandedTabIndex={possibleValues.findIndex((possibleValue) => (possibleValue.toUpperCase() === (value ?? defaultValue)?.toUpperCase()))}
            onExpandedChange={handleExpandedChange}
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
