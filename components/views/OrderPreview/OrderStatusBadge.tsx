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
    PaymentType,
    OrderStatus,
}                           from '@prisma/client'



// utilities:
export const orderStatusTheme = (orderStatus : OrderStatus, paymentType?: PaymentType): ThemeName => {
    switch (orderStatus) {
        case 'NEW_ORDER':
            if ((paymentType !== undefined) && (paymentType === 'MANUAL')) return 'secondary';
            return 'danger';
        case 'COMPLETED': return 'success';
        default         : return 'warning';
    } // switch
};
export const orderStatusText = (orderStatus : OrderStatus, paymentType?: PaymentType): ThemeName => {
    switch (orderStatus) {
        case 'NEW_ORDER':
            if ((paymentType !== undefined) && (paymentType === 'MANUAL')) return 'Waiting for Payment';
            return 'New Order';
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
