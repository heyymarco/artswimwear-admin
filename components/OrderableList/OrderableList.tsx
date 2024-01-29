// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // variants:
    ListStyle,
    ListVariant,
    
    
    
    // react components:
    ListProps,
    List,
    
    ListComponentProps,
}                           from '@reusable-ui/list'            // represents a series of content



// react components:
export interface OrderableListProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        ListProps<TElement>,
        
        // components:
        Omit<ListComponentProps<TElement>,
            // we don't need these extra properties because the <OrderableList> is sub <List>
            |'listRef'
            |'listOrientation'
            |'listStyle'
            
            
            
            // children:
            |'listItems' // we redefined `children` prop as <ListItem>(s)
        >
{
}
const OrderableList = <TElement extends Element = HTMLElement>(props: OrderableListProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // components:
        listComponent = (<List<TElement> /> as React.ReactComponentElement<any, ListProps<TElement>>),
    ...restListProps} = props;
    
    
    
    // jsx:
    /* <List> */
    return React.cloneElement<ListProps<TElement>>(listComponent,
        // props:
        {
            // other props:
            ...restListProps,
            ...listComponent.props, // overwrites restListProps (if any conflics)
        },
        
        
        
        // children:
        listComponent.props.children ?? props.children,
    );
};
export {
    OrderableList,
    OrderableList as default,
}

export type { ListStyle, ListVariant }
