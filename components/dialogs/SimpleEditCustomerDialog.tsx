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

// stores:
import {
    // types:
    OrderDetail,
    
    
    
    // hooks:
    useUpdateOrder,
}                           from '@/store/features/api/apiSlice'



// react components:
export interface SimpleEditCustomerDialogProps
    extends
        ImplementedSimpleEditDialogProps<string, OrderDetail, keyof NonNullable<(OrderDetail['customer'] & OrderDetail['guest'])>>
{
    // data:
    editGroup : keyof Pick<OrderDetail, 'customer'|'guest'>
}
export const SimpleEditCustomerDialog = (props: SimpleEditCustomerDialogProps) => {
    // rest props:
    const {
        // data:
        editGroup,
    ...restSimpleEditDialogProps} = props;
    
    
    
    // handlers:
    interface MockModel extends NonNullable<(OrderDetail['customer'] & OrderDetail['guest'])> {
        id : never
    }
    const handleInitialValue   = useEvent<InitialValueHandler<string, MockModel, keyof MockModel>>((edit, model) => {
        return (model as unknown as Pick<OrderDetail, 'customer'|'guest'>)[editGroup]![edit];
    });
    const handleTransformValue = useEvent<TransformValueHandler<string, MockModel, keyof MockModel>>((value, edit, model) => {
        return {
            id          : model.id,
            
            [editGroup] : {
                [edit] : value,
            } as any,
        };
    });
    
    
    
    // jsx:
    return (
        <SimpleEditModelDialog<MockModel>
            // other props:
            {...restSimpleEditDialogProps as unknown as ImplementedSimpleEditDialogProps<string, MockModel, keyof MockModel>}
            
            
            
            // data:
            initialValue={handleInitialValue}
            transformValue={handleTransformValue}
            
            
            
            // stores:
            updateModelApi={useUpdateOrder as () => UpdateModelApi<MockModel>}
        />
    );
};