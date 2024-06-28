// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useMemo,
}                           from 'react'

// heymarco components:
import {
    // react components:
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
    TextEditor,
}                           from '@heymarco/text-editor'
import {
    NameEditor,
}                           from '@heymarco/name-editor'
import {
    PhoneEditor,
}                           from '@heymarco/phone-editor'
import {
    // react components:
    AddressEditorProps as BaseAddressEditorProps,
    AddressEditor      as BaseAddressEditor,
}                           from '@heymarco/address-editor'

// stores:
import {
    useGetCountryList,
    useGetStateList,
    useGetCityList,
}                           from '@/store/features/api/apiSlice'



// react components:
export interface AddressEditorProps<out TElement extends Element = HTMLFormElement>
    extends
        // bases:
        BaseAddressEditorProps<TElement>
{
}
const AddressEditor = <TElement extends Element = HTMLFormElement>(props: AddressEditorProps<TElement>): JSX.Element|null => {
    // props:
    const {
        // other props:
        ...restAddressEditorProps
    } = props;
    
    
    // states:
    const [country, setCountry] = useState<string>(props.value?.country ?? '');
    const [state  , setState  ] = useState<string>(props.value?.state   ?? '');
    
    
    
    // stores:
    const [getCountryList] = useGetCountryList();
    const [getStateList  ] = useGetStateList();
    const [getCityList   ] = useGetCityList();
    
    const countryOptionsPromise = useMemo(() => {
        return getCountryList().unwrap();
    }, []);
    const stateOptionsPromise = useMemo(() => {
        if (!country) return [];
        return getStateList({ countryCode: country }).unwrap();
    }, [country]);
    const cityOptionsPromise = useMemo(() => {
        if (!country) return [];
        if (!state) return [];
        return getCityList({ countryCode: country, state: state }).unwrap();
    }, [country, state]);
    
    
    
    // default props:
    const {
        // semantics:
        tag = 'form',
        
        
        
        // components:
        countryEditorComponent=(
            <SelectCountryEditor theme='primary' onChange={setCountry} valueOptions={countryOptionsPromise} autoComplete='nope' />
        ),
        stateEditorComponent=(
            <SelectStateEditor theme='primary' onChange={setState} valueOptions={stateOptionsPromise} autoComplete='nope' />
        ),
        cityEditorComponent=(
            <SelectCityEditor theme='primary' valueOptions={cityOptionsPromise} autoComplete='nope' />
        ),
        zipEditorComponent=(
            <TextEditor aria-label='Zip (Postal) Code' autoComplete='nope' />
        ),
        addressEditorComponent=(
            <TextEditor aria-label='Street Address' autoComplete='nope' />
        ),
        firstNameEditorComponent=(
            <NameEditor aria-label='First Name' autoComplete='nope' />
        ),
        lastNameEditorComponent=(
            <NameEditor aria-label='Last Name' autoComplete='nope' />
        ),
        phoneEditorComponent=(
            <PhoneEditor autoComplete='nope' />
        ),
        
        
        
        // other props:
        ...restBaseAddressEditorProps
    } = restAddressEditorProps;
    console.log(restBaseAddressEditorProps.value);
    
    
    
    // jsx:
    return (
        <BaseAddressEditor<TElement>
            // other props:
            {...restBaseAddressEditorProps}
            
            
            
            // semantics:
            tag={tag}
            
            
            
            // components:
            countryEditorComponent={countryEditorComponent}
            stateEditorComponent={stateEditorComponent}
            cityEditorComponent={cityEditorComponent}
            zipEditorComponent={zipEditorComponent}
            addressEditorComponent={addressEditorComponent}
            firstNameEditorComponent={firstNameEditorComponent}
            lastNameEditorComponent={lastNameEditorComponent}
            phoneEditorComponent={phoneEditorComponent}
        />
    );
};
export {
    AddressEditor,            // named export for readibility
    AddressEditor as default, // default export to support React.lazy
}
