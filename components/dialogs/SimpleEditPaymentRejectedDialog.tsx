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
    WysiwygEditorState,
}                           from '@/components/editors/WysiwygEditor'

// stores:
import {
    // types:
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
        ImplementedSimpleEditDialogProps<WysiwygEditorState|null, OrderDetailWithOptions, 'paymentConfirmation'>
{
}
export const SimpleEditPaymentRejectedDialog = (props: SimpleEditPaymentRejectedDialogProps) => {
    // handlers:
    interface MockModel {
        id                  : never
        paymentConfirmation : WysiwygEditorState|null
    }
    const handleInitialValue   = useEvent<InitialValueHandler<WysiwygEditorState|null, MockModel, keyof MockModel>>((edit, model) => {
        return ((model as unknown as OrderDetailWithOptions).paymentConfirmation?.rejectionReason ?? null) as WysiwygEditorState|null;
    });
    const handleTransformValue = useEvent<TransformValueHandler<WysiwygEditorState|null, MockModel, keyof MockModel>>((value, edit, model) => {
        return {
            id     : model.id,
            
            [edit] : {
                rejectionReason : value as Prisma.JsonValue,
            },
            
            // @ts-ignore
            sendConfirmationEmail : true,
        };
    });
    
    
    
    // jsx:
    return (
        <SimpleEditModelDialog<MockModel>
            // other props:
            {...props as unknown as ImplementedSimpleEditDialogProps<WysiwygEditorState|null, MockModel, keyof MockModel>}
            
            
            
            // data:
            initialValue={handleInitialValue}
            transformValue={handleTransformValue}
            
            
            
            // stores:
            updateModelApi={useUpdateOrder as () => UpdateModelApi<MockModel>}
        />
    );
};