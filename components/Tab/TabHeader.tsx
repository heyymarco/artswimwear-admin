// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // react components:
    ListItemProps,
    ListItem,
    
    ListItemComponentProps,
    
    ListProps,
    List,
    
    ListComponentProps,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internals:
import {
    // states:
    TabExpandedChangeEvent,
    useTabState,
}                           from './states/tabState'
import {
    // react components:
    ListItemWithState,
}                           from './ListItemWithState'
import type {
    // react components:
    TabPanelProps,
}                           from './TabPanel'



// react components:
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
        // data:
        tabPanels,
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
        listComponent.props.children ?? React.Children.map(tabPanels, (tabPanel, tabIndex) => {
            // conditions:
            if (!React.isValidElement<TabPanelProps<Element, TabExpandedChangeEvent>>(tabPanel)) return tabPanel; // not a <TabPanel> => ignore
            
            
            
            // fn props:
            const {props: {label: tabPanelLabel}} = tabPanel;
            
            
            
            // props:
            const listItemComponentProps = {
                // other props:
                ...listItemComponent.props,
                
                
                
                // identifiers:
             // id              : collapsibleId,
                
                
                
                // semantics:
                semanticTag     : listItemComponent.props.semanticTag      ?? '',
                semanticRole    : listItemComponent.props.semanticRole     ?? 'tab',
             // 'aria-controls' : listItemComponent.props['aria-controls'] ?? collapsibleId,
                
                
                
                // children:
                children        : listItemComponent.props.children ?? tabPanelLabel,
            };
            
            
            
            // jsx:
            /* ListItemWithState<Element> */
            return (
                <ListItemWithState<Element, TabExpandedChangeEvent>
                    // other props:
                    {...listItemComponentProps} // steals all listItemComponent's props, so the <Owner> can recognize the <ListItemWithState> as <TheirChild>
                    
                    
                    
                    // positions:
                    tabIndex={tabIndex}
                    
                    
                    
                    // components:
                    listItemComponent={
                        // clone listItemComponent element with (almost) blank props:
                        <listItemComponent.type<Element, TabExpandedChangeEvent>
                            // identifiers:
                            key={listItemComponent.key}
                            
                            
                            
                            //#region restore conflicting props
                            {...{
                                ...(('tabIndex'          in listItemComponentProps) ? { tabIndex          : listItemComponentProps.tabIndex          } : undefined),
                                ...(('listItemComponent' in listItemComponentProps) ? { listItemComponent : listItemComponentProps.listItemComponent } : undefined),
                            }}
                            //#endregion restore conflicting props
                        />
                    }
                />
            );
        })
    );
};
export {
    TabHeader,
    TabHeader as default,
}
