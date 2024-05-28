// utilities:
import {
    trimNumber,
}                           from '@/libs/formatters'

// configs:
import {
    checkoutConfigShared,
}                           from '@/checkout.config.shared'



// exchangers:
/**
 * Converts:  
 * from customer's preferred currency  
 * to the app's default currency.
 */
export const convertSystemCurrencyIfRequired = <TNumber extends number|null|undefined>(fromAmount: TNumber, rate: number): TNumber => {
    // conditions:
    if (typeof(fromAmount) !== 'number') return fromAmount; // null|undefined => nothing to convert
    if (rate === 1)                      return fromAmount; // rate is 1      => nothing to convert
    
    
    
    const fractionUnit = checkoutConfigShared.intl.currencies[checkoutConfigShared.intl.defaultCurrency].fractionUnit;
    const rawConverted = fromAmount * rate;
    const rounding     = {
        ROUND : Math.round,
        CEIL  : Math.ceil,
        FLOOR : Math.floor,
    }[checkoutConfigShared.intl.currencyConversionRounding]; // reverts using app's currencyConversionRounding (usually ROUND)
    const fractions    = rounding(rawConverted / fractionUnit);
    const stepped      = fractions * fractionUnit;
    
    
    
    return trimNumber(stepped) as TNumber;
}
/**
 * Converts:  
 * from the app's default currency  
 * to customer's preferred currency.
 */
export const revertSystemCurrencyIfRequired  = <TNumber extends number|null|undefined>(fromAmount: TNumber, rate: number, customerCurrency: string = checkoutConfigShared.intl.defaultCurrency): TNumber => {
    // conditions:
    if (typeof(fromAmount) !== 'number') return fromAmount; // null|undefined => nothing to convert
    if (rate === 1)                      return fromAmount; // rate is 1      => nothing to convert
    
    
    
    const fractionUnit = (checkoutConfigShared.intl.currencies[customerCurrency] ?? checkoutConfigShared.intl.currencies[checkoutConfigShared.intl.defaultCurrency]).fractionUnit;
    const rawConverted = fromAmount / rate;
    const rounding     = {
        ROUND : Math.round,
        CEIL  : Math.ceil,
        FLOOR : Math.floor,
    }[checkoutConfigShared.intl.currencyConversionRounding]; // reverts using app's currencyConversionRounding (usually ROUND)
    const fractions    = rounding(rawConverted / fractionUnit);
    const stepped      = fractions * fractionUnit;
    
    
    
    return trimNumber(stepped) as TNumber;
}
