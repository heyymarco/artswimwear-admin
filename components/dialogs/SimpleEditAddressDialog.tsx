'use client'

import { useEvent } from '@reusable-ui/core'

import { InitialValueEventHandler, UpdateModelEventHandler, SimpleEditDialogProps, SimpleEditDialog } from '@/components/dialogs/SimpleEditDialog'
import { OrderDetail, useUpdateOrder } from '@/store/features/api/apiSlice'
import { emptyAddressValue, type AddressValue } from '../editors/AddressEditor/AddressEditor';



// react components:
export interface SimpleEditAddressDialogProps
    extends
        Omit<SimpleEditDialogProps<AddressValue, OrderDetail, 'shippingAddress'|'billingAddress'>,
            // states:
            |'isLoading'
            
            
            
            // data:
            |'initialValue'
            
            
            
            // handlers:
            |'onUpdateModel'
        >
{
}
export const SimpleEditAddressDialog = (props: SimpleEditAddressDialogProps) => {
    // stores:
    const [updateOrder, {isLoading}] = useUpdateOrder();
    
    
    
    // handlers:
    const handleInitialValue = useEvent<InitialValueEventHandler<AddressValue, OrderDetail, 'shippingAddress'|'billingAddress'>>((edit, model) => {
        return model[edit] ?? emptyAddressValue;
    });
    const handleUpdateModel  = useEvent<UpdateModelEventHandler<AddressValue, OrderDetail, 'shippingAddress'|'billingAddress'>>(async (value, edit, model) => {
        await updateOrder({
            id     : model.id,
            
            [edit] : value,
        }).unwrap();
    });
    
    
    
    // jsx:
    return (
        <SimpleEditDialog<AddressValue, OrderDetail, 'shippingAddress'|'billingAddress'>
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