// react:
import {
    // react:
    default as React,
}                           from 'react'

// internals:
import type {
    // types:
    EditorChangeEventHandler,
}                           from '@/components/editors/Editor'

// reusable-ui components:
import {
    // react components:
    ListProps,
    List,
    ListItem,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internals:
import type {
    // react components:
    TabOptionProps,
}                           from './TabOption'



export interface TabHeaderProps<TElement extends Element = HTMLElement, TValue extends any = string>
    extends
        // bases:
        Omit<ListProps<TElement>,
            // values:
            |'defaultValue' // converted to TValue
            |'value'        // converted to TValue
            |'onChange'     // converted to TValue
            
            // children:
            |'children'     // replaced `children` with `options.label`
        >
{
    // values:
    children      : React.ReactNode // required
    value        ?: TValue
    onChange     ?: EditorChangeEventHandler<TValue>
}
const TabHeader = <TElement extends Element = HTMLElement, TValue extends any = string>(props: TabHeaderProps<TElement, TValue>): JSX.Element|null => {
    // rest props:
    const {
        // values:
        children : options,
        value,
        onChange,
    ...restListProps} = props;
    
    
    
    // jsx:
    return (
        <List<TElement>
            // other props:
            {...restListProps}
            
            
            
            // variants:
            listStyle={props.listStyle ?? 'tab'}
            orientation={props.orientation ?? 'inline'}
            
            
            
            // behaviors:
            actionCtrl={props.actionCtrl ?? true}
        >
            {React.Children.map(options, (option) => {
                // conditions:
                if (!React.isValidElement<TabOptionProps<TElement, TValue>>(option)) return option;
                
                
                
                // fn props:
                const {props: {label: optionLabel, value: optionValue}} = option;
                const isActive = Object.is(value, optionValue);
                
                
                
                // jsx:
                return (
                    <ListItem key={`${optionValue}`}
                        // accessibilities:
                        active={isActive}
                        
                        
                        
                        // handlers:
                        onClick={() => onChange?.(optionValue)}
                    >
                        {((optionLabel !== true) && optionLabel) ?? `${optionValue}`}
                    </ListItem>
                );
            })}
        </List>
    );
};
export {
    TabHeader,
    TabHeader as default,
}
