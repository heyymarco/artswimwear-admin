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



export interface TabControlOptionProps<TElement extends Element = HTMLElement, TValue extends any = string>
    extends
        // bases:
        GenericProps<TElement>
{
    // accessibilities:
    label    ?: React.ReactNode
    
    
    
    // values:
    value     : TValue
    
    
    
    // states:
    expanded ?: boolean
    
    
    
    // children:
    children ?: React.ReactNode
}
const TabControlOption = <TElement extends Element = HTMLElement, TValue extends any = string>(props: TabControlOptionProps<TElement, TValue>): JSX.Element|null => {
    // rest props:
    const {
        // accessibilities:
        label : _label, // not used here, used by <TabControlHeader>|<TabControlBody>
        
        
        
        // values:
        value : _value, // not used here, used by <TabControlHeader>|<TabControlBody>
        
        
        
        // states:
        expanded = false,
        
        
        
        // children:
        children,
    ...restGenericProps} = props;
    
    
    
    // classes:
    const classes = useMergeClasses(
        // preserves the original `classes`:
        props.classes,
        
        
        
        // classes:
        'tabOption',
    );
    const stateClasses = useMergeClasses(
        // preserves the original `stateClasses`:
        props.stateClasses,
        
        
        
        // states:
        expanded ? 'expanded' : null,
    );
    
    
    
    // jsx:
    return (
        <Generic<TElement>
            // other props:
            {...restGenericProps}
            
            
            
            // semantics:
            aria-selected={props['aria-selected'] ?? expanded}
            
            
            
            // classes:
            classes={classes}
            stateClasses={stateClasses}
        >
            {children}
        </Generic>
    );
};
export {
    TabControlOption,
    TabControlOption as default,
}
