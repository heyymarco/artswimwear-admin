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
    
    
    
    // an accessibility management system:
    AccessibilityProvider,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// models:
import {
    type DefaultShippingOriginDetail,
    type ShippingAddressDetail,
}                           from '@/models'

// internals:
import {
    type CheckoutStep,
    type BusyState,
}                           from './types'
import {
    calculateCheckoutProgress,
}                           from './utilities'



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
    
    
    
    // fields:
    shippingAddressInputRef      : React.MutableRefObject<HTMLInputElement|null> | undefined
    
    
    
    // actions:
    gotoStepInformation          : () => void
    gotoStepSelectCarrier        : () => Promise<boolean>
    gotoPayment                  : () => Promise<boolean>
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
    
    
    
    // fields:
    shippingAddressInputRef      : undefined,
    
    
    
    // actions:
    gotoStepInformation          : noopCallback,
    gotoStepSelectCarrier        : noopCallback as any,
    gotoPayment                  : noopCallback as any,
});
CheckoutStateContext.displayName  = 'CheckoutState';

export const useCheckoutState = (): CheckoutState => {
    return useContext(CheckoutStateContext);
}



// react components:
export interface CheckoutStateProps
{
    // states:
    defaultExpandedListIndex ?: number
    expandedListIndex        ?: number
}
const CheckoutStateProvider = (props: React.PropsWithChildren): JSX.Element|null => {
    // props:
    const {
        // children:
        children,
    } = props;
    
    
    
    // states:
    const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('info');
    const checkoutProgress = calculateCheckoutProgress(checkoutStep);
    const [isBusy , setIsBusyInternal] = useState<BusyState>(false);
    
    const isLastCheckoutStep = (checkoutStep === 'paid');
    const isCheckoutLoading              = (
        (
            // have any loading(s):
            
            false
        )
    );
    const isCheckoutError                = (
        !isCheckoutLoading // while still LOADING => consider as NOT error
        &&
        (
            // have any error(s):
            
            false
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
    
    
    
    // address data:
    const [addressValidation, setAddressValidation] = useState<boolean>(false);
    const [originAddress    , setOriginAddress    ] = useState<Omit<DefaultShippingOriginDetail, 'id'>|null>(null);
    const [shippingAddress  , setShippingAddress  ] = useState<ShippingAddressDetail|null>(null);
    
    
    
    // refs:
    const shippingAddressInputRef = useRef<HTMLInputElement|null>(null);
    
    
    
    // stable callbacks:
    const gotoStepInformation   = useEvent((): void => {
        setCheckoutStep('info');
    });
    const gotoStepSelectCarrier = useEvent(async (): Promise<boolean> => {
        const goForward = (checkoutStep === 'info');
        setCheckoutStep('selectCarrier');
        
        
        
        return true; // transaction completed
    });
    const gotoPayment           = useEvent(async (): Promise<boolean> => {
        // const goForward = ... // always go_forward, never go_backward after finishing the payment
        setCheckoutStep('payment');
        
        
        
        return true; // transaction completed
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
        
        
        
        // fields:
        shippingAddressInputRef,      // stable ref
        
        
        
        // actions:
        gotoStepInformation,          // stable ref
        gotoStepSelectCarrier,        // stable ref
        gotoPayment,                  // stable ref
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
        
        
        
        // fields:
        // shippingAddressInputRef,   // stable ref
        
        
        
        // actions:
        // gotoStepInformation,       // stable ref
        // gotoStepSelectCarrier,     // stable ref
        // gotoPayment,               // stable ref
    ]);
    
    
    
    // jsx:
    return (
        <CheckoutStateContext.Provider value={checkoutState}>
            {children}
        </CheckoutStateContext.Provider>
    );
};
export {
    CheckoutStateProvider,
    CheckoutStateProvider as default,
}
//#endregion checkoutState
