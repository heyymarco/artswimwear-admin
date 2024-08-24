import {
    // types:
    type WysiwygEditorState,
}                           from '@/components/editors/WysiwygEditor/types'

// models:
import {
    type Prisma,
    
    type Payment,
    type PaymentConfirmation,
    type DraftOrder,
    type Order,
    type OrderCurrency,
    type OrdersOnProducts,
    type DraftOrdersOnProducts,
    type Shipment,
}                           from '@prisma/client'
import {
    type CustomerDetail,
    type GuestDetail,
}                           from '../customers'
import {
    type ShippingAddressDetail,
    type BillingAddressDetail,
}                           from '../shippings'



// types:
export interface DraftOrderDetail
    extends
        Omit<DraftOrder,
            // records:
            |'expiresAt'
            
            // data:
            // |'paymentId'  // required for `commitDraftOrder()`, do NOT omit
            
            // relations:
            // |'customerId' // required for `commitDraftOrder()`, do NOT omit
            // |'guestId'    // required for `commitDraftOrder()`, do NOT omit
        >
{
    // data:
    currency        : OrderCurrencyDetail|null
    shippingAddress : ShippingAddressDetail|null
}



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
    currency        : OrderCurrencyDetail|null
    shippingAddress : ShippingAddressDetail|null
    payment         : PaymentDetail|null
    
    
    
    // relations:
    items    : Omit<OrdersOnProducts,
        // records:
        |'id'
        
        // relations:
        |'parentId'
    >[]
    
    customer : CustomerDetail|null
    guest    : GuestDetail|null
    
    paymentConfirmation : null|Partial<Omit<PaymentConfirmation,
        |'id'
        
        |'token'
        
        |'parentId'
    >>
    
    shipment : null|Partial<Omit<Shipment,
        // records:
        |'id'
        
        // data:
        |'token'
        |'trackerId'
        
        // relations:
        |'parentId'
    >>
}

export interface OrderDetailWithOptions
    extends
        OrderDetail
{
    sendConfirmationEmail?: boolean
}



export interface OrderCurrencyDetail
    extends
        Omit<OrderCurrency,
            // records:
            |'id'
            
            // relations:
            |'parentId'
        >
{
}



export interface PaymentDetail
    extends
        Omit<Payment,
            // records:
            |'id'
            
            // data:
            |'expiresAt' // converted to optional
            
            // relations:
            |'parentId'
        >
{
    // data:
    expiresAt      ?: Payment['expiresAt'] // converted to optional
    billingAddress ?: BillingAddressDetail|null
    
    paymentId      ?: string // an optional token for make manual_payment
}



export type RevertDraftOrder = Pick<DraftOrderDetail,
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



export type CancelOrder = Pick<OrderDetail,
    |'id'
    
    |'orderId'
    
    |'orderStatus'
> & {
    payment : Pick<PaymentDetail,
        |'type'
    >|null
    items : Pick<OrdersOnProducts,
        // data:
        |'quantity'
        
        // relations:
        |'productId'
        |'variantIds'
    >[]
}

export interface CancelOrderData<TSelect extends Prisma.OrderSelect> {
    order              : CancelOrder
    isExpired         ?: boolean
    deleteOrder       ?: boolean
    cancelationReason ?: WysiwygEditorState|null
    
    orderSelect        : TSelect
}
