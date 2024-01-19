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

// stores:
import {
    // types:
    OrderDetail,
    OrderDetailWithOptions,
    
    
    
    // hooks:
    useUpdateOrder,
}                           from '@/store/features/api/apiSlice'

// models:
import type {
    Prisma,
}                           from '@prisma/client'



// react components:
export interface SimpleEditPaymentRejectedDialogProps
    extends
        // bases:
        ImplementedSimpleEditModelDialogProps<OrderDetail, 'paymentConfirmation'>
{
}
export const SimpleEditPaymentRejectedDialog = (props: SimpleEditPaymentRejectedDialogProps) => {
    // handlers:
    interface PaymentRejectedModel {
        id                  : OrderDetail['id']
        paymentConfirmation : WysiwygEditorState|null
    }
    const handleInitialValue   = useEvent<InitialValueHandler<PaymentRejectedModel>>((edit, model) => {
        return ((model as unknown as OrderDetailWithOptions)[edit]?.rejectionReason as Prisma.JsonValue as WysiwygEditorState|null) ?? null;
    });
    const handleTransformValue = useEvent<TransformValueHandler<PaymentRejectedModel>>((value, edit, model) => {
        return {
            id     : model.id,
            
            [edit] : {
                rejectionReason : value,
            } as any,
            
            // @ts-ignore
            sendConfirmationEmail : true,
        };
    });
    
    
    
    // jsx:
    return (
        <SimpleEditModelDialog<PaymentRejectedModel>
            // other props:
            {...props as unknown as ImplementedSimpleEditModelDialogProps<PaymentRejectedModel>}
            
            
            
            // data:
            initialValue={handleInitialValue}
            transformValue={handleTransformValue}
            
            
            
            // stores:
            updateModelApi={useUpdateOrder as () => UpdateModelApi<PaymentRejectedModel>}
        />
    );
};
