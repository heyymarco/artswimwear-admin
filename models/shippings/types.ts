// models:
import {
    type ShippingProvider,
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



export type CoverageSubzone = CoverageCountry|CoverageState|never
export interface CoverageZone<TSubzone extends CoverageSubzone>
    extends
        Omit<CoverageCountry, 'useZones'|'zones'>,
        Omit<CoverageState  , 'useZones'|'zones'>,
        Omit<CoverageCity   , 'useZones'|'zones'>
{
    useZones : TSubzone extends never ? never : boolean
    zones    : TSubzone extends never ? never : TSubzone[]
}
