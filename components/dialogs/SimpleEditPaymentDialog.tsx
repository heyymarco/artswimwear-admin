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
    PaymentValue,
}                           from '@/components/editors/PaymentEditor/PaymentEditor'

// stores:
import {
    // types:
    OrderDetailWithOptions,
    
    
    
    // hooks:
    useUpdateOrder,
}                           from '@/store/features/api/apiSlice'



// react components:
export interface SimpleEditPaymentDialogProps
    extends
        ImplementedSimpleEditDialogProps<PaymentValue, OrderDetailWithOptions, 'payment'>
{
}
export const SimpleEditPaymentDialog = (props: SimpleEditPaymentDialogProps) => {
    // stores:
    const [updateOrder, {isLoading}] = useUpdateOrder();
    
    
    
    // handlers:
    const handleInitialValue = useEvent<InitialValueHandler<PaymentValue, OrderDetailWithOptions, 'payment'>>((edit, model) => {
        return model[edit];
    });
    const handleUpdate       = useEvent<UpdateHandler<PaymentValue, OrderDetailWithOptions, 'payment'>>(async (value, edit, model) => {
        const {
            sendConfirmationEmail = true,
        ...restValue} = value;
        
        await updateOrder({
            id     : model.id,
            
            [edit] : {
                // original:
                ...restValue,
                amount : restValue.amount ?? 0, // normalize to zero if null
                fee    : restValue.fee    ?? 0, // normalize to zero if null
            },
            
            //@ts-ignore
            sendConfirmationEmail,
        }).unwrap();
    });
    
    
    
    // jsx:
    return (
        <SimpleEditDialog<PaymentValue, OrderDetailWithOptions, 'payment'>
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