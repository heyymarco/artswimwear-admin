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
    BasicProps,
    Content,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internals:
import type {
    // react components:
    TabOptionProps,
}                           from './TabOption'



export interface TabBodyProps<TElement extends Element = HTMLElement, TValue extends any = string>
    extends
        // bases:
        Omit<BasicProps<TElement>,
            // values:
            |'defaultValue' // converted to TValue
            |'value'        // converted to TValue
            |'onChange'     // converted to TValue
            
            // children:
            |'children'     // replaced `children` with `options.content`
        >
{
    // values:
    children      : React.ReactNode // required
    value        ?: TValue
}
const TabBody = <TElement extends Element = HTMLElement, TValue extends any = string>(props: TabBodyProps<TElement, TValue>): JSX.Element|null => {
    // rest props:
    const {
        // values:
        children : options,
        value,
    ...restContentProps} = props;
    
    
    
    // classes:
    const classes = useMergeClasses(
        // preserves the original `classes`:
        props.classes,
        
        
        
        // classes:
        'tabBody',
    );
    
    
    
    // jsx:
    return (
        <Content<TElement>
            // other props:
            {...restContentProps}
            
            
            
            // semantics:
            aria-selected={props['aria-selected'] ?? undefined}
            
            
            
            // variants:
         // outlined={props.outlined ?? false} // kill outlined variant // to appear as *selected*, so it *looks* the same as *tab*
            mild={props.mild ?? false}         // kill mild     variant // to appear as *selected*, so it *looks* the same as *tab*
            
            
            
            // classes:
            classes={classes}
        >
            {React.Children.map(options, (option) => {
                // conditions:
                if (!React.isValidElement<TabOptionProps<TElement, TValue>>(option)) return option;
                
                
                
                // fn props:
                const {props: {value: optionValue}} = option;
                const isActive = Object.is(value, optionValue);
                
                
                
                // jsx:
                if (!isActive) return option;
                return React.cloneElement<TabOptionProps<TElement, TValue>>(option,
                    // props:
                    {
                        expanded: true,
                    },
                );
            })}
        </Content>
    );
};
export {
    TabBody,
    TabBody as default,
}
