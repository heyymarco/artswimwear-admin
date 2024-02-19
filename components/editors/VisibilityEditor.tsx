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
import {
    ProductVisibility,
    ProductVariantVisibility,
}                           from '@prisma/client'



// types:
const valueOptions        : ProductVisibility[]        = ['PUBLISHED', 'HIDDEN', 'DRAFT']; // with hidden
const reducedValueOptions : ProductVariantVisibility[] = ['PUBLISHED',           'DRAFT']; // without hidden



// react components:
interface BaseVisibilityEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<TabProps<TElement>,
            // states:
            |'defaultExpandedTabIndex' // already taken over
            |'expandedTabIndex'        // already taken over
            |'onExpandedChange'        // already taken over
            
            // children:
            |'children'                // already taken over
        >
{
    // data:
    modelName    ?: string
}
interface CompletedVisibilityEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        BaseVisibilityEditorProps<TElement>,
        Pick<EditorProps<TElement, ProductVisibility>,
            // values:
            |'defaultValue'
            |'value'
            |'onChange'
        >
{
    // values:
    optionHidden ?: undefined|true
}
interface ReducedVisibilityEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        BaseVisibilityEditorProps<TElement>,
        Pick<EditorProps<TElement, ProductVariantVisibility>,
            // values:
            |'defaultValue'
            |'value'
            |'onChange'
        >
{
    // values:
    optionHidden  : false
}
type VisibilityEditorProps<TElement extends Element = HTMLElement> =
    |CompletedVisibilityEditorProps<TElement>
    |ReducedVisibilityEditorProps<TElement>
const VisibilityEditor = <TElement extends Element = HTMLElement>(props: VisibilityEditorProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // data:
        modelName = 'product',
        
        
        
        // values:
        optionHidden = true,
        
        defaultValue,
        value,
        onChange,
    ...restTabProps} = props;
    
    
    
    // handlers:
    const handleExpandedChange = useEvent<EventHandler<TabExpandedChangeEvent>>(({tabIndex}) => {
        onChange?.(
            (
                optionHidden                    // if including hidden
                ? valueOptions[tabIndex]        // with hidden
                : reducedValueOptions[tabIndex] // without hidden
            ) as (ProductVisibility & ProductVariantVisibility)
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
                    optionHidden          // if including hidden
                    ? valueOptions        // with hidden
                    : reducedValueOptions // without hidden
                )
                .findIndex((valueOption) =>
                    (valueOption.toUpperCase() === (value ?? defaultValue)?.toUpperCase())
                )
            }
            onExpandedChange={handleExpandedChange}
        >
            <TabPanel label={PAGE_PRODUCT_VISIBILITY_PUBLISHED}>
                <p>
                    The {modelName} is <em>shown</em> on the webiste.
                </p>
            </TabPanel>
            {optionHidden && <TabPanel label={PAGE_PRODUCT_VISIBILITY_HIDDEN}>
                <p>
                    The {modelName} can only be viewed via <em>a (bookmarked) link</em>.
                </p>
            </TabPanel>}
            <TabPanel label={PAGE_PRODUCT_VISIBILITY_DRAFT}>
                <p>
                    The {modelName} <em>cannot be viewed</em> on the entire website.
                </p>
            </TabPanel>
        </Tab>
    );
};
export {
    VisibilityEditor,
    VisibilityEditor as default,
}
