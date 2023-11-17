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
    Customer,
    Order,
    OrdersOnProducts,
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
    sendConfirmationEmail,
}                           from './utilities'



// types:
export interface OrderDetail
    extends
        Omit<Order,
            |'createdAt'
            |'updatedAt'
            
            |'customerId'
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
                id                     : true,
                
                orderId                : true,
                orderStatus            : true,
                
                items                  : {
                    select: {
                        productId      : true,
                        
                        price          : true,
                        shippingWeight : true,
                        quantity       : true,
                    },
                },
                
                customer               : {
                    select: {
                        id             : true,
                        
                        marketingOpt   : true,
                        
                        nickName       : true,
                        email          : true,
                    },
                },
                
                shippingAddress        : true,
                shippingCost           : true,
                shippingNumber         : true,
                shippingProviderId     : true,
                
                payment                : true,
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
        
        customer,
        
        shippingAddress,
        shippingCost,
        shippingNumber,
        shippingProviderId,
        
        billingAddress : optionalBillingAddress,
    } = body;
    const mergedPayment = {
        ...body.payment,
        
        // if supplied, overwrite billingAddress of the payment:
        ...(optionalBillingAddress ? {
            billingAddress : optionalBillingAddress,
        } : undefined),
    };
    const {
        sendConfirmationEmail : performSendConfirmationEmail = false,
    ...unmergedPayment} = mergedPayment;
    const payment = Object.keys(unmergedPayment).length ? unmergedPayment : undefined;
    //#endregion parsing request
    
    
    
    //#region validating request
    if ((orderStatus !== undefined) && (typeof(orderStatus) !== 'string') && !['NEW_ORDER', 'PROCESSED', 'SHIPPED', 'ON_HOLD', 'COMPLETED'].includes(orderStatus)) {
        return NextResponse.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    
    if ((shippingNumber !== undefined) && (((typeof(shippingNumber) !== 'string') && !!shippingNumber) || (shippingNumber === null))) {
        return NextResponse.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    
    if ((typeof(id) !== 'string') || (id.length < 1)
        ||
        ((customer !== undefined) && ((typeof(customer) !== 'object') || Object.keys(customer).some((prop) => !['nickName', 'email'].includes(prop))))
        ||
        ((customer?.marketingOpt !== undefined) && ((typeof(customer.marketingOpt) !== 'boolean')))
        ||
        ((customer?.nickName     !== undefined) && ((typeof(customer.nickName)     !== 'string') || (customer.nickName.length < 2) || (customer.nickName.length > 30)))
        ||
        ((customer?.email        !== undefined) && ((typeof(customer.email)        !== 'string') || (customer.email.length    < 5) || (customer.email.length    > 50)))
        
        ||
        
        (
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
        if (!session.role?.order_us && (orderStatus !== undefined)) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to modify the order's status.`
        }, { status: 403 }); // handled with error: forbidden
        
        if (!session.role?.order_usa && (shippingAddress !== undefined)) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to modify the order's shippingAddress.`
        }, { status: 403 }); // handled with error: forbidden
        
        if (!session.role?.order_usn && (shippingNumber !== undefined)) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to modify the order's shippingNumber.`
        }, { status: 403 }); // handled with error: forbidden
        
        if (payment !== undefined) {
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
        const orderDetail : OrderDetail = await prisma.order.update({
            where  : {
                id : id,
            },
            data   : {
                // items    : {
                //     update : {
                //         data : {
                //             //
                //         },
                //     },
                // },
                
                customer : {
                    update : {
                        data : {
                            marketingOpt : customer?.marketingOpt,
                            
                            nickName     : customer?.nickName,
                            email        : customer?.email,
                        },
                    },
                },
                
                shippingAddress,
                shippingCost,
                shippingNumber,
                shippingProviderId,
                
                payment,
            },
            select : {
                id                     : true,
                
                orderId                : true,
                orderStatus            : true,
                
                items                  : {
                    select: {
                        productId      : true,
                        
                        price          : true,
                        shippingWeight : true,
                        quantity       : true,
                    },
                },
                
                customer               : {
                    select: {
                        id             : true,
                        
                        marketingOpt   : true,
                        
                        nickName       : true,
                        email          : true,
                    },
                },
                
                shippingAddress        : true,
                shippingCost           : true,
                shippingNumber         : true,
                shippingProviderId     : true,
                
                payment                : true,
            },
        });
        
        
        
        //#region send email confirmation
        if ((payment?.type === 'MANUAL_PAID') && !!performSendConfirmationEmail) {
            try {
                await sendConfirmationEmail(orderDetail.orderId);
            }
            catch {
                // ignore send email error
            }
        } // if
        //#endregion send email confirmation
        
        
        
        return NextResponse.json(orderDetail); // handled with success
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        // if (error instanceof RecordNotFound) return NextResponse.json({ error: 'invalid ID' }, { status: 400 }); // handled with error
        return NextResponse.json({ error: error }, { status: 500 }); // handled with error
    } // try
    //#endregion save changes
});
