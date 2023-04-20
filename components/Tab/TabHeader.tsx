// react:
import {
    // react:
    default as React,
}                           from 'react'

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
    // types:
    EditorChangeEventHandler,
}                           from '@/components/editors/Editor'
import type {
    // react components:
    TabOptionProps,
}                           from './TabOption'



export interface TabHeaderProps<TElement extends Element = HTMLElement, TValue extends any = string>
    extends
        // bases:
        Omit<ListProps<TElement>,
            // values:
            |'defaultValue'            // converted to TValue
            |'value'                   // converted to TValue
            |'onChange'                // converted to TValue
            
            // children:
            |'children'                // replaced `children` with `options`
            |'dangerouslySetInnerHTML' // not supported
        >,
        
        // components:
        Omit<ListComponentProps<TElement>,
            // we don't need these extra properties because the <TabHeader> is sub <List>
            |'listRef'
            |'listOrientation'
            |'listStyle'
            
            
            
            // children:
            |'listItems' // replaced `listItems` with `options.label`
        >,
        ListItemComponentProps<Element>
{
    // accessibilities:
    label         ?: string
    
    
    
    // values:
    children       : React.ReactNode // required
    value         ?: TValue
    onChange      ?: EditorChangeEventHandler<TValue>
}
const TabHeader = <TElement extends Element = HTMLElement, TValue extends any = string>(props: TabHeaderProps<TElement, TValue>): JSX.Element|null => {
    // rest props:
    const {
        // accessibilities:
        label,
        
        
        
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
            
            
            
            // semantics:
            semanticTag  : props.semanticTag   ?? '',
            semanticRole : props.semanticRole  ?? 'tablist',
            'aria-label' : props['aria-label'] ?? label,
            
            
            // variants:
            listStyle    : props.listStyle     ?? 'tab',
            orientation  : props.orientation   ?? 'inline',
            
            
            
            // behaviors:
            actionCtrl   : props.actionCtrl    ?? true,
        },
        
        
        
        // children:
        React.Children.map(options, (option) => {
            // conditions:
            if (!React.isValidElement<TabOptionProps<Element, TValue>>(option)) return option;
            
            
            
            // fn props:
            const {props: {label: optionLabel, value: optionValue}} = option;
            const isActive = Object.is(value, optionValue);
            
            
            
            // jsx:
            /* <ListItem<Element> > */
            return React.cloneElement<ListItemProps<Element>>(listItemComponent,
                // props:
                {
                    // accessibilities:
                    active  : listItemComponent.props.active ?? isActive,
                    
                    
                    
                    // handlers:
                    onClick : () => onChange?.(optionValue),
                },
                
                
                
                // children:
                listItemComponent.props.children ?? ((optionLabel !== true) && optionLabel) ?? `${optionValue}`,
            );
        })
    );
};
export {
    TabHeader,
    TabHeader as default,
}
