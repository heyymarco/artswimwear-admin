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
    problemOrderStatusValues,
    orderStatusText,
}                           from '@/components/OrderStatusBadge'

// models:
import type {
    OrderDetail,
}                           from '@/models'



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
    const orderStatus         = model?.orderStatus ?? 'NEW_ORDER';
    const orderStatusIndex    = orderStatusValues.findIndex((value) => (value === orderStatus));
    
    const isCanceled          = (orderStatus === 'CANCELED');
    const isExpired           = (orderStatus === 'EXPIRED');
    const isCanceledOrExpired = isCanceled || isExpired;
    
    
    
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
                (
                    !problemOrderStatusValues.includes(orderStatusOption) // must be a regular status progresses: 'NEW_ORDER'|'PROCESSED'|'ON_THE_WAY'|'COMPLETED'
                    ||
                    (orderStatusOption === orderStatus)                   // must be a special status progresses: 'CANCELED'|'EXPIRED'|'IN_TROUBLE' that MATCHES currentStatus
                )
                &&
                (
                    !isCanceledOrExpired                // the order is NOT 'CANCELED'|'EXPIRED'
                    ||
                    (listItemIndex <= orderStatusIndex) // if 'CANCELED'|'EXPIRED' => no need to render the next steps
                )
                &&
                <ListItem
                    // identifiers:
                    key={listItemIndex}
                    
                    
                    
                    // variants:
                    size={props.size ?? 'sm'}
                    theme={problemOrderStatusValues.includes(orderStatusOption) ? 'danger' : undefined}
                    
                    
                    
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
