export type CheckoutStep =
    |'info'
    |'selectCarrier'
    |'payment'
    |'paid'

export type BusyState =
    | false // idle
    | 'checkCarriers'
    | 'transaction'

export type ExpandedAddress =
    |'originAddress'
    |'shippingAddress'
