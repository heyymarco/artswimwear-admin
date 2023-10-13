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
import {
    AddressValue,
    emptyAddressValue,
}                           from '@/components/editors/AddressEditor/AddressEditor'

// stores:
import {
    // types:
    OrderDetail,
    
    
    
    // hooks:
    useUpdateOrder,
}                           from '@/store/features/api/apiSlice'



// react components:
export interface SimpleEditAddressDialogProps
    extends
        ImplementedSimpleEditDialogProps<AddressValue, OrderDetail, 'shippingAddress'|'billingAddress'>
{
}
export const SimpleEditAddressDialog = (props: SimpleEditAddressDialogProps) => {
    // stores:
    const [updateOrder, {isLoading}] = useUpdateOrder();
    
    
    
    // handlers:
    const handleInitialValue = useEvent<InitialValueEventHandler<AddressValue, OrderDetail, 'shippingAddress'|'billingAddress'>>((edit, model) => {
        return model[edit] ?? emptyAddressValue;
    });
    const handleUpdate       = useEvent<UpdateModelEventHandler<AddressValue, OrderDetail, 'shippingAddress'|'billingAddress'>>(async (value, edit, model) => {
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
            onUpdate={handleUpdate}
        />
    );
};