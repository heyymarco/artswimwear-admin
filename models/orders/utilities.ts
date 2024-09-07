// models:
import {
    type Prisma,
    type PaymentType,
    type OrderStatus,
}                           from '@prisma/client'

// reusable-ui core:
import {
    // color options of UI:
    type ThemeName,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    type IconList,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components



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
    
    currency          : {
        select : {
            currency  : true,
            rate      : true,
        },
    },
    
    shippingAddress   : {
        select : {
            country   : true,
            state     : true,
            city      : true,
            zip       : true,
            address   : true,
            
            firstName : true,
            lastName  : true,
            phone     : true,
        },
    },
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
            
            billingAddress : {
                select : {
                    country   : true,
                    state     : true,
                    city      : true,
                    zip       : true,
                    address   : true,
                    
                    firstName : true,
                    lastName  : true,
                    phone     : true,
                },
            },
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
            preference : {
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
            preference : {
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
    shipment            : {
        select : {
            token       : true,
            
            carrier     : true,
            number      : true,
            eta         : {
                select : {
                    min : true,
                    max : true,
                },
            },
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
            
            
            
            preference : {
                select : {
                    marketingOpt : true,
                    timezone     : true,
                },
            },
        },
    },
    guest                     : {
        select: {
            id                : true,
            
            name              : true,
            email             : true,
            
            
            
            preference : {
                select : {
                    marketingOpt : true,
                    timezone     : true,
                },
            },
        },
    },
    
    currency                  : {
        select : {
            currency          : true,
            rate              : true,
        },
    },
    
    shippingAddress           : {
        select : {
            country   : true,
            state     : true,
            city      : true,
            zip       : true,
            address   : true,
            
            firstName : true,
            lastName  : true,
            phone     : true,
        },
    },
    shippingCost              : true,
    shippingProviderId        : true,
    
    payment                   : {
        select : {
            // data:
            type           : true,
            brand          : true,
            identifier     : true,
            expiresAt      : true,
            
            amount         : true,
            fee            : true,
            
            billingAddress : {
                select : {
                    country   : true,
                    state     : true,
                    city      : true,
                    zip       : true,
                    address   : true,
                    
                    firstName : true,
                    lastName  : true,
                    phone     : true,
                },
            },
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
    
    shipment                  : {
        select : {
            carrier     : true,
            number      : true,
            cost        : true,
        },
    },
} satisfies Prisma.OrderSelect;



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
    
    payment                : {
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



export const orderStatusValues : OrderStatus[] = [
    'NEW_ORDER',
    'CANCELED',
    'EXPIRED',
    'PROCESSED',
    'ON_THE_WAY',
    'IN_TROUBLE',
    'COMPLETED',
];
export const problemOrderStatusValues : OrderStatus[] = [
    'CANCELED',
    'EXPIRED',
    'IN_TROUBLE',
];

export const orderStatusTheme = (orderStatus : OrderStatus, paymentType?: PaymentType, reportedAt?: Date|null, reviewedAt?: Date|null): ThemeName => {
    if (!!reportedAt && (reviewedAt === null)) { // has reported and never approved or rejected
        return 'danger';
    } // if
    
    
    
    switch (orderStatus) {
        case 'NEW_ORDER'  :
            if (paymentType === 'MANUAL') return 'secondary';
            return 'danger';
        case 'CANCELED'   :
        case 'EXPIRED'    : return 'secondary';
        case 'IN_TROUBLE' : return 'danger';
        case 'COMPLETED'  : return 'success';
        default           : return 'warning';
    } // switch
};
export const orderStatusText = (orderStatus : OrderStatus, paymentType?: PaymentType, reportedAt?: Date|null, reviewedAt?: Date|null): ThemeName => {
    if (!!reportedAt && (reviewedAt === null)) { // has reported and never approved or rejected
        return 'Payment Confirmed';
    } // if
    
    
    
    switch (orderStatus) {
        case 'NEW_ORDER'  :
            if (paymentType === 'MANUAL') return 'Waiting for Payment';
            return 'New Order';
        case 'CANCELED'   : return 'Canceled';
        case 'EXPIRED'    : return 'Expired';
        case 'PROCESSED'  : return 'Being Processed';
        case 'ON_THE_WAY' : return 'On the Way';
        case 'IN_TROUBLE' : return 'In Trouble';
        case 'COMPLETED'  : return 'Completed';
    } // switch
};
export const orderStatusIcon = (orderStatus : OrderStatus, paymentType?: PaymentType, reportedAt?: Date|null, reviewedAt?: Date|null): IconList => {
    if (!!reportedAt && (reviewedAt === null)) { // has reported and never approved or rejected
        return 'chat';
    } // if
    
    
    
    switch (orderStatus) {
        case 'NEW_ORDER'  :
            if (paymentType === 'MANUAL') return 'timer';
            return 'shopping_cart';
        case 'CANCELED'   : return 'cancel_presentation';
        case 'EXPIRED'    : return 'timer_off';
        case 'PROCESSED'  : return 'directions_run';
        case 'ON_THE_WAY' : return 'local_shipping';
        case 'IN_TROUBLE' : return 'report_problem';
        case 'COMPLETED'  : return 'done';
    } // switch
};
export const orderStatusNext = (orderStatus : OrderStatus): OrderStatus => {
    switch (orderStatus) {
        case 'NEW_ORDER'  : return 'PROCESSED';
        case 'CANCELED'   : return orderStatus;
        case 'EXPIRED'    : return orderStatus;
        case 'PROCESSED'  : return 'ON_THE_WAY';
        case 'ON_THE_WAY' : return 'COMPLETED';
        case 'IN_TROUBLE' : return 'COMPLETED';
        case 'COMPLETED'  : return orderStatus;
        default           : return orderStatus;
    } // switch
}
