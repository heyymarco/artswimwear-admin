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
            |'defaultValue'            // converted to TValue
            |'value'                   // converted to TValue
            |'onChange'                // converted to TValue
            
            // children:
            |'children'                // replaced `children` with `options`
            |'dangerouslySetInnerHTML' // not supported
        >
{
    // values:
    children       : React.ReactNode // required
    value         ?: TValue
    
    
    
    // components:
    bodyComponent ?: React.ReactComponentElement<any, BasicProps<TElement>>
}
const TabBody = <TElement extends Element = HTMLElement, TValue extends any = string>(props: TabBodyProps<TElement, TValue>): JSX.Element|null => {
    // rest props:
    const {
        // values:
        children : options,
        value,
        
        
        
        // components:
        bodyComponent = (<Content<TElement> /> as React.ReactComponentElement<any, BasicProps<TElement>>),
    ...restBasicProps} = props;
    
    
    
    // classes:
    const classes = useMergeClasses(
        // preserves the original `classes` from `bodyComponent`:
        bodyComponent.props.classes,
        
        
        
        // preserves the original `classes` from `props`:
        props.classes,
        
        
        
        // classes:
        'tabBody',
    );
    
    
    
    // jsx:
    /* <TabBody> */
    return React.cloneElement<BasicProps<TElement>>(bodyComponent,
        // props:
        {
            // other props:
            ...restBasicProps,
            ...bodyComponent.props, // overwrites restBasicProps (if any conflics)
            
            
            
            // semantics:
            'aria-selected' : bodyComponent.props['aria-selected'] ?? props['aria-selected'] ?? undefined,
            
            
            
            // variants:
         // outlined        : bodyComponent.props.outlined         ?? props.outlined         ?? false, // kill outlined variant // to appear as *selected*, so it *looks* the same as *tab*
            mild            : bodyComponent.props.mild             ?? props.mild             ?? false, // kill mild     variant // to appear as *selected*, so it *looks* the same as *tab*
            
            
            
            // classes:
            classes         : classes,
        },
        
        
        
        // children:
        bodyComponent.props.children ?? React.Children.map(options, (option) => {
            // conditions:
            if (!React.isValidElement<TabOptionProps<Element, TValue>>(option)) return option;
            
            
            
            // fn props:
            const {props: {value: optionValue}} = option;
            const isActive = Object.is(value, optionValue);
            
            
            
            // jsx:
            if (!isActive) return option;
            return React.cloneElement<TabOptionProps<Element, TValue>>(option,
                // props:
                {
                    expanded : option.props.expanded ?? true,
                },
            );
        })
    );
};
export {
    TabBody,
    TabBody as default,
}
