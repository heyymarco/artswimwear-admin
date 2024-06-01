// models:
import type {
    Prisma,
}                           from '@prisma/client'



export const orderDetailSelect = {
    id                        : true,
    
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
    
    payment                   : true,
    
    paymentConfirmation       : {
        select : {
            reportedAt        : true,
            reviewedAt        : true,
            
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