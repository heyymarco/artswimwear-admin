// react:
import {
    // react:
    default as React,
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
    
    
    
    // an accessibility management system:
    AccessibilityProvider,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// heymarco:
import {
    // utilities:
    useControllableAndUncontrollable,
}                           from '@heymarco/events'

// reusable-ui components:
import {
    // react components:
    IndicatorProps,
    
    
    
    // simple-components:
    Form,
}                           from '@reusable-ui/components'  // a set of official Reusable-UI components

// heymarco components:
import {
    // react components:
    AddressFieldsProps,
    AddressFields,
}                           from '@heymarco/address-fields'

// internals:
import type {
    // react components:
    EditorProps,
}                           from '@/components/editors/Editor'

// models:
import type {
    Address,
}                           from '@prisma/client'



// styles:
export const useAddressEditorStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles/styles')
, { id: 'fceq62seui' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



// utilities:
export const emptyAddressValue : AddressValue = {
    firstName : '',
    lastName  : '',
    
    phone     : '',
    
    address   : '',
    city      : '',
    zone      : '',
    zip       : '',
    country   : '',
};
Object.freeze(emptyAddressValue);



// react components:
export type AddressValue = Omit<Address, 'id'>
export interface AddressEditorProps
    extends
        // bases:
        Pick<EditorProps<HTMLElement, AddressValue>,
            // values:
            |'defaultValue' // supported
            |'value'        // supported
            |'onChange'     // supported
        >,
        Pick<AddressFieldsProps,
            // values:
            |'countryList'  // supported
            
            
            
            // formats:
            |'addressType'
        >,
        Omit<IndicatorProps<HTMLFormElement>,
            // refs:
            |'elmRef'       // overriden
            
            
            
            // values:
            |'defaultValue' // taken over by EditorProps
            |'value'        // taken over by EditorProps
            |'onChange'     // taken over by EditorProps
            
            
            
            // children:
            |'children'     // not supported
        >
{
    // refs:
    elmRef ?: AddressFieldsProps['addressRef']
}
const AddressEditor = (props: AddressEditorProps): JSX.Element|null => {
    // styles:
    const styleSheet = useAddressEditorStyleSheet();
    
    
    
    // rest props:
    const {
        // refs:
        elmRef,
        
        
        
        // values:
        defaultValue : defaultUncontrollableValue = emptyAddressValue,
        value        : controllableValue,
        onChange     : onControllableValueChange,
        countryList,
        
        
        
        // formats:
        addressType,
    ...restIndicatorProps} = props;
    
    const {
        // accessibilities:
        enabled,         // take
        inheritEnabled,  // take
        
        active,          // take
        inheritActive,   // take
        
        readOnly,        // take
        inheritReadOnly, // take
    ...restFormProps} = restIndicatorProps;
    
    
    
    // states:
    const {
        value              : value,
        triggerValueChange : triggerValueChange,
    } = useControllableAndUncontrollable<AddressValue>({
        defaultValue       : defaultUncontrollableValue,
        value              : controllableValue,
        onValueChange      : onControllableValueChange,
    });
    
    
    
    // utilities:
    const setValue = useEvent<React.Dispatch<React.SetStateAction<AddressValue>>>((newValueFn) => {
        // conditions:
        const newValue = (typeof(newValueFn) === 'function') ? newValueFn(value) : newValueFn;
        if (newValue === value) return; // still the same => nothing to update
        
        
        
        // update:
        triggerValueChange(newValue, { triggerAt: 'immediately' });
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
        <Form
            // other props:
            {...restFormProps}
            
            
            
            // variants:
            nude={props.nude ?? true}
            
            
            
            // classes:
            mainClass={props.mainClass ?? styleSheet.main}
        >
            <AccessibilityProvider
                // accessibilities:
                enabled         = {enabled        }
                inheritEnabled  = {inheritEnabled }
                
                active          = {active         }
                inheritActive   = {inheritActive  }
                
                readOnly        = {readOnly       }
                inheritReadOnly = {inheritReadOnly}
            >
                <AddressFields
                    // refs:
                    addressRef={elmRef}
                    
                    
                    
                    // types:
                    addressType       = {addressType}
                    
                    
                    
                    // values:
                    firstName         = {value.firstName       }
                    lastName          = {value.lastName        }
                    
                    phone             = {value.phone           }
                    
                    address           = {value.address         }
                    city              = {value.city            }
                    zone              = {value.zone            }
                    zip               = {value.zip ?? undefined}
                    country           = {value.country         }
                    countryList       = {countryList           }
                    
                    
                    
                    // handlers:
                    onFirstNameChange = {handleFirstNameChange}
                    onLastNameChange  = {handleLastNameChange }
                    
                    onPhoneChange     = {handlePhoneChange    }
                    
                    onAddressChange   = {handleAddressChange  }
                    onCityChange      = {handleCityChange     }
                    onZoneChange      = {handleZoneChange     }
                    onZipChange       = {handleZipChange      }
                    onCountryChange   = {handleCountryChange  }
                />
            </AccessibilityProvider>
        </Form>
    );
};
export {
    AddressEditor,
    AddressEditor as default,
}
