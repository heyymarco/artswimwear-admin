'use client'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// internal components:
import {
    InitialValueEventHandler,
    UpdateModelEventHandler,
    ImplementedSimpleEditDialogProps,
    SimpleEditDialog,
}                           from '@/components/dialogs/SimpleEditDialog'

// stores:
import {
    // types:
    OrderDetail,
    
    
    
    // hooks:
    useUpdateOrder,
}                           from '@/store/features/api/apiSlice'



// react components:
export interface SimpleEditCustomerDialogProps<TValue extends any>
    extends
        ImplementedSimpleEditDialogProps<TValue, OrderDetail, keyof NonNullable<OrderDetail['customer']>>
{
}
export const SimpleEditCustomerDialog = <TValue extends any>(props: SimpleEditCustomerDialogProps<TValue>) => {
    // stores:
    const [updateOrder, {isLoading}] = useUpdateOrder();
    
    
    
    // handlers:
    const handleInitialValue = useEvent<InitialValueEventHandler<TValue, OrderDetail, keyof NonNullable<OrderDetail['customer']>>>((edit, model) => {
        return model.customer?.[edit] as TValue;
    });
    const handleUpdate       = useEvent<UpdateModelEventHandler<TValue, OrderDetail, keyof NonNullable<OrderDetail['customer']>>>(async (value, edit, model) => {
        await updateOrder({
            id         : model.id,
            
            customer   : {
                [edit] : value,
            } as any,
        }).unwrap();
    });
    
    
    
    // jsx:
    return (
        <SimpleEditDialog<TValue, OrderDetail, keyof NonNullable<OrderDetail['customer']>>
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