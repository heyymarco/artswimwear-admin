// models:
import {
    type ShippingProvider,
    type CoverageCountry,
    type CoverageState,
    type CoverageCity,
    type ShippingRate,
}                           from '@prisma/client'



// types:
export interface ShippingPreview
    extends
        Pick<ShippingProvider,
            // records:
            |'id'
            
            // data:
            |'name'
        >
{
}

export interface ShippingDetail
    extends
        Omit<ShippingProvider,
            // records:
            |'createdAt'
            |'updatedAt'
            
            // data:
            |'zones' // we redefined the zones with less detail
        >
{
    // data:
    zones : CoverageCountryDetail[] // we redefined the zones with less detail
}

export interface CoverageCountryDetail
    extends
        Omit<CoverageCountry,
            // data:
            'zones' // we redefined the zones with less detail
        >
{
    // data:
    zones : CoverageStateDetail[] // we redefined the zones with less detail
}
export interface CoverageStateDetail
    extends
        Omit<CoverageState,
            // data:
            'zones' // we redefined the zones with less detail
        >
{
    // data:
    zones : CoverageCityDetail[] // we redefined the zones with less detail
}
export interface CoverageCityDetail
    extends
        Omit<CoverageCity,
            // data:
            |'updatedAt' // less detailed of `updatedAt` because we don't need it (and won't update it) for the `EditCoverageZoneDialog`
        >
{
}



export interface ShippingRateWithId extends ShippingRate {
    // records:
    id : string
}



export interface CoverageZone<TSubzone extends CoverageSubzone>
    extends
        Omit<CoverageCountryDetail,
            // data:
            |'useZones' // generic-ify the sub-zones
            |'zones'    // generic-ify the sub-zones
        >,
        Omit<CoverageStateDetail,
            // data:
            |'useZones' // generic-ify the sub-zones
            |'zones'    // generic-ify the sub-zones
        >,
        Omit<CoverageCityDetail,
            // data:
            |'useZones' // generic-ify the sub-zones
            |'zones'    // generic-ify the sub-zones
        >
{
    // data:
    useZones : TSubzone extends never ? never : boolean    // generic-ify the sub-zones
    zones    : TSubzone extends never ? never : TSubzone[] // generic-ify the sub-zones
}
export interface CoverageZoneWithId<TSubzone extends CoverageSubzone>
    extends
        CoverageZone<TSubzone>
{
    // records:
    id       : string
}

export type CoverageSubzone = CoverageStateDetail|CoverageCityDetail|never



export interface CoverageCountryWithId
    extends Omit<CoverageCountryDetail,
        // data:
        |'zones' // id-ify the sub-zones
    >
{
    // records:
    id    : string
    
    
    
    // data:
    zones : CoverageStateWithId[] // id-ify the sub-zones
}
export interface CoverageStateWithId
    extends Omit<CoverageStateDetail,
        // data:
        |'zones' // id-ify the sub-zones
    >
{
    // records:
    id    : string
    
    
    
    // data:
    zones : CoverageCityWithId[] // id-ify the sub-zones
}
export interface CoverageCityWithId
    extends Omit<CoverageCityDetail,
        // data:
        |'zones' // id-ify the sub-zones
    >
{
    // records:
    id    : string
    
    
    
    // data:
    // zones : CoverageVillageWithId[] // reserved for the future
}
