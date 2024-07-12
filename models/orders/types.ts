import type {
    // types:
    WysiwygEditorState,
}                           from '@/components/editors/WysiwygEditor/types'

// models:
import type {
    Prisma,
    
    Customer,
    CustomerPreference,
    Guest,
    GuestPreference,
    Payment,
    PaymentConfirmation,
    Order,
    OrdersOnProducts,
    DraftOrder,
    DraftOrdersOnProducts,
    ShippingTracking,
}                           from '@prisma/client'



// types:
export interface OrderDetail
    extends
        Omit<Order,
            // records:
            |'updatedAt'
            
            // data:
            |'paymentId'
            
            // relations:
            |'customerId'
            |'guestId'
        >
{
    // data:
    payment  : PaymentDetail|null
    
    
    
    // relations:
    items    : Omit<OrdersOnProducts,
        |'id'
        |'orderId'
    >[]
    
    customer : null|(Omit<Customer,
        |'createdAt'
        |'updatedAt'
    > & {
        preference : CustomerOrGuestPreferenceData|null
    })
    guest    : null|(Omit<Guest,
        |'createdAt'
        |'updatedAt'
    > & {
        preference : CustomerOrGuestPreferenceData|null
    })
    
    paymentConfirmation : null|Partial<Omit<PaymentConfirmation,
        |'id'
        
        |'token'
        
        |'orderId'
    >>
    
    shippingTracking : null|Partial<Omit<ShippingTracking,
        |'id'
        
        |'token'
        
        |'orderId'
    >>
}



export type CustomerOrGuest =
    &Pick<Customer, keyof Customer & keyof Guest>
    &Pick<Guest   , keyof Customer & keyof Guest>
export type CustomerOrGuestPreference =
    &Pick<CustomerPreference, keyof CustomerPreference & keyof GuestPreference>
    &Pick<GuestPreference   , keyof CustomerPreference & keyof GuestPreference>
export type CustomerOrGuestPreferenceData = Omit<CustomerOrGuestPreference,
    // records:
    |'id'
    
    // data:
    |'marketingOpt'
    
    // relations:
    |'customerId'
    |'guestId'
>



export type RevertDraftOrder = Pick<DraftOrder,
    // records:
    |'id'
    
    // data:
    |'orderId'
> & {
    items : Pick<DraftOrdersOnProducts,
        // data:
        |'quantity'
        
        // relations:
        |'productId'
        |'variantIds'
    >[]
}
export interface RevertDraftOrderData {
    draftOrder: RevertDraftOrder
}



export interface FindOrderByIdData<TSelect extends Prisma.OrderSelect> {
    id          ?: string|null
    orderId     ?: string|null
    paymentId   ?: string|null
    
    orderSelect  : TSelect
}



export type CancelOrder = Pick<Order,
    |'id'
    
    |'orderId'
    
    |'orderStatus'
> & {
    payment : Pick<PaymentDetail,
        |'type'
    >|null
    items : Pick<OrdersOnProducts,
        |'productId'
        |'variantIds'
        
        |'quantity'
    >[]
}

export interface CancelOrderData<TSelect extends Prisma.OrderSelect> {
    order              : CancelOrder
    isExpired         ?: boolean
    deleteOrder       ?: boolean
    cancelationReason ?: WysiwygEditorState|null
    
    orderSelect        : TSelect
}



export interface PaymentDetail
    extends
        Omit<Payment,
            // records:
            |'id'
            
            // data:
            |'expiresAt'      // converted to optional
            |'billingAddress' // converted to optional
            
            // relations:
            |'parentId'
        >
{
    // data:
    expiresAt      ?: Payment['expiresAt']      // converted to optional
    billingAddress ?: Payment['billingAddress'] // converted to optional
    
    paymentId      ?: string // an optional token for make manual_payment
}
