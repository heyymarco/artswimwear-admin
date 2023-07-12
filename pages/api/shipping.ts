import type { NextApiRequest, NextApiResponse } from 'next'
import { createRouter } from 'next-connect'

import type { HydratedDocument } from 'mongoose'
import { connectDB } from '@/libs/dbConn'
import { default as Shipping, ShippingSchema } from '@/models/Shipping'



// types:
export interface ShippingPreview
    extends
        Pick<ShippingSchema,
            |'name'
        >
{
    _id : string
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
        | Array<ShippingPreview>
        | { error: string }
    >
>();



router
.get(async (req, res) => {
    return res.json(
        await Shipping.find<HydratedDocument<ShippingPreview>>({}, {
            _id  : true,
            
            name : true,
        }) // get all shippings including the disabled ones
    );
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
