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
    type DefaultShippingOriginDetail,
    type ShippingAddressDetail,
}                           from '@/models'

// stores:
import {
    // hooks:
    useGetDefaultShippingOrigin,
}                           from '@/store/features/api/apiSlice'

// internals:
import {
    type CheckoutStep,
    type BusyState,
    type ExpandedAddress,
}                           from './types'
import {
    calculateCheckoutProgress,
}                           from './utilities'



// utilities:
const invalidSelector = ':is(.invalidating, .invalidated):not([aria-invalid="false"])';



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
    
    
    
    // sections:
    originAddressSectionRef      : React.MutableRefObject<HTMLElement|null>      | undefined
    shippingAddressSectionRef    : React.MutableRefObject<HTMLElement|null>      | undefined
    
    
    
    // fields:
    originAddressInputRef        : React.MutableRefObject<HTMLInputElement|null> | undefined
    shippingAddressInputRef      : React.MutableRefObject<HTMLInputElement|null> | undefined
    carrierOptionRef             : React.MutableRefObject<HTMLInputElement|null> | undefined
    
    
    
    // actions:
    gotoStepInformation          : () => void
    gotoStepSelectCarrier        : () => Promise<boolean>
    gotoPayment                  : () => Promise<boolean>
    
    refetchCheckout              : () => void
}

const noopSetter   : EventHandler<unknown> = () => {};
const noopCallback = () => {};
const CheckoutStateContext = createContext<CheckoutState>({
    // states:
    checkoutStep                 : 'info',
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
    
    
    
    // sections:
    originAddressSectionRef      : undefined,
    shippingAddressSectionRef    : undefined,
    
    
    
    // fields:
    originAddressInputRef        : undefined,
    shippingAddressInputRef      : undefined,
    carrierOptionRef             : undefined,
    
    
    
    // actions:
    gotoStepInformation          : noopCallback,
    gotoStepSelectCarrier        : noopCallback as any,
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
    defaultShippingAddress ?: ShippingAddressDetail|null
}
const CheckoutStateProvider = (props: React.PropsWithChildren<CheckoutStateProps>): JSX.Element|null => {
    // props:
    const {
        // data:
        defaultShippingAddress = null,
        
        
        
        // children:
        children,
    } = props;
    
    
    
    // states:
    const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('info');
    const checkoutProgress = calculateCheckoutProgress(checkoutStep);
    const [isBusy , setIsBusyInternal] = useState<BusyState>(false);
    
    
    
    // utilities:
    const setTimeoutAsync = useSetTimeout();
    
    
    
    // address data:
    const [addressValidation, setAddressValidation] = useState<boolean>(false);
    const [originAddress    , setOriginAddress    ] = useState<Omit<DefaultShippingOriginDetail, 'id'>|null>(null);
    const [shippingAddress  , setShippingAddress  ] = useState<ShippingAddressDetail|null>(defaultShippingAddress);
    const [expandedAddress  , setExpandedAddress  ] = useState<ExpandedAddress|null>('shippingAddress');
    
    
    
    // apis:
    const {data: originAddressInitial, isLoading : isShippingOriginLoading, isError: isShippingOriginError, refetch: refetchShippingOrigin} = useGetDefaultShippingOrigin();
    
    
    
    const isLastCheckoutStep = (checkoutStep === 'paid');
    const isCheckoutLoading              = (
        (
            // have any loading(s):
            
            isShippingOriginLoading
        )
    );
    const isCheckoutError                = (
        !isCheckoutLoading // while still LOADING => consider as NOT error
        &&
        (
            // have any error(s):
            
            isShippingOriginError
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
    
    
    
    // refs:
    const originAddressSectionRef   = useRef<HTMLElement|null>(null);
    const shippingAddressSectionRef = useRef<HTMLElement|null>(null);
    
    const originAddressInputRef     = useRef<HTMLInputElement|null>(null);
    const shippingAddressInputRef   = useRef<HTMLInputElement|null>(null);
    const carrierOptionRef          = useRef<HTMLInputElement|null>(null);
    
    
    
    // effects:
    useIsomorphicLayoutEffect(() => {
        // conditions:
        if (!originAddressInitial) return;
        
        
        
        // actions:
        setOriginAddress(originAddressInitial);
    }, [originAddressInitial]);
    
    
    
    // dialogs:
    const {
        showMessageError,
        showMessageFieldError,
        showMessageFetchError,
    } = useDialogMessage();
    
    
    
    // stable callbacks:
    const gotoStepInformation   = useEvent((): void => {
        setCheckoutStep('info');
    });
    const gotoStepSelectCarrier = useEvent(async (): Promise<boolean> => {
        const goForward = (checkoutStep === 'info');
        if (goForward) { // go forward from 'info' => do check shipping rates
            // validate:
            // enable validation and *wait* until the next re-render of validation_enabled before we're going to `querySelectorAll()`:
            setAddressValidation(true);
            
            // wait for a validation state applied:
            if (!(await setTimeoutAsync(0))) return false; // the component was unloaded before the timer runs => do nothing
            if (!(await setTimeoutAsync(0))) return false; // the component was unloaded before the timer runs => do nothing
            const originAddressFieldErrors   = originAddressSectionRef?.current?.querySelectorAll?.(invalidSelector);
            const shippingAddressFieldErrors = shippingAddressSectionRef?.current?.querySelectorAll?.(invalidSelector);
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
            
            
            
            setCheckoutStep('selectCarrier');
        } // if
        
        
        
        if (!goForward) { // go back from 'payment' => focus to select carrier control
            // go backward to select carrier:
            setCheckoutStep('selectCarrier');
            
            
            
            // focus to select carrier control:
            setTimeoutAsync(200)
            .then((isDone) => {
                // conditions:
                if (!isDone) return; // the component was unloaded before the timer runs => do nothing
                
                
                
                // actions:
                const focusInputElm = carrierOptionRef.current;
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
        setCheckoutStep('payment');
        
        
        
        return true; // transaction completed
    });
    
    const refetchCheckout      = useEvent((): void => {
        refetchShippingOrigin();
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
        
        
        
        // sections:
        originAddressSectionRef,      // stable ref
        shippingAddressSectionRef,    // stable ref
        
        
        
        // fields:
        originAddressInputRef,        // stable ref
        shippingAddressInputRef,      // stable ref
        carrierOptionRef,             // stable ref
        
        
        
        // actions:
        gotoStepInformation,          // stable ref
        gotoStepSelectCarrier,        // stable ref
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
        
        
        
        // sections:
        originAddressSectionRef,      // stable ref
        shippingAddressSectionRef,    // stable ref
        
        
        
        // fields:
        // originAddressInputRef,     // stable ref
        // shippingAddressInputRef,   // stable ref
        // carrierOptionRef,          // stable ref
        
        
        
        // actions:
        // gotoStepInformation,       // stable ref
        // gotoStepSelectCarrier,     // stable ref
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
