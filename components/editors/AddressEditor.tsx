// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    type DropdownListExpandedChangeEvent
}                           from '@reusable-ui/components'

// heymarco components:
import {
    // react components:
    type SelectCountryEditorProps,
    SelectCountryEditor,
}                           from '@heymarco/select-country-editor'
import {
    // react components:
    SelectStateEditor,
}                           from '@heymarco/select-state-editor'
import {
    // react components:
    SelectCityEditor,
}                           from '@heymarco/select-city-editor'
import {
    // types:
    type Address,
    
    
    
    // react components:
    AddressEditorProps as BaseAddressEditorProps,
    AddressEditor      as BaseAddressEditor,
}                           from '@heymarco/address-editor'
export *                    from '@heymarco/address-editor'



// utilities:
export const emptyAddress : Address = {
    country   : '',
    state     : '',
    city      : '',
    zip       : '',
    address   : '',
    
    firstName : '',
    lastName  : '',
    phone     : '',
}



// react components:
export interface AddressEditorProps<out TElement extends Element = HTMLFormElement>
    extends
        // bases:
        BaseAddressEditorProps<TElement>
{
    // values:
    countryOptions ?: SelectCountryEditorProps['valueOptions']
}
const AddressEditor = <TElement extends Element = HTMLFormElement>(props: AddressEditorProps<TElement>): JSX.Element|null => {
    // props:
    const {
        // values:
        countryOptions,
        
        
        
        // other props:
        ...restAddressEditorProps
    } = props;
    
    
    
    // default props:
    const {
        // semantics:
        tag = 'form',
        
        
        
        // components:
        countryEditorComponent=(
            <SelectCountryEditor />
        ),
        stateEditorComponent=(
            <SelectStateEditor />
        ),
        cityEditorComponent=(
            <SelectCityEditor />
        ),
        
        
        
        // other props:
        ...restBaseAddressEditorProps
    } = restAddressEditorProps;
    
    
    
    // jsx:
    return (
        <BaseAddressEditor<TElement>
            // other props:
            {...restBaseAddressEditorProps}
            
            
            
            // semantics:
            tag={tag}
            
            
            
            // components:
            countryEditorComponent={!countryEditorComponent ? undefined : (React.cloneElement<SelectCountryEditorProps<Element, React.SyntheticEvent<unknown, Event>, DropdownListExpandedChangeEvent<string>>>(countryEditorComponent,
                // props:
                {
                    valueOptions : countryOptions,
                },
            ) as typeof countryEditorComponent)}
            stateEditorComponent={stateEditorComponent}
            cityEditorComponent={cityEditorComponent}
        />
    );
};
export {
    AddressEditor,            // named export for readibility
    AddressEditor as default, // default export to support React.lazy
}
