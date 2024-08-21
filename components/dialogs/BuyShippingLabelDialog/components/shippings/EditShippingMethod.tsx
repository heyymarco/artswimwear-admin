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
    // simple-components:
    Basic,
    
    
    
    // layout-components:
    ListItem,
    List,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// heymarco components:
import {
    RadioDecorator,
}                           from '@heymarco/radio-decorator'
import {
    DataTableHeader,
    DataTableBody,
    DataTableItem,
    DataTable,
}                           from '@heymarco/data-table'

// internal components:
import {
    CurrencyDisplay,
}                           from '@/components/CurrencyDisplay'

// contexts:
import {
    useCheckoutState,
}                           from '../../states/checkoutState'



// react components:
const EditShippingMethod = (): JSX.Element|null => {
    // styles:
    const styleSheet = useCheckoutStyleSheet();
    
    
    
    // contexts:
    const {
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
        shippingMethodOptionRef,
    } = useCheckoutState();
    const filteredShippingLabelList = !shippingLabelList ? undefined : Object.values(shippingLabelList.entities).filter((shippingEntry): shippingEntry is Exclude<typeof shippingEntry, undefined> => !!shippingEntry);
    
    const foreignCurrencyRate = preferedCurrency?.rate;
    const systemCurrencyRate  = (foreignCurrencyRate === undefined) ? undefined : (1 / foreignCurrencyRate);
    
    
    
    // jsx:
    return (
        <>
            <p>
                Customer&apos;s selected carrier:
            </p>
            {!preferedShippingProvider && <span className='noValue'>none</span>}
            {!!preferedShippingProvider && <DataTable theme='success' mild={false}>
                <DataTableBody>
                    <DataTableItem label='Name'>
                        {preferedShippingProvider.name}
                    </DataTableItem>
                    <DataTableItem label='Est. Cost'>
                        <CurrencyDisplay amount={preferedShippingProvider.rates} currencyRate={systemCurrencyRate} />
                    </DataTableItem>
                </DataTableBody>
            </DataTable>}
            <p>
                Current selected carrier:
            </p>
            {!!filteredShippingLabelList && <List
                // classes:
                className={styleSheet.selectShipping}
                
                
                
                // behaviors:
                actionCtrl={true}
            >
                {
                    filteredShippingLabelList
                    // .sort(({rate: a}, {rate: b}) => (a - b))
                    .sort((a, b) => (!a.name || !b.name) ? 0 : (a.name < b.name) ? -1 : 1)
                    .map((shippingLabelEntry) => {
                        const isActive = `${shippingLabelEntry.id}` === shippingLabel?.id;
                        
                        
                        
                        // jsx:
                        return (
                            <ListItem
                                // identifiers:
                                key={`${shippingLabelEntry.id}`}
                                
                                
                                
                                // refs:
                                elmRef={isActive ? shippingMethodOptionRef : undefined}
                                
                                
                                
                                // states:
                                active={isActive}
                                
                                
                                
                                // handlers:
                                onClick={() => setShippingLabel(shippingLabelEntry)}
                            >
                                <RadioDecorator />
                                
                                <span className='label'>
                                    {shippingLabelEntry.name}
                                    
                                    {(preferedShippingLabel === shippingLabelEntry) && <>
                                        {' '}
                                        <Basic theme='success' size='sm' className={styleSheet.selectionBadge}>
                                            Customer&apos;s selection
                                        </Basic>
                                    </>}
                                </span>
                                
                                {!!shippingLabelEntry.eta && <span className='eta txt-sec'>
                                    (estimate: {shippingLabelEntry.eta.min}{(shippingLabelEntry.eta.max > shippingLabelEntry.eta.min) ? <>-{shippingLabelEntry.eta.max}</> : null} day{(shippingLabelEntry.eta.min > 1) ? 's' : ''})
                                </span>}
                                
                                <span className='cost'>
                                    <CurrencyDisplay amount={shippingLabelEntry.rate} />
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
