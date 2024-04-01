// react:
import {
    // react:
    default as React,
}                           from 'react'

// internal components:
import {
    // react components:
    CurrencyEditorProps,
    CurrencyEditor,
}                           from '@/components/editors/CurrencyEditor'

// configs:
import {
    commerceConfig,
}                           from '@/commerce.config'



// react components:
export interface PriceEditorProps<TElement extends Element = HTMLDivElement>
    extends
        // bases:
        CurrencyEditorProps<TElement>
{
}
const PriceEditor = <TElement extends Element = HTMLDivElement>(props: PriceEditorProps<TElement>): JSX.Element|null => {
    // default props:
    const {
        // appearances:
        currency                 = commerceConfig.defaultCurrency,
        
        
        
        // accessibilities:
        "aria-label" : ariaLabel = 'Price',
        
        
        
        // validations:
        required                 = true,
        
        
        
        // other props:
        ...restPriceEditorProps
    } = props;
    
    
    
    // jsx:
    return (
        <CurrencyEditor<TElement>
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
