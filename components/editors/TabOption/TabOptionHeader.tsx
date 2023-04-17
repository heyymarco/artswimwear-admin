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
    // types:
    TabOptionItem,
}                           from './types'



export interface TabOptionHeaderProps<TElement extends Element = HTMLElement, TValue extends any = string>
    extends
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
    options       : TabOptionItem<TValue>[] // required
    value        ?: TValue
    onChange     ?: EditorChangeEventHandler<TValue>
}
const TabOptionHeader = <TElement extends Element = HTMLElement, TValue extends any = string>(props: TabOptionHeaderProps<TElement, TValue>): JSX.Element|null => {
    // rest props:
    const {
        // values:
        options,
        value,
        onChange,
    ...restListProps} = props;
    
    
    
    // jsx:
    return (
        <List
            // other props:
            {...restListProps}
            
            
            
            // variants:
            listStyle={props.listStyle ?? 'tab'}
            orientation={props.orientation ?? 'inline'}
            
            
            
            // behaviors:
            actionCtrl={props.actionCtrl ?? true}
        >
            {options.map(({value: optionValue, label: optionLabel}) =>
                <ListItem key={`${optionValue}`}
                    // accessibilities:
                    active={Object.is(value, optionValue)}
                    
                    
                    
                    // handlers:
                    onClick={() => onChange?.(optionValue)}
                >
                    {((optionLabel !== true) && optionLabel) ?? `${optionValue}`}
                </ListItem>
            )}
        </List>
    );
};
export {
    TabOptionHeader,
    TabOptionHeader as default,
}
