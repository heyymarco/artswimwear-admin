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
    Product,
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
export interface ProductPreview
    extends
        Pick<Product,
            |'id'
            |'name'
            |'price'
            |'shippingWeight'
        >
{
    image: Required<Product>['images'][number]|undefined
}
export interface ProductDetail
    extends
        Omit<Product,
            |'createdAt'
            |'updatedAt'
        >
{
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
.get(async (req) => {
    /* required for displaying related_products in orders page */
    
    
    
    const productPreviews : ProductPreview[] = (
        (await prisma.product.findMany({
            select: {
                id             : true,
                name           : true,
                price          : true,
                shippingWeight : true,
                images         : true,
            },
        }))
        .map((product) => {
            const {
                images, // take
            ...restProduct} = product;
            return {
                ...restProduct,
                image : images?.[0]
            };
        })
    );
    return NextResponse.json(productPreviews); // handled with success
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
    if (!session.role?.product_r) return NextResponse.json({ error: `You do not have the privilege to view the products.` }, { status: 403 }); // handled with error: forbidden
    //#endregion validating privileges
    
    
    
    const [total, paged] = await prisma.$transaction([
        prisma.product.count(),
        prisma.product.findMany({
            select: {
                id             : true,
                
                visibility     : true,
                
                name           : true,
                
                price          : true,
                shippingWeight : true,
                
                stock          : true,
                
                path           : true,
                
                excerpt        : true,
                description    : true,
                
                images         : true,
            },
            orderBy : {
                createdAt: 'desc',
            },
            skip    : (page - 1) * perPage, // note: not scaleable but works in small commerce app -- will be fixed in the future
            take    : perPage,
        }),
    ]);
    const paginationProductDetail : Pagination<ProductDetail> = {
        total    : total,
        entities : paged,
    };
    return NextResponse.json(paginationProductDetail); // handled with success
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
        
        visibility,
        
        name,
        
        price,
        shippingWeight,
        
        stock,
        
        path,
        
        excerpt,
        description,
        
        images,
    } = await req.json();
    //#endregion parsing request
    
    
    
    //#region validating request
    if (
        // (typeof(id) !== 'string') || (id.length < 1)
        (typeof(id) !== 'string')
        ||
        ((name !== undefined) && ((typeof(name) !== 'string') || (name.length < 1)))
        
        // TODO: validating data type & constraints
    ) {
        return NextResponse.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    //#endregion validating request
    
    
    
    //#region validating privileges
    const session = (req as any).session as Session;
    if (!id) {
        if (!session.role?.product_c) return NextResponse.json({ error: `You do not have the privilege to add new products.` }, { status: 403 }); // handled with error: forbidden
    }
    else {
        if (!session.role?.product_u) return NextResponse.json({ error: `You do not have the privilege to modify the products.` }, { status: 403 }); // handled with error: forbidden
    } // if
    //#endregion validating privileges
    
    
    
    //#region save changes
    try {
        const data = {
            visibility,
            
            name,
            
            price,
            shippingWeight,
            
            stock,
            
            path,
            
            excerpt,
            description,
            
            images,
        };
        const select = {
            id             : true,
            
            visibility     : true,
            
            name           : true,
            
            price          : true,
            shippingWeight : true,
            
            stock          : true,
            
            path           : true,
            
            excerpt        : true,
            description    : true,
            
            images         : true,
        };
        const productDetail : ProductDetail = (
            !id
            ? await prisma.product.create({
                data   : data,
                select : select,
            })
            : await prisma.product.update({
                where  : {
                    id : id,
                },
                data   : data,
                select : select,
            })
        );
        return NextResponse.json(productDetail); // handled with success
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        // if (error instanceof RecordNotFound) return NextResponse.json({ error: 'invalid ID' }, { status: 400 }); // handled with error
        return NextResponse.json({ error: error }, { status: 500 }); // handled with error
    } // try
    //#endregion save changes
})
.delete(async (req) => {
    if (process.env.SIMULATE_SLOW_NETWORK === 'true') {
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, 2000);
        });
    } // if
    
    
    
    //#region parsing request
    const {
        id,
    } = await req.json();
    //#endregion parsing request
    
    
    
    //#region validating request
    if (
        ((typeof(id) !== 'string') || (id.length < 1))
    ) {
        return NextResponse.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    //#endregion validating request
    
    
    
    //#region validating privileges
    const session = (req as any).session as Session;
    if (!session.role?.product_d) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to delete the product.`
    }, { status: 403 }); // handled with error: forbidden
    //#endregion validating privileges
    
    
    
    //#region save changes
    try {
        const deletedProduct : Pick<ProductDetail, 'id'> = (
            await prisma.product.delete({
                where  : {
                    id : id,
                },
                select : {
                    id : true,
                },
            })
        );
        return NextResponse.json(deletedProduct); // handled with success
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        // if (error instanceof RecordNotFound) return NextResponse.json({ error: 'invalid ID' }, { status: 400 }); // handled with error
        return NextResponse.json({ error: error }, { status: 500 }); // handled with error
    } // try
    //#endregion save changes
});
