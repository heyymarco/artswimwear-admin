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
    Address,
    emptyAddress,
}                           from '@/components/editors/AddressEditor'

// models:
import type {
    OrderDetail,
}                           from '@/models'

// stores:
import {
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
        shippingAddress ?: Address|null
        billingAddress  ?: Address|null
    }
    const handleInitialValue   = useEvent<InitialValueHandler<AddressModel>>((edit, model) => {
        if (edit === 'billingAddress') {
            const modelRaw = (model as unknown as OrderDetail).payment.billingAddress ?? emptyAddress;
            return {
                ...modelRaw,
                zip : modelRaw.zip ?? '',
            };
        }
        else {
            const modelRaw = model[edit] ?? emptyAddress;
            return {
                ...modelRaw,
                zip : modelRaw.zip ?? '',
            };
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
