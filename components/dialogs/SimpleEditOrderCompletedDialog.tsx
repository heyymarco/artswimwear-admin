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
    OrderCompletedValue,
}                           from '@/components/editors/OrderCompletedEditor'

// stores:
import {
    // types:
    OrderDetailWithOptions,
    
    
    
    // hooks:
    useUpdateOrder,
}                           from '@/store/features/api/apiSlice'



// react components:
export interface SimpleEditOrderCompletedDialogProps
    extends
        ImplementedSimpleEditDialogProps<OrderCompletedValue, OrderDetailWithOptions, ''>
{
}
export const SimpleEditOrderCompletedDialog = (props: SimpleEditOrderCompletedDialogProps) => {
    // stores:
    const [updateOrder, {isLoading}] = useUpdateOrder();
    
    
    
    // handlers:
    const handleInitialValue = useEvent<InitialValueHandler<OrderCompletedValue, OrderDetailWithOptions, ''>>((edit, model) => {
        return {};
    });
    const handleUpdate       = useEvent<UpdateHandler<OrderCompletedValue, OrderDetailWithOptions, ''>>(async (value, edit, model) => {
        const {
            sendConfirmationEmail = true,
        ...restValue} = value;
        
        await updateOrder({
            id          : model.id,
            
            orderStatus : 'COMPLETED',
            
            // original:
            ...restValue,
            
            //@ts-ignore
            sendConfirmationEmail,
        }).unwrap();
    });
    
    
    
    // jsx:
    return (
        <SimpleEditDialog<OrderCompletedValue, OrderDetailWithOptions, ''>
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
