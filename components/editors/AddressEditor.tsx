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
        />
    );
};
export {
    AddressEditor,            // named export for readibility
    AddressEditor as default, // default export to support React.lazy
}
