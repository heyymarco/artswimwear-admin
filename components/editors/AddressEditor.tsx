// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useMemo,
    useEffect,
    useRef,
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
    // hooks:
    // useGetCountryList,
    // useGetStateList,
    // useGetCityList,
    
    
    
    // apis:
    getCountryList,
    getStateList,
    getCityList,
}                           from '@/store/features/api/apiSlice'
import {
    // hooks:
    useAppDispatch,
}                           from '@/store/hooks'



// react components:
export interface AddressEditorProps<out TElement extends Element = HTMLFormElement>
    extends
        // bases:
        BaseAddressEditorProps<TElement>
{
    // accessibilities:
    autoComplete ?: boolean
}
const AddressEditor = <TElement extends Element = HTMLFormElement>(props: AddressEditorProps<TElement>): JSX.Element|null => {
    // props:
    const {
        // accessibilities:
        autoComplete = false,
        
        
        
        // other props:
        ...restAddressEditorProps
    } = props;
    
    
    // states:
    const [country, setCountry] = useState<string>(props.value?.country ?? '');
    const [state  , setState  ] = useState<string>(props.value?.state   ?? '');
    
    
    
    // stores:
    const dispatch = useAppDispatch();
    
    const mountedSignalRef = useRef<((isMounted: boolean) => void)|null>(null);
    const [mountedPromise] = useState<Promise<boolean>>(() =>
        new Promise<boolean>((resolve) => {
            mountedSignalRef.current = resolve;
        })
    );
    useEffect(() => {
        // setups:
        mountedSignalRef.current?.(true); // signal that the component is mounted;
        mountedSignalRef.current = null;  // no more signaling in the future
        
        
        
        // cleanups:
        return () => {
            mountedSignalRef.current?.(false); // signal that the component is never mounted;
            mountedSignalRef.current = null;  // no more signaling in the future
        };
    }, []);
    
    const countryOptionsPromise = useMemo(() => {
        return mountedPromise.then((isMounted) => {
            // conditions:
            if (!isMounted) return []; // the component was unmounted before waiting for fully_mounted => return empty
            
            
            
            // actions:
            return dispatch(getCountryList()).unwrap();
        });
    }, []);
    const stateOptionsPromise = useMemo(() => {
        if (!country) return [];
        return mountedPromise.then((isMounted) => {
            // conditions:
            if (!isMounted) return []; // the component was unmounted before waiting for fully_mounted => return empty
            
            
            
            // actions:
            return dispatch(getStateList({ countryCode: country })).unwrap();
        });
    }, [country]);
    const cityOptionsPromise = useMemo(() => {
        if (!country) return [];
        if (!state) return [];
        return mountedPromise.then((isMounted) => {
            // conditions:
            if (!isMounted) return []; // the component was unmounted before waiting for fully_mounted => return empty
            
            
            
            // actions:
            return dispatch(getCityList({ countryCode: country, state: state })).unwrap();
        });
    }, [country, state]);
    
    
    
    // default props:
    const {
        // semantics:
        tag = 'form',
        
        
        
        // components:
        countryEditorComponent=(
            <SelectCountryEditor theme='primary' onChange={setCountry} valueOptions={countryOptionsPromise} autoComplete={!autoComplete ? 'nope' : undefined} />
        ),
        stateEditorComponent=(
            <SelectStateEditor theme='primary' onChange={setState} valueOptions={stateOptionsPromise} autoComplete={!autoComplete ? 'nope' : undefined} minLength={3} maxLength={50} />
        ),
        cityEditorComponent=(
            <SelectCityEditor theme='primary' valueOptions={cityOptionsPromise} autoComplete={!autoComplete ? 'nope' : undefined} minLength={3} maxLength={50} />
        ),
        zipEditorComponent=(
            <TextEditor aria-label='Zip (Postal) Code' autoComplete={!autoComplete ? 'nope' : undefined} minLength={2} maxLength={11} />
        ),
        addressEditorComponent=(
            <TextEditor aria-label='Street Address' autoComplete={!autoComplete ? 'nope' : undefined} minLength={5} maxLength={90} />
        ),
        companyEditorComponent=(
            <NameEditor aria-label='Company' autoComplete={!autoComplete ? 'nope' : undefined} minLength={2} maxLength={30} />
        ),
        firstNameEditorComponent=(
            <NameEditor aria-label='First Name' autoComplete={!autoComplete ? 'nope' : undefined} minLength={2} maxLength={30} />
        ),
        lastNameEditorComponent=(
            <NameEditor aria-label='Last Name' autoComplete={!autoComplete ? 'nope' : undefined} minLength={1} maxLength={30} />
        ),
        phoneEditorComponent=(
            <PhoneEditor autoComplete={!autoComplete ? 'nope' : undefined} minLength={5} maxLength={15} />
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
            countryEditorComponent={countryEditorComponent}
            stateEditorComponent={stateEditorComponent}
            cityEditorComponent={cityEditorComponent}
            zipEditorComponent={zipEditorComponent}
            addressEditorComponent={addressEditorComponent}
            companyEditorComponent={companyEditorComponent}
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
