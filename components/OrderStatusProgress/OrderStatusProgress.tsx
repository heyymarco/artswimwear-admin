'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    useMountedFlag,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    Icon,
    ButtonIconProps,
    ButtonIcon,
    
    
    
    // layout-components:
    ListItem,
    ListProps,
    List,
    
    
    
    // menu-components:
    DropdownListButton,
    
    
    
    // composite-components:
    GroupProps,
    Group,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    orderStatusValues,
    orderStatusTheme,
    orderStatusText,
    orderStatusIcon,
    orderStatusNext,
    orderStatusTextNext,
}                           from '@/components/OrderStatusBadge'
import {
    RadioDecorator,
}                           from '@/components/RadioDecorator'

// stores:
import type {
    // types:
    OrderDetail,
}                           from '@/store/features/api/apiSlice'

// models:
import type {
    OrderStatus,
}                           from '@prisma/client'



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
                ((orderStatusOption !== 'IN_TROUBLE') || (orderStatus === 'IN_TROUBLE'))
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
