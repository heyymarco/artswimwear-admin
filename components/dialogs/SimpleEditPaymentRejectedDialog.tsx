'use client'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// internal components:
import {
    InitialValueHandler,
    UpdateHandler,
    ImplementedSimpleEditDialogProps,
    SimpleEditDialog,
}                           from '@/components/dialogs/SimpleEditDialog'
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
    // stores:
    const [updateOrder, {isLoading}] = useUpdateOrder();
    
    
    
    // handlers:
    const handleInitialValue = useEvent<InitialValueHandler<WysiwygEditorState|null, OrderDetailWithOptions, 'paymentConfirmation'>>((edit, model) => {
        return (model[edit]?.rejectionReason ?? null) as WysiwygEditorState|null;
    });
    const handleUpdate       = useEvent<UpdateHandler<WysiwygEditorState|null, OrderDetailWithOptions, 'paymentConfirmation'>>(async (value, edit, model) => {
        await updateOrder({
            id     : model.id,
            
            [edit] : {
                rejectionReason : value as Prisma.JsonValue,
            },
            
            //@ts-ignore
            sendConfirmationEmail : true,
        }).unwrap();
    });
    
    
    
    // jsx:
    return (
        <SimpleEditDialog<WysiwygEditorState|null, OrderDetailWithOptions, 'paymentConfirmation'>
            // other props:
            {...props}
            
            
            
            // states:
            isLoading={isLoading}
            
            
            
            // data:
            initialValue={handleInitialValue}
            
            
            
            // handlers:
            onUpdate={handleUpdate}
        />
    );
};