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
import {
    type PaymentType,
    type OrderStatus,
    
    orderStatusTheme,
    orderStatusText,
    orderStatusIcon,
}                           from '@/models'



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
    
    reportedAt  ?: Date|null
    reviewedAt  ?: Date|null
    
    
    
    // handlers:
    onClick     ?: (params: { orderStatus: OrderStatus, isPaid: boolean }) => void
}
const OrderStatusBadge = (props: OrderStatusBadgeProps): JSX.Element|null => {
    // rest props:
    const {
        // data:
        orderStatus,
        paymentType,
        
        reportedAt,
        reviewedAt,
        
        
        
        // children:
        children,
        
        
        
        // handlers:
        onClick,
    ...restBadgeProps} = props;
    const preferredTheme = orderStatusTheme(orderStatus, paymentType, reportedAt, reviewedAt);
    const hasAlternateTheme = ((preferredTheme === 'warning') || (preferredTheme === 'secondary'));
    
    
    
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
            theme={props.theme ?? preferredTheme}
            
            
            
            // components:
            iconComponent={
                <Icon
                    // appearances:
                    icon={orderStatusIcon(orderStatus, paymentType, reportedAt, reviewedAt)}
                    
                    
                    
                    // variants:
                    size='sm'
                    theme={hasAlternateTheme ? 'dark' : preferredTheme}
                    mild={hasAlternateTheme ? true : undefined}
                />
            }
            
            
            
            // handlers:
            onClick={handleClick}
        >
            {orderStatusText(orderStatus, paymentType, reportedAt, reviewedAt)}
        </ButtonIcon>
    );
};
export {
    OrderStatusBadge,
    OrderStatusBadge as default,
}
