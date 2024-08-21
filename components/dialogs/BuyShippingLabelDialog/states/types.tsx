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
