
import type { NextApiRequest, NextApiResponse } from 'next'
import { createRouter } from 'next-connect'

import { connectDB } from '@/libs/dbConn'
import { default as Order, OrderSchema } from '@/models/Order'
import type { HydratedDocument } from 'mongoose'
import type { Pagination } from '@/libs/types'
import type { WysiwygEditorState } from '@/components/editors/WysiwygEditor'



// types:
export interface OrderDetail
    extends
        Omit<OrderSchema,
            |'_id'
            |'shippingProvider'
        >
{
    _id              : string
    shippingProvider : string
}



try {
    await connectDB(); // top level await
    console.log('connected to mongoDB!');
}
catch (error) {
    console.log('FAILED to connect mongoDB!');
    throw error;
} // try



const router = createRouter<
    NextApiRequest,
    NextApiResponse<
        |Pagination<OrderDetail>
        |{ error: any }
    >
>();



router
// Use express middleware in next-connect with expressWrapper function
// .use(expressWrapper(passport.session()))
.get(async (req, res) => {
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
    } = req.query;
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
    
    
    
    const total = await Order.count();
    return res.json({
        total,
        entities: (await Order.find<HydratedDocument<OrderDetail>>({}, {
            _id              : true,
            
            customer         : true,
            
            items            : true,
            
            shippingAddress  : true,
            shippingProvider : true,
            shippingCost     : true,
            
            billingAddress   : true,
            
            paymentMethod    : true,
        }, {
            skip  : (page - 1) * perPage, // note: not scaleable but works in small commerce app -- will be fixed in the future
            limit : perPage,
        }))
    });
})
.patch(async (req, res) => {
    // if (process.env.SIMULATE_SLOW_NETWORK === 'true') {
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, 2000);
        });
    // } // if
    
    // throw '';
    // return res.status(400).json({ message: 'not found' });
    // return res.status(500).json({ message: 'server error' });
    
    //#region parsing request
    const {
        _id,
        
        customer,
        
        items,
        
        shippingAddress,
        shippingProvider,
        shippingCost,
        
        billingAddress,
        
        paymentMethod,
    } = req.body;
    //#endregion parsing request
    
    
    
    //#region validating request
    if ((typeof(_id) !== 'string') || (_id.length < 1)
        ||
        ((customer !== undefined) && ((typeof(customer) !== 'object') || Object.keys(customer).some((prop) => !['nickName', 'email'].includes(prop))))
        ||
        ((customer?.nickName !== undefined) && ((typeof(customer.nickName) !== 'string') || (customer.nickName.length < 2) || (customer.nickName.length > 30)))
        ||
        ((customer?.email    !== undefined) && ((typeof(customer.email)    !== 'string') || (customer.email.length    < 5) || (customer.email.length    > 50)))
        
        // TODO: validating data type & constraints
    ) {
        return res.status(400).json({ error: 'invalid data' });
    } // if
    const order = await Order.findById(_id, {
        _id              : true,
        
        customer         : true,
        
        items            : true,
        
        shippingAddress  : true,
        shippingProvider : true,
        shippingCost     : true,
        
        billingAddress   : true,
        
        paymentMethod    : true,
    });
    if (!order) return res.status(400).json({ error: 'invalid ID' });
    //#endregion validating request
    
    
    
    //#region save changes
    if (customer         !== undefined) Object.assign(order.customer       , customer);
    
    if (items            !== undefined) Object.assign(order.items          , items);
    
    if (shippingAddress  !== undefined) Object.assign(order.shippingAddress, shippingAddress);
    
    if (shippingProvider !== undefined) order.shippingProvider = shippingProvider;
    if (shippingCost     !== undefined) order.shippingCost     = shippingCost;
    
    if (billingAddress   !== undefined) Object.assign(order.billingAddress , billingAddress);
    
    if (paymentMethod    !== undefined) Object.assign(order.paymentMethod , paymentMethod);
    
    try {
        await order.save();
        res.status(200).json(order);
    }
    catch (error) {
        res.status(500).json({ error: error });
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
