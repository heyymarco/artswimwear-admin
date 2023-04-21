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
    // states:
    TabExpandedChangeEvent,
    useTabState,
}                           from './states/tabState'
import type {
    // react components:
    TabPanelProps,
}                           from './TabPanel'



export interface TabHeaderProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<ListProps<TElement>,
            // values:
            |'defaultValue'            // not supported
            |'value'                   // not supported
            |'onChange'                // not supported
            
            // formats:
            |'autoCapitalize'          // not supported
            
            // children:
            |'children'                // replaced `children` with `tabPanels`
            |'dangerouslySetInnerHTML' // not supported
        >,
        
        // components:
        Omit<ListComponentProps<TElement>,
            // we don't need these extra properties because the <TabHeader> is sub <List>
            |'listRef'
            |'listOrientation'
            |'listStyle'
            
            
            
            // children:
            |'listItems' // replaced `listItems` with `tabPanels.label`
        >,
        ListItemComponentProps<Element>
{
    // accessibilities:
    label ?: string
}
const TabHeader = <TElement extends Element = HTMLElement>(props: TabHeaderProps<TElement>): JSX.Element|null => {
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
        tabPanels,
        expandedTabIndex,
        triggerExpandedChange,
    } = useTabState();
    
    
    
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
        listComponent.props.children ?? React.Children.map(tabPanels, (tabPanel, index) => {
            // conditions:
            if (!React.isValidElement<TabPanelProps<Element, TabExpandedChangeEvent>>(tabPanel)) return tabPanel;
            
            
            
            // fn props:
            const {props: {label: tabPanelLabel}} = tabPanel;
            const isActive = (expandedTabIndex === index);
            
            
            
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
                    onClick         : () => triggerExpandedChange(index),
                },
                
                
                
                // children:
                listItemComponent.props.children ?? tabPanelLabel,
            );
        })
    );
};
export {
    TabHeader,
    TabHeader as default,
}
