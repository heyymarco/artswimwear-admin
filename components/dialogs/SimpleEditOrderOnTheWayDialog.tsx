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

// stores:
import {
    // types:
    OrderDetail,
    
    
    
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
        const value = model[edit];
        return {
            ...value,
            
            shippingCarrier       : value?.shippingCarrier?.trim() || null, // normalize to null if empty_string or only_spaces
            shippingNumber        : value?.shippingNumber?.trim()  || null, // normalize to null if empty_string or only_spaces
            sendConfirmationEmail : true,
        };
    });
    const handleTransformValue = useEvent<TransformValueHandler<OrderOnTheWayModel>>((value, edit, model) => {
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
