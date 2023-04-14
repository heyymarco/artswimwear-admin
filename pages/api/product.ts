
import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'

import { connectDB } from '@/libs/dbConn'
import { default as Product, ProductSchema } from '@/models/Product'
import type { HydratedDocument } from 'mongoose'



// types:
export type PreviewProduct  =
    Required<Pick<ProductSchema, '_id'>>
    &
    Pick<ProductSchema,
        |'visibility'
        
        |'name'
        
        |'price'
        |'shippingWeight'
        
        |'stock'
        
        |'description'
        |'images'
        |'path'
    >



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
    
    
    
    const total = await Product.count();
    return res.json({
        total,
        entities: (await Product.find<HydratedDocument<PreviewProduct>>({}, {
            _id            : true,
            
            visibility     : true,
            
            name           : true,
            
            price          : true,
            shippingWeight : true,
            
            stock          : true,
            
            description    : true,
            images         : true,
            path           : true,
        }, {
            skip  : (page - 1) * perPage, // note: not scaleable but works in small commerce app -- will be fixed in the future
            limit : perPage,
        }))
    });
})
.patch<NextApiRequest, NextApiResponse>(async (req, res) => {
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
        
        visibility,
        
        name,
        
        price,
        shippingWeight,
        
        stock,
        
        description,
        images,
        path,
    } = req.body;
    //#endregion parsing request
    
    
    
    //#region validating request
    if ((typeof(_id) !== 'string') || (_id.length < 1)
        ||
        ((name !== undefined) && ((typeof(name) !== 'string') || (name.length < 1)))
    ) {
        return res.status(400).json({ error: 'invalid data' });
    } // if
    const product = await Product.findById(_id, {
        _id            : true,
        
        visibility     : true,
        
        name           : true,
        
        price          : true,
        shippingWeight : true,
        
        stock          : true,
        
        description    : true,
        images         : true,
        path           : true,
    });
    if (!product) return res.status(400).json({ error: 'invalid ID' });
    //#endregion validating request
    
    
    
    //#region save changes
    if (visibility     !== undefined) product.visibility     = visibility;
    
    if (name           !== undefined) product.name           = name;
    
    if (price          !== undefined) product.price          = price;
    if (shippingWeight !== undefined) product.shippingWeight = shippingWeight;
    
    if (stock          !== undefined) product.stock          = stock;
    
    if (description    !== undefined) product.description    = description;
    if (images         !== undefined) product.images         = images;
    if (path           !== undefined) product.path           = path;
    
    try {
        await product.save();
        res.status(200).json(product);
    }
    catch (error) {
        res.status(500).json({ error: error });
    } // try
    //#endregion save changes
})