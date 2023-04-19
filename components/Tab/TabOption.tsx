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
    label    ?: React.ReactNode
    
    
    
    // values:
    value     : TValue
    
    
    
    // states:
    expanded ?: boolean
    
    
    
    // children:
    children ?: React.ReactNode
    
    
    
    // components:
    contentComponent ?: React.ReactComponentElement<any, GenericProps<TElement>>
}
const TabOption = <TElement extends Element = HTMLElement, TValue extends any = string>(props: TabOptionProps<TElement, TValue>): JSX.Element|null => {
    // rest props:
    const {
        // accessibilities:
        label : _label, // not used here, used by <TabHeader>|<TabBody>
        
        
        
        // values:
        value : _value, // not used here, used by <TabHeader>|<TabBody>
        
        
        
        // states:
        expanded = false,
        
        
        
        // components:
        contentComponent = (<Generic<TElement> /> as React.ReactComponentElement<any, GenericProps<TElement>>),
        
        
        
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
    /* <Content> */
    return React.cloneElement<GenericProps<TElement>>(contentComponent,
        // props:
        {
            // other props:
            ...restGenericProps,
            
            
            
            // semantics:
            'aria-selected' : props['aria-selected'] ?? expanded,
            
            
            
            // classes:
            classes         : classes,
            stateClasses    : stateClasses,
        },
        
        
        
        // children:
        children,
    );
};
export {
    TabOption,
    TabOption as default,
}
