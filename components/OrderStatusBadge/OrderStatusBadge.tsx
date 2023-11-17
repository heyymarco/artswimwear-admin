'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // status-components:
    BadgeProps,
    Badge,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// models:
import type {
    PaymentType,
    OrderStatus,
}                           from '@prisma/client'

// utilities:
import {
    orderStatusTheme,
    orderStatusText,
}                           from './utilities'



// react components:
export interface OrderStatusBadgeProps
    extends
        // bases:
        BadgeProps
{
    // data:
    orderStatus  : OrderStatus
    paymentType ?: PaymentType
}
const OrderStatusBadge = (props: OrderStatusBadgeProps): JSX.Element|null => {
    // rest props:
    const {
        // data:
        orderStatus,
        paymentType,
        
        
        
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
            theme={props.theme ?? orderStatusTheme(orderStatus, paymentType)}
        >
            {children ?? orderStatusText(orderStatus, paymentType)}
        </Badge>
    );
};
export {
    OrderStatusBadge,
    OrderStatusBadge as default,
}
