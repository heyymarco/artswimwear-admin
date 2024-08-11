'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useMemo,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

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

// types:
import type {
    MutationArgs,
}                           from '@/libs/types'

// models:
import type {
    OrderDetail,
    OrderDetailWithOptions,
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
        shippingTracking : OrderOnTheWayValue|null
    }
    const handleInitialValue   = useEvent<InitialValueHandler<OrderOnTheWayModel>>((edit, model) => {
        const initialValue : OrderOnTheWayValue = model[edit] ?? {
            shippingCarrier       : null,
            shippingNumber        : null,
            sendConfirmationEmail : undefined,
        } satisfies OrderOnTheWayValue;
        
        const {
            sendConfirmationEmail = (
                !initialValue.shippingCarrier // default to send_notification if the shipping tracking CARRIER is NOT YET provided
                ||
                !initialValue.shippingNumber  // default to send_notification if the shipping tracking NUMBER is NOT YET provided
            ),
            ...restInitialValue
        } = initialValue;
        
        
        
        return {
            ...restInitialValue,
            
            shippingCarrier       : initialValue.shippingCarrier?.trim() || null, // normalize to null if empty_string or only_spaces
            shippingNumber        : initialValue.shippingNumber?.trim()  || null, // normalize to null if empty_string or only_spaces
            
            sendConfirmationEmail,
        } satisfies OrderOnTheWayValue;
    });
    const handleTransformValue = useEvent<TransformValueHandler<OrderOnTheWayModel>>((editedValue, edit, model) => {
        const initialValue : OrderOnTheWayValue = model[edit] ?? {
            shippingCarrier       : null,
            shippingNumber        : null,
            sendConfirmationEmail : undefined,
        } satisfies OrderOnTheWayValue;
        
        editedValue ??= {
            shippingCarrier       : null,
            shippingNumber        : null,
            sendConfirmationEmail : undefined,
        } satisfies OrderOnTheWayValue;
        
        const {
            sendConfirmationEmail = (
                !initialValue.shippingCarrier // default to send_notification if the shipping tracking CARRIER is NOT YET provided
                ||
                !initialValue.shippingNumber  // default to send_notification if the shipping tracking NUMBER is NOT YET provided
                ||
                (initialValue.shippingCarrier !== editedValue.shippingCarrier) // default to send_notification if the shipping tracking CARRIER is CHANGED
                ||
                (initialValue.shippingNumber  !== editedValue.shippingNumber)  // default to send_notification if the shipping tracking NUMBER is CHANGED
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
        } satisfies MutationArgs<OrderDetailWithOptions>;
    });
    
    
    
    // dialogs:
    const {
        showMessageSuccess,
    } = useDialogMessage();
    
    
    
    // stores:
    const [updateOrder, updateOrderState] = useUpdateOrder();
    const updateOrderProxy : typeof updateOrder = useEvent((mutationArg) => {
        const updatedPromise = updateOrder(mutationArg);
        
        if (mutationArg.orderStatus === 'ON_THE_WAY') {
            updatedPromise.unwrap().then((result) => {
                if (result.orderStatus === 'COMPLETED') {
                    showMessageSuccess({
                        title   : <h1>Order Status Updated</h1>,
                        success : <>
                            <p>
                                We detected that the shipment has been <strong>delivered</strong>.
                            </p>
                            <p>
                                So, we changed the order status to <strong>completed</strong>.
                            </p>
                        </>,
                    });
                } // if
            });
        } // if
        
        return updatedPromise;
    });
    const updateOrderApi = useMemo<readonly [typeof updateOrder, typeof updateOrderState]>(() => [
        updateOrderProxy,
        updateOrderState,
    ], [updateOrderState]);
    
    
    
    // jsx:
    return (
        <SimpleEditModelDialog<OrderOnTheWayModel>
            // other props:
            {...props as unknown as ImplementedSimpleEditModelDialogProps<OrderOnTheWayModel>}
            
            
            
            // data:
            initialValue={handleInitialValue}
            transformValue={handleTransformValue}
            
            
            
            // stores:
            updateModelApi={updateOrderApi as UpdateModelApi<OrderOnTheWayModel>}
        />
    );
};
