'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// cssfn:
import {
    useCheckoutStyleSheet,
}                           from '../../styles/loader'

// reusable-ui components:
import {
    // status-components:
    Busy,
    
    
    
    // layout-components:
    ListItem,
    List,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// heymarco components:
import {
    RadioDecorator,
}                           from '@heymarco/radio-decorator'

// internal components:
import {
    CurrencyDisplay,
}                           from '@/components/CurrencyDisplay'

// contexts:
import {
    useCheckoutState,
}                           from '../../states/checkoutState'

// utilities:
import {
    calculateShippingCost,
}                           from '@/libs/shippings/shippings'



// react components:
const EditShippingMethod = (): JSX.Element|null => {
    // styles:
    const styleSheet = useCheckoutStyleSheet();
    
    
    
    // contexts:
    const {
        // shipping data:
        shippingProvider,
        setShippingProvider,
        
        
        
        // relation data:
        shippingList,
        
        
        
        // sections:
        shippingMethodOptionRef,
    } = useCheckoutState();
    const filteredShippingList = !shippingList ? undefined : Object.values(shippingList.entities).filter((shippingEntry): shippingEntry is Exclude<typeof shippingEntry, undefined> => !!shippingEntry);
    
    
    
    // jsx:
    return (
        <>
            {!!filteredShippingList && <List
                // classes:
                className={styleSheet.selectShipping}
                
                
                
                // behaviors:
                actionCtrl={true}
            >
                {
                    filteredShippingList
                    // .sort(({rate: a}, {rate: b}) => (a - b))
                    .sort((a, b) => (!a.name || !b.name) ? 0 : (a.name < b.name) ? -1 : 1)
                    .map((shippingEntry) => {
                        const isActive = `${shippingEntry.id}` === shippingProvider;
                        
                        
                        
                        // jsx:
                        return (
                            <ListItem
                                // identifiers:
                                key={`${shippingEntry.id}`}
                                
                                
                                
                                // refs:
                                elmRef={isActive ? shippingMethodOptionRef : undefined}
                                
                                
                                
                                // states:
                                active={isActive}
                                
                                
                                
                                // handlers:
                                onClick={() => setShippingProvider(`${shippingEntry.id}`)}
                            >
                                <RadioDecorator />
                                
                                <span className='label'>
                                    {shippingEntry.name}
                                </span>
                                
                                {!!shippingEntry.eta && <span className='eta txt-sec'>
                                    (estimate: {shippingEntry.eta.min}{(shippingEntry.eta.max > shippingEntry.eta.min) ? <>-{shippingEntry.eta.max}</> : null} day{(shippingEntry.eta.min > 1) ? 's' : ''})
                                </span>}
                                
                                <span className='cost'>
                                    <CurrencyDisplay amount={shippingEntry.rate} />
                                </span>
                            </ListItem>
                        );
                    })
                }
            </List>}
        </>
    );
};
export {
    EditShippingMethod,
    EditShippingMethod as default,
};
