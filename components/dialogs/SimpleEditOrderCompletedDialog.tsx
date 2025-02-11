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
    OrderCompletedValue,
}                           from '@/components/editors/OrderCompletedEditor'

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
export interface SimpleEditOrderCompletedDialogProps
    extends
        // bases:
        ImplementedSimpleEditModelDialogProps<OrderDetail, 'orderStatus'>
{
}
export const SimpleEditOrderCompletedDialog = (props: SimpleEditOrderCompletedDialogProps) => {
    // handlers:
    interface OrderCompletedModel {
        id          : OrderDetail['id']
        orderStatus : OrderCompletedValue
    }
    const handleInitialValue   = useEvent<InitialValueHandler<OrderCompletedModel>>((edit, model) => {
        return {
            sendConfirmationEmail : true,
        };
    });
    const handleTransformValue = useEvent<TransformValueHandler<OrderCompletedModel>>((value, edit, model) => {
        const {
            sendConfirmationEmail = true,
        ...restValue} = value;
        
        return {
            id          : model.id,
            
            orderStatus : 'COMPLETED',
            
            // original:
            ...restValue,
            
            //@ts-ignore
            sendConfirmationEmail,
        } as any;
    });
    
    
    
    // jsx:
    return (
        <SimpleEditModelDialog<OrderCompletedModel>
            // other props:
            {...props as unknown as ImplementedSimpleEditModelDialogProps<OrderCompletedModel>}
            
            
            
            // data:
            initialValue={handleInitialValue}
            transformValue={handleTransformValue}
            
            
            
            // stores:
            useUpdateModel={useUpdateOrder as unknown as () => UpdateModelApi<OrderCompletedModel>}
        />
    );
};
