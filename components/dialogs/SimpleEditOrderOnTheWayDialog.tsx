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
        ImplementedSimpleEditDialogProps<OrderOnTheWayValue, OrderDetailWithOptions, 'shippingNumber'>
{
}
export const SimpleEditOrderOnTheWayDialog = (props: SimpleEditOrderOnTheWayDialogProps) => {
    // stores:
    const [updateOrder, {isLoading}] = useUpdateOrder();
    
    
    
    // handlers:
    const handleInitialValue = useEvent<InitialValueHandler<OrderOnTheWayValue, OrderDetailWithOptions, 'shippingNumber'>>((edit, model) => {
        return {
            shippingNumber : model[edit],
        };
    });
    const handleUpdate       = useEvent<UpdateHandler<OrderOnTheWayValue, OrderDetailWithOptions, 'shippingNumber'>>(async (value, edit, model) => {
        const {
            sendConfirmationEmail = true,
            shippingNumber,
        ...restValue} = value;
        
        await updateOrder({
            id          : model.id,
            
            orderStatus : 'ON_THE_WAY',
            ...{
                // original:
                ...restValue,
                [edit] : shippingNumber?.trim() || null, // normalize to null if empty_string or only_spaces
            },
            
            //@ts-ignore
            sendConfirmationEmail,
        }).unwrap();
    });
    
    
    
    // jsx:
    return (
        <SimpleEditDialog<OrderOnTheWayValue, OrderDetailWithOptions, 'shippingNumber'>
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
