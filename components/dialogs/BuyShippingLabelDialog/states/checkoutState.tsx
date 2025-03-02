// react:
import {
    // react:
    default as React,
    
    
    
    // contexts:
    createContext,
    
    
    
    // hooks:
    useContext,
    useMemo,
    useRef,
    useState,
}                           from 'react'

// redux:
import type {
    EntityState
}                           from '@reduxjs/toolkit'

// reusable-ui core:
import {
    // a responsive management system:
    breakpoints,
    
    
    
    // a set of client-side functions.:
    isClientSide,
    
    
    
    // react helper hooks:
    useIsomorphicLayoutEffect,
    useEvent,
    EventHandler,
    useMountedFlag,
    type TimerPromise,
    useSetTimeout,
    
    
    
    // an accessibility management system:
    AccessibilityProvider,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    ButtonIcon,
    
    
    
    // utility-components:
    WindowResizeCallback,
    useWindowResizeObserver,
    useDialogMessage,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// models:
import {
    type OrderDetail,
    type OrderCurrencyDetail,
    
    type DefaultShippingOriginDetail,
    type ShippingAddressDetail,
    type ShippingPreview,
    
    type ShippingLabelDetail,
}                           from '@/models'

// stores:
import {
    // hooks:
    useGetDefaultShippingOrigin,
    useGetShippingLabelRates,
    useGetShippingList,
}                           from '@/store/features/api/apiSlice'

// internals:
import {
    type CheckoutStep,
    type BusyState,
    type ExpandedAddress,
    type FixedMatchingShipping,
}                           from './types'
import {
    calculateCheckoutProgress,
}                           from './utilities'
import {
    getInvalidFields,
}                           from '@/libs/css-selectors'



// hooks:

// states:

//#region checkoutState

// contexts:
export interface CheckoutState {
    // states:
    checkoutStep                 : CheckoutStep
    checkoutProgress             : number
    
    isBusy                       : BusyState,
    
    isCheckoutLoading            : boolean
    isCheckoutError              : boolean
    isCheckoutReady              : boolean
    isCheckoutFinished           : boolean
    
    
    
    // address data:
    addressValidation            : boolean
    setAddressValidation         : EventHandler<boolean>
    originAddress                : Omit<DefaultShippingOriginDetail, 'id'>|null
    setOriginAddress             : EventHandler<Omit<DefaultShippingOriginDetail, 'id'>|null>
    shippingAddress              : ShippingAddressDetail|null
    setShippingAddress           : EventHandler<ShippingAddressDetail|null>
    expandedAddress              : ExpandedAddress|null
    setExpandedAddress           : EventHandler<ExpandedAddress|null>
    
    
    
    // shipping data:
    preferedShippingProvider     : FixedMatchingShipping | null
    preferedShippingLabel        : ShippingLabelDetail   | null
    shippingLabel                : ShippingLabelDetail   | undefined
    setShippingLabel             : (shippingLabel: ShippingLabelDetail) => void
    
    
    
    // payment data:
    preferedCurrency             : OrderCurrencyDetail   | null
    
    
    
    // relation data:
    shippingLabelList            : EntityState<ShippingLabelDetail, string> | undefined
    shippingList                 : EntityState<ShippingPreview, string> | undefined
    
    
    
    // sections:
    originAddressSectionRef      : React.MutableRefObject<HTMLElement|null>      | undefined
    shippingAddressSectionRef    : React.MutableRefObject<HTMLElement|null>      | undefined
    shippingMethodOptionRef      : React.MutableRefObject<HTMLElement|null>      | undefined
    currentStepSectionRef        : React.MutableRefObject<HTMLElement|null>      | undefined
    
    
    
    // fields:
    originAddressInputRef        : React.MutableRefObject<HTMLInputElement|null> | undefined
    shippingAddressInputRef      : React.MutableRefObject<HTMLInputElement|null> | undefined
    
    
    
    // actions:
    gotoStepInformation          : () => void
    gotoStepShipping             : () => Promise<boolean>
    gotoPayment                  : () => Promise<boolean>
    
    refetchCheckout              : () => void
}

const noopSetter   : EventHandler<unknown> = () => {};
const noopCallback = () => {};
const CheckoutStateContext = createContext<CheckoutState>({
    // states:
    checkoutStep                 : 'INFO',
    checkoutProgress             : 0,
    
    isBusy                       : false,
    
    isCheckoutLoading            : false,
    isCheckoutError              : false,
    isCheckoutReady              : false,
    isCheckoutFinished           : false,
    
    
    
    // address data:
    addressValidation            : false,
    setAddressValidation         : noopSetter,
    originAddress                : null,
    setOriginAddress             : noopSetter,
    shippingAddress              : null,
    setShippingAddress           : noopSetter,
    expandedAddress              : null,
    setExpandedAddress           : noopSetter,
    
    
    
    // shipping data:
    preferedShippingProvider     : null,
    preferedShippingLabel        : null,
    shippingLabel                : undefined,
    setShippingLabel             : noopSetter,
    
    
    
    // payment data:
    preferedCurrency             : null,
    
    
    
    // relation data:
    shippingLabelList            : undefined,
    shippingList                 : undefined,
    
    
    
    // sections:
    originAddressSectionRef      : undefined,
    shippingAddressSectionRef    : undefined,
    shippingMethodOptionRef      : undefined,
    currentStepSectionRef        : undefined,
    
    
    
    // fields:
    originAddressInputRef        : undefined,
    shippingAddressInputRef      : undefined,
    
    
    
    // actions:
    gotoStepInformation          : noopCallback,
    gotoStepShipping             : noopCallback as any,
    gotoPayment                  : noopCallback as any,
    
    refetchCheckout              : noopCallback,
});
CheckoutStateContext.displayName  = 'CheckoutState';

export const useCheckoutState = (): CheckoutState => {
    return useContext(CheckoutStateContext);
}



// react components:
export interface CheckoutStateProps {
    // data:
    order : OrderDetail
}
const CheckoutStateProvider = (props: React.PropsWithChildren<CheckoutStateProps>): JSX.Element|null => {
    // props:
    const {
        // data:
        order,
        
        
        
        // children:
        children,
    } = props;
    const totalProductWeight = useMemo((): number => {
        return (
            order.items
            .reduce((accum, {shippingWeight, quantity}) => {
                if (shippingWeight === null) return accum;
                return accum + (shippingWeight * quantity);
            }, 0)
        );
    }, [order]);
    const preferedShippingProviderId = order.shippingProviderId;
    const preferedCurrency = order.currency;
    
    
    
    // states:
    const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('INFO');
    const checkoutProgress = calculateCheckoutProgress(checkoutStep);
    const [isBusy , setIsBusyInternal] = useState<BusyState>(false);
    
    
    
    // utilities:
    const setTimeoutAsync = useSetTimeout();
    
    
    
    // address data:
    const [addressValidation, setAddressValidation] = useState<boolean>(false);
    const [originAddress    , setOriginAddress    ] = useState<Omit<DefaultShippingOriginDetail, 'id'>|null>(null);
    const [shippingAddress  , setShippingAddress  ] = useState<ShippingAddressDetail|null>(order.shippingAddress);
    const [expandedAddress  , setExpandedAddress  ] = useState<ExpandedAddress|null>('shippingAddress');
    
    
    
    // shipping data:
    const [shippingLabel, setShippingLabel] = useState<ShippingLabelDetail|undefined>(undefined);
    
    
    
    // apis:
    const {                    data: originAddressInitial, isLoading : isShippingOriginLoading, isError: isShippingOriginError, refetch: refetchShippingOrigin} = useGetDefaultShippingOrigin();
    const [getShippingLabels, {data: shippingLabelList   , isLoading : isShippingLabelLoading , isError: isShippingLabelError}] = useGetShippingLabelRates();
    const {                    data: shippingList        , isLoading : isShippingLoading      , isError: isShippingError      , refetch: refetchShipping      }  = useGetShippingList();
    
    
    
    const isLastCheckoutStep = (checkoutStep === 'PAID');
    const isCheckoutLoading              = (
        (
            // have any loading(s):
            
            isShippingOriginLoading
            ||
            (
                (isBusy !== 'checkCarriers')  // IGNORE shippingLoading if the business is triggered by next_button (the busy indicator belong to the next_button's icon)
                &&
                isShippingLabelLoading
            )
            ||
            isShippingLoading
        )
    );
    const isCheckoutError                = (
        !isCheckoutLoading // while still LOADING => consider as NOT error
        &&
        (
            // have any error(s):
            
            isShippingOriginError
            ||
            (
                (checkoutStep !== 'INFO') // IGNORE shippingError if on the info step (the `shippingLabelList` data is NOT YET required)
                &&
                isShippingLabelError
            )
            ||
            isShippingError
        )
    );
    const isCheckoutReady                = (
        !isCheckoutLoading // not still LOADING
        &&
        !isCheckoutError   // not having ERROR
    );
    const isCheckoutFinished             = (
        isCheckoutReady    // must have READY state
        &&
        isLastCheckoutStep // must at_the_last_step
    );
    
    
    
    const shippingLabelListEntities = shippingLabelList?.entities;
    const shippingListEntities      = shippingList?.entities;
    const shippingCost              = order.shippingCost ?? 0;
    const [
        preferedShippingProvider,
        preferedShippingLabel,
    ] = useMemo((): readonly [FixedMatchingShipping|null, ShippingLabelDetail|null] | null => {
        // conditions:
        if (!preferedShippingProviderId) return null; // no preference => ignore
        if (!shippingListEntities) return null; // the shippingList is not yet loaded => ignore
        if (!shippingLabelListEntities) return null;  // the shippingLabelList is not yet loaded => ignore
        
        
        
        // actions:
        const preferedShippingProviderRaw   = !preferedShippingProviderId ? null : (shippingListEntities[preferedShippingProviderId] ?? null);
        const preferedShippingProviderName  = preferedShippingProviderRaw?.name.toLowerCase() ?? null;
        if (!preferedShippingProviderName) return null;
        const preferedShippingLabel = (
            Object.values(shippingLabelListEntities)
            .filter((shippingLabel): shippingLabel is Exclude<typeof shippingLabel, undefined> => (shippingLabel !== undefined))
            .find((shippingLabel) =>
                (shippingLabel.name.toLowerCase() === preferedShippingProviderName)
            )
            ??
            null
        );
        
        
        
        return [
            (preferedShippingProviderRaw === null) ? null : {
                ...preferedShippingProviderRaw,
                rates : shippingCost,
            } satisfies FixedMatchingShipping,
            preferedShippingLabel
        ];
    }, [preferedShippingProviderId, shippingListEntities, shippingLabelListEntities, shippingCost]) ?? [ null, null ];
    
    
    
    // refs:
    const originAddressSectionRef   = useRef<HTMLElement|null>(null);
    const shippingAddressSectionRef = useRef<HTMLElement|null>(null);
    const shippingMethodOptionRef   = useRef<HTMLElement|null>(null);
    
    const originAddressInputRef     = useRef<HTMLInputElement|null>(null);
    const shippingAddressInputRef   = useRef<HTMLInputElement|null>(null);
    const currentStepSectionRef     = useRef<HTMLElement|null>(null);
    
    
    
    // effects:
    useIsomorphicLayoutEffect(() => {
        // conditions:
        if (!originAddressInitial) return;
        
        
        
        // actions:
        setOriginAddress(originAddressInitial);
    }, [originAddressInitial]);
    
    // auto scroll to top on checkoutStep changed:
    const isSubsequentStep = useRef<boolean>(false);
    useIsomorphicLayoutEffect(() => {
        // conditions:
        if (typeof(window) === 'undefined') return; // noop on server_side
        
        
        
        // actions:
        if (isSubsequentStep.current) {
            const currentStepSectionElm = currentStepSectionRef.current;
            window.document.scrollingElement?.scrollTo({
                top      : 0,
                behavior : currentStepSectionElm ? 'auto' : 'smooth',
            });
            currentStepSectionElm?.scrollIntoView({
                block    : 'start',
                behavior : 'smooth',
            });
        } // if
        isSubsequentStep.current = true;
    }, [checkoutStep]);
    
    // auto select prefered shipping label:
    useIsomorphicLayoutEffect(() => {
        // conditions:
        if (!!shippingLabel && shippingLabelListEntities && Object.values(shippingLabelListEntities).includes(shippingLabel)) return; // the selected label is already choosen and valid => ignore
        
        
        
        // actions:
        setShippingLabel(preferedShippingLabel ?? undefined);
    }, [shippingLabelListEntities, preferedShippingLabel]);
    
    
    
    // dialogs:
    const {
        showMessageError,
        showMessageFieldError,
        showMessageFetchError,
    } = useDialogMessage();
    
    
    
    // stable callbacks:
    const setIsBusy            = useEvent((isBusy: BusyState) => {
        checkoutState.isBusy = isBusy; /* instant update without waiting for (slow|delayed) re-render */
        setIsBusyInternal(isBusy);
    });
    
    const gotoStepInformation   = useEvent((): void => {
        setCheckoutStep('INFO');
        
        
        
        // focus to (origin|shipping) address input:
        setTimeoutAsync(200)
        .then((isDone) => {
            // conditions:
            if (!isDone) return; // the component was unloaded before the timer runs => do nothing
            
            
            
            // actions:
            const focusInputElm = (() => {
                switch (expandedAddress) {
                    case 'originAddress':
                        return originAddressInputRef.current;
                    case 'shippingAddress':
                        return shippingAddressInputRef.current;
                } // switch
            })();
            if (focusInputElm) {
                focusInputElm.scrollIntoView({
                    block    : 'start',
                    behavior : 'smooth',
                });
                focusInputElm.focus({ preventScroll: true });
            } // if
        });
    });
    const gotoStepShipping      = useEvent(async (): Promise<boolean> => {
        const goForward = (checkoutStep === 'INFO');
        if (goForward) { // go forward from 'INFO' => do check shipping rates
            // validate:
            // enable validation and *wait* until the next re-render of validation_enabled before we're going to `querySelectorAll()`:
            setAddressValidation(true);
            
            // wait for a validation state applied:
            if (!(await setTimeoutAsync(0))) return false; // the component was unloaded before the timer runs => do nothing
            if (!(await setTimeoutAsync(0))) return false; // the component was unloaded before the timer runs => do nothing
            const originAddressFieldErrors   = getInvalidFields(originAddressSectionRef?.current);
            const shippingAddressFieldErrors = getInvalidFields(shippingAddressSectionRef?.current);
            if (originAddressFieldErrors?.length || shippingAddressFieldErrors?.length) { // there is an/some invalid field
                if (originAddressFieldErrors?.length) {
                    setExpandedAddress('originAddress');
                }
                else if (shippingAddressFieldErrors?.length) {
                    setExpandedAddress('shippingAddress');
                } // if
                
                
                
                showMessageFieldError(
                    originAddressFieldErrors?.length
                    ? originAddressFieldErrors
                    : shippingAddressFieldErrors
                );
                return false; // transaction aborted due to validation error
            } // if
            
            
            
            // check for available shippingLabel(s):
            setIsBusy('checkCarriers');
            try {
                const shippingLabelList = (!originAddress || !shippingAddress) ? undefined : await getShippingLabels({ // fire and forget
                    originAddress,
                    shippingAddress,
                    totalProductWeight,
                }).unwrap();
                
                
                
                if (!shippingLabelList?.ids.length) {
                    showMessageError({
                        title : <h1>No Available Shipping Label</h1>,
                        error : <>
                            <p>
                                We&apos;re sorry. There are <strong>no shipping label available</strong> for delivery from your origin to the customer&apos;s address.
                            </p>
                            <p>
                                Please verify that the <strong>country</strong>, <strong>state</strong>, <strong>city</strong>, and <strong>zip code</strong> are typed correctly, and then try again.
                            </p>
                            <p>
                                If the problem persists, please contact us for further assistance.
                            </p>
                        </>,
                    });
                    return false; // transaction failed due to no_shipping_carriers
                } // if
            }
            catch (error: any) {
                showMessageError({
                    title : <h1>Failed to Retrieve Data From Server</h1>,
                    error : <>
                        <p>
                            Oops, there was an error retrieving the shipping label list.
                        </p>
                        <p>
                            There was a <strong>problem contacting our server</strong>.<br />
                            Make sure your internet connection is available.
                        </p>
                        <p>
                            Please try again in a few minutes.<br />
                            If the problem still persists, please contact us manually.
                        </p>
                    </>,
                });
                return false; // transaction failed due to fetch_error
            }
            finally {
                setIsBusy(false);
            } // try
            
            
            
            setCheckoutStep('SHIPPING');
        } // if
        
        
        
        if (!goForward) { // go back from 'PAYMENT' => focus to shipping method option control
            // go backward to shipping method:
            setCheckoutStep('SHIPPING');
            
            
            
            // focus to shipping method:
            setTimeoutAsync(200)
            .then((isDone) => {
                // conditions:
                if (!isDone) return; // the component was unloaded before the timer runs => do nothing
                
                
                
                // actions:
                const focusInputElm = shippingMethodOptionRef.current;
                if (focusInputElm) {
                    focusInputElm.scrollIntoView({
                        block    : 'start',
                        behavior : 'smooth',
                    });
                    focusInputElm.focus({ preventScroll: true });
                } // if
            });
        } // if
        
        
        
        return true; // transaction completed
    });
    const gotoPayment           = useEvent(async (): Promise<boolean> => {
        // const goForward = ... // always go_forward, never go_backward after finishing the payment
        setCheckoutStep('PAYMENT');
        
        
        
        return true; // transaction completed
    });
    
    const refetchCheckout      = useEvent((): void => {
        if (isShippingOriginError && !isShippingOriginLoading) {
            refetchShippingOrigin();
        } // if
        
        if (isShippingLabelError && !isShippingLabelLoading && originAddress && shippingAddress) {
            getShippingLabels({ // fire and forget
                originAddress,
                shippingAddress,
                totalProductWeight,
            });
        } // if
        
        if (isShippingError && !isShippingLoading) {
            refetchShipping();
        } // if
    });
    
    
    
    // states:
    const checkoutState = useMemo<CheckoutState>(() => ({
        // states:
        checkoutStep,
        checkoutProgress,
        
        isBusy,
        
        isCheckoutLoading,
        isCheckoutError,
        isCheckoutReady,
        isCheckoutFinished,
        
        
        
        // address data:
        addressValidation,
        setAddressValidation,
        originAddress,
        setOriginAddress,
        shippingAddress,
        setShippingAddress,
        expandedAddress,
        setExpandedAddress,
        
        
        
        // shipping data:
        preferedShippingProvider,
        preferedShippingLabel,
        shippingLabel,
        setShippingLabel,
        
        
        
        // payment data:
        preferedCurrency,
        
        
        
        // relation data:
        shippingLabelList,
        shippingList,
        
        
        
        // sections:
        originAddressSectionRef,      // stable ref
        shippingAddressSectionRef,    // stable ref
        shippingMethodOptionRef,      // stable ref
        currentStepSectionRef,        // stable ref
        
        
        
        // fields:
        originAddressInputRef,        // stable ref
        shippingAddressInputRef,      // stable ref
        
        
        
        // actions:
        gotoStepInformation,          // stable ref
        gotoStepShipping,             // stable ref
        gotoPayment,                  // stable ref
        
        refetchCheckout,              // stable ref
    }), [
        // states:
        checkoutStep,
        checkoutProgress,
        
        isBusy,
        
        isCheckoutLoading,
        isCheckoutError,
        isCheckoutReady,
        isCheckoutFinished,
        
        
        
        // address data:
        addressValidation,
        setAddressValidation,
        originAddress,
        setOriginAddress,
        shippingAddress,
        setShippingAddress,
        expandedAddress,
        setExpandedAddress,
        
        
        
        // shipping data:
        preferedShippingProvider,
        preferedShippingLabel,
        shippingLabel,
        setShippingLabel,
        
        
        
        // payment data:
        preferedCurrency,
        
        
        
        // relation data:
        shippingLabelList,
        shippingList,
        
        
        
        // sections:
        // originAddressSectionRef,   // stable ref
        // shippingAddressSectionRef, // stable ref
        // shippingMethodOptionRef,   // stable ref
        // currentStepSectionRef,     // stable ref
        
        
        
        // fields:
        // originAddressInputRef,     // stable ref
        // shippingAddressInputRef,   // stable ref
        
        
        
        // actions:
        // gotoStepInformation,       // stable ref
        // gotoStepShipping,          // stable ref
        // gotoPayment,               // stable ref
        
        refetchCheckout,              // stable ref
    ]);
    
    
    
    // jsx:
    return (
        <CheckoutStateContext.Provider value={checkoutState}>
            <AccessibilityProvider
                // accessibilities:
                enabled={!isBusy} // disabled if busy
            >
                {children}
            </AccessibilityProvider>
        </CheckoutStateContext.Provider>
    );
};
export {
    CheckoutStateProvider,
    CheckoutStateProvider as default,
}
//#endregion checkoutState
