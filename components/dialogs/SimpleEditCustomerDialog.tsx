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
        // bases:
        ImplementedSimpleEditModelDialogProps<OrderDetail, Exclude<keyof NonNullable<(OrderDetail['customer'] & OrderDetail['guest'])>, 'id'>>
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
    interface CustomerModel extends NonNullable<(OrderDetail['customer'] & OrderDetail['guest'])> {
        id : OrderDetail['id']
    }
    const handleInitialValue   = useEvent<InitialValueHandler<CustomerModel>>((edit, model) => {
        return (model as unknown as Pick<OrderDetail, 'customer'|'guest'>)[editGroup]![edit];
    });
    const handleTransformValue = useEvent<TransformValueHandler<CustomerModel>>((value, edit, model) => {
        return {
            id          : model.id,
            
            [editGroup] : {
                [edit] : value,
            } as any,
        };
    });
    
    
    
    // jsx:
    return (
        <SimpleEditModelDialog<CustomerModel>
            // other props:
            {...restSimpleEditDialogProps as unknown as ImplementedSimpleEditModelDialogProps<CustomerModel>}
            
            
            
            // data:
            initialValue={handleInitialValue}
            transformValue={handleTransformValue}
            
            
            
            // stores:
            updateModelApi={useUpdateOrder as () => UpdateModelApi<CustomerModel>}
        />
    );
};
