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
export interface SimpleEditOrderTroubleDialogProps
    extends
        // bases:
        ImplementedSimpleEditModelDialogProps<OrderDetail, 'orderTrouble'>
{
}
export const SimpleEditOrderTroubleDialog = (props: SimpleEditOrderTroubleDialogProps) => {
    // handlers:
    interface OrderTroubleModel {
        id           : OrderDetail['id']
        orderTrouble : WysiwygEditorState|null
    }
    const handleInitialValue   = useEvent<InitialValueHandler<OrderTroubleModel>>((edit, model) => {
        return (model[edit] as Prisma.JsonValue as WysiwygEditorState|null) ?? null;
    });
    const handleTransformValue = useEvent<TransformValueHandler<OrderTroubleModel>>((value, edit, model) => {
        return {
            id     : model.id,
            
            [edit] : value,
        };
    });
    
    
    
    // jsx:
    return (
        <SimpleEditModelDialog<OrderTroubleModel>
            // other props:
            {...props as unknown as ImplementedSimpleEditModelDialogProps<OrderTroubleModel>}
            
            
            
            // data:
            initialValue={handleInitialValue}
            transformValue={handleTransformValue}
            
            
            
            // stores:
            updateModelApi={useUpdateOrder as () => UpdateModelApi<OrderTroubleModel>}
        />
    );
};
