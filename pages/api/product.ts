
import type { NextApiRequest, NextApiResponse } from 'next'
import { createRouter } from 'next-connect'

import { connectDB } from '@/libs/dbConn'
import { default as Product, ProductSchema } from '@/models/Product'
import type { HydratedDocument } from 'mongoose'
import type { Pagination } from '@/libs/types'
import type { WysiwygEditorState } from '@/components/editors/WysiwygEditor'



// types:
export interface ProductPreview
    extends
        Pick<ProductSchema,
            |'name'
            |'price'
            |'shippingWeight'
        >
{
    _id         : string
}
export interface ProductDetail
    extends
        Omit<ProductSchema,
            |'_id'
            |'shippingWeight'
            |'stock'
            |'description'
        >
{
    _id            : string
    
    shippingWeight : number|null|undefined
    
    stock          : number|null|undefined
    
    description    : WysiwygEditorState|null|undefined
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
        |ProductPreview[]
        |Pagination<ProductDetail>
        |{ error: any }
    >
>();



router
// Use express middleware in next-connect with expressWrapper function
// .use(expressWrapper(passport.session()))
.get(async (req, res) => {
    return res.json(
        await Product.find<HydratedDocument<ProductPreview>>({}, {
            _id            : true,
            name           : true,
            price          : true,
            shippingWeight : true,
        })
    );
})
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
    
    
    
    const total = await Product.count();
    return res.json({
        total,
        entities: (await Product.find<HydratedDocument<ProductDetail>>({}, {
            _id            : true,
            
            visibility     : true,
            
            name           : true,
            
            price          : true,
            shippingWeight : true,
            
            stock          : true,
            
            path           : true,
            
            excerpt        : true,
            description    : true,
            
            images         : true,
        }, {
            sort  : { _id: -1 },
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
        
        // TODO: validating data type & constraints
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
        
        path           : true,
        
        excerpt        : true,
        description    : true,
        
        images         : true,
    });
    if (!product) return res.status(400).json({ error: 'invalid ID' });
    //#endregion validating request
    
    
    
    //#region save changes
    if (visibility     !== undefined) product.visibility     = visibility;
    
    if (name           !== undefined) product.name           = name;
    
    if (price          !== undefined) product.price          = price;
    if (shippingWeight !== undefined) product.shippingWeight = shippingWeight ?? undefined;
    
    if (stock          !== undefined) product.stock          = stock          ?? undefined;
    
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
