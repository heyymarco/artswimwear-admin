// internals:
import {
    // types:
    type MatchingShipping,
}                           from '@/libs/shippings/shippings'



export type CheckoutStep =
    |'info'
    |'shipping'
    |'payment'
    |'paid'

export type BusyState =
    | false // idle
    | 'checkCarriers'
    | 'transaction'

export type ExpandedAddress =
    |'originAddress'
    |'shippingAddress'

export interface FixedMatchingShipping
    extends
        Pick<MatchingShipping,
        |'name'
        |'rates'
    >
{
    rates : number
}
