// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useMergeClasses,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // react components:
    GenericProps,
    Generic,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components



export interface TabOptionProps<TElement extends Element = HTMLElement, TValue extends any = string>
    extends
        // bases:
        GenericProps<TElement>
{
    // accessibilities:
    label          ?: React.ReactNode
    
    
    
    // values:
    value           : TValue
    
    
    
    // states:
    expanded       ?: boolean
    
    
    
    // components:
    panelComponent ?: React.ReactComponentElement<any, GenericProps<TElement>>
    
    
    
    // children:
    children       ?: React.ReactNode
}
const TabOption = <TElement extends Element = HTMLElement, TValue extends any = string>(props: TabOptionProps<TElement, TValue>): JSX.Element|null => {
    // rest props:
    const {
        // accessibilities:
        label : _label, // not used here, used by <TabHeader>|<TabBody>
        
        
        
        // values:
        value : _value, // not used here, used by <TabHeader>|<TabBody>
        
        
        
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
        'tabOption',
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
         // 'aria-labelledby' : panelComponent.props['aria-labelledby'] ?? props['aria-labelledby'] ?? collapsibleId,
            
            
            
            // classes:
            classes           : classes,
            stateClasses      : stateClasses,
        },
        
        
        
        // children:
        panelComponent.props.children ?? children,
    );
};
export {
    TabOption,
    TabOption as default,
}
