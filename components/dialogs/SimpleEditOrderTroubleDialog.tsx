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
import {
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
        // detect for empty value:
        if (value) {
            if ('root' in value) { // value as plain JSON
                const firstChild = (value.root as any)?.children?.[0];
                if (!firstChild || ((firstChild?.type === 'paragraph') && !firstChild?.children?.length)) {
                    // empty paragraph => empty content => null:
                    value = null;
                } // if
            }
            else { // value as EditorState
                const nodeMap = value?._nodeMap;
                const root = nodeMap?.get('root');
                if (!root) {
                    // no root => empty content => null:
                    value = null;
                }
                else {
                    const firstKey = root?.__first;
                    if (!firstKey) {
                        // no child => empty content => null:
                        value = null;
                    }
                    else {
                        const firstChild = nodeMap?.get(firstKey);
                        if (!firstChild || ((firstChild?.__type === 'paragraph') && !firstChild?.__first)) {
                            // empty paragraph => empty content => null:
                            value = null;
                        } // if
                    } // if
                } // if
            } // if
        } // if
        
        
        
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