// models:
import {
    type OrderDetail,
}                           from './types'
import {
    type Prisma,
}                           from '@prisma/client'

// ORMs:
import {
    type prisma,
}                           from '@/libs/prisma.server'



export const orderAndDataSelectAndExtra = {
    // records:
    id                : true,
    createdAt         : true,
    updatedAt         : true,
    
    // data:
    orderId           : true,
    paymentId         : true,
    
    orderStatus       : true,
    orderTrouble      : true,
    cancelationReason : true,
    
    preferredCurrency : true,
    
    shippingAddress   : true,
    shippingCost      : true,
    
    payment           : {
        select : {
            // data:
            type           : true,
            brand          : true,
            identifier     : true,
            expiresAt      : true,
            
            amount         : true,
            fee            : true,
            
            billingAddress : true,
        },
    },
    
    // relations:
    items : {
        select : {
            // data:
            price          : true,
            shippingWeight : true,
            quantity       : true,
            
            // relations:
            product        : {
                select : {
                    name   : true,
                    images : true,
                    
                    // relations:
                    variantGroups : {
                        select : {
                            variants : {
                                // always allow to access DRAFT variants when the customer is already ordered:
                                // where    : {
                                //     visibility : { not: 'DRAFT' } // allows access to Variant with visibility: 'PUBLISHED' but NOT 'DRAFT'
                                // },
                                select : {
                                    id   : true,
                                    
                                    name : true,
                                },
                                orderBy : {
                                    sort : 'asc',
                                },
                            },
                        },
                        orderBy : {
                            sort : 'asc',
                        },
                    },
                },
            },
            variantIds     : true,
        },
    },
    
    customerId         : true,
    customer           : {
        select : {
            name  : true,
            email : true,
            customerPreference : {
                select : {
                    marketingOpt : true,
                    timezone     : true,
                },
            },
        },
    },
    
    guestId            : true,
    guest              : {
        select : {
            name  : true,
            email : true,
            guestPreference : {
                select : {
                    marketingOpt : true,
                    timezone     : true,
                },
            },
        },
    },
    
    shippingProviderId : true,
    shippingProvider   : {
        select : {
            // records:
            id         : true, // required for identifier
            
            
            
            // data:
            name       : true, // required for identifier
            
            weightStep : true, // required for calculate_shipping_cost algorithm
            eta        : {     // optional for matching_shipping algorithm
                select : {
                    // data:
                    min : true,
                    max : true,
                },
            },
            rates      : {     // required for calculate_shipping_cost algorithm
                select : {
                    // data:
                    start : true,
                    rate  : true,
                },
            },
            
            useZones   : true, // required for matching_shipping algorithm
        },
    },
    
    
    
    // extra data:
    paymentConfirmation : {
        select : {
            // records:
            reportedAt      : true,
            reviewedAt      : true,
            
            // data:
            token           : true,
            
            amount          : true,
            payerName       : true,
            paymentDate     : true,
            
            originatingBank : true,
            destinationBank : true,
            
            rejectionReason : true,
        },
    },
    shippingTracking : {
        select : {
            token          : true,
            shippingNumber : true,
        },
    },
} satisfies Prisma.OrderSelect;



export const orderDetailSelect = {
    id                        : true,
    createdAt                 : true,
    
    orderId                   : true,
    orderStatus               : true,
    orderTrouble              : true,
    cancelationReason         : true,
    
    items                     : {
        select: {
            productId         : true,
            variantIds        : true,
            
            price             : true,
            shippingWeight    : true,
            quantity          : true,
        },
    },
    
    customer                  : {
        select: {
            id                : true,
            
            name              : true,
            email             : true,
            
            
            
            customerPreference : {
                select : {
                    timezone : true,
                },
            },
        },
    },
    guest                     : {
        select: {
            id                : true,
            
            name              : true,
            email             : true,
            
            
            
            guestPreference : {
                select : {
                    timezone : true,
                },
            },
        },
    },
    
    preferredCurrency         : true,
    
    shippingAddress           : true,
    shippingCost              : true,
    shippingProviderId        : true,
    
    payment           : {
        select : {
            // data:
            type           : true,
            brand          : true,
            identifier     : true,
            expiresAt      : true,
            
            amount         : true,
            fee            : true,
            
            billingAddress : true,
        },
    },
    
    paymentConfirmation       : {
        select : {
            // records:
            reportedAt        : true,
            reviewedAt        : true,
            
            // data:
            amount            : true,
            payerName         : true,
            paymentDate       : true,
            
            originatingBank   : true,
            destinationBank   : true,
            
            rejectionReason   : true,
        },
    },
    
    shippingTracking          : {
        select : {
            shippingCarrier   : true,
            shippingNumber    : true,
        },
    },
} satisfies Prisma.OrderSelect;

export const convertOrderDetailDataToOrderDetail = (orderDetailData: Awaited<ReturnType<typeof prisma.order.findFirstOrThrow<{ select: typeof orderDetailSelect }>>>): OrderDetail => {
    const {
        customer : customerData,
        guest    : guestData,
        ...restOrderDetail
    } = orderDetailData;
    return {
        customer : !customerData ? null : ((): OrderDetail['customer'] => {
            const {
                customerPreference,
                ...restCustomer
            } = customerData;
            return {
                ...restCustomer,
                preference : customerPreference,
            };
        })(),
        guest : !guestData ? null : ((): OrderDetail['guest'] => {
            const {
                guestPreference,
                ...restCustomer
            } = guestData;
            return {
                ...restCustomer,
                preference : guestPreference,
            };
        })(),
        ...restOrderDetail,
    } satisfies OrderDetail;
};



export const revertDraftOrderSelect = {
    // records:
    id                     : true,
    
    // data:
    orderId                : true,
    
    items : {
        select : {
            // data:
            quantity       : true,
            
            // relations:
            productId      : true,
            variantIds     : true,
        },
    },
} satisfies Prisma.DraftOrderSelect;



export const cancelOrderSelect = {
    id                     : true,
    
    orderId                : true,
    
    orderStatus            : true,
    
    payment : {
        select : {
            type           : true,
        },
    },
    
    items : {
        select : {
            productId      : true,
            variantIds     : true,
            
            quantity       : true,
        },
    },
} satisfies Prisma.OrderSelect;