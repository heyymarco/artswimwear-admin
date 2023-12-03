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
    OrderDetail,
    
    
    
    // hooks:
    useUpdateOrder,
}                           from '@/store/features/api/apiSlice'



// react components:
export interface SimpleEditOrderTroubleDialogProps
    extends
        ImplementedSimpleEditDialogProps<WysiwygEditorState|null, OrderDetail, 'orderTrouble'>
{
}
export const SimpleEditOrderTroubleDialog = (props: SimpleEditOrderTroubleDialogProps) => {
    // stores:
    const [updateOrder, {isLoading}] = useUpdateOrder();
    
    
    
    // handlers:
    const handleInitialValue = useEvent<InitialValueHandler<WysiwygEditorState|null, OrderDetail, 'orderTrouble'>>((edit, model) => {
        return (model[edit] as any) ?? null;
    });
    const handleUpdate       = useEvent<UpdateHandler<WysiwygEditorState|null, OrderDetail, 'orderTrouble'>>(async (value, edit, model) => {
        await updateOrder({
            id     : model.id,
            
            [edit] : value as any,
        }).unwrap();
    });
    
    
    
    // jsx:
    return (
        <SimpleEditDialog<WysiwygEditorState|null, OrderDetail, 'orderTrouble'>
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