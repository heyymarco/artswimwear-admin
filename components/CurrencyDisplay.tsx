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
    checkoutConfigShared,
}                           from '@/checkout.config.shared'
import {
    sumReducer,
}                           from '@/libs/numbers'



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
        currency     = checkoutConfigShared.intl.defaultCurrency,
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
