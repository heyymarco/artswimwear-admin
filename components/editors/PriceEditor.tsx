// react:
import {
    // react:
    default as React,
}                           from 'react'

// internal components:
import {
    // react components:
    FundEditorProps,
    FundEditor,
}                           from '@/components/editors/FundEditor'

// configs:
import {
    checkoutConfigShared,
}                           from '@/checkout.config.shared'



// react components:
export interface PriceEditorProps<TElement extends Element = HTMLDivElement>
    extends
        // bases:
        FundEditorProps<TElement>
{
}
const PriceEditor = <TElement extends Element = HTMLDivElement>(props: PriceEditorProps<TElement>): JSX.Element|null => {
    // default props:
    const {
        // appearances:
        currency                 = checkoutConfigShared.intl.defaultCurrency,
        
        
        
        // accessibilities:
        "aria-label" : ariaLabel = 'Price',
        
        
        
        // validations:
        required                 = true,
        
        
        
        // other props:
        ...restPriceEditorProps
    } = props;
    
    
    
    // jsx:
    return (
        <FundEditor<TElement>
            // other props:
            {...restPriceEditorProps}
            
            
            
            // appearances:
            currency={currency}
            
            
            
            // accessibilities:
            aria-label={ariaLabel}
            
            
            
            // validations:
            required={required}
        />
    );
};
export {
    PriceEditor,
    PriceEditor as default,
}
