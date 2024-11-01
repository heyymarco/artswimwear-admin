// next-js:
import {
    type NextRequest,
}                           from 'next/server'

// next-auth:
import {
    getServerSession,
}                           from 'next-auth'

// heymarco:
import type {
    Session,
}                           from '@heymarco/next-auth/server'

// next-connect:
import {
    createEdgeRouter,
}                           from 'next-connect'

// models:
import {
    type Pagination,
    type OrderDetail,
    type ShipmentPreview,
    
    
    
    // schemas:
    PaginationArgSchema,
    
    
    
    orderDetailSelect,
    cancelOrderSelect,
}                           from '@/models'
import {
    Prisma,
}                           from '@prisma/client'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'

// internal auth:
import {
    authOptions,
}                           from '@/libs/auth.server'

// internals:
import {
    // utilities:
    findOrderById,
    cancelOrder,
}                           from '@/libs/order-utilities'
import {
    sendConfirmationEmail,
    NotificationType,
    broadcastNotificationEmail,
}                           from '@/libs/email-utilities'

// easypost:
import {
    registerShippingTracker,
}                           from '@/libs/shippings/processors/easypost'

// others:
import {
    customAlphabet,
}                           from 'nanoid/async'

// configs:
import type {
    EmailConfig,
}                           from '@/components/Checkout/types'
import {
    checkoutConfigServer,
}                           from '@/checkout.config.server'



// configs:
export const fetchCache = 'force-no-store';
export const maxDuration = 60; // this function can run for a maximum of 60 seconds for many & complex transactions



// routers:
interface RequestContext {
    params: {
        /* no params yet */
    }
}
const router  = createEdgeRouter<NextRequest, RequestContext>();
const handler = async (req: NextRequest, ctx: RequestContext) => router.run(req, ctx) as Promise<any>;
export {
    handler as GET,
    handler as POST,
    handler as PUT,
    handler as PATCH,
    handler as DELETE,
    handler as HEAD,
}

router
.use(async (req, ctx, next) => {
    // conditions:
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: 'Please sign in.' }, { status: 401 }); // handled with error: unauthorized
    (req as any).session = session;
    
    
    
    // authorized => next:
    return await next();
})
.post(async (req) => {
    //#region parsing and validating request
    const requestData = await (async () => {
        try {
            const data = await req.json();
            return {
                paginationArg : PaginationArgSchema.parse(data),
            };
        }
        catch {
            return null;
        } // try
    })();
    if (requestData === null) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    const {
        paginationArg : {
            page,
            perPage,
        },
    } = requestData;
    //#endregion parsing and validating request
    
    
    
    //#region validating privileges
    const session = (req as any).session as Session;
    if (!session.role?.order_r) return Response.json({ error:
`Access denied.

You do not have the privilege to view the orders.`
    }, { status: 403 }); // handled with error: forbidden
    //#endregion validating privileges
    
    
    
    const [total, paged] = await prisma.$transaction([
        prisma.order.count(),
        prisma.order.findMany({
            select : orderDetailSelect,
            orderBy : {
                createdAt: 'desc',
            },
            skip    : page * perPage, // note: not scaleable but works in small commerce app -- will be fixed in the future
            take    : perPage,
        }),
    ]);
    const paginationOrderDetail : Pagination<OrderDetail> = {
        total    : total,
        entities : paged satisfies OrderDetail[],
    };
    return Response.json(paginationOrderDetail); // handled with success
})
.patch(async (req) => {
    if (process.env.SIMULATE_SLOW_NETWORK === 'true') {
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, 2000);
        });
    } // if
    
    // throw '';
    // return Response.json({ message: 'not found'    }, { status: 400 }); // handled with error
    // return Response.json({ message: 'server error' }, { status: 500 }); // handled with error
    
    //#region parsing request
    const body = await req.json();
    const {
        id,
        
        orderStatus,
        orderTrouble,
        cancelationReason,
        
        customer,
        guest,
        
        shippingAddress,
        
        billingAddress : optionalBillingAddress,
        
        sendConfirmationEmail : performSendConfirmationEmail = false,
        
        paymentConfirmation,
        shipment,
    } = body;
    const mergedPayment = {
        ...body.payment,
        
        // if supplied, overwrite billingAddress of the payment:
        ...(optionalBillingAddress ? {
            billingAddress : optionalBillingAddress,
        } : undefined),
    };
    const payment = Object.keys(mergedPayment).length ? mergedPayment : undefined;
    const rejectionReason = paymentConfirmation?.rejectionReason;
    const {
        carrier : shippingCarrier,
        number  : shippingNumber,
        cost    : shippingCost,
    } = shipment ?? {};
    //#endregion parsing request
    
    
    
    //#region validating request
    if ((orderStatus !== undefined) && (typeof(orderStatus) !== 'string') && !['NEW_ORDER', 'CANCELED', /* 'EXPIRED' should be done in backend_only, not by http_request */, 'PROCESSED', 'ON_THE_WAY', 'IN_TROUBLE', 'COMPLETED'].includes(orderStatus)) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    if ((orderTrouble !== undefined) && (orderTrouble !== null) && (typeof(orderTrouble) !== 'object')) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    if ((cancelationReason !== undefined) && (cancelationReason !== null) && (typeof(cancelationReason) !== 'object')) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    
    if ((shippingCarrier !== undefined) && (shippingCarrier !== null) && ((typeof(shippingCarrier) !== 'string') || (shippingCarrier.length < 1) || (shippingCarrier.length > 50))) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    if ((shippingNumber !== undefined) && (shippingNumber !== null) && ((typeof(shippingNumber) !== 'string') || (shippingNumber.length < 1) || (shippingNumber.length > 50))) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    if ((shippingCost !== undefined) && (shippingCost !== null) && ((typeof(shippingCost) !== 'number') || !isFinite(shippingCost) || (shippingCost < 0))) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    
    if ((typeof(id) !== 'string') || (id.length < 1)) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    
    if ((customer !== undefined) && (guest !== undefined)) { // conflicting data! must be both undefined -or- one kind is existing
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    
    const customerOrGuest = customer ?? guest;
    if (
        ((customerOrGuest !== undefined) && ((typeof(customerOrGuest) !== 'object') || Object.keys(customerOrGuest).some((prop) => !['name', 'email'].includes(prop))))
        ||
        ((customerOrGuest?.name         !== undefined) && ((typeof(customerOrGuest.name)         !== 'string') || (customerOrGuest.name.length  < 2) || (customerOrGuest.name.length  > 30)))
        ||
        ((customerOrGuest?.email        !== undefined) && ((typeof(customerOrGuest.email)        !== 'string') || (customerOrGuest.email.length < 5) || (customerOrGuest.email.length > 50)))
    ) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    
    if (
        (payment !== undefined)
        &&
        (
            ((typeof(payment?.type) !== 'string') || (payment?.type !== 'MANUAL_PAID'))
            ||
            ((typeof(payment?.brand) !== 'string') || !['BANK_TRANSFER', 'CHECK', 'OTHER', /* TODO: config dependent brands */].includes(payment?.brand)) // must be filled
            ||
            ((payment?.identifier !== undefined) && (payment?.identifier !== null) && (typeof(payment?.identifier) !== 'string'))
            ||
            ((typeof(payment?.amount) !== 'number') || (payment?.amount < 0) || !isFinite(payment?.amount)) // the amount must be finite & non_negative
            ||
            ((typeof(payment?.fee) !== 'number') || (payment?.fee < 0) || !isFinite(payment?.fee)) // the fee must be finite & non_negative
        )
    ) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    
    if (
            (rejectionReason !== undefined)
            &&
            (
                (payment !== undefined) // cannot update payment & update rejectionReason at the same time
                ||
                (typeof(rejectionReason) !== 'object')
            )
    ) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    
    const order = await prisma.order.findUnique({
        where  : {
            id : id,
        },
        select : {
            id : true,
        },
    });
    if (!order) {
        return Response.json({
            error: 'Invalid ID.',
        }, { status: 400 }); // handled with error
    } // if
    //#endregion validating request
    
    
    
    //#region validating privileges
    const session = (req as any).session as Session;
    if (!id) {
//         if (!session.role?.order_c) return Response.json({ error:
// `Access denied.
// 
// You do not have the privilege to add new order.`
//         }, { status: 403 }); // handled with error: forbidden
    }
    else {
        if (!session.role?.order_us && ((orderStatus !== undefined) || (orderTrouble !== undefined) || (cancelationReason !== undefined) || (shippingCarrier !== undefined) || (shippingNumber !== undefined) || (shippingCost !== undefined))) return Response.json({ error:
`Access denied.

You do not have the privilege to modify the order's status.`
        }, { status: 403 }); // handled with error: forbidden
        
        if (!session.role?.order_usa && (shippingAddress !== undefined)) return Response.json({ error:
`Access denied.

You do not have the privilege to modify the order's shippingAddress.`
        }, { status: 403 }); // handled with error: forbidden
        
        if ((payment !== undefined) || (rejectionReason !== undefined)) {
            // const {payment: {type: currentPaymentType}} = await prisma.order.findUnique({
            const foundOrder = await prisma.order.findUnique({
                where  : {
                    id : id,
                },
                select : {
                    payment : {
                        select : {
                            type : true,
                        },
                    },
                },
            });
            const currentPaymentType = foundOrder?.payment?.type;
            
            
            
            if (currentPaymentType) {
                
                if (!session.role?.order_upmu && (currentPaymentType === 'MANUAL')) return Response.json({ error:
`Access denied.

You do not have the privilege to approve payment of the order.`
                }, { status: 403 }); // handled with error: forbidden
                
                if (!session.role?.order_upmp && (currentPaymentType === 'MANUAL_PAID')) return Response.json({ error:
`Access denied.

You do not have the privilege to modify the payment of the order.`
                }, { status: 403 }); // handled with error: forbidden
            } // if
        } // if
    } // if
    //#endregion validating privileges
    
    
    
    //#region register shippingTracker
    const shippingTracker = (
        (orderStatus === 'ON_THE_WAY') && shippingCarrier && shippingNumber
        ? await registerShippingTracker({ carrier: shippingCarrier, number: shippingNumber })
        : undefined
    );
    
    // a rare case: the shipment is already delivered:
    const isDelivered = shippingTracker?.status === 'delivered';
    //#endregion register shippingTracker
    
    
    
    //#region save changes
    try {
        const [prevShipment, orderDetail] = await (async (): Promise<readonly [ShipmentPreview|undefined, OrderDetail|null]> => {
            if (orderStatus === 'CANCELED') {
                const orderDetail : OrderDetail|null = await prisma.$transaction(async (prismaTransaction): Promise<OrderDetail|null> => {
                    const order = await findOrderById(prismaTransaction, {
                        id                : id,
                        
                        orderSelect       : cancelOrderSelect,
                    });
                    if (!order) return null; // the order is not found => ignore
                    if (['CANCELED', 'EXPIRED'].includes(order.orderStatus)) return null; // already 'CANCELED'|'EXPIRED' => ignore
                    if (!order.payment || order.payment.type !== 'MANUAL') return null; // not 'MANUAL' payment => ignore
                    
                    
                    
                    // (Real)Order CANCELED => restore the `Product` stock and mark Order as 'CANCELED':
                    const orderDetail : OrderDetail = await cancelOrder(prismaTransaction, {
                        order             : order,
                        cancelationReason : cancelationReason,
                        
                        orderSelect       : orderDetailSelect,
                    });
                    return orderDetail;
                }, { timeout: 50000 }); // give a longer timeout for `cancelOrder`
                return [undefined, orderDetail];
            } // if
            
            
            
            const [, prevShipment, orderDetail] = await prisma.$transaction([
                // update PaymentConfirmation (if any):
                (
                    (payment?.type === 'MANUAL_PAID')
                    ? prisma.paymentConfirmation.updateMany({
                        where  : {
                            parentId              : id,
                            OR : [
                                { reviewedAt      : { equals : null          } }, // never approved or rejected
                                
                                /* -or- */
                                
                                { rejectionReason : { not    : Prisma.DbNull } }, // has reviewed as rejected (prevents to approve the *already_approved_payment_confirmation*)
                            ],
                        },
                        data: {
                            reviewedAt            : new Date(),    // the approval date
                            rejectionReason       : Prisma.DbNull, // unset the rejection reason, because it's approved now
                        },
                    })
                    : (
                        rejectionReason
                        ? prisma.paymentConfirmation.updateMany({
                            where  : {
                                parentId          : id,
                                
                                reviewedAt        : { equals : null          }, // never approved or rejected (prevents to reject the *already_rejected/approved_payment_confirmation*)
                            },
                            data: {
                                reviewedAt        : new Date(),      // the rejection date
                                rejectionReason   : rejectionReason, // set the rejection reason
                            },
                        })
                        : prisma.paymentConfirmation.updateMany({
                            where : {
                                AND : [
                                    { parentId : { equals : id } }, // never match, just for dummy transaction without change the size of the array
                                    { parentId : { not    : id } }, // never match, just for dummy transaction without change the size of the array
                                ],
                            },
                            data : {},
                        })
                    )
                ),
                
                // detect shipping tracking number changes:
                (
                    (orderStatus !== 'ON_THE_WAY')
                    ? prisma.order.findFirst({
                        where  : {
                            AND : [
                                { id : { equals : id } }, // never match, just for dummy transaction without change the size of the array
                                { id : { not    : id } }, // never match, just for dummy transaction without change the size of the array
                            ],
                        },
                        select : {
                            shipment : {
                                select : {
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
                        },
                    })
                    : prisma.order.findFirst({
                        where  : {
                            id : id,
                        },
                        select : {
                            shipment : {
                                select : {
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
                        },
                    })
                ),
                
                // update Order:
                prisma.order.update({
                    where  : {
                        id : id,
                    },
                    data   : {
                        orderStatus : isDelivered ? 'COMPLETED' : orderStatus,
                        orderTrouble,
                        
                        customer : (
                            (customer !== undefined)
                            ? {
                                update : {
                                    name  : customer.name,
                                    email : customer.email,
                                },
                            }
                            : undefined
                        ),
                        guest : (
                            (guest !== undefined)
                            ? {
                                upsert : {
                                    update : {
                                        name  : guest.name,
                                        email : guest.email,
                                    },
                                    create : {
                                        name  : guest.name  ?? '', // required field
                                        email : guest.email ?? '', // required field
                                    },
                                },
                            }
                            : undefined
                        ),
                        
                        shippingAddress,
                        
                        payment : !payment ? undefined : {
                            update : {
                                data : {
                                    ...payment,
                                    ...((payment?.type !== 'MANUAL_PAID') ? undefined : { // commitOrder:
                                        expiresAt : null, // paid, no more payment expiry date
                                    }),
                                    
                                    billingAddress : (!payment.billingAddress) ? undefined : {
                                        update : payment.billingAddress,
                                        create : payment.billingAddress,
                                    },
                                },
                            },
                        },
                        
                        shipment : {
                            upsert : {
                                update : {
                                    carrier   : (shippingCarrier === '') ? null /* delete if empty_string */ : shippingCarrier,
                                    number    : (shippingNumber  === '') ? null /* delete if empty_string */ : shippingNumber,
                                    cost      : shippingCost,
                                    
                                    trackerId : shippingTracker?.id,
                                    logs      : !shippingTracker?.tracking_details?.length ? undefined : {
                                        deleteMany : {
                                            // do DELETE ALL related log(s)
                                            // no condition is needed because we want to delete all related log(s)
                                        },
                                        create : shippingTracker.tracking_details.map((shippingDetail) => ({
                                            reportedAt : shippingDetail.datetime,
                                            log        : shippingDetail.message || shippingDetail.status,
                                        })),
                                    },
                                },
                                create : {
                                    token     : await (async (): Promise<string> => {
                                        const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 16);
                                        return await nanoid();
                                    })(),
                                    
                                    carrier   : (shippingCarrier === '') ? null /* delete if empty_string */ : shippingCarrier,
                                    number    : (shippingNumber  === '') ? null /* delete if empty_string */ : shippingNumber,
                                    cost      : shippingCost,
                                    
                                    trackerId : shippingTracker?.id,
                                    logs      : !shippingTracker?.tracking_details?.length ? undefined : {
                                        create : shippingTracker.tracking_details.map((shippingDetail) => ({
                                            reportedAt : shippingDetail.datetime,
                                            log        : shippingDetail.message || shippingDetail.status,
                                        })),
                                    },
                                },
                            },
                        },
                    },
                    select : orderDetailSelect,
                }),
            ]);
            return [prevShipment?.shipment ?? undefined, orderDetail satisfies OrderDetail];
        })();
        
        
        
        //#region send email confirmation
        if (orderDetail) {
            let customerEmailConfig : EmailConfig|undefined = undefined;
            let adminEmailConfig    : EmailConfig|undefined = undefined;
            let notificationType    : NotificationType|undefined = undefined;
            
            const {
                customerEmails,
                adminEmails,
            } = checkoutConfigServer;
            if (rejectionReason) { // payment confirmation declined
                customerEmailConfig = customerEmails.rejected;
                adminEmailConfig    = adminEmails.rejected;
                notificationType    = 'emailOrderRejected';
            }
            else if (payment?.type === 'MANUAL_PAID') {   // payment approved (regradless having payment confirmation or not)
                customerEmailConfig = customerEmails.checkout;
                adminEmailConfig    = adminEmails.checkout;
                notificationType    = 'emailOrderNewPaid';
            }
            else if (orderStatus === 'CANCELED') { // order canceled confirmation
                customerEmailConfig = customerEmails.canceled;
                adminEmailConfig    = adminEmails.canceled;
                notificationType    = 'emailOrderCanceled';
            }
            else if (orderStatus === 'PROCESSED') {
                customerEmailConfig = undefined;
                adminEmailConfig    = adminEmails.processing;
                notificationType    = 'emailOrderProcessing';
            }
            else if (orderStatus === 'ON_THE_WAY') { // shipping tracking number confirmation
                customerEmailConfig = customerEmails.shipping;
                adminEmailConfig    = adminEmails.shipping;
                notificationType    = 'emailOrderShipping';
            }
            else if (orderStatus === 'COMPLETED') {  // order completed confirmation
                customerEmailConfig = customerEmails.completed;
                adminEmailConfig    = adminEmails.completed;
                notificationType    = 'emailOrderCompleted';
            } // if
            
            
            
            await Promise.all([
                performSendConfirmationEmail && customerEmailConfig && sendConfirmationEmail(orderDetail.orderId, customerEmailConfig, {
                    // shipping carrier changes:
                    prevShipment,
                }),
                
                notificationType             && adminEmailConfig    && broadcastNotificationEmail(orderDetail.orderId, adminEmailConfig, {
                    notificationType : notificationType,
                    
                    // shipping carrier changes:
                    prevShipment,
                }),
                
                
                
                // a rare case: the shipment is already delivered:
                isDelivered && sendConfirmationEmail(orderDetail.orderId, customerEmails.completed),
                isDelivered && broadcastNotificationEmail(orderDetail.orderId, adminEmails.completed, {
                    notificationType : 'emailOrderCompleted',
                }),
            ]);
        } // if
        //#endregion send email confirmation
        
        
        
        if (!orderDetail) return Response.json({ error: 'Order record not found.'}, { status: 404 }); // handled with error: not found
        return Response.json(orderDetail satisfies OrderDetail); // handled with success
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        // if (error instanceof RecordNotFound) return Response.json({ error: 'invalid ID' }, { status: 400 }); // handled with error
        return Response.json({ error: error }, { status: 500 }); // handled with error
    } // try
    //#endregion save changes
});
