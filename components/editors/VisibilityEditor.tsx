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

// configs:
import {
    PAGE_PRODUCT_VISIBILITY_PUBLISHED,
    PAGE_PRODUCT_VISIBILITY_HIDDEN,
    PAGE_PRODUCT_VISIBILITY_DRAFT,
}                           from '@/website.config'

// models:
import type {
    ProductVisibility,
}                           from '@prisma/client'



// types:
const possibleValues        : ProductVisibility[] = ['PUBLISHED', 'HIDDEN', 'DRAFT']; // with hidden
const reducedPossibleValues : ProductVisibility[] = ['PUBLISHED',           'DRAFT']; // without hidden



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
    // values:
    optionHidden ?: boolean
}
const VisibilityEditor = <TElement extends Element = HTMLElement>(props: VisibilityEditorProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // values:
        optionHidden = true,
        
        defaultValue,
        value,
        onChange,
    ...restTabProps} = props;
    
    
    
    // handlers:
    const handleExpandedChange = useEvent<EventHandler<TabExpandedChangeEvent>>(({tabIndex}) => {
        onChange?.(
            optionHidden                      // if including hidden
            ? possibleValues[tabIndex]        // with hidden
            : reducedPossibleValues[tabIndex] // without hidden
        );
    });
    
    
    
    // jsx:
    return (
        <Tab<TElement>
            // other props:
            {...restTabProps}
            
            
            
            // accessibilities:
            aria-label={props['aria-label'] ?? 'Visibility'}
            
            
            
            // states:
            defaultExpandedTabIndex={
                (
                    optionHidden            // if including hidden
                    ? possibleValues        // with hidden
                    : reducedPossibleValues // without hidden
                )
                .findIndex((possibleValue) =>
                    (possibleValue.toUpperCase() === (value ?? defaultValue)?.toUpperCase())
                )
            }
            onExpandedChange={handleExpandedChange}
        >
            <TabPanel label={PAGE_PRODUCT_VISIBILITY_PUBLISHED}>
                <p>
                    The product is <em>shown</em> on the webiste.
                </p>
            </TabPanel>
            {optionHidden && <TabPanel label={PAGE_PRODUCT_VISIBILITY_HIDDEN}>
                <p>
                    The product can only be viewed via <em>a (bookmarked) link</em>.
                </p>
            </TabPanel>}
            <TabPanel label={PAGE_PRODUCT_VISIBILITY_DRAFT}>
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
