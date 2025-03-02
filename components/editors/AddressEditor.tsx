// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useEffect,
    useRef,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useIsomorphicLayoutEffect,
    useEvent,
    useMergeEvents,
    type TimerPromise,
    useSetTimeout,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// heymarco components:
import {
    type EditorChangeEventHandler,
}                           from '@heymarco/editor'
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
    type Address,
    // react components:
    AddressEditorProps as BaseAddressEditorProps,
    AddressEditor      as BaseAddressEditor,
}                           from '@heymarco/address-editor'
export {
    type Address,
}                           from '@heymarco/address-editor'

// stores:
import {
    // hooks:
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
    // refs:
    addressRef   ?: React.Ref<HTMLInputElement> // setter ref
    
    
    
    // accessibilities:
    autoComplete ?: boolean
}
const AddressEditor = <TElement extends Element = HTMLFormElement>(props: AddressEditorProps<TElement>): JSX.Element|null => {
    // props:
    const {
        // refs:
        addressRef,
        
        
        
        // accessibilities:
        autoComplete = false,
        
        
        
        // handlers:
        onChange,
        
        
        
        // other props:
        ...restAddressEditorProps
    } = props;
    
    
    
    // RTK Query hooks:
    const                { data: countryListData, isFetching: countryListFetching, isError: countryListError }  = useGetCountryList();
    const [getStateList, { data: stateListData  , isFetching: stateListFetching  , isError: stateListError   }] = useGetStateList();
    const [getCityList , { data: cityListData   , isFetching: cityListFetching   , isError: cityListError    }] = useGetCityList();
    
    
    
    // states:
    const [country, setCountry] = useState<string>(props.value?.country ?? '');
    const [state  , setState  ] = useState<string>(props.value?.state   ?? '');
    
    const [countryListPromise,                    ] = useState<[Promise<string[]>, (value: string[]) => void]>(() => {
        // Initialize a new unresolved promise:
        const { promise, resolve } = Promise.withResolvers<string[]>();
        return [promise, resolve];
    });
    const [stateListPromise  , setStateListPromise] = useState<[Promise<string[]>, (value: string[]) => void]>(() => {
        // Initialize a new unresolved promise:
        const { promise, resolve } = Promise.withResolvers<string[]>();
        return [promise, resolve];
    });
    const [cityListPromise   , setCityListPromise ] = useState<[Promise<string[]>, (value: string[]) => void]>(() => {
        // Initialize a new unresolved promise:
        const { promise, resolve } = Promise.withResolvers<string[]>();
        return [promise, resolve];
    });
    
    // Set stateListPromise when country changes:
    // We use `useIsomorphicLayoutEffect` instead of `useEffect` to get the list as quickly as possible before the browser has a chance to repaint the page.
    useIsomorphicLayoutEffect(() => {
        // Initialize a new unresolved promise:
        const { promise, resolve } = Promise.withResolvers<string[]>();
        setStateListPromise([promise, resolve]);
        
        
        
        if (!country) {
            resolve([]); // no selected country => the states cannot be determined => empty result
        }
        else {
            // fire a request and we will take care of the result later:
            getStateList({ countryCode: country });
        } // if
    }, [country, getStateList]);
    
    // Set cityListPromise when country or state changes:
    // We use `useIsomorphicLayoutEffect` instead of `useEffect` to get the list as quickly as possible before the browser has a chance to repaint the page.
    useIsomorphicLayoutEffect(() => {
        // Initialize a new unresolved promise:
        const { promise, resolve } = Promise.withResolvers<string[]>();
        setCityListPromise([promise, resolve]);
        
        
        
        if (!country || !state) {
            resolve([]); // no selected country or state => the cities cannot be determined => empty result
        }
        else {
            // fire a request and we will take care of the result later:
            getCityList({ countryCode: country, state: state });
        } // if
    }, [country, state, getCityList]);
    
    // Listen for countryListData and countryListError:
    // We use `useIsomorphicLayoutEffect` instead of `useEffect` to get the list as quickly as possible before the browser has a chance to repaint the page.
    useIsomorphicLayoutEffect(() => {
        const [, resolve] = countryListPromise;
        if (countryListError) {
            resolve([]); // the countries cannot be resolved => empty result
        }
        else if (countryListFetching) {
            // do nothing, just wait until the data is ready
        }
        else if (countryListData) {
            resolve(countryListData);
        } // if
    }, [countryListData, countryListError, countryListFetching, countryListPromise]);
    
    // Listen for stateListData and stateListError:
    // We use `useIsomorphicLayoutEffect` instead of `useEffect` to get the list as quickly as possible before the browser has a chance to repaint the page.
    useIsomorphicLayoutEffect(() => {
        const [, resolve] = stateListPromise;
        if (stateListError) {
            resolve([]); // the states cannot be resolved => empty result
        }
        else if (stateListFetching) {
            // do nothing, just wait until the data is ready
        }
        else if (stateListData) {
            resolve(stateListData);
        } // if
    }, [stateListData, stateListError, stateListFetching, stateListPromise]);
    
    // Listen for cityListData and cityListError:
    // We use `useIsomorphicLayoutEffect` instead of `useEffect` to get the list as quickly as possible before the browser has a chance to repaint the page.
    useIsomorphicLayoutEffect(() => {
        const [, resolve] = cityListPromise;
        if (cityListError) {
            resolve([]); // the cities cannot be resolved => empty result
        }
        else if (cityListFetching) {
            // do nothing, just wait until the data is ready
        }
        else if (cityListData) {
            resolve(cityListData);
        } // if
    }, [cityListData, cityListError, cityListFetching, cityListPromise]);
    
    // Handle component unmount:
    // We use `useEffect` instead of `useIsomorphicLayoutEffect` because it doesn't need to be done quickly since the component is already unmounted.
    const setTimeoutAsync = useSetTimeout();
    const delayedCleanup  = useRef<TimerPromise<boolean>|null>(null);
    useEffect(() => {
        // setups:
        // abort the previous delayed cleanup (if any):
        delayedCleanup.current?.abort();
        
        
        
        // cleanups:
        return () => {
            // prevents double cleanup when in dev mode with strictMode:
            (delayedCleanup.current = setTimeoutAsync(100)).then((isDone) => {
                // conditions:
                if (!isDone) return; // the component was unloaded before the timer runs => do nothing
                
                
                
                // actions:
                // if the promises are not resolved until the component unmounts, resolve them as an empty result:
                const [, resolveCountry] = countryListPromise;
                const [, resolveState  ] = stateListPromise;
                const [, resolveCity   ] = cityListPromise;
                resolveCountry([]);
                resolveState([]);
                resolveCity([]);
            });
        };
    }, [countryListPromise, stateListPromise, cityListPromise]);
    
    
    
    // handlers:
    const handleChangeInternal = useEvent<EditorChangeEventHandler<Address|null, React.ChangeEvent<HTMLInputElement>>>((value) => {
        // conditions:
        if (props.value !== undefined) return; // sync `country` and `state` for uncontrollable value only
        
        
        
        // actions:
        setCountry(value?.country ?? '');
        setState(value?.state     ?? '');
    });
    const handleChange = useMergeEvents(
        // preserves the original `onChange` from `props`:
        onChange,
        
        
        
        // actions:
        handleChangeInternal,
    );
    
    // effects:
    // We use `useEffect` instead of `useIsomorphicLayoutEffect` because the subsequent updates happen after the component is fully mounted.
    useEffect(() => {
        // conditions:
        if (props?.value === undefined) return; // sync `country` and `state` for controllable value only
        
        
        
        // actions:
        setCountry(props.value?.country ?? '');
        setState(props.value?.state     ?? '');
    }, [props.value, props.value?.country, props.value?.state]);
    
    
    
    // default props:
    const {
        // components:
        countryEditorComponent=(
            <SelectCountryEditor theme='primary' valueOptions={countryListPromise?.[0]} autoComplete={!autoComplete ? 'nope' : undefined} />
        ),
        stateEditorComponent=(
            <SelectStateEditor theme='primary' valueOptions={stateListPromise?.[0]} autoComplete={!autoComplete ? 'nope' : undefined} minLength={3} maxLength={50} />
        ),
        cityEditorComponent=(
            <SelectCityEditor theme='primary' valueOptions={cityListPromise?.[0]} autoComplete={!autoComplete ? 'nope' : undefined} minLength={3} maxLength={50} />
        ),
        zipEditorComponent=(
            <TextEditor aria-label='Zip (Postal) Code' autoComplete={!autoComplete ? 'nope' : undefined} minLength={2} maxLength={11} />
        ),
        addressEditorComponent=(
            <TextEditor aria-label='Street Address' autoComplete={!autoComplete ? 'nope' : undefined} minLength={5} maxLength={90} elmRef={addressRef} />
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
            
            
            
            // handlers:
            onChange={handleChange}
        />
    );
};
export {
    AddressEditor,            // named export for readibility
    AddressEditor as default, // default export to support React.lazy
}
