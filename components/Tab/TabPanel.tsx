// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useMergeClasses,
    
    
    
    // a capability of UI to expand/reduce its size or toggle the visibility:
    CollapsibleProps,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // react components:
    GenericProps,
    Generic,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internals:
import type {
    // states:
    TabExpandedChangeEvent,
}                           from './states/tabState'



// react components:
export interface TabPanelProps<TElement extends Element = HTMLElement, TTabExpandedChangeEvent extends TabExpandedChangeEvent = TabExpandedChangeEvent>
    extends
        // bases:
        GenericProps<TElement>,
        
        // states:
        CollapsibleProps<TTabExpandedChangeEvent>
{
    // accessibilities:
    label          ?: React.ReactNode
    
    
    
    // states:
    expanded       ?: boolean
    
    
    
    // components:
    panelComponent ?: React.ReactComponentElement<any, GenericProps<TElement>>
    
    
    
    // children:
    children       ?: React.ReactNode
}
const TabPanel = <TElement extends Element = HTMLElement, TTabExpandedChangeEvent extends TabExpandedChangeEvent = TabExpandedChangeEvent>(props: TabPanelProps<TElement, TTabExpandedChangeEvent>): JSX.Element|null => {
    // rest props:
    const {
        // accessibilities:
        label : _label, // not used here, used by <TabHeader>|<TabBody>
        
        
        
        // states:
        expanded       = false,
        
        
        
        // components:
        panelComponent = (<Generic<TElement> /> as React.ReactComponentElement<any, GenericProps<TElement>>),
        
        
        
        // children:
        children,
    ...restGenericProps} = props;
    
    
    
    // classes:
    const classes = useMergeClasses(
        // preserves the original `classes` from `panelComponent`:
        panelComponent.props.classes,
        
        
        
        // preserves the original `classes` from `props`:
        props.classes,
        
        
        
        // classes:
        'tabPanel',
    );
    const stateClasses = useMergeClasses(
        // preserves the original `stateClasses` from `panelComponent`:
        panelComponent.props.stateClasses,
        
        
        
        // preserves the original `stateClasses` from `props`:
        props.stateClasses,
        
        
        
        // states:
        expanded ? 'expanded' : null,
    );
    
    
    
    // jsx:
    /* <Panel> */
    return React.cloneElement<GenericProps<TElement>>(panelComponent,
        // props:
        {
            // other props:
            ...restGenericProps,
            ...panelComponent.props, // overwrites restGenericProps (if any conflics)
            
            
            
            // semantics:
            semanticTag       : panelComponent.props.semanticTag        ?? props.semanticTag        ?? '',
            semanticRole      : panelComponent.props.semanticRole       ?? props.semanticRole       ?? 'tabpanel',
            
            
            
            // classes:
            classes           : classes,
            stateClasses      : stateClasses,
        },
        
        
        
        // children:
        panelComponent.props.children ?? children,
    );
};
export {
    TabPanel,
    TabPanel as default,
}



export interface TabPanelComponentProps<TElement extends Element = HTMLElement, TTabExpandedChangeEvent extends TabExpandedChangeEvent = TabExpandedChangeEvent>
{
    // components:
    tabPanelComponent ?: React.ReactComponentElement<any, TabPanelProps<TElement, TTabExpandedChangeEvent>>
}
