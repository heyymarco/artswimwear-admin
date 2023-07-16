'use client'

import { useEvent } from '@reusable-ui/core'

import { InitialValueEventHandler, UpdateModelEventHandler, SimpleEditDialogProps, SimpleEditDialog } from '@/components/dialogs/SimpleEditDialog'
import { OrderDetail, useUpdateOrder } from '@/store/features/api/apiSlice'
import type { PaymentValue } from '../editors/PaymentEditor/PaymentEditor';



// react components:
export interface SimpleEditPaymentDialogProps
    extends
        Omit<SimpleEditDialogProps<PaymentValue, OrderDetail, 'paymentMethod'>,
            // states:
            |'isLoading'
            
            
            
            // data:
            |'initialValue'
            
            
            
            // handlers:
            |'onUpdateModel'
        >
{
}
export const SimpleEditPaymentDialog = (props: SimpleEditPaymentDialogProps) => {
    // stores:
    const [updateOrder, {isLoading}] = useUpdateOrder();
    
    
    
    // handlers:
    const handleInitialValue = useEvent<InitialValueEventHandler<PaymentValue, OrderDetail, 'paymentMethod'>>((edit, model) => {
        return model[edit];
    });
    const handleUpdateModel  = useEvent<UpdateModelEventHandler<PaymentValue, OrderDetail, 'paymentMethod'>>(async (value, edit, model) => {
        await updateOrder({
            _id    : model._id,
            
            [edit] : value,
        }).unwrap();
    });
    
    
    
    // jsx:
    return (
        <SimpleEditDialog<PaymentValue, OrderDetail, 'paymentMethod'>
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