'use client'

import { useEvent } from '@reusable-ui/core'

import { InitialValueEventHandler, UpdateModelEventHandler, SimpleEditDialogProps, SimpleEditDialog } from '@/components/dialogs/SimpleEditDialog'
import { OrderDetail, useUpdateOrder } from '@/store/features/api/apiSlice'



// react components:
export interface SimpleEditCustomerDialogProps<TValue extends any>
    extends
        Omit<SimpleEditDialogProps<TValue, OrderDetail, keyof OrderDetail['customer']>,
            // states:
            |'isLoading'
            
            
            
            // data:
            |'initialValue'
            
            
            
            // handlers:
            |'onUpdateModel'
        >
{
}
export const SimpleEditCustomerDialog = <TValue extends any>(props: SimpleEditCustomerDialogProps<TValue>) => {
    // stores:
    const [updateOrder, {isLoading}] = useUpdateOrder();
    
    
    
    // handlers:
    const handleInitialValue = useEvent<InitialValueEventHandler<TValue, OrderDetail, keyof OrderDetail['customer']>>((edit, model) => {
        return model.customer[edit] as TValue;
    });
    const handleUpdateModel  = useEvent<UpdateModelEventHandler<TValue, OrderDetail, keyof OrderDetail['customer']>>(async (value, edit, model) => {
        await updateOrder({
            _id        : model._id,
            
            customer   : {
                [edit] : value,
            } as any,
        }).unwrap();
    });
    
    
    
    // jsx:
    return (
        <SimpleEditDialog<TValue, OrderDetail, keyof OrderDetail['customer']>
            // other props:
            {...props}
            
            
            
            // states:
            isLoading={isLoading}
            
            
            
            // data:
            initialValue={handleInitialValue}
            
            
            
            // handlers:
            onUpdateModel={handleUpdateModel}
        />
    );
};