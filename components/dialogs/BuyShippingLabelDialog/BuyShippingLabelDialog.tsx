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
    useCheckoutStyleSheet,
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
    Container,
    Content,
    
    
    
    // simple-components:
    ButtonIcon,
    CloseButton,
    
    
    
    // layout-components:
    List,
    ListItem,
    CardHeader,
    CardFooter,
    CardBody,
    
    
    
    // dialog-components:
    ModalExpandedChangeEvent,
    Modal,
    ModalCardProps,
    ModalCard,
    
    
    
    // composite-components:
    Accordion,
    AccordionItem,
    type ExclusiveExpandedChangeEvent,
    ExclusiveAccordion,
    type TabPanelProps,
    TabPanel,
    TabProps,
    Tab,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    Article,
    Section,
}                           from '@heymarco/section'

// internal components:
import {
    MessageLoading,
}                           from '@/components/MessageLoading'
import {
    MessageError,
}                           from '@/components/MessageError'
import {
    ProgressCheckout,
}                           from './components/navigations/ProgressCheckout'
import {
    NavCheckout,
}                           from './components/navigations/NavCheckout'
import {
    EditOriginAddress,
}                           from './components/checkouts/EditOriginAddress'
import {
    EditShippingAddress,
}                           from './components/checkouts/EditShippingAddress'
import {
    EditShippingMethod,
}                           from './components/shippings/EditShippingMethod'

// models:
import {
    type OrderDetail,
}                           from '@/models'

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
    // data:
    order : OrderDetail
}
const BuyShippingLabelDialog = (props: BuyShippingLabelDialogProps): JSX.Element|null => {
    // props:
    const {
        // data:
        order,
        
        
        
        // other props:
        ...restBuyShippingLabelDialogProps
    } = props;
    
    
    
    // jsx:
    return (
        <CheckoutStateProvider
            // data:
            order={order}
        >
            <BuyShippingLabelDialogInternal {...restBuyShippingLabelDialogProps} />
        </CheckoutStateProvider>
    );
};
const BuyShippingLabelDialogInternal = (props: Omit<BuyShippingLabelDialogProps, 'order'>): JSX.Element|null => {
    // props:
    const {
        // handlers:
        onExpandedChange,
        
        
        
        // other props:
        ...restModalCardProps
    } = props;
    
    
    
    // styles:
    const styleSheet = useCheckoutStyleSheet();
    
    
    
    // contexts:
    const {
        // states:
        checkoutStep,
        
        isCheckoutLoading,
        isCheckoutError,
        isCheckoutReady,
        isCheckoutFinished,
        
        
        
        // address data:
        expandedAddress,
        setExpandedAddress,
        
        
        
        // sections:
        originAddressSectionRef,
        shippingAddressSectionRef,
        currentStepSectionRef,
        
        
        
        // actions:
        refetchCheckout,
    } = useCheckoutState();
    
    
    
    // handlers:
    const handleCloseDialog           = useEvent(async () => {
        onExpandedChange?.({
            expanded   : false,
            actionType : 'ui',
            data       : 'booh',
        });
    });
    const handleExpandedChange        = useEvent<EventHandler<ModalExpandedChangeEvent<unknown>>>((event) => {
        // conditions:
        if (event.actionType === 'shortcut') return; // prevents closing modal by accidentally pressing [esc]
        
        
        
        // actions:
        onExpandedChange?.(event);
    });
    const handleAddressExpandedChange = useEvent<EventHandler<ExclusiveExpandedChangeEvent>>((event) => {
        if (!event.expanded) {
            setExpandedAddress(null);
            return;
        } // if
        
        
        
        setExpandedAddress((() => {
            switch (event.listIndex) {
                case 0  : return 'originAddress';
                case 1  : return 'shippingAddress';
                default : return null;
            } // switch
        })());
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
            horzAlign      = 'stretch'
            vertAlign      = 'stretch'
            
            
            
            // classes:
            className={styleSheet.dialog}
            
            
            
            // handlers:
            onExpandedChange = {handleExpandedChange}
        >
            <CardHeader>
                <h1>Buy a Shipping Label</h1>
                <CloseButton onClick={handleCloseDialog} />
            </CardHeader>
            
            {(isCheckoutLoading || isCheckoutError) && <CardBody className={styleSheet.layoutLoading}>
                {isCheckoutLoading && <MessageLoading />}
                
                {isCheckoutError && <MessageError
                    // handlers:
                    onRetry={refetchCheckout}
                />}
            </CardBody>}
            
            {isCheckoutReady && <CardBody className={styleSheet.layout}>
                <Section
                    // semantics:
                    tag='nav'
                    
                    
                    
                    // classes:
                    className={styleSheet.progressCheckout}
                >
                    <ProgressCheckout />
                </Section>
                
                <div
                    // classes:
                    className={styleSheet.currentStepLayout}
                >
                    {(checkoutStep === 'INFO') && <Section
                        // refs:
                        elmRef={currentStepSectionRef}
                        
                        
                        
                        // classes:
                        className={styleSheet.checkout}
                    >
                        <ExclusiveAccordion
                            // variants:
                            listStyle='content'
                            
                            
                            
                            // handlers:
                            expandedListIndex={(() => {
                                switch(expandedAddress) {
                                    case 'originAddress'   : return 0;
                                    case 'shippingAddress' : return 1;
                                    default                : return -1;
                                } // switch
                            })()}
                            onExpandedChange={handleAddressExpandedChange}
                        >
                            <AccordionItem label='From' bodyComponent={<ListItem elmRef={originAddressSectionRef} />}>
                                <p className={styleSheet.noSize}>
                                    Edit the shipping origin address. This is usually your store location.
                                </p>
                                <EditOriginAddress />
                            </AccordionItem>
                            <AccordionItem label='To' bodyComponent={<ListItem elmRef={shippingAddressSectionRef} />}>
                                <p className={styleSheet.noSize}>
                                    Edit the customer&apos;s shipping address.
                                </p>
                                <EditShippingAddress />
                            </AccordionItem>
                        </ExclusiveAccordion>
                    </Section>}
                    
                    {(checkoutStep === 'SHIPPING') && <Section
                        // refs:
                        elmRef={currentStepSectionRef}
                        
                        
                        
                        // accessibilities:
                        title='Select Carrier'
                    >
                        <EditShippingMethod />
                    </Section>}
                </div>
            </CardBody>}
            
            <CardFooter
                // classes:
                className={styleSheet.navFooter}
            >
                <NavCheckout />
            </CardFooter>
        </ModalCard>
    );
};
export {
    BuyShippingLabelDialog,
    BuyShippingLabelDialog as default,
}
