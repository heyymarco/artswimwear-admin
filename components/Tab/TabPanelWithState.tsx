// react:
import {
    // react:
    default as React,
}                           from 'react'

// internals:
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
        Omit<TabPanelProps<TElement>, 'tabIndex'>,
        
        // positions:
        Pick<TTabExpandedChangeEvent, 'tabIndex'>,
        
        // components:
        Required<TabPanelComponentProps<TElement>>
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
    
    
    
    // jsx:
    /* <TabPanel> */
    return React.cloneElement<TabPanelProps<TElement>>(tabPanelComponent,
        // props:
        {
            // other props:
            ...restTabPanelProps,
            ...tabPanelComponent.props, // overwrites restTabPanelProps (if any conflics)
            
            
            
            // states:
            expanded : tabPanelComponent.props.expanded ??  isActive,
        },
    );
};
