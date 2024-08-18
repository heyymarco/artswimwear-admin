'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // layout-components:
    ListItem,
    List,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internals:
import {
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
const ProgressCheckout = (): JSX.Element|null => {
    // states:
    const {
        // states:
        checkoutProgress,
    } = useCheckoutState();
    
    
    
    // jsx:
    return (
        <List
            // variants:
            size='sm'
            outlined={false}
            mild={false}
            listStyle='breadcrumb'
            orientation='inline'
            
            
            
            // accessibilities:
            enabled={true}         // always enabled
            inheritEnabled={false} // always enabled
        >
            <ListItem size='sm' mild={true} active={checkoutProgress >= 0}>Information</ListItem>
            <ListItem size='sm' mild={true} active={checkoutProgress >= 1}>Select Carrier</ListItem>
            <ListItem size='sm' mild={true} active={checkoutProgress >= 2}>Payment</ListItem>
            <ListItem size='sm' mild={true} active={checkoutProgress >= 3}>Finished</ListItem>
        </List>
    );
};
export {
    ProgressCheckout,
    ProgressCheckout as default,
}
