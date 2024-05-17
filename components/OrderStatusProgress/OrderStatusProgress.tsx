'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // layout-components:
    ListItem,
    ListProps,
    List,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    orderStatusValues,
    orderStatusText,
}                           from '@/components/OrderStatusBadge'

// stores:
import type {
    // types:
    OrderDetail,
}                           from '@/store/features/api/apiSlice'



// react components:
export interface OrderStatusProgressProps
    extends
        // bases:
        ListProps
{
    // data:
    model : OrderDetail|null
}
const OrderStatusProgress = (props: OrderStatusProgressProps): JSX.Element|null => {
    // rest props:
    const {
        // data:
        model,
        
        
        
        // children:
        children,
    ...restListProps} = props;
    const orderStatus      = model?.orderStatus ?? 'NEW_ORDER';
    const orderStatusIndex = orderStatusValues.findIndex((value) => (value === orderStatus));
    
    
    
    // jsx:
    return (
        <List
            // other props:
            {...restListProps}
            
            
            
            // variants:
            size={props.size ?? 'sm'}
            outlined={true}
            mild={false}
            listStyle='breadcrumb'
            orientation='inline'
        >
            {orderStatusValues.map((orderStatusOption, listItemIndex) =>
                ((orderStatusOption !== 'IN_TROUBLE') || (orderStatus === 'IN_TROUBLE')) // hides IN_TROUBLE step except when the current status is IN_TROUBLE
                &&
                <ListItem
                    // identifiers:
                    key={listItemIndex}
                    
                    
                    
                    // variants:
                    size={props.size ?? 'sm'}
                    theme={(orderStatusOption === 'IN_TROUBLE') ? 'danger' : undefined}
                    
                    
                    
                    // states:
                    active={orderStatusValues.findIndex((value) => (value === orderStatusOption)) <= orderStatusIndex}
                >
                    {orderStatusText(orderStatusOption)}
                </ListItem>
            )}
        </List>
    );
};
export {
    OrderStatusProgress,
    OrderStatusProgress as default,
}
