// next-js:
import {
    NextRequest,
    NextResponse,
}                           from 'next/server'

// redux:
import {
    createEntityAdapter
}                           from '@reduxjs/toolkit'

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

// webs:
import {
    default as nodemailer,
}                           from 'nodemailer'

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

// stores:
import type {
    // types:
    CountryPreview,
}                           from '@/store/features/api/apiSlice'

// templates:
import {
    // types:
    OrderAndData,
    
    
    
    // react components:
    OrderDataContextProviderProps,
    OrderDataContextProvider,
}                           from '@/components/Checkout/templates/orderDataContext'
import {
    // react components:
    BusinessContextProviderProps,
    BusinessContextProvider,
}                           from '@/components/Checkout/templates/businessDataContext'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'

// internal auth:
import {
    authOptions,
}                           from '@/app/api/auth/[...nextauth]/route'

// utilities:
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'
import {
    getMatchingShipping,
}                           from '@/libs/shippings'
import {
    downloadImageAsBase64,
}                           from '@/libs/images'

// configs:
import {
    checkoutConfig,
}                           from '@/checkout.config.server'



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
        
     // items,
        
        customer,
        
        shippingAddress,
        shippingCost,
        shippingProviderId,
        
        billingAddress,
    } = body;
    const payment = (
        (billingAddress === undefined)
        ? body.payment
        : {
            ...body.payment,
            billingAddress,
        }
    );
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
        if (!session.role?.order_usa && (shippingAddress !== undefined)) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to modify the order's shippingAddress.`
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
                shippingProviderId,
                
                payment,
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
                
                payment                : true,
            },
        });
        
        
        
        //#region send email confirmation
        if (payment.type === 'MANUAL_PAID') {
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



const getOrderAndData = async (prismaTransaction: Parameters<Parameters<typeof prisma.$transaction>[0]>[0], orderId : string): Promise<(OrderAndData & { customer: Customer|null })|null> => {
    const newOrder = await prismaTransaction.order.findUnique({
        where   : {
            orderId : orderId,
        },
        include : {
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
                        },
                    },
                },
            },
            shippingProvider : {
                select : {
                    name            : true, // optional for displaying email report
                    
                    weightStep      : true, // required for calculating `getMatchingShipping()`
                    
                    estimate        : true, // optional for displaying email report
                    shippingRates   : true, // required for calculating `getMatchingShipping()`
                    
                    useSpecificArea : true, // required for calculating `getMatchingShipping()`
                    countries       : true, // required for calculating `getMatchingShipping()`
                },
            },
            customer : true,
        },
    });
    if (!newOrder) return null;
    const shippingAddress  = newOrder.shippingAddress;
    const shippingProvider = newOrder.shippingProvider;
    return {
        ...newOrder,
        items: newOrder.items.map((item) => ({
            ...item,
            product : !!item.product ? {
                name        : item.product.name,
                image       : item.product.images?.[0] ?? null,
                imageBase64 : undefined,
                imageId     : undefined,
            } : null,
        })),
        shippingProvider : (
            (shippingAddress && shippingProvider)
            ? getMatchingShipping(shippingProvider, { city: shippingAddress.city, zone: shippingAddress.zone, country: shippingAddress.country })
            : null
        ),
    };
};
const sendConfirmationEmail = async (orderId: string): Promise<void> => {
    const [newOrder, countryList] = await prisma.$transaction(async (prismaTransaction) => {
        return await Promise.all([
            getOrderAndData(prismaTransaction, orderId),
            (async () => {
                const allCountries = await prismaTransaction.country.findMany({
                    select : {
                        name    : true,
                        
                        code    : true,
                    },
                    // enabled: true
                });
                const countryListAdapter = createEntityAdapter<CountryPreview>({
                    selectId : (countryEntry) => countryEntry.code,
                });
                const countryList = countryListAdapter.addMany(
                    countryListAdapter.getInitialState(),
                    allCountries
                );
                return countryList;
            })(),
        ]);
    });
    if (!newOrder) return;
    const {
        customer,
    ...orderAndData} = newOrder;
    if (!customer) return;
    
    
    
    //#region download image url to base64
    const newOrderItems = newOrder.items;
    const imageUrls     = newOrderItems.map((item) => item.product?.image);
    const imageBase64s  = await Promise.all(
        imageUrls.map(async (imageUrl): Promise<string|undefined> => {
            if (!imageUrl) return undefined;
            const resolvedImageUrl = resolveMediaUrl(imageUrl);
            if (!resolvedImageUrl) return undefined;
            try {
                return await downloadImageAsBase64(resolvedImageUrl, 64);
            }
            catch (error: any) { // silently ignore the error and resulting as undefined:
                console.log('ERROR DOWNLOADING IMAGE: ', error);
                return undefined;
            } // if
        })
    );
    console.log('downloaded images: ', imageBase64s);
    imageBase64s.forEach((imageBase64, index) => {
        if (!imageBase64) return;
        const itemProduct = newOrderItems[index].product;
        if (!itemProduct) return;
        itemProduct.imageBase64 = imageBase64;
        itemProduct.imageId     = `i${index}`;
    });
    //#endregion download image url to base64
    
    
    
    try {
        const {
            business,
            emails : {
                checkout : checkoutEmail,
            },
        } = checkoutConfig;
        
        
        
        const { renderToStaticMarkup } = await import('react-dom/server');
        const orderDataContextProviderProps : OrderDataContextProviderProps = {
            // data:
            order       : orderAndData,
            customer    : customer,
            isPaid      : true,
            
            
            
            // relation data:
            countryList : countryList,
        };
        const businessContextProviderProps  : BusinessContextProviderProps = {
            // data:
            model : business,
        };
        
        
        
        const transporter = nodemailer.createTransport({
            host     : checkoutEmail.host,
            port     : checkoutEmail.port,
            secure   : checkoutEmail.secure,
            auth     : {
                user : checkoutEmail.username,
                pass : checkoutEmail.password,
            },
        });
        try {
            console.log('sending email...');
            await transporter.sendMail({
                from        : checkoutEmail.from,
                to          : customer.email,
                subject     : renderToStaticMarkup(
                    <OrderDataContextProvider {...orderDataContextProviderProps}>
                        <BusinessContextProvider {...businessContextProviderProps}>
                            {checkoutEmail.subject}
                        </BusinessContextProvider>
                    </OrderDataContextProvider>
                ),
                html        : renderToStaticMarkup(
                    <OrderDataContextProvider {...orderDataContextProviderProps}>
                        <BusinessContextProvider {...businessContextProviderProps}>
                            {checkoutEmail.message}
                        </BusinessContextProvider>
                    </OrderDataContextProvider>
                ),
                attachments : (
                    newOrderItems
                    .filter(({product}) => !!product && !!product.imageBase64 && !!product.imageId)
                    .map(({product}) => ({
                        path : product?.imageBase64,
                        cid  : product?.imageId,
                    }))
                ),
            });
            console.log('email sent.');
        }
        finally {
            transporter.close();
        } // try
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        // ignore send email error
    } // try
};
