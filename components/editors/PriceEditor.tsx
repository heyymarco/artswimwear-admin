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
export interface PriceEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        CurrencyEditorProps<TElement>
{
}
const PriceEditor = <TElement extends Element = HTMLElement>(props: PriceEditorProps<TElement>): JSX.Element|null => {
    // default props:
    const {
        // appearances:
        currencyCode             = commerceConfig.defaultCurrency,
        
        
        
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
            currencyCode={currencyCode}
            
            
            
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
