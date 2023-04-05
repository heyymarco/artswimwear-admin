
import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'

import { connectDB } from '@/libs/dbConn'
import { default as Product, ProductSchema } from '@/models/Product'
import type { HydratedDocument } from 'mongoose'



// types:
export type PreviewProduct  = Required<Pick<ProductSchema, '_id'>> & Pick<ProductSchema, 'name'|'price'|'stock'> & { image?: Required<ProductSchema>['images'][number] }



try {
    await connectDB(); // top level await
    console.log('connected to mongoDB!');
}
catch (error) {
    console.log('FAILED to connect mongoDB!');
    throw error;
} // try



export default nextConnect<NextApiRequest, NextApiResponse>({
    onError: (err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({ error: 'Something broke!' });
    },
    onNoMatch: (req, res) => {
        res.status(404).json({ error: 'Page is not found' });
    },
})
.get<NextApiRequest, NextApiResponse>(async (req, res) => {
    if (process.env.SIMULATE_SLOW_NETWORK === 'true') {
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, 2000);
        });
    } // if
    
    
    
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
    
    
    
    const total = await Product.count();
    return res.json({
        total,
        entities: (await Product.find<HydratedDocument<PreviewProduct>>({}, { _id: true, name: true, price: true, stock: true, image: { $first: "$images" } }, {
            skip  : (page - 1) * perPage, // note: not scaleable but works in small commerce app -- will be fixed in the future
            limit : perPage,
        }))
    });
})