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
    OrderCompletedValue,
}                           from '@/components/editors/OrderCompletedEditor'

// stores:
import {
    // types:
    OrderDetailWithOptions,
    
    
    
    // hooks:
    useUpdateOrder,
}                           from '@/store/features/api/apiSlice'



// react components:
export interface SimpleEditOrderCompletedDialogProps
    extends
        ImplementedSimpleEditDialogProps<OrderCompletedValue, OrderDetailWithOptions, ''>
{
}
export const SimpleEditOrderCompletedDialog = (props: SimpleEditOrderCompletedDialogProps) => {
    // handlers:
    interface MockModel {
        id : never
        '' : OrderCompletedValue
    }
    const handleInitialValue   = useEvent<InitialValueHandler<OrderCompletedValue, MockModel, keyof MockModel>>((edit, model) => {
        return {
            sendConfirmationEmail : true,
        };
    });
    const handleTransformValue = useEvent<TransformValueHandler<OrderCompletedValue, MockModel, keyof MockModel>>((value, edit, model) => {
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
        };
    });
    
    
    
    // jsx:
    return (
        <SimpleEditModelDialog<MockModel>
            // other props:
            {...props as unknown as ImplementedSimpleEditDialogProps<OrderCompletedValue, MockModel, keyof MockModel>}
            
            
            
            // data:
            initialValue={handleInitialValue}
            transformValue={handleTransformValue}
            
            
            
            // stores:
            updateModelApi={useUpdateOrder as () => UpdateModelApi<MockModel>}
        />
    );
};
