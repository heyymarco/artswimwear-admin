'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import type {
    // color options of UI:
    ThemeName,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // status-components:
    BadgeProps,
    Badge,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// models:
import type {
    OrderStatus,
}                           from '@prisma/client'



// utilities:
export const orderStatusTheme = (orderStatus : OrderStatus): ThemeName => {
    switch (orderStatus) {
        case 'NEW_ORDER': return 'danger';
        case 'COMPLETED': return 'success';
        default         : return 'warning';
    } // switch
};
export const orderStatusText = (orderStatus : OrderStatus): ThemeName => {
    switch (orderStatus) {
        case 'NEW_ORDER': return 'New Order';
        case 'PROCESSED': return 'Being Processed';
        case 'SHIPPED'  : return 'Shipped';
        case 'ON_HOLD'  : return 'On Hold';
        case 'COMPLETED': return 'Completed';
    } // switch
};



// react components:
export interface OrderStatusBadgeProps
    extends
        // bases:
        BadgeProps
{
    // data:
    orderStatus : OrderStatus
}
const OrderStatusBadge = (props: OrderStatusBadgeProps): JSX.Element|null => {
    // rest props:
    const {
        // data:
        orderStatus,
        
        
        
        // children:
        children,
    ...restBadgeProps} = props;
    
    
    
    // jsx:
    return (
        <Badge
            // other props:
            {...restBadgeProps}
            
            
            
            // variants:
            size={props.size ?? 'sm'}
            theme={props.theme ?? orderStatusTheme(orderStatus)}
        >
            {children ?? orderStatusText(orderStatus)}
        </Badge>
    );
};
export {
    OrderStatusBadge,
    OrderStatusBadge as default,
}
