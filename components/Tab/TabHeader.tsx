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
    
    ListItemProps,
    ListItem,
    
    ListComponentProps,
    ListItemComponentProps,
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
        >,
        
        // components:
        Omit<ListComponentProps<TElement>,
            // we don't need these extra properties because the <Nav> is sub <List>
            |'listRef'
            |'listOrientation'
            |'listStyle'
            
            
            
            // children:
            |'listItems' // replaced `listItems` with `options.label`
        >,
        ListItemComponentProps<Element>
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
        
        
        
        // components:
        listComponent     = (<List<TElement>    /> as React.ReactComponentElement<any, ListProps<TElement>    >),
        listItemComponent = (<ListItem<Element> /> as React.ReactComponentElement<any, ListItemProps<Element> >),
    ...restListProps} = props;
    
    
    
    // jsx:
    /* <List> */
    return React.cloneElement<ListProps<TElement>>(listComponent,
        // props:
        {
            // other props:
            ...restListProps,
            
            
            
            // variants:
            listStyle   : props.listStyle   ?? 'tab',
            orientation : props.orientation ?? 'inline',
            
            
            
            // behaviors:
            actionCtrl  : props.actionCtrl ?? true,
        },
        
        
        
        // children:
        React.Children.map(options, (option) => {
            // conditions:
            if (!React.isValidElement<TabOptionProps<TElement, TValue>>(option)) return option;
            
            
            
            // fn props:
            const {props: {label: optionLabel, value: optionValue}} = option;
            const isActive = Object.is(value, optionValue);
            
            
            
            // jsx:
            /* <ListItem> */
            return React.cloneElement<ListItemProps<Element>>(listItemComponent,
                // props:
                {
                    // accessibilities:
                    active  : isActive,
                    
                    
                    
                    // handlers:
                    onClick : () => onChange?.(optionValue),
                },
                
                
                
                // children:
                ((optionLabel !== true) && optionLabel) ?? `${optionValue}`,
            );
        })
    );
};
export {
    TabHeader,
    TabHeader as default,
}
