import defaultCountries from './defaultCountries'
import { createEntityAdapter } from '@reduxjs/toolkit'



export interface CountryEntry {
    code : string
    name : string
}
const countryListAdapter = createEntityAdapter<CountryEntry>({
    selectId : (countryEntry) => countryEntry.code,
});
export const countryList = countryListAdapter.addMany(countryListAdapter.getInitialState(), defaultCountries);
