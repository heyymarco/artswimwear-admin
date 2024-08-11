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
    OrderOnTheWayValue,
}                           from '@/components/editors/OrderOnTheWayEditor'

// models:
import type {
    OrderDetail,
}                           from '@/models'

// stores:
import {
    // hooks:
    useUpdateOrder,
}                           from '@/store/features/api/apiSlice'



// react components:
export interface SimpleEditOrderOnTheWayDialogProps
    extends
        // bases:
        ImplementedSimpleEditModelDialogProps<OrderDetail, 'shippingTracking'>
{
}
export const SimpleEditOrderOnTheWayDialog = (props: SimpleEditOrderOnTheWayDialogProps) => {
    // handlers:
    interface OrderOnTheWayModel {
        id               : OrderDetail['id']
        shippingTracking : OrderOnTheWayValue
    }
    const handleInitialValue   = useEvent<InitialValueHandler<OrderOnTheWayModel>>((edit, model) => {
        const initialValue = model[edit];
        const {
            sendConfirmationEmail = (
                !initialValue.shippingCarrier // default to send_notification if the shipping tracking CARRIER is NOT YET provided
                ||
                !initialValue.shippingNumber  // default to send_notification if the shipping tracking NUMBER is NOT YET provided
                ||
                (initialValue.shippingCarrier !== model.shippingTracking.shippingCarrier) // default to send_notification if the shipping tracking CARRIER is CHANGED
                ||
                (initialValue.shippingNumber !== model.shippingTracking.shippingNumber)   // default to send_notification if the shipping tracking NUMBER is CHANGED
            ),
            ...restInitialValue
        } = initialValue;
        
        
        
        return {
            ...restInitialValue,
            
            shippingCarrier       : initialValue.shippingCarrier?.trim() || null, // normalize to null if empty_string or only_spaces
            shippingNumber        : initialValue.shippingNumber?.trim()  || null, // normalize to null if empty_string or only_spaces
            
            sendConfirmationEmail,
        };
    });
    const handleTransformValue = useEvent<TransformValueHandler<OrderOnTheWayModel>>((editedValue, edit, model) => {
        const {
            sendConfirmationEmail = (
                !editedValue.shippingCarrier // default to send_notification if the shipping tracking CARRIER is NOT YET provided
                ||
                !editedValue.shippingNumber  // default to send_notification if the shipping tracking NUMBER is NOT YET provided
                ||
                (editedValue.shippingCarrier !== model.shippingTracking.shippingCarrier) // default to send_notification if the shipping tracking CARRIER is CHANGED
                ||
                (editedValue.shippingNumber !== model.shippingTracking.shippingNumber)   // default to send_notification if the shipping tracking NUMBER is CHANGED
            ),
            ...restEditedValue
        } = editedValue;
        
        
        
        return {
            id          : model.id,
            
            orderStatus : 'ON_THE_WAY',
            [edit]      : {
                ...restEditedValue,
                
                shippingCarrier : restEditedValue.shippingCarrier?.trim() || null, // normalize to null if empty_string or only_spaces
                shippingNumber  : restEditedValue.shippingNumber?.trim()  || null, // normalize to null if empty_string or only_spaces
            },
            
            sendConfirmationEmail,
        };
    });
    
    
    
    // jsx:
    return (
        <SimpleEditModelDialog<OrderOnTheWayModel>
            // other props:
            {...props as unknown as ImplementedSimpleEditModelDialogProps<OrderOnTheWayModel>}
            
            
            
            // data:
            initialValue={handleInitialValue}
            transformValue={handleTransformValue}
            
            
            
            // stores:
            updateModelApi={useUpdateOrder as () => UpdateModelApi<OrderOnTheWayModel>}
        />
    );
};
