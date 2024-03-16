import {
    commerceConfig,
} from '../commerce.config'



const currencyFormatter = new Intl.NumberFormat(commerceConfig.locale, {
    style                 : 'currency',
    currency              : commerceConfig.defaultCurrency,
    // These options are needed to round to whole numbers if that's what you want.
    minimumFractionDigits : commerceConfig.currencies[commerceConfig.defaultCurrency].fractionMin, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    maximumFractionDigits : commerceConfig.currencies[commerceConfig.defaultCurrency].fractionMax, // (causes 2500.99 to be printed as $2,501)
});



export const formatCurrency = (value?: number|null|undefined, currencyCode?: string): string => {
    // conditions:
    if ((value === null) || (value === undefined) || isNaN(value)) return '-';
    
    
    
    let currentCurrencyFormatter = currencyFormatter;
    if (currencyCode) {
        const customCurrencyFormatter = new Intl.NumberFormat(commerceConfig.locale, {
            style    : 'currency',
            currency : currencyCode,
        });
        currentCurrencyFormatter = customCurrencyFormatter;
    } // if
    return currentCurrencyFormatter.format(value)
};
export const getCurrencySign = (currencyCode?: string) => {
    let currentCurrencyFormatter = currencyFormatter;
    if (currencyCode) {
        const customCurrencyFormatter = new Intl.NumberFormat(commerceConfig.locale, {
            style    : 'currency',
            currency : currencyCode,
        });
        currentCurrencyFormatter = customCurrencyFormatter;
    } // if
    return currentCurrencyFormatter.formatToParts(1)[0].value;
}



export const formatPath = (productName: string): string => {
    return productName.replace(/(\s|-)+/g, '-').toLowerCase().trim();
}



export const trimNumber = <TNumber extends number|undefined>(number: TNumber) : TNumber => {
    if (typeof(number) !== 'number') return number;
    
    
    
    return Number.parseFloat(number.toFixed(6)) as TNumber;
}
