'use client'

import { useEvent } from '@reusable-ui/core'

import { InitialValueEventHandler, UpdateModelEventHandler, SimpleEditDialogProps, SimpleEditDialog } from '@/components/dialogs/SimpleEditDialog'
import { OrderDetail, useUpdateOrder } from '@/store/features/api/apiSlice'



// react components:
export interface SimpleEditAddressDialogProps<TValue extends any>
    extends
        Omit<SimpleEditDialogProps<TValue, OrderDetail, 'shippingAddress'|'billingAddress'>,
            // states:
            |'isLoading'
            
            
            
            // data:
            |'initialValue'
            
            
            
            // handlers:
            |'onUpdateModel'
        >
{
}
export const SimpleEditAddressDialog = <TValue extends any>(props: SimpleEditAddressDialogProps<TValue>) => {
    // stores:
    const [updateOrder, {isLoading}] = useUpdateOrder();
    
    
    
    // handlers:
    const handleInitialValue = useEvent<InitialValueEventHandler<TValue, OrderDetail, 'shippingAddress'|'billingAddress'>>((edit, model) => {
        return model[edit] as TValue;
    });
    const handleUpdateModel  = useEvent<UpdateModelEventHandler<TValue, OrderDetail, 'shippingAddress'|'billingAddress'>>(async (value, edit, model) => {
        await updateOrder({
            _id    : model._id,
            
            [edit] : value,
        }).unwrap();
    });
    
    
    
    // jsx:
    return (
        <SimpleEditDialog<TValue, OrderDetail, 'shippingAddress'|'billingAddress'>
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