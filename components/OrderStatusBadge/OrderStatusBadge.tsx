'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    Icon,
    ButtonIcon,
    
    
    
    // status-components:
    BadgeProps,
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
        Omit<BadgeProps<HTMLButtonElement>,
            // handlers:
            |'onClick' // overriden
        >
{
    // data:
    orderStatus  : OrderStatus
    paymentType ?: PaymentType
    
    
    
    // handlers:
    onClick      : (params: { orderStatus: OrderStatus, isPaid: boolean }) => void
}
const OrderStatusBadge = (props: OrderStatusBadgeProps): JSX.Element|null => {
    // rest props:
    const {
        // data:
        orderStatus,
        paymentType,
        
        
        
        // children:
        children,
        
        
        
        // handlers:
        onClick,
    ...restBadgeProps} = props;
    const preferedTheme = orderStatusTheme(orderStatus, paymentType);
    const hasAlternateTheme = ((preferedTheme === 'warning') || (preferedTheme === 'secondary'));
    
    
    
    // handlers:
    const handleClick = useEvent(() => {
        onClick?.({
            orderStatus,
            isPaid : (paymentType !== 'MANUAL'),
        });
    });
    
    
    
    // jsx:
    return (
        <ButtonIcon
            // other props:
            {...restBadgeProps}
            
            
            
            // variants:
            size={props.size ?? 'sm'}
            theme={props.theme ?? preferedTheme}
            
            
            
            // components:
            iconComponent={
                <Icon
                    // appearances:
                    icon={orderStatusIcon(orderStatus, paymentType)}
                    
                    
                    
                    // variants:
                    size='sm'
                    theme={hasAlternateTheme ? 'dark' : preferedTheme}
                    mild={hasAlternateTheme ? true : undefined}
                />
            }
            
            
            
            // handlers:
            onClick={handleClick}
        >
            {orderStatusText(orderStatus, paymentType)}
        </ButtonIcon>
    );
};
export {
    OrderStatusBadge,
    OrderStatusBadge as default,
}
