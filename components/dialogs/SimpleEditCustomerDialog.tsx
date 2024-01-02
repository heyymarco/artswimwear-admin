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
        ImplementedSimpleEditDialogProps<TValue, OrderDetail, keyof NonNullable<OrderDetail['guest']>>
{
}
export const SimpleEditCustomerDialog = <TValue extends any>(props: SimpleEditCustomerDialogProps<TValue>) => {
    // stores:
    const [updateOrder, {isLoading}] = useUpdateOrder();
    
    
    
    // handlers:
    const handleInitialValue = useEvent<InitialValueHandler<TValue, OrderDetail, keyof NonNullable<OrderDetail['guest']>>>((edit, model) => {
        return model.guest?.[edit] as TValue;
    });
    const handleUpdate       = useEvent<UpdateHandler<TValue, OrderDetail, keyof NonNullable<OrderDetail['guest']>>>(async (value, edit, model) => {
        await updateOrder({
            id         : model.id,
            
            guest      : {
                [edit] : value,
            } as any,
        }).unwrap();
    });
    
    
    
    // jsx:
    return (
        <SimpleEditDialog<TValue, OrderDetail, keyof NonNullable<OrderDetail['guest']>>
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