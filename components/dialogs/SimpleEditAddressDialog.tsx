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

// models:
import type {
    Address,
    OrderDetail,
}                           from '@/models'

// stores:
import {
    // hooks:
    useUpdateOrder,
}                           from '@/store/features/api/apiSlice'



// utilities:
export const emptyAddress : Address = {
    country   : '',
    state     : '',
    city      : '',
    zip       : null,
    address   : '',
    
    firstName : '',
    lastName  : '',
    phone     : '',
}



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
            return (model as unknown as OrderDetail).payment.billingAddress ?? emptyAddress;
        }
        else {
            return model[edit] ?? emptyAddress;
        } // if
    });
    const handleTransformValue = useEvent<TransformValueHandler<AddressModel>>((value, edit, model) => {
        return {
            id     : model.id,
            
            [edit] : {
                ...value,
                zip : value?.zip?.trim() || null, // null if empty_string
            },
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
