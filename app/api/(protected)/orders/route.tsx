// next-js:
import {
    NextRequest,
    NextResponse,
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

// types:
import type {
    Pagination,
}                           from '@/libs/types'

// models:
import type {
    Prisma,
    
    Customer,
    Guest,
    Order,
    OrdersOnProducts,
    PaymentConfirmation,
    ShippingTracking,
}                           from '@prisma/client'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'

// internal auth:
import {
    authOptions,
}                           from '@/app/api/auth/[...nextauth]/route'

// internals:
import {
    // utilities:
    findOrderById,
    cancelOrderSelect,
    cancelOrder,
}                           from './order-utilities'
import {
    sendConfirmationEmail,
}                           from './email-utilities'

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



// types:
export interface OrderDetail
    extends
        Omit<Order,
            |'createdAt'
            |'updatedAt'
            
            |'paymentId'
            
            |'customerId'
            |'guestId'
        >
{
    // relations:
    items    : Omit<OrdersOnProducts,
        |'id'
        |'orderId'
    >[]
    
    customer : null|Omit<Customer,
        |'createdAt'
        |'updatedAt'
    >
    guest    : null|Omit<Guest,
        |'createdAt'
        |'updatedAt'
    >
    
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
    if (!session) return NextResponse.json({ error: 'Please sign in.' }, { status: 401 }); // handled with error: unauthorized
    (req as any).session = session;
    
    
    
    // authorized => next:
    return await next();
})
.post(async (req) => {
    /* required for displaying products page */
    
    
    
    if (process.env.SIMULATE_SLOW_NETWORK === 'true') {
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, 2000);
        });
    } // if
    
    // throw '';
    
    //#region parsing request
    const {
        page    : pageStr    = 1,
        perPage : perPageStr = 20,
    } = await req.json();
    const page = Number.parseInt(pageStr as string);
    const perPage = Number.parseInt(perPageStr as string);
    //#endregion parsing request
    
    
    
    //#region validating request
    if ((typeof(page) !== 'number') || !isFinite(page) || (page < 1)
        ||
        (typeof(perPage) !== 'number') || !isFinite(perPage) || (perPage < 1)
    ) {
        return NextResponse.json({
            error: 'Invalid parameter(s).',
        }, { status: 400 }); // handled with error
    } // if
    //#endregion validating request
    
    
    
    //#region validating privileges
    const session = (req as any).session as Session;
    if (!session.role?.order_r) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to view the orders.`
    }, { status: 403 }); // handled with error: forbidden
    //#endregion validating privileges
    
    
    
    const [total, paged] = await prisma.$transaction([
        prisma.order.count(),
        prisma.order.findMany({
            select : {
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
                    },
                },
                guest                     : {
                    select: {
                        id                : true,
                        
                        name              : true,
                        email             : true,
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
                        preferredTimezone : true,
                        
                        originatingBank   : true,
                        destinationBank   : true,
                        
                        rejectionReason   : true,
                    },
                },
                shippingTracking          : {
                    select : {
                        shippingCarrier   : true,
                        shippingNumber    : true,
                        preferredTimezone : true,
                    },
                },
            },
            orderBy : {
                createdAt: 'desc',
            },
            skip    : (page - 1) * perPage, // note: not scaleable but works in small commerce app -- will be fixed in the future
            take    : perPage,
        }),
    ]);
    const paginationOrderDetail : Pagination<OrderDetail> = {
        total    : total,
        entities : paged,
    };
    return NextResponse.json(paginationOrderDetail); // handled with success
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
    // return NextResponse.json({ message: 'not found'    }, { status: 400 }); // handled with error
    // return NextResponse.json({ message: 'server error' }, { status: 500 }); // handled with error
    
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
        shippingCost,
        shippingProviderId,
        
        billingAddress : optionalBillingAddress,
        
        sendConfirmationEmail : performSendConfirmationEmail = false,
        
        paymentConfirmation,
        shippingTracking,
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
        shippingCarrier,
        shippingNumber,
        // preferredTimezone,
    } = shippingTracking ?? {};
    //#endregion parsing request
    
    
    
    //#region validating request
    if ((orderStatus !== undefined) && (typeof(orderStatus) !== 'string') && !['NEW_ORDER', 'CANCELED', /* 'EXPIRED' should be done in backend_only, not by http_request */, 'PROCESSED', 'ON_THE_WAY', 'IN_TROUBLE', 'COMPLETED'].includes(orderStatus)) {
        return NextResponse.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    if ((orderTrouble !== undefined) && (orderTrouble !== null) && (typeof(orderTrouble) !== 'object')) {
        return NextResponse.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    if ((cancelationReason !== undefined) && (cancelationReason !== null) && (typeof(cancelationReason) !== 'object')) {
        return NextResponse.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    
    if ((shippingCarrier !== undefined) && (shippingCarrier !== null) && ((typeof(shippingCarrier) !== 'string') || (shippingCarrier.length < 1) || (shippingCarrier.length > 50))) {
        return NextResponse.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    if ((shippingNumber !== undefined) && (shippingNumber !== null) && ((typeof(shippingNumber) !== 'string') || (shippingNumber.length < 1) || (shippingNumber.length > 50))) {
        return NextResponse.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    
    if ((typeof(id) !== 'string') || (id.length < 1)) {
        return NextResponse.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    
    if ((customer !== undefined) && (guest !== undefined)) { // conflicting data! must be both undefined -or- one kind is existing
        return NextResponse.json({
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
        return NextResponse.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    
    if (
        (payment !== undefined)
        &&
        (
            ((typeof(payment?.type) !== 'string') || !['MANUAL', 'MANUAL_PAID'].includes(payment?.type))
            ||
            ((typeof(payment?.brand) !== 'string') || !['BANK_TRANSFER', 'CHECK', 'OTHER'].includes(payment?.brand)) // must be filled
            ||
            (payment?.identifier !== null) // must be null
            ||
            ((typeof(payment?.amount) !== 'number') || (payment?.amount < 0) || !isFinite(payment?.amount)) // the amount must be finite & non_negative
            ||
            ((typeof(payment?.fee) !== 'number') || (payment?.fee < 0) || !isFinite(payment?.fee)) // the fee must be finite & non_negative
        )
    ) {
        return NextResponse.json({
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
        return NextResponse.json({
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
        return NextResponse.json({
            error: 'Invalid ID.',
        }, { status: 400 }); // handled with error
    } // if
    //#endregion validating request
    
    
    
    //#region validating privileges
    const session = (req as any).session as Session;
    if (!id) {
//         if (!session.role?.order_c) return NextResponse.json({ error:
// `Access denied.
// 
// You do not have the privilege to add new order.`
//         }, { status: 403 }); // handled with error: forbidden
    }
    else {
        if (!session.role?.order_us && ((orderStatus !== undefined) || (orderTrouble !== undefined) || (cancelationReason !== undefined) || (shippingCarrier !== undefined) || (shippingNumber !== undefined))) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to modify the order's status.`
        }, { status: 403 }); // handled with error: forbidden
        
        if (!session.role?.order_usa && (shippingAddress !== undefined)) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to modify the order's shippingAddress.`
        }, { status: 403 }); // handled with error: forbidden
        
        if ((payment !== undefined) || (rejectionReason !== undefined)) {
            const {payment: {type: currentPaymentType}} = await prisma.order.findUnique({
                where  : {
                    id : id,
                },
                select : {
                    payment : true,
                },
            }) ?? {payment:{}};
            
            if (currentPaymentType) {
                if (!session.role?.order_upmu && (currentPaymentType === 'MANUAL')) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to approve payment of the order.`
                }, { status: 403 }); // handled with error: forbidden
                
                if (!session.role?.order_upmp && (currentPaymentType === 'MANUAL_PAID')) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to modify the payment of the order.`
                }, { status: 403 }); // handled with error: forbidden
            } // if
        } // if
    } // if
    //#endregion validating privileges
    
    
    
    //#region save changes
    try {
        const orderDetail = await (async (): Promise<OrderDetail|null> => {
            const orderDetailSelect : Prisma.OrderSelect = {
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
                    },
                },
                guest                     : {
                    select: {
                        id                : true,
                        
                        name              : true,
                        email             : true,
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
                        preferredTimezone : true,
                        
                        originatingBank   : true,
                        destinationBank   : true,
                        
                        rejectionReason   : true,
                    },
                },
                
                shippingTracking          : {
                    select : {
                        shippingCarrier   : true,
                        shippingNumber    : true,
                        preferredTimezone : true,
                    },
                },
            };
            
            
            
            if (orderStatus === 'CANCELED') {
                const orderDetail = await prisma.$transaction(async (prismaTransaction): Promise<OrderDetail|null> => {
                    const order = await findOrderById(prismaTransaction, {
                        id                : id,
                        
                        orderSelect       : cancelOrderSelect,
                    });
                    if (!order) return null; // the order is not found => ignore
                    if (['CANCELED', 'EXPIRED'].includes(order.orderStatus)) return null; // already 'CANCELED'|'EXPIRED' => ignore
                    if (order.payment.type !== 'MANUAL') return null; // not 'MANUAL' payment => ignore
                    
                    
                    
                    // (pending)Order CANCELED => restore the `Product` stock and mark Order as 'CANCELED':
                    return await cancelOrder(prismaTransaction, {
                        order             : order,
                        cancelationReason : cancelationReason,
                        
                        orderSelect       : orderDetailSelect,
                    });
                });
                return orderDetail || null;
            } // if
            
            
            
            const [, orderDetail] = await prisma.$transaction([
                // update PaymentConfirmation (if any):
                (
                    (payment?.type === 'MANUAL_PAID')
                    ? prisma.paymentConfirmation.updateMany({
                        where  : {
                            orderId : id,
                            OR : [
                                { reviewedAt      : { equals : null  } }, // never approved or rejected
                                { reviewedAt      : { isSet  : false } }, // never approved or rejected
                                
                                /* -or- */
                                
                                { rejectionReason : { not    : null  } }, // has reviewed as rejected (prevents to approve the *already_approved_payment_confirmation*)
                            ],
                        },
                        data: {
                            reviewedAt      : new Date(), // the approval date
                            rejectionReason : null,       // unset the rejection reason, because it's approved now
                        },
                    })
                    : (
                        rejectionReason
                        ? prisma.paymentConfirmation.updateMany({
                            where  : {
                                orderId : id,
                                
                                OR : [
                                    { reviewedAt      : { equals : null  } }, // never approved or rejected (prevents to reject the *already_rejected/approved_payment_confirmation*)
                                    { reviewedAt      : { isSet  : false } }, // never approved or rejected (prevents to reject the *already_rejected/approved_payment_confirmation*)
                                ],
                            },
                            data: {
                                reviewedAt      : new Date(),      // the rejection date
                                rejectionReason : rejectionReason, // set the rejection reason
                            },
                        })
                        : prisma.paymentConfirmation.updateMany({
                            where : {
                                AND : [
                                    { orderId : { equals : id } }, // never match, just for dummy transaction
                                    { orderId : { not    : id } }, // never match, just for dummy transaction
                                ],
                            },
                            data : {},
                        })
                    )
                ),
                
                // update Order:
                prisma.order.update({
                    where  : {
                        id : id,
                    },
                    data   : {
                        orderStatus,
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
                        shippingCost,
                        shippingProviderId,
                        
                        payment,
                        
                        shippingTracking : {
                            upsert : {
                                update : {
                                    shippingCarrier : shippingCarrier || null, // null if empty_string
                                    shippingNumber  : shippingNumber  || null, // null if empty_string
                                },
                                create : {
                                    token           : await (async (): Promise<string> => {
                                        const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 16);
                                        return await nanoid();
                                    })(),
                                    shippingCarrier : shippingCarrier || null, // null if empty_string
                                    shippingNumber  : shippingNumber  || null, // null if empty_string
                                },
                            },
                        },
                    },
                    select : orderDetailSelect,
                }),
            ]);
            return orderDetail;
        })();
        
        
        
        //#region send email confirmation
        if (orderDetail && performSendConfirmationEmail) {
            let emailConfig : EmailConfig|undefined = undefined;
            
            if (rejectionReason) { // payment confirmation declined
                emailConfig = checkoutConfigServer.emails.rejected;
            }
            else if (payment?.type === 'MANUAL_PAID') {   // payment approved (regradless having payment confirmation or not)
                emailConfig = checkoutConfigServer.emails.checkout;
            }
            else if (orderStatus === 'CANCELED') { // order canceled confirmation
                emailConfig = checkoutConfigServer.emails.canceled;
            }
            else if (orderStatus === 'ON_THE_WAY') { // shipping tracking number confirmation
                emailConfig = checkoutConfigServer.emails.shipping;
            }
            else if (orderStatus === 'COMPLETED') {  // order completed confirmation
                emailConfig = checkoutConfigServer.emails.completed;
            } // if
            
            if (emailConfig) {
                try {
                    await sendConfirmationEmail(orderDetail.orderId, emailConfig);
                }
                catch {
                    // ignore send email error
                }
            } // if
        } // if
        //#endregion send email confirmation
        
        
        
        if (!orderDetail) return NextResponse.json({ error: 'Order record not found.'}, { status: 404 }); // handled with error: not found
        return NextResponse.json(orderDetail satisfies OrderDetail); // handled with success
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        // if (error instanceof RecordNotFound) return NextResponse.json({ error: 'invalid ID' }, { status: 400 }); // handled with error
        return NextResponse.json({ error: error }, { status: 500 }); // handled with error
    } // try
    //#endregion save changes
});
