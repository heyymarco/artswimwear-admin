
import type { NextApiRequest, NextApiResponse } from 'next'
import { createRouter } from 'next-connect'

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
    >[],
    customer : null|Omit<Customer,
        |'createdAt'
        |'updatedAt'
    >
}



const router = createRouter<
    NextApiRequest,
    NextApiResponse<
        |Pagination<OrderDetail>
        |OrderDetail
        |{ error: any }
    >
>();



router
// Use express middleware in next-connect with expressWrapper function
// .use(expressWrapper(passport.session()))
.post(async (req, res) => {
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
    } = req.body;
    const page = Number.parseInt(pageStr as string);
    const perPage = Number.parseInt(perPageStr as string);
    //#endregion parsing request
    
    
    
    //#region validating request
    if ((typeof(page) !== 'number') || !isFinite(page) || (page < 1)
        ||
        (typeof(perPage) !== 'number') || !isFinite(perPage) || (perPage < 1)
    ) {
        return res.status(400).json({ error: 'invalid parameter(s)' });
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
    return res.json({
        total    : total,
        entities : paged,
    });
})
.patch(async (req, res) => {
    if (process.env.SIMULATE_SLOW_NETWORK === 'true') {
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, 2000);
        });
    } // if
    
    // throw '';
    // return res.status(400).json({ message: 'not found' });
    // return res.status(500).json({ message: 'server error' });
    
    //#region parsing request
    const {
        id,
        
        items,
        
        customer,
        
        shippingAddress,
        shippingCost,
        shippingProviderId,
        
        billingAddress,
        paymentMethod,
    } = req.body;
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
        return res.status(400).json({ error: 'invalid data' });
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
    if (!order) return res.status(400).json({ error: 'invalid ID' });
    //#endregion validating request
    
    
    
    //#region save changes
    try {
        const order = await prisma.order.update({
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
        return res.status(200).json(order);
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        // if (error instanceof RecordNotFound) return res.status(400).json({ error: 'invalid ID' });
        return res.status(500).json({ error: error });
    } // try
    //#endregion save changes
});



export default router.handler({
    onError: (err: any, req, res) => {
        console.error(err.stack);
        res.status(err.statusCode || 500).end(err.message);
    },
    onNoMatch: (req, res) => {
        res.status(404).json({ error: 'Page is not found' });
    },
});
