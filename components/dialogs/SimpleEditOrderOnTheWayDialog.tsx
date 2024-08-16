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
import {
    type OrderDetail,
    type OrderDetailWithOptions,
    
    
    
    shippingCarrierList,
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
        ImplementedSimpleEditModelDialogProps<OrderDetail, 'shipment'>
{
    // data:
    defaultCarrier ?: string
}
export const SimpleEditOrderOnTheWayDialog = (props: SimpleEditOrderOnTheWayDialogProps) => {
    // props:
    const {
        // data:
        defaultCarrier,
        
        
        
        // other props:
        ...restImplementedSimpleEditModelDialogProps
    } = props;
    
    
    
    // handlers:
    interface OrderOnTheWayModel {
        id       : OrderDetail['id']
        shipment : OrderOnTheWayValue|null
    }
    const handleInitialValue   = useEvent<InitialValueHandler<OrderOnTheWayModel>>((edit, model) => {
        const initialValue : OrderOnTheWayValue = model[edit] ?? {
            carrier               : null,
            number                : null,
            sendConfirmationEmail : undefined,
        } satisfies OrderOnTheWayValue;
        
        const {
            sendConfirmationEmail = (
                !initialValue.carrier // default to send_notification if the shipping tracking CARRIER is NOT YET provided
                ||
                !initialValue.number  // default to send_notification if the shipping tracking NUMBER is NOT YET provided
            ),
            ...restInitialValue
        } = initialValue;
        
        
        
        return {
            ...restInitialValue,
            
            carrier               : (
                initialValue.carrier?.trim()
                ||
                (() => {
                    if (!defaultCarrier) return null;
                    
                    return (
                        shippingCarrierList.find((shippingCarrierItem) => defaultCarrier.startsWith(shippingCarrierItem))
                        ??
                        (() => {
                            const defaultCarrierLowercase = defaultCarrier.trim().toLowerCase();
                            return shippingCarrierList.find((shippingCarrierItem) => defaultCarrierLowercase.startsWith(shippingCarrierItem.trim().toLowerCase()))
                        })()
                        ??
                        null
                    );
                })()
            ) || null, // normalize to null if empty_string or only_spaces
            number                : initialValue.number?.trim()  || null, // normalize to null if empty_string or only_spaces
            
            sendConfirmationEmail,
        } satisfies OrderOnTheWayValue;
    });
    const handleTransformValue = useEvent<TransformValueHandler<OrderOnTheWayModel>>((editedValue, edit, model) => {
        const initialValue : OrderOnTheWayValue = model[edit] ?? {
            carrier               : null,
            number                : null,
            sendConfirmationEmail : undefined,
        } satisfies OrderOnTheWayValue;
        
        editedValue ??= {
            carrier               : null,
            number                : null,
            sendConfirmationEmail : undefined,
        } satisfies OrderOnTheWayValue;
        
        const {
            sendConfirmationEmail = (
                !initialValue.carrier // default to send_notification if the shipping tracking CARRIER is NOT YET provided
                ||
                !initialValue.number  // default to send_notification if the shipping tracking NUMBER is NOT YET provided
                ||
                (initialValue.carrier !== editedValue.carrier) // default to send_notification if the shipping tracking CARRIER is CHANGED
                ||
                (initialValue.number  !== editedValue.number ) // default to send_notification if the shipping tracking NUMBER is CHANGED
            ),
            ...restEditedValue
        } = editedValue;
        
        
        
        return {
            id          : model.id,
            
            orderStatus : 'ON_THE_WAY',
            [edit]      : {
                ...restEditedValue,
                
                carrier : restEditedValue.carrier?.trim() || null, // normalize to null if empty_string or only_spaces
                number  : restEditedValue.number?.trim()  || null, // normalize to null if empty_string or only_spaces
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
            {...restImplementedSimpleEditModelDialogProps as unknown as ImplementedSimpleEditModelDialogProps<OrderOnTheWayModel>}
            
            
            
            // data:
            initialValue={handleInitialValue}
            transformValue={handleTransformValue}
            
            
            
            // stores:
            updateModelApi={updateOrderApi as UpdateModelApi<OrderOnTheWayModel>}
        />
    );
};
