// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
}                           from 'react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'           // writes css in react hook

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // react components:
    IndicatorProps,
    Indicator,
}                           from '@reusable-ui/indicator'       // a base component

// internals:
import type {
    // types:
    EditorChangeEventHandler,
    
    
    
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



// utilities:
const emptyAddressValue : AddressValue = {
    firstName : '',
    lastName  : '',
    
    phone     : '',
    
    address   : '',
    city      : '',
    zone      : '',
    zip       : '',
    country   : '',
};



// react components:
export type AddressValue = Omit<AddressSchema, '_id'>
export interface AddressEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Pick<EditorProps<TElement, AddressValue>,
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
    const [valueDn, setValueDn] = useState<AddressValue>((value !== undefined) ? value : ((defaultValue !== undefined) ? defaultValue : emptyAddressValue));
    
    
    
    /*
     * value state is based on [controllable value] (if set) and fallback to [uncontrollable value]
     */
    const valueFn : AddressValue = (value !== undefined) ? value /*controllable*/ : valueDn /*uncontrollable*/;
    
    
    
    // events:
    /*
          controllable : setValue(new) => update state(old => old) => trigger Event(new)
        uncontrollable : setValue(new) => update state(old => new) => trigger Event(new)
    */
    const triggerValueChange = useEvent<EditorChangeEventHandler<AddressValue>>((value) => {
        if (onChange) {
            // fire `onChange` react event:
            onChange(value);
        };
    });
    
    
    
    // callbacks:
    const setValue = useEvent<React.Dispatch<React.SetStateAction<AddressValue>>>((value) => {
        // conditions:
        const newValue = (typeof(value) === 'function') ? value(valueFn) : value;
        if (newValue === valueFn) return; // still the same => nothing to update
        
        
        
        // update:
        setValueDn(newValue);
        triggerValueChange(newValue);
    }); // a stable callback, the `setValue` guaranteed to never change
    
    
    
    // handlers:
    const handleFirstNameChange = useEvent<React.ChangeEventHandler<HTMLInputElement>>(({target:{value}}) => {
        setValue((current) => ({ ...current, firstName : value }));
    });
    const handleLastNameChange  = useEvent<React.ChangeEventHandler<HTMLInputElement>>(({target:{value}}) => {
        setValue((current) => ({ ...current, lastName  : value }));
    });
    
    const handlePhoneChange     = useEvent<React.ChangeEventHandler<HTMLInputElement>>(({target:{value}}) => {
        setValue((current) => ({ ...current, phone     : value }));
    });
    
    const handleAddressChange   = useEvent<React.ChangeEventHandler<HTMLInputElement>>(({target:{value}}) => {
        setValue((current) => ({ ...current, address   : value }));
    });
    const handleCityChange      = useEvent<React.ChangeEventHandler<HTMLInputElement>>(({target:{value}}) => {
        setValue((current) => ({ ...current, city      : value }));
    });
    const handleZoneChange      = useEvent<React.ChangeEventHandler<HTMLInputElement>>(({target:{value}}) => {
        setValue((current) => ({ ...current, zone      : value }));
    });
    const handleZipChange       = useEvent<React.ChangeEventHandler<HTMLInputElement>>(({target:{value}}) => {
        setValue((current) => ({ ...current, zip       : value }));
    });
    const handleCountryChange   = useEvent<React.ChangeEventHandler<HTMLInputElement>>(({target:{value}}) => {
        setValue((current) => ({ ...current, country   : value }));
    });
    
    
    
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
                onFirstNameChange = {handleFirstNameChange}
                onLastNameChange  = {handleLastNameChange }
                
                onPhoneChange     = {handlePhoneChange    }
                
                onAddressChange   = {handleAddressChange  }
                onCityChange      = {handleCityChange     }
                onZoneChange      = {handleZoneChange     }
                onZipChange       = {handleZipChange      }
                onCountryChange   = {handleCountryChange  }
            />
        </Indicator>
    );
};
export {
    AddressEditor,
    AddressEditor as default,
}
