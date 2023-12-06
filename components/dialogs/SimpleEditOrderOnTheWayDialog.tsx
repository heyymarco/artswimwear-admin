'use client'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// internal components:
import {
    InitialValueHandler,
    UpdateHandler,
    ImplementedSimpleEditDialogProps,
    SimpleEditDialog,
}                           from '@/components/dialogs/SimpleEditDialog'
import type {
    OrderOnTheWayValue,
}                           from '@/components/editors/OrderOnTheWayEditor'

// stores:
import {
    // types:
    OrderDetailWithOptions,
    
    
    
    // hooks:
    useUpdateOrder,
}                           from '@/store/features/api/apiSlice'



// react components:
export interface SimpleEditOrderOnTheWayDialogProps
    extends
        ImplementedSimpleEditDialogProps<OrderOnTheWayValue, OrderDetailWithOptions, 'shippingTracking'>
{
}
export const SimpleEditOrderOnTheWayDialog = (props: SimpleEditOrderOnTheWayDialogProps) => {
    // stores:
    const [updateOrder, {isLoading}] = useUpdateOrder();
    
    
    
    // handlers:
    const handleInitialValue = useEvent<InitialValueHandler<OrderOnTheWayValue, OrderDetailWithOptions, 'shippingTracking'>>((edit, model) => {
        const value = model[edit];
        return {
            ...value,
            
            shippingCarrier       : value?.shippingCarrier?.trim() || null, // normalize to null if empty_string or only_spaces
            shippingNumber        : value?.shippingNumber?.trim()  || null, // normalize to null if empty_string or only_spaces
            sendConfirmationEmail : true,
        };
    });
    const handleUpdate       = useEvent<UpdateHandler<OrderOnTheWayValue, OrderDetailWithOptions, 'shippingTracking'>>(async (value, edit, model) => {
        const {
            sendConfirmationEmail = true,
        ...restValue} = value;
        
        await updateOrder({
            id          : model.id,
            
            orderStatus : 'ON_THE_WAY',
            [edit] : {
                // original:
                ...restValue,
                shippingCarrier : restValue.shippingCarrier?.trim() || null, // normalize to null if empty_string or only_spaces
                shippingNumber  : restValue.shippingNumber?.trim()  || null, // normalize to null if empty_string or only_spaces
            },
            
            //@ts-ignore
            sendConfirmationEmail,
        }).unwrap();
    });
    
    
    
    // jsx:
    return (
        <SimpleEditDialog<OrderOnTheWayValue, OrderDetailWithOptions, 'shippingTracking'>
            // other props:
            {...props}
            
            
            
            // states:
            isLoading={isLoading}
            
            
            
            // data:
            initialValue={handleInitialValue}
            
            
            
            // handlers:
            onUpdate={handleUpdate}
        />
    );
};
