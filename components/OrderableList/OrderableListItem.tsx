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
    
    ListSeparatorItemProps,
    ListSeparatorItem,
    
    ListItemComponentProps,
}                           from '@reusable-ui/list'            // represents a series of content



// react components:
export interface OrderableListItemProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        ListItemProps<TElement>,
        
        // components:
        ListItemComponentProps<TElement>
{
}
export const OrderableListItem       = <TElement extends Element = HTMLElement>(props: OrderableListItemProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // components:
        listItemComponent = (<ListItem<TElement> /> as React.ReactComponentElement<any, ListItemProps<TElement>>),
    ...restListItemProps} = props;
    
    
    
    // jsx:
    /* <ListItem> */
    return React.cloneElement<ListItemProps<TElement>>(listItemComponent,
        // props:
        {
            // other props:
            ...restListItemProps,
            ...listItemComponent.props, // overwrites restListItemProps (if any conflics)
        },
        
        
        
        // children:
        listItemComponent.props.children ?? props.children,
    );
};

export {
    ListSeparatorItemProps,
    ListSeparatorItem,
}
