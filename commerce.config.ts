export const COMMERCE_LOCALE                     = 'id-ID'
export const COMMERCE_CURRENCY                   = 'IDR'
export const COMMERCE_CURRENCY_FRACTION_MIN      = 2
export const COMMERCE_CURRENCY_FRACTION_MAX      = 2
export const COMMERCE_CURRENCY_FRACTION_UNIT     = 100
export const COMMERCE_CURRENCY_FRACTION_ROUNDING = 'ROUND'

export const commerceConfig = {
    locale : 'id-ID',
    currencies : {
        IDR: {
            sign             : 'Rp',
            fractionMin      : 2,
            fractionMax      : 2,
            fractionUnit     : 100,
            fractionRounding : 'ROUND',
        },
        USD: {
            sign             : '$',
            fractionMin      : 2,
            fractionMax      : 2,
            fractionUnit     : 0.01,
            fractionRounding : 'ROUND',
        },
    },
    defaultCurrency : 'IDR',
};
