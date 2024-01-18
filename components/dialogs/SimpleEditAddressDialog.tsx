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
import {
    AddressValue,
    emptyAddressValue,
}                           from '@/components/editors/AddressEditor/AddressEditor'

// stores:
import {
    // types:
    OrderDetail,
    
    
    
    // hooks:
    useUpdateOrder,
}                           from '@/store/features/api/apiSlice'



// react components:
export interface SimpleEditAddressDialogProps
    extends
        ImplementedSimpleEditDialogProps<AddressValue, OrderDetail, 'shippingAddress'|'billingAddress'>
{
}
export const SimpleEditAddressDialog = (props: SimpleEditAddressDialogProps) => {
    // handlers:
    interface MockModel {
        id              : never
        shippingAddress : AddressValue
        billingAddress  : AddressValue
    }
    const handleInitialValue   = useEvent<InitialValueHandler<AddressValue, MockModel, keyof MockModel>>((edit, model) => {
        if (edit === 'billingAddress') {
            return (model as unknown as OrderDetail).payment[edit] ?? emptyAddressValue;
        }
        else {
            return model[edit] ?? emptyAddressValue;
        } // if
    });
    const handleTransformValue = useEvent<TransformValueHandler<AddressValue, MockModel, keyof MockModel>>((value, edit, model) => {
        return {
            id     : model.id,
            
            [edit] : value,
        };
    });
    
    
    
    // jsx:
    return (
        <SimpleEditModelDialog<MockModel>
            // other props:
            {...props as unknown as ImplementedSimpleEditDialogProps<AddressValue, MockModel, 'shippingAddress'|'billingAddress'>}
            
            
            
            // data:
            initialValue={handleInitialValue}
            transformValue={handleTransformValue}
            onChange={undefined}
            
            
            
            // stores:
            updateModelApi={useUpdateOrder as () => UpdateModelApi<MockModel>}
        />
    );
};