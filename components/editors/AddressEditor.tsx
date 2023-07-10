// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useRef,
    useEffect,
}                           from 'react'

// internals:
import type {
    // react components:
    EditorProps,
}                           from '@/components/editors/Editor'

import { AddressFieldsProps, AddressFields } from '@heymarco/address-fields'
import type { AddressSchema } from '@/models/Address'
import { countryList } from '@/libs/countryList'



// react components:
export type AddressValue = Omit<AddressSchema, '_id'>
export interface AddressEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<EditorProps<TElement, AddressValue|null>,
            // validations:
            |'minLength'|'maxLength' // not supported
            |'pattern'               // not supported
            |'min'|'max'|'step'      // not supported
            
            // formats:
            |'type'                  // not supported
            |'autoCapitalize'        // not supported
            |'inputMode'             // not supported
        >,
        Pick<AddressFieldsProps,
            // formats:
            |'addressType'
        >
{
}
const AddressEditor = <TElement extends Element = HTMLElement>(props: AddressEditorProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // values:
        defaultValue,
        value,
        onChange,
        
        
        
        // formats:
        addressType,
    ...restAddressFieldsProps} = props;
    
    
    
    // states:
    const [valueDn, setValueDn] = useState<AddressValue|null>((value !== undefined) ? value : ((defaultValue !== undefined) ? defaultValue : null));
    const prevValueDn = useRef<AddressValue|null>(valueDn);
    useEffect(() => {
        if (valueDn === prevValueDn.current) return;
        onChange?.(valueDn);
    }, [valueDn]);
    
    
    
    // fn states:
    const valueFn = (value !== undefined) ? value /*controllable*/ : valueDn /*uncontrollable*/;
    
    
    
    // jsx:
    return (
        <div>
            <AddressFields
                // other props:
                {...restAddressFieldsProps}
                
                
                
                // types:
                addressType       = {addressType}
                
                
                
                // values:
                firstName         = {valueFn?.firstName ?? ''}
                lastName          = {valueFn?.lastName  ?? ''}
                
                phone             = {valueFn?.phone     ?? ''}
                
                address           = {valueFn?.address   ?? ''}
                city              = {valueFn?.city      ?? ''}
                zone              = {valueFn?.zone      ?? ''}
                zip               = {valueFn?.zip       ?? ''}
                country           = {valueFn?.country   ?? ''}
                countryList       = {countryList}
                
                
                
                // events:
                onFirstNameChange = {({target:{value}}) => setValueDn((current) => ({ ...current, firstName : value }) as any)}
                onLastNameChange  = {({target:{value}}) => setValueDn((current) => ({ ...current, lastName  : value }) as any)}
                
                onPhoneChange     = {({target:{value}}) => setValueDn((current) => ({ ...current, phone     : value }) as any)}
                
                onAddressChange   = {({target:{value}}) => setValueDn((current) => ({ ...current, address   : value }) as any)}
                onCityChange      = {({target:{value}}) => setValueDn((current) => ({ ...current, city      : value }) as any)}
                onZoneChange      = {({target:{value}}) => setValueDn((current) => ({ ...current, zone      : value }) as any)}
                onZipChange       = {({target:{value}}) => setValueDn((current) => ({ ...current, zip       : value }) as any)}
                onCountryChange   = {({target:{value}}) => setValueDn((current) => ({ ...current, country   : value }) as any)}
            />
        </div>
    );
};
export {
    AddressEditor,
    AddressEditor as default,
}
