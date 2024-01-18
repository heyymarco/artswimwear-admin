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
    OrderOnTheWayValue,
}                           from '@/components/editors/OrderOnTheWayEditor'

// stores:
import {
    // types:
    OrderDetailWithOptions,
    
    
    
    // hooks:
    useUpdateOrder,
}                           from '@/store/features/api/apiSlice'



// react components:
export interface SimpleEditOrderOnTheWayDialogProps
    extends
        ImplementedSimpleEditDialogProps<OrderOnTheWayValue, OrderDetailWithOptions, 'shippingTracking'>
{
}
export const SimpleEditOrderOnTheWayDialog = (props: SimpleEditOrderOnTheWayDialogProps) => {
    // handlers:
    interface MockModel {
        id               : never
        shippingTracking : OrderOnTheWayValue
    }
    const handleInitialValue   = useEvent<InitialValueHandler<OrderOnTheWayValue, MockModel, keyof MockModel>>((edit, model) => {
        const value = model[edit];
        return {
            ...value,
            
            shippingCarrier       : value?.shippingCarrier?.trim() || null, // normalize to null if empty_string or only_spaces
            shippingNumber        : value?.shippingNumber?.trim()  || null, // normalize to null if empty_string or only_spaces
            sendConfirmationEmail : true,
        };
    });
    const handleTransformValue = useEvent<TransformValueHandler<OrderOnTheWayValue, MockModel, keyof MockModel>>((value, edit, model) => {
        const {
            sendConfirmationEmail = true,
        ...restValue} = value;
        
        return {
            id          : model.id,
            
            orderStatus : 'ON_THE_WAY',
            [edit]      : {
                // original:
                ...restValue,
                shippingCarrier : restValue.shippingCarrier?.trim() || null, // normalize to null if empty_string or only_spaces
                shippingNumber  : restValue.shippingNumber?.trim()  || null, // normalize to null if empty_string or only_spaces
            },
            
            //@ts-ignore
            sendConfirmationEmail,
        };
    });
    
    
    
    // jsx:
    return (
        <SimpleEditModelDialog<MockModel>
            // other props:
            {...props as unknown as ImplementedSimpleEditDialogProps<OrderOnTheWayValue, MockModel, keyof MockModel>}
            
            
            
            // data:
            initialValue={handleInitialValue}
            transformValue={handleTransformValue}
            
            
            
            // stores:
            updateModelApi={useUpdateOrder as () => UpdateModelApi<MockModel>}
        />
    );
};
