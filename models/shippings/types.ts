// models:
import {
    type ShippingProvider,
    type ShippingRate,
    type CoverageCountry,
    type CoverageState,
    type CoverageCity,
}                           from '@prisma/client'



// types:
export interface ShippingPreview
    extends
        Pick<ShippingProvider,
            |'id'
            |'name'
        >
{
}

export interface ShippingDetail
    extends
        Omit<ShippingProvider,
            |'createdAt'
            |'updatedAt'
        >
{
}



export interface ShippingRateWithId extends ShippingRate {
    id : string
}



export interface CoverageZone<TSubzone extends CoverageSubzone>
    extends
        Omit<CoverageCountry, 'useZones'|'zones'>,
        Omit<CoverageState  , 'useZones'|'zones'>,
        Omit<CoverageCity   , 'useZones'|'zones'|'updatedAt'>
{
    useZones : TSubzone extends never ? never : boolean
    zones    : TSubzone extends never ? never : TSubzone[]
}
export interface CoverageZoneWithId<TSubzone extends CoverageSubzone> extends CoverageZone<TSubzone> {
    id       : string
}

export type CoverageSubzone = CoverageState|Omit<CoverageCity, 'updatedAt'>|never



export interface CoverageCountryWithId extends Omit<CoverageCountry, 'zones'> {
    id    : string
    zones : CoverageStateWithId[]
}
export interface CoverageStateWithId extends Omit<CoverageState, 'zones'> {
    id    : string
    zones : CoverageCityWithId[]
}
export interface CoverageCityWithId extends Omit<CoverageCity, 'zones'> {
    id    : string
}
