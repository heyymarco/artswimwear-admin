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
    WysiwygEditorState,
}                           from '@/components/editors/WysiwygEditor'
import type {
    OrderCanceledValue,
}                           from '@/components/editors/OrderCanceledEditor'

// models:
import type {
    OrderDetail,
}                           from '@/models'

// models:
import type {
    Prisma,
}                           from '@prisma/client'

// stores:
import {
    // hooks:
    useUpdateOrder,
}                           from '@/store/features/api/apiSlice'



// react components:
export interface SimpleEditOrderCanceledDialogProps
    extends
        // bases:
        ImplementedSimpleEditModelDialogProps<OrderDetail, 'cancelationReason'>
{
}
export const SimpleEditOrderCanceledDialog = (props: SimpleEditOrderCanceledDialogProps) => {
    // handlers:
    interface OrderCanceledModel {
        id                : OrderDetail['id']
        cancelationReason : OrderCanceledValue
    }
    const handleInitialValue   = useEvent<InitialValueHandler<OrderCanceledModel>>((edit, model) => {
        const value = ((model as unknown as OrderDetail)[edit] as Prisma.JsonValue as WysiwygEditorState|null) ?? null;
        return {
            cancelationReason     : value,
            sendConfirmationEmail : true,
        };
    });
    const handleTransformValue = useEvent<TransformValueHandler<OrderCanceledModel>>((value, edit, model) => {
        const {
            sendConfirmationEmail = true,
            cancelationReason,
        } = value;
        
        return {
            id          : model.id,
            
            orderStatus : 'CANCELED',
            [edit]      : cancelationReason  as Prisma.JsonValue,
            
            //@ts-ignore
            sendConfirmationEmail,
        } satisfies OrderDetail as unknown as OrderCanceledModel;
    });
    
    
    
    // jsx:
    return (
        <SimpleEditModelDialog<OrderCanceledModel>
            // other props:
            {...props as unknown as ImplementedSimpleEditModelDialogProps<OrderCanceledModel>}
            
            
            
            // data:
            initialValue={handleInitialValue}
            transformValue={handleTransformValue}
            
            
            
            // stores:
            useUpdateModel={useUpdateOrder as () => UpdateModelApi<OrderCanceledModel>}
        />
    );
};
