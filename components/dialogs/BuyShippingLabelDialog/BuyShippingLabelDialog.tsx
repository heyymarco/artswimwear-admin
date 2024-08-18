'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useState,
}                           from 'react'

// styles:
import {
    useBuyShippingLabelDialogStyleSheet,
}                           from './styles/loader'

// reusable-ui core:
import {
    // a set of React node utility functions:
    flattenChildren,
    
    
    
    // react helper hooks:
    useEvent,
    EventHandler,
    useMountedFlag,
    
    
    
    // an accessibility management system:
    AccessibilityProvider,
    
    
    
    // a validation management system:
    ValidationProvider,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-content-components:
    Content,
    
    
    
    // simple-components:
    ButtonIcon,
    CloseButton,
    
    
    
    // layout-components:
    List,
    CardHeader,
    CardFooter,
    CardBody,
    
    
    
    // dialog-components:
    ModalExpandedChangeEvent,
    ModalCardProps,
    ModalCard,
    
    
    
    // composite-components:
    type TabPanelProps,
    TabPanel,
    TabProps,
    Tab,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    MessageLoading,
}                           from '@/components/MessageLoading'
import {
    MessageErrorProps,
    MessageError,
}                           from '@/components/MessageError'
import {
    ProgressCheckout,
}                           from './components/navigations/ProgressCheckout'
import {
    NavCheckout,
}                           from './components/navigations/NavCheckout'

// internals:
import type {
    Model,
    PartialModel,
}                           from '@/libs/types'

// contexts:
import {
    CheckoutStateProvider,
    useCheckoutState,
}                           from './states/checkoutState'



// react components:
export interface BuyShippingLabelDialogProps
    extends
        // bases:
        Omit<ModalCardProps<HTMLElement>,
            // children:
            |'children'        // already taken over
        >
{
}
const BuyShippingLabelDialog = (props: BuyShippingLabelDialogProps): JSX.Element|null => {
    // jsx:
    return (
        <CheckoutStateProvider>
            <BuyShippingLabelDialogInternal {...props} />
        </CheckoutStateProvider>
    );
};
const BuyShippingLabelDialogInternal = (props: BuyShippingLabelDialogProps): JSX.Element|null => {
    // styles:
    const styleSheet = useBuyShippingLabelDialogStyleSheet();
    
    
    
    // rest props:
    const {
        // handlers:
        onExpandedChange,
        
        
        
        // other props:
        ...restModalCardProps
    } = props;
    
    
    
    // handlers:
    const handleCloseDialog    = useEvent(async () => {
        onExpandedChange?.({
            expanded   : false,
            actionType : 'ui',
            data       : 'booh',
        });
    });
    const handleExpandedChange = useEvent<EventHandler<ModalExpandedChangeEvent<unknown>>>((event) => {
        // conditions:
        if (event.actionType === 'shortcut') return; // prevents closing modal by accidentally pressing [esc]
        
        
        
        // actions:
        onExpandedChange?.(event);
    });
    
    
    
    // jsx:
    return (
        <ModalCard
            // other props:
            {...restModalCardProps}
            
            
            
            // variants:
            theme          = {props.theme          ?? 'primary'   }
            backdropStyle  = {props.backdropStyle  ?? 'static'    }
            modalCardStyle = {props.modalCardStyle ?? 'scrollable'}
            
            
            
            // handlers:
            onExpandedChange = {handleExpandedChange}
        >
            <CardHeader>
                <h1>Buy a Shipping Label</h1>
                <CloseButton onClick={handleCloseDialog} />
            </CardHeader>
            
            <CardBody>
                <ProgressCheckout />
                <p>
                    hello world
                </p>
                <NavCheckout />
            </CardBody>
            
            <CardFooter>
                <ButtonIcon
                    // appearances:
                    icon='cancel'
                    
                    
                    
                    // variants:
                    theme='danger'
                    
                    
                    
                    // classes:
                    className='btnCancel'
                    
                    
                    
                    // handlers:
                    onClick={handleCloseDialog}
                >
                    Cancel
                </ButtonIcon>
            </CardFooter>
        </ModalCard>
    );
};
export {
    BuyShippingLabelDialog,
    BuyShippingLabelDialog as default,
}
