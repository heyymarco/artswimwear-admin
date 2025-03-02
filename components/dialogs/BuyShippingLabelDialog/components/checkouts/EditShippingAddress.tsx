'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useMemo,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    
    
    
    // a validation management system:
    ValidationProvider,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// heymarco components:
import {
    type EditorChangeEventHandler,
}                           from '@heymarco/editor'

// internal components:
import {
    type Address as EditorAddress,
    AddressEditor,
}                           from '@/components/editors/AddressEditor'

// internals:
import {
    useCheckoutState,
}                           from '../../states/checkoutState'

// models:
import {
    type ShippingAddressDetail as Address,
    // type BillingAddressDetail  as Address, // the same thing
}                           from '@/models'



// react components:
const EditShippingAddress = (): JSX.Element|null => {
    // states:
    const {
        // address data:
        addressValidation,
        
        shippingAddress,
        setShippingAddress,
        
        
        
        // fields:
        shippingAddressInputRef,
    } = useCheckoutState();
    
    const editorAddress = useMemo((): EditorAddress|null => {
        if (!shippingAddress) return null;
        return {
            ...shippingAddress,
            company : '',
            zip: shippingAddress.zip ?? '',
        };
    }, [shippingAddress]);
    
    
    
    // handlers:
    const handleChange = useEvent<EditorChangeEventHandler<EditorAddress|null, React.ChangeEvent<HTMLInputElement>>>((newValue, event) => {
        const address : Address|null = (
            !newValue
            ? null
            : (() => {
                const {
                    company : _company,
                    ...restValue
                } = newValue;
                return {
                    ...restValue,
                    zip : newValue.zip.trim() || null,
                } satisfies Address;
            })()
        );
        setShippingAddress(address);
    });
    
    
    
    // jsx:
    return (
        <ValidationProvider
            // validations:
            enableValidation={addressValidation}
        >
            <AddressEditor
                // refs:
                addressRef   = {shippingAddressInputRef}
                
                
                
                // types:
                addressType  = 'shipping'
                
                
                
                // values:
                value        = {editorAddress}
                onChange     = {handleChange}
                
                
                
                // components:
                companyEditorComponent={null}
            />
        </ValidationProvider>
    );
};;
export {
    EditShippingAddress,
    EditShippingAddress as default,
};
