// next-js:
import {
    NextRequest,
    NextResponse,
}                           from 'next/server'

// next-next:
import {
    getServerSession,
}                           from 'next-auth'

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
    
    
    
    // authorized => next:
    return await next();
})
.post(async (req) => {
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
    
    
    
    const [total, paged] = await prisma.$transaction([
        prisma.order.count(),
        prisma.order.findMany({
            select : {
                id                     : true,
                orderId                : true,
                
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
                shippingProviderId     : true,
                
                billingAddress         : true,
                paymentMethod          : true,
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
    const {
        id,
        
     // items,
        
        customer,
        
        shippingAddress,
        shippingCost,
        shippingProviderId,
        
        billingAddress,
        paymentMethod,
    } = await req.json();
    //#endregion parsing request
    
    
    
    //#region validating request
    if ((typeof(id) !== 'string') || (id.length < 1)
        ||
        ((customer !== undefined) && ((typeof(customer) !== 'object') || Object.keys(customer).some((prop) => !['nickName', 'email'].includes(prop))))
        ||
        ((customer?.marketingOpt !== undefined) && ((typeof(customer.marketingOpt) !== 'boolean')))
        ||
        ((customer?.nickName     !== undefined) && ((typeof(customer.nickName)     !== 'string') || (customer.nickName.length < 2) || (customer.nickName.length > 30)))
        ||
        ((customer?.email        !== undefined) && ((typeof(customer.email)        !== 'string') || (customer.email.length    < 5) || (customer.email.length    > 50)))
        
        // TODO: validating data type & constraints
    ) {
        return NextResponse.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    const order = await prisma.order.findUnique({
        where  : {
            id: id,
        },
            select : {
                id                     : true,
                orderId                : true,
                
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
                shippingProviderId     : true,
                
                billingAddress         : true,
                paymentMethod          : true,
            },
    });
    if (!order) {
        return NextResponse.json({
            error: 'Invalid ID.',
        }, { status: 400 }); // handled with error
    } // if
    //#endregion validating request
    
    
    
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
                shippingProviderId,
                
                billingAddress,
                paymentMethod,
            },
            select : {
                id                     : true,
                orderId                : true,
                
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
                shippingProviderId     : true,
                
                billingAddress         : true,
                paymentMethod          : true,
            },
        });
        return NextResponse.json(orderDetail); // handled with success
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        // if (error instanceof RecordNotFound) return NextResponse.json({ error: 'invalid ID' }, { status: 400 }); // handled with error
        return NextResponse.json({ error: error }, { status: 500 }); // handled with error
    } // try
    //#endregion save changes
});
