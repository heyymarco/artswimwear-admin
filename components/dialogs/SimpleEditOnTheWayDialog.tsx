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
    OnTheWayValue,
}                           from '@/components/editors/OnTheWayEditor/OnTheWayEditor'

// stores:
import {
    // types:
    OrderDetailWithOptions,
    
    
    
    // hooks:
    useUpdateOrder,
}                           from '@/store/features/api/apiSlice'



// react components:
export interface SimpleEditOnTheWayDialogProps
    extends
        ImplementedSimpleEditDialogProps<OnTheWayValue, OrderDetailWithOptions, 'shippingNumber'>
{
}
export const SimpleEditOnTheWayDialog = (props: SimpleEditOnTheWayDialogProps) => {
    // stores:
    const [updateOrder, {isLoading}] = useUpdateOrder();
    
    
    
    // handlers:
    const handleInitialValue = useEvent<InitialValueHandler<OnTheWayValue, OrderDetailWithOptions, 'shippingNumber'>>((edit, model) => {
        return {
            shippingNumber : model[edit],
        };
    });
    const handleUpdate       = useEvent<UpdateHandler<OnTheWayValue, OrderDetailWithOptions, 'shippingNumber'>>(async (value, edit, model) => {
        const {
            sendConfirmationEmail = true,
            shippingNumber,
        ...restPayment} = value;
        
        await updateOrder({
            id          : model.id,
            
            orderStatus : 'ON_THE_WAY',
            ...{
                // original:
                ...restPayment,
                [edit] : shippingNumber || null,
            },
            
            //@ts-ignore
            sendConfirmationEmail,
        }).unwrap();
    });
    
    
    
    // jsx:
    return (
        <SimpleEditDialog<OnTheWayValue, OrderDetailWithOptions, 'shippingNumber'>
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
