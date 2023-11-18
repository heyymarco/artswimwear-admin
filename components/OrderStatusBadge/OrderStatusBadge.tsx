'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // simple-components:
    Icon,
    
    
    
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
    orderStatusIcon,
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
    const preferedTheme = orderStatusTheme(orderStatus, paymentType);
    const hasAlternateTheme = ((preferedTheme === 'warning') || (preferedTheme === 'secondary'));
    
    
    // jsx:
    return (
        <Badge
            // other props:
            {...restBadgeProps}
            
            
            
            // variants:
            size={props.size ?? 'sm'}
            theme={props.theme ?? preferedTheme}
        >
            {children ?? <>
                <Icon
                    // appearances:
                    icon={orderStatusIcon(orderStatus, paymentType)}
                    
                    
                    
                    // variants:
                    size='sm'
                    theme={hasAlternateTheme ? 'dark' : preferedTheme}
                    mild={hasAlternateTheme ? true : undefined}
                />
                &nbsp;&nbsp;
                {orderStatusText(orderStatus, paymentType)}
            </>}
        </Badge>
    );
};
export {
    OrderStatusBadge,
    OrderStatusBadge as default,
}
