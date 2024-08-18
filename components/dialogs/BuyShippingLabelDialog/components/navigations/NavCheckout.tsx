'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useMemo,
}                           from 'react'

// reusable-ui core:
import {
    // an accessibility management system:
    AccessibilityProvider,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    Icon,
    Button,
    ButtonIcon,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components
import {
    Link,
}                           from '@reusable-ui/next-compat-link'

// internal components:
import {
    ButtonWithBusy,
}                           from '../ButtonWithBusy'

// internals:
import {
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
const NavCheckout = (): JSX.Element|null => {
    // states:
    const {
        // states:
        checkoutProgress,
        
        isCheckoutReady,
        isCheckoutFinished,
        
        
        
        // actions:
        gotoStepInformation,
        gotoStepSelectCarrier,
        gotoPayment,
    } = useCheckoutState();
    
    
    
    // utilities:
    const [prevAction, nextAction] = useMemo(() => {
        const prevAction = [
            null,
            { text: 'Return to Information'     , action: () => gotoStepInformation()    },
            { text: 'Return to Select Carrier'  , action: gotoStepSelectCarrier          },
        ][Math.max(0, checkoutProgress)];
        
        const nextAction = [
            { text: 'Continue to Select Carrier', action: gotoStepSelectCarrier          },
            { text: 'Continue to Payment'       , action: gotoPayment                    },
        ][checkoutProgress];
        
        return [prevAction, nextAction] as const;
    }, [checkoutProgress]);
    
    
    
    // jsx:
    return (
        <AccessibilityProvider
            // accessibilities:
            enabled={isCheckoutReady} // disabled if not ready
        >
            {!isCheckoutFinished && <>
                {/* a dummy element to push the next button to the right */}
                {!prevAction && <span />}
                
                {!!prevAction && <ButtonIcon
                    // appearances:
                    icon='arrow_back'
                    iconPosition='start'
                    
                    
                    
                    // variants:
                    buttonStyle='link'
                    
                    
                    
                    // classes:
                    className='back'
                    
                    
                    
                    // handlers:
                    onClick={prevAction.action}
                >
                    {prevAction.text}
                </ButtonIcon>}
                
                {!!nextAction && <ButtonWithBusy
                    // components:
                    buttonComponent={
                        <ButtonIcon
                            // appearances:
                            icon='arrow_forward'
                            iconPosition='end'
                            
                            
                            
                            // variants:
                            gradient={true}
                            
                            
                            
                            // classes:
                            className='next'
                            
                            
                            
                            // handlers:
                            onClick={nextAction.action}
                        >
                            {nextAction.text}
                        </ButtonIcon>
                    }
                />}
            </>}
            
            {isCheckoutFinished && <>
                <p>
                    <Icon
                        // appearances:
                        icon='help'
                    />
                    {' '}Need help?{' '}
                    <Button
                        // variants:
                        buttonStyle='link'
                    >
                        <Link href='/contact'>
                            Contact Us
                        </Link>
                    </Button>
                </p>
                
                <ButtonIcon
                    // appearances:
                    icon='shopping_bag'
                    iconPosition='end'
                    
                    
                    
                    // variants:
                    gradient={true}
                    
                    
                    
                    // classes:
                    className='next'
                >
                    <Link href='/products'>
                        Continue Shopping
                    </Link>
                </ButtonIcon>
            </>}
        </AccessibilityProvider>
    );
};
export {
    NavCheckout,
    NavCheckout as default,
}
