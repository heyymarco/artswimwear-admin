// utilities:
import {
    trimNumber,
}                           from '@/libs/formatters'

// configs:
import {
    checkoutConfigShared,
}                           from '@/checkout.config.shared'



// utilities:
const currencyExchange = {
    expires : new Date(),
    rates   : new Map<string, number>(),
};
let currencyExchangeUpdatedPromise : Promise<void>|undefined = undefined;
/**
 * Gets the conversion ratio  
 * from app's default currency to `targetCurrency`.
 */
export const getCurrencyRate = async (targetCurrency: string): Promise<number> => {
    if (currencyExchange.expires <= new Date()) {
        if (!currencyExchangeUpdatedPromise) currencyExchangeUpdatedPromise = (async (): Promise<void> => {
            const rates = currencyExchange.rates;
            rates.clear();
            
            
            
            // fetch https://www.exchangerate-api.com :
            const exchangeRateResponse = await fetch(`https://v6.exchangerate-api.com/v6/${process.env.EXCHANGERATEAPI_KEY}/latest/${checkoutConfigShared.intl.defaultCurrency}`, {
                // cache : 'force-cache', // "cache: force-cache" and "revalidate: 86400", only one should be specified
                next  : {
                    revalidate : 3 * 3600, // set the cache lifetime of a resource (in seconds).
                },
            });
            if (exchangeRateResponse.status !== 200) throw Error('api error');
            const data = await exchangeRateResponse.json();
            const apiRates = data?.conversion_rates;
            if (typeof(apiRates) !== 'object') throw Error('api error');
            for (const currency in apiRates) {
                rates.set(currency, apiRates[currency]);
            } // for
            
            
            
            currencyExchange.expires = new Date(Date.now() + (3 * 3600 * 1000));
        })();
        await currencyExchangeUpdatedPromise;
        currencyExchangeUpdatedPromise = undefined;
    } // if
    
    
    
    const toRate = currencyExchange.rates.get(targetCurrency);
    if (toRate === undefined) throw Error('unknown currency');
    return toRate;
}

/**
 * Gets the conversion ratio (and fraction unit)
 * from app's default currency to `targetCurrency`.
 */
const getCurrencyConverter   = async (targetCurrency: string): Promise<{rate: number, fractionUnit: number}> => {
    return {
        rate         : await getCurrencyRate(targetCurrency),
        fractionUnit : checkoutConfigShared.intl.currencies[targetCurrency]?.fractionUnit ?? 0.001,
    };
}



// exchangers:
export const convertForeignToSystemCurrencyIfRequired = async <TNumber extends number|null|undefined>(fromAmount: TNumber, foreignCurrency: string): Promise<TNumber> => {
    // conditions:
    if (typeof(fromAmount) !== 'number') return fromAmount;                     // null|undefined    => nothing to convert
    if (foreignCurrency === checkoutConfigShared.intl.defaultCurrency) return fromAmount; // the same currency => nothing to convert
    
    
    
    const fractionUnit = checkoutConfigShared.intl.currencies[checkoutConfigShared.intl.defaultCurrency]?.fractionUnit ?? 0.001;
    const {rate} = await getCurrencyConverter(foreignCurrency);
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
