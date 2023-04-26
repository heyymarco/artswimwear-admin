// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useMemo,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useMergeStyles,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// internals:
import {
    // features:
    usesTab,
}                           from './features/tab'
import {
    // states:
    TabExpandedChangeEvent,
    useTabState,
}                           from './states/tabState'
import type {
    // react components:
    TabPanelProps,
    
    TabPanelComponentProps,
}                           from './TabPanel'



// react components:
export interface TabPanelWithStateProps<TElement extends Element = HTMLElement, TTabExpandedChangeEvent extends TabExpandedChangeEvent = TabExpandedChangeEvent>
    extends
        // bases:
        Omit<TabPanelProps<TElement, TTabExpandedChangeEvent>, 'tabIndex'>,
        
        // positions:
        Pick<TTabExpandedChangeEvent, 'tabIndex'>,
        
        // components:
        Required<TabPanelComponentProps<TElement, TTabExpandedChangeEvent>>
{
}
export const TabPanelWithState = <TElement extends Element = HTMLElement, TTabExpandedChangeEvent extends TabExpandedChangeEvent = TabExpandedChangeEvent>(props: TabPanelWithStateProps<TElement, TTabExpandedChangeEvent>): JSX.Element|null => {
    // rest props:
    const {
        // positions:
        tabIndex,
        
        
        
        // components:
        tabPanelComponent,
    ...restTabPanelProps} = props;
    
    
    
    // states:
    const {
        // states:
        expandedTabIndex,
    } = useTabState();
    const isActive = (expandedTabIndex === tabIndex);
    
    
    
    // features:
    const {tabVars} = usesTab();
    
    
    
    // styles:
    const tabIndexStyle = useMemo<React.CSSProperties>(() => ({
        // values:
        [
            tabVars.tabIndex
            .slice(4, -1) // fix: var(--customProp) => --customProp
        ] : tabIndex,
    }), [tabVars.tabIndex, tabIndex]);
    const mergedStyle   = useMergeStyles(
        // values:
        tabIndexStyle,
        
        
        
        // preserves the original `style` from `props` (can overwrite the `tabIndexStyle`):
        props.style,
        
        
        
        // preserves the original `style` from `tabPanelComponent` (can overwrite the `style` and/or the `tabIndexStyle`):
        tabPanelComponent.props.style,
    );
    
    
    
    // jsx:
    /* <TabPanel> */
    return React.cloneElement<TabPanelProps<TElement, TTabExpandedChangeEvent>>(tabPanelComponent,
        // props:
        {
            // other props:
            ...restTabPanelProps,
            ...tabPanelComponent.props, // overwrites restTabPanelProps (if any conflics)
            
            
            
            // semantics:
            role     : tabPanelComponent.props.role     ?? props.role     ?? 'presentation',
            
            
            
            // styles:
            style    : mergedStyle,
            
            
            
            // states:
            expanded : tabPanelComponent.props.expanded ?? props.expanded ?? isActive,
        },
    );
};
