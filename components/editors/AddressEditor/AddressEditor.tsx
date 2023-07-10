// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useRef,
    useEffect,
}                           from 'react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'           // writes css in react hook

// reusable-ui components:
import {
    // react components:
    IndicatorProps,
    Indicator,
}                           from '@reusable-ui/indicator'       // a base component

// internals:
import type {
    // react components:
    EditorProps,
}                           from '@/components/editors/Editor'

import {
    // react components:
    AddressFieldsProps,
    AddressFields,
}                           from '@heymarco/address-fields'

// models:
import type {
    // types:
    AddressSchema,
}                           from '@/models/Address'

// libs:
import {
    countryList,
}                           from '@/libs/countryList'



// styles:
export const useAddressEditorStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles/styles')
, { id: 'fceq62seui' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



// react components:
export type AddressValue = Omit<AddressSchema, '_id'>
export interface AddressEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Pick<EditorProps<TElement, AddressValue|null>,
            // values:
            |'defaultValue' // supported
            |'value'        // supported
            |'onChange'     // supported
        >,
        Pick<AddressFieldsProps,
            // formats:
            |'addressType'
        >,
        Omit<IndicatorProps<TElement>,
            // values:
            |'defaultValue' // taken over by EditorProps
            |'value'        // taken over by EditorProps
            |'onChange'     // taken over by EditorProps
            
            
            
            // children:
            |'children'     // not supported
        >
{
}
const AddressEditor = <TElement extends Element = HTMLElement>(props: AddressEditorProps<TElement>): JSX.Element|null => {
    // styles:
    const styleSheet = useAddressEditorStyleSheet();
    
    
    
    // rest props:
    const {
        // values:
        defaultValue,
        value,
        onChange,
        
        
        
        // formats:
        addressType,
    ...restIndicatorProps} = props;
    
    
    
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
        <Indicator<TElement>
            // other props:
            {...restIndicatorProps}
            
            
            
            // variants:
            nude={props.nude ?? true}
            
            
            
            // classes:
            mainClass={props.mainClass ?? styleSheet.main}
        >
            <AddressFields
                // types:
                addressType       = {addressType}
                
                
                
                // values:
                firstName         = {valueFn?.firstName}
                lastName          = {valueFn?.lastName }
                
                phone             = {valueFn?.phone    }
                
                address           = {valueFn?.address  }
                city              = {valueFn?.city     }
                zone              = {valueFn?.zone     }
                zip               = {valueFn?.zip      }
                country           = {valueFn?.country  }
                countryList       = {countryList       }
                
                
                
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
        </Indicator>
    );
};
export {
    AddressEditor,
    AddressEditor as default,
}
