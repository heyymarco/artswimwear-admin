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
import {
    // hooks:
    useTabState,
}                           from './states/tabState'
import type {
    // react components:
    TabPanelProps,
}                           from './TabPanel'



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
    label ?: string
}
const TabHeader = <TElement extends Element = HTMLElement, TValue extends any = string>(props: TabHeaderProps<TElement, TValue>): JSX.Element|null => {
    // rest props:
    const {
        // accessibilities:
        label,
        
        
        
        // components:
        listComponent     = (<List<TElement>    /> as React.ReactComponentElement<any, ListProps<TElement>    >),
        listItemComponent = (<ListItem<Element> /> as React.ReactComponentElement<any, ListItemProps<Element> >),
    ...restListProps} = props;
    
    
    
    // states:
    const {
        // values:
        options,
        value,
        onChange,
    } = useTabState<TValue>();
    
    
    
    // jsx:
    /* <List> */
    return React.cloneElement<ListProps<TElement>>(listComponent,
        // props:
        {
            // other props:
            ...restListProps,
            ...listComponent.props, // overwrites restListProps (if any conflics)
            
            
            
            // semantics:
            semanticTag  : listComponent.props.semanticTag   ?? props.semanticTag   ?? '',
            semanticRole : listComponent.props.semanticRole  ?? props.semanticRole  ?? 'tablist',
            'aria-label' : listComponent.props['aria-label'] ?? props['aria-label'] ?? label,
            
            
            // variants:
            listStyle    : listComponent.props.listStyle     ?? props.listStyle     ?? 'tab',
            orientation  : listComponent.props.orientation   ?? props.orientation   ?? 'inline',
            
            
            
            // behaviors:
            actionCtrl   : listComponent.props.actionCtrl    ?? props.actionCtrl    ?? true,
        },
        
        
        
        // children:
        listComponent.props.children ?? React.Children.map(options, (option) => {
            // conditions:
            if (!React.isValidElement<TabPanelProps<Element, TValue>>(option)) return option;
            
            
            
            // fn props:
            const {props: {label: optionLabel, value: selectedValue}} = option;
            const isActive = Object.is(value, selectedValue);
            
            
            
            // jsx:
            /* <ListItem<Element> > */
            return React.cloneElement<ListItemProps<Element>>(listItemComponent,
                // props:
                {
                    // identifiers:
                 // id              : collapsibleId,
                    
                    
                    
                    // semantics:
                    semanticTag     : listItemComponent.props.semanticTag      ?? '',
                    semanticRole    : listItemComponent.props.semanticRole     ?? 'tab',
                    'aria-selected' : listItemComponent.props['aria-selected'] ?? isActive,
                 // 'aria-controls' : listItemComponent.props['aria-controls'] ?? collapsibleId,
                    
                    
                    
                    // accessibilities:
                    active          : listItemComponent.props.active           ?? isActive,
                    tabIndex        : listItemComponent.props.tabIndex         ?? (isActive ? 0 : -1),
                    
                    
                    
                    // handlers:
                    onClick         : () => onChange?.(selectedValue),
                },
                
                
                
                // children:
                listItemComponent.props.children ?? ((optionLabel !== true) && optionLabel) ?? `${selectedValue}`,
            );
        })
    );
};
export {
    TabHeader,
    TabHeader as default,
}
