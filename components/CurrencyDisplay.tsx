// react:
import {
    // react:
    default as React,
}                           from 'react'

// utilities:
import {
    formatCurrency,
}                           from '@/libs/formatters'

// configs:

import {
    commerceConfig,
}                           from '@/commerce.config'



// utilities:
const sumReducer = <TNumber extends number|null|undefined>(accum: TNumber, value: TNumber): TNumber => {
    if (typeof(value) !== 'number') return accum; // ignore null
    if (typeof(accum) !== 'number') return value; // ignore null
    return (accum + value) as TNumber;
};



// react components:
export interface CurrencyDisplayProps {
    currency     ?: string
    currencyRate ?: number
    amount        : number|null|undefined | Array<number|null|undefined>
    multiply     ?: number
}
const CurrencyDisplay = (props: CurrencyDisplayProps): JSX.Element|null => {
    // props:
    const {
        currency     = commerceConfig.defaultCurrency,
        currencyRate = 1,
        
        amount       : amountRaw,
        multiply     = 1,
    } = props;
    
    
    
    // calcs:
    const amountList = (
        !Array.isArray(amountRaw)
        ? [amountRaw]
        : amountRaw
    );
    
    
    
    const mergedAmount = (
        amountList
        .flatMap((amountItem): number|null|undefined => {
            if (typeof(amountItem) !== 'number') return amountItem;
            return (amountItem * currencyRate);
        })
        .reduce(sumReducer, undefined)     // may produces ugly_fractional_decimal
    );
    
    
    
    // jsx:
    return (
        <>
            {formatCurrency(
                (typeof(mergedAmount) === 'number')
                ? (mergedAmount * multiply)     // may produces ugly_fractional_decimal
                : mergedAmount                  // no need to decimalize accumulated numbers to avoid producing ugly_fractional_decimal // `formatCurrency()` wouldn't produce ugly_fractional_decimal
            , currency)}
        </>
    );
};
export {
    CurrencyDisplay,
    CurrencyDisplay as default,
};
