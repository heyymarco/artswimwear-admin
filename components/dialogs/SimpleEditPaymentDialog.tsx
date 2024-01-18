'use client'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// internal components:
import {
    InitialValueHandler,
    ImplementedSimpleEditDialogProps,
}                           from '@/components/dialogs/SimpleEditDialog'
import {
    // types:
    TransformValueHandler,
    UpdateModelApi,
    
    
    
    // react components:
    SimpleEditModelDialog,
}                           from '@/components/dialogs/SimpleEditModelDialog'
import type {
    PaymentValue,
}                           from '@/components/editors/PaymentEditor/PaymentEditor'

// stores:
import {
    // types:
    OrderDetailWithOptions,
    
    
    
    // hooks:
    useUpdateOrder,
}                           from '@/store/features/api/apiSlice'



// react components:
export interface SimpleEditPaymentDialogProps
    extends
        ImplementedSimpleEditDialogProps<PaymentValue, OrderDetailWithOptions, 'payment'>
{
}
export const SimpleEditPaymentDialog = (props: SimpleEditPaymentDialogProps) => {
    // handlers:
    interface MockModel {
        id      : never
        payment : PaymentValue
    }
    const handleInitialValue   = useEvent<InitialValueHandler<PaymentValue, MockModel, keyof MockModel>>((edit, model) => {
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
    const handleTransformValue = useEvent<TransformValueHandler<PaymentValue, MockModel, keyof MockModel>>((value, edit, model) => {
        const {
            sendConfirmationEmail = true,
        ...restValue} = value;
        
        return {
            id     : model.id,
            
            [edit] : {
                // original:
                ...restValue,
                type   : 'MANUAL_PAID',
                amount : restValue.amount ?? 0, // normalize to zero if null
                fee    : restValue.fee    ?? 0, // normalize to zero if null
            },
            
            //@ts-ignore
            sendConfirmationEmail,
        };
    });
    
    
    
    // jsx:
    return (
        <SimpleEditModelDialog<MockModel>
            // other props:
            {...props as unknown as ImplementedSimpleEditDialogProps<PaymentValue, MockModel, keyof MockModel>}
            
            
            
            // data:
            initialValue={handleInitialValue}
            transformValue={handleTransformValue}
            
            
            
            // stores:
            updateModelApi={useUpdateOrder as () => UpdateModelApi<MockModel>}
        />
    );
};