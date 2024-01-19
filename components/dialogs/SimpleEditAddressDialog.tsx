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
        // bases:
        ImplementedSimpleEditModelDialogProps<OrderDetail, 'shippingAddress'|'billingAddress'>
{
}
export const SimpleEditAddressDialog = (props: SimpleEditAddressDialogProps) => {
    // handlers:
    interface AddressModel {
        id               : OrderDetail['id']
        shippingAddress ?: AddressValue|null
        billingAddress  ?: AddressValue|null
    }
    const handleInitialValue   = useEvent<InitialValueHandler<AddressModel>>((edit, model) => {
        if (edit === 'billingAddress') {
            return (model as unknown as OrderDetail).payment.billingAddress ?? emptyAddressValue;
        }
        else {
            return model[edit] ?? emptyAddressValue;
        } // if
    });
    const handleTransformValue = useEvent<TransformValueHandler<AddressModel>>((value, edit, model) => {
        return {
            id     : model.id,
            
            [edit] : value,
        };
    });
    
    
    
    // jsx:
    return (
        <SimpleEditModelDialog<AddressModel>
            // other props:
            {...props as unknown as ImplementedSimpleEditModelDialogProps<AddressModel>}
            
            
            
            // data:
            initialValue={handleInitialValue}
            transformValue={handleTransformValue}
            
            
            
            // stores:
            updateModelApi={useUpdateOrder as () => UpdateModelApi<AddressModel>}
        />
    );
};
