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

export const convertOrderDetailDataToOrderDetail = (orderDetailData: Awaited<ReturnType<typeof prisma.order.findFirstOrThrow<{ where: {}, select: typeof orderDetailSelect }>>>): OrderDetail => {
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