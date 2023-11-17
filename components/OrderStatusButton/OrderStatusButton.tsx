'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // simple-components:
    ButtonIconProps,
    ButtonIcon,
    
    
    
    // layout-components:
    ListItem,
    
    
    
    // menu-components:
    DropdownListButton,
    
    
    
    // composite-components:
    GroupProps,
    Group,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    orderStatusValues,
    orderStatusText,
    orderStatusTextNext,
}                           from '@/components/OrderStatusBadge'

// models:
import type {
    OrderStatus,
}                           from '@prisma/client'



// react components:
export interface OrderStatusButtonProps
    extends
        // bases:
        Omit<ButtonIconProps,
            // variants:
            |'size' // the Group doesn't support size of: 'xs' & 'xl'
        >,
        Pick<GroupProps,
            // variants:
            |'size' // use standard sizes: 'sm', 'md', 'lg'
        >
{
    // data:
    orderStatus  : OrderStatus
}
const OrderStatusButton = (props: OrderStatusButtonProps): JSX.Element|null => {
    // rest props:
    const {
        // data:
        orderStatus,
        
        
        
        // variants:
        size,
        theme,
        gradient,
        outlined,
        mild,
        
        
        
        // children:
        children,
    ...restButtonIconProps} = props;
    
    
    
    // jsx:
    return (
        <Group
            // variants:
            size={size}
            theme={theme}
            gradient={gradient}
            outlined={outlined}
            mild={mild}
        >
            <ButtonIcon
                // other props:
                {...restButtonIconProps}
                
                
                
                // appearances:
                icon='print'
            >
                {children ?? <>
                    Print and Mark as {orderStatusTextNext(orderStatus)}
                </>}
            </ButtonIcon>
            <DropdownListButton
                // variants:
                theme='secondary'
                
                
                
                // classes:
                className='solid'
                
                
                
                // floatable:
                floatingPlacement='bottom-end'
            >
                {orderStatusValues.map((orderStatusValue, listItemIndex) =>
                    <ListItem
                        // identifiers:
                        key={listItemIndex}
                    >
                        Mark as {orderStatusText(orderStatusValue)}
                    </ListItem>
                )}
            </DropdownListButton>
        </Group>
    );
};
export {
    OrderStatusButton,
    OrderStatusButton as default,
}
