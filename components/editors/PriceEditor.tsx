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

// internals:
import {
    getCurrencySign,
}                           from '@/libs/formatters'

// configs:
import {
    COMMERCE_CURRENCY_FRACTION_MAX,
}                           from '@/commerce.config'



// react components:
export interface PriceEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        CurrencyEditorProps<TElement>
{
}
const PriceEditor = <TElement extends Element = HTMLElement>(props: PriceEditorProps<TElement>): JSX.Element|null => {
    // jsx:
    return (
        <CurrencyEditor<TElement>
            // other props:
            {...props}
            
            
            
            // appearances:
            currencySign     = {props.currencySign     ?? getCurrencySign()             }
            currencyFraction = {props.currencyFraction ?? COMMERCE_CURRENCY_FRACTION_MAX}
            
            
            
            // accessibilities:
            aria-label={props['aria-label'] ?? 'Price'}
            
            
            
            // validations:
            required={props.required ?? true}
        />
    );
};
export {
    PriceEditor,
    PriceEditor as default,
}
