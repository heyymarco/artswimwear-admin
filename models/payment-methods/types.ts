// models:
import {
    type PaymentType,
    type PaymentMethod,
    type PaymentMethodType,
}                           from '@prisma/client'
import {
    type BillingAddressDetail,
}                           from '../shippings'



export interface PaymentMethodDetail
    extends
        Pick<PaymentMethod,
            // records:
            |'id'
            
            
            
            // data:
            |'type'
            |'currency'
        >
{
    // data:
    type           : Extract<PaymentType, PaymentMethodType>
    brand          : string
    identifier     : string
    
    expiresAt      : Date|null
    
    billingAddress : BillingAddressDetail|null
    
    priority       : number
}
