// privates:
import {
    default as defaultCountryMap
}                           from './defaultCountryMap'



export const getCountryByCode  = (countryCode: string|null|undefined): string|null => (countryCode ? defaultCountryMap.get(countryCode) : null) ?? null;
export const getCountryDisplay = (countryCode: string|null|undefined): string => getCountryByCode(countryCode) ?? 'Select Country';
export const countryList       = Array.from(defaultCountryMap.keys());
