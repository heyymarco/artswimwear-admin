// models:
import {
    type DefaultShippingOrigin,
}                           from '@prisma/client'
import {
    type ShippingAddressDetail,
}                           from '../orders'



export interface ShippingLabelRequest {
    originAddress      : Omit<DefaultShippingOrigin, 'id'>
    shippingAddress    : ShippingAddressDetail
    totalProductWeight : number
}
export interface ShippingLabelEta {
    min : number
    max : number
}
export interface ShippingLabelDetail {
    id   : string
    
    name : string
    
    eta  : ShippingLabelEta|null
    rate : number
}
