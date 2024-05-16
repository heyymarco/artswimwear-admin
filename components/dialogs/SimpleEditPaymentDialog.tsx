'use client'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// internal components:
import {
    // types:
    InitialValueHandler,
    TransformValueHandler,
    UpdateModelApi,
    
    
    
    // react components:
    ImplementedSimpleEditModelDialogProps,
    SimpleEditModelDialog,
}                           from '@/components/dialogs/SimpleEditModelDialog'
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
        // bases:
        ImplementedSimpleEditModelDialogProps<OrderDetail, 'payment'>
{
}
export const SimpleEditPaymentDialog = (props: SimpleEditPaymentDialogProps) => {
    // handlers:
    interface PaymentModel {
        id      : OrderDetail['id']
        payment : PaymentValue
    }
    const handleInitialValue   = useEvent<InitialValueHandler<PaymentModel>>((edit, model) => {
        const value = model[edit];
        const isInitiallyUnpaid = (value.type === 'MANUAL');
        
        return {
            ...value,
            
            brand                 : ((isInitiallyUnpaid ? null : value.brand ) || null), // normalize to null if empty_string
            
            amount                : ((isInitiallyUnpaid ? null : value.amount)        ), // perserve zero
            fee                   : ((isInitiallyUnpaid ? null : value.fee   ) || null), // normalize to null if zero
            
            sendConfirmationEmail :   isInitiallyUnpaid,
        };
    });
    const handleTransformValue = useEvent<TransformValueHandler<PaymentModel>>((value, edit, model) => {
        const {
            sendConfirmationEmail = true,
        ...restValue} = value;
        
        return {
            id     : model.id,
            
            [edit] : {
                // original:
                ...restValue,
                
                type   : 'MANUAL_PAID',           // 'MANUAL' (unedited) => 'MANUAL_PAID' (edited)
                
                amount : (restValue.amount ?? 0), // normalize to zero if null
                fee    : (restValue.fee    ?? 0), // normalize to zero if null
            },
            
            // @ts-ignore
            sendConfirmationEmail,
        };
    });
    
    
    
    // jsx:
    return (
        <SimpleEditModelDialog<PaymentModel>
            // other props:
            {...props as unknown as ImplementedSimpleEditModelDialogProps<PaymentModel>}
            
            
            
            // data:
            initialValue={handleInitialValue}
            transformValue={handleTransformValue}
            
            
            
            // stores:
            updateModelApi={useUpdateOrder as () => UpdateModelApi<PaymentModel>}
        />
    );
};
