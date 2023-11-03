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
    OrderDetail,
    
    
    
    // hooks:
    useUpdateOrder,
}                           from '@/store/features/api/apiSlice'



// react components:
export interface SimpleEditPaymentDialogProps
    extends
        ImplementedSimpleEditDialogProps<PaymentValue, OrderDetail, 'payment'>
{
}
export const SimpleEditPaymentDialog = (props: SimpleEditPaymentDialogProps) => {
    // stores:
    const [updateOrder, {isLoading}] = useUpdateOrder();
    
    
    
    // handlers:
    const handleInitialValue = useEvent<InitialValueHandler<PaymentValue, OrderDetail, 'payment'>>((edit, model) => {
        return model[edit];
    });
    const handleUpdate       = useEvent<UpdateHandler<PaymentValue, OrderDetail, 'payment'>>(async (value, edit, model) => {
        await updateOrder({
            id     : model.id,
            
            [edit] : {
                // original:
                ...value,
                amount : value.amount ?? 0,
                fee    : value.fee    ?? 0,
            },
        }).unwrap();
    });
    
    
    
    // jsx:
    return (
        <SimpleEditDialog<PaymentValue, OrderDetail, 'payment'>
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