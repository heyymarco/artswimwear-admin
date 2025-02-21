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
    type DefaultShippingOriginDetail as Address,
}                           from '@/models'



// react components:
const EditOriginAddress = (): JSX.Element|null => {
    // states:
    const {
        // address data:
        addressValidation,
        
        originAddress,
        setOriginAddress,
        
        
        
        // fields:
        originAddressInputRef,
    } = useCheckoutState();
    
    const editorAddress = useMemo((): EditorAddress|null => {
        if (!originAddress) return null;
        return {
            ...originAddress,
            zip: originAddress.zip ?? '',
        };
    }, [originAddress]);
    
    
    
    // handlers:
    const handleChange = useEvent<EditorChangeEventHandler<EditorAddress|null, React.ChangeEvent<HTMLInputElement>>>((newValue, event) => {
        const address : Omit<Address, 'id'>|null = (
            !newValue
            ? null
            : (() => {
                const {
                    ...restValue
                } = newValue;
                return {
                    ...restValue,
                    zip : newValue.zip.trim() || null,
                } satisfies Omit<Address, 'id'>;
            })()
        );
        setOriginAddress(address);
    });
    
    
    
    // jsx:
    return (
        <ValidationProvider
            // validations:
            enableValidation={addressValidation}
        >
            <AddressEditor
                // refs:
                addressRef   = {originAddressInputRef}
                
                
                
                // accessibilities:
                autoComplete ={true}
                
                
                
                // types:
                addressType  = 'shipping'
                
                
                
                // values:
                value        = {editorAddress}
                onChange     = {handleChange}
            />
        </ValidationProvider>
    );
};;
export {
    EditOriginAddress,
    EditOriginAddress as default,
};
