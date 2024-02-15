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

// models:
import type {
    ProductVariant,
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
export interface ProductVariantDetail
    extends
        Omit<ProductVariant,
            |'createdAt'
            |'updatedAt'
            
            |'productVariantGroupId'
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
    /* required for displaying related_variants in variant_groups page */
    
    
    
    //#region parsing request
    const {
        groupId,
    } = await req.json();
    //#endregion parsing request
    
    
    
    //#region validating request
    if (
        ((typeof(groupId) !== 'string') || (groupId.length < 1))
    ) {
        return NextResponse.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    //#endregion validating request
    
    
    
    const productVariantDetails : ProductVariantDetail[] = (
        (await prisma.productVariant.findMany({
            where  : {
                productVariantGroupId : groupId,
            },
            select : {
                id             : true,
                
                visibility     : true,
                sort           : true,
                
                name           : true,
                price          : true,
                shippingWeight : true,
                images         : true,
            },
            orderBy : {
                sort: 'asc',
            },
        }))
    );
    return NextResponse.json(productVariantDetails); // handled with success
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
        groupId,
        
        visibility,
        sort,
        
        name,
        
        price,
        shippingWeight,
        
        images,
    } = await req.json();
    //#endregion parsing request
    
    
    
    //#region validating request
    if (
        // (typeof(id) !== 'string') || (id.length < 1)
        (typeof(id) !== 'string')
        ||
        (!id && ((typeof(groupId) !== 'string') || !groupId.length)) // groudId is required when no id (create a new ProductVariant record)
        ||
        (id  && (typeof(groupId) !== 'undefined')) // groupId must be blank if has id (update ProductVariant record)
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
        if (!session.role?.product_c) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to add new product variant.`
        }, { status: 403 }); // handled with error: forbidden
    }
    else {
        if (!session.role?.product_ui && (images !== undefined)) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to modify the product variant images.`
        }, { status: 403 }); // handled with error: forbidden
        
        if (!session.role?.product_up && ((price !== undefined) || (shippingWeight !== undefined))) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to modify the product variant price and/or shipping weight.`
        }, { status: 403 }); // handled with error: forbidden
        
        if (!session.role?.product_uv && (visibility !== undefined)) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to modify the product variant visibility.`
        }, { status: 403 }); // handled with error: forbidden
    } // if
    //#endregion validating privileges
    
    
    
    //#region save changes
    try {
        const data = {
            visibility,
            sort,
            
            name,
            
            price,
            shippingWeight,
            
            images,
            
            productVariantGroupId : groupId,
        };
        const select = {
            id             : true,
            
            visibility     : true,
            sort           : true,
            
            name           : true,
            
            price          : true,
            shippingWeight : true,
            
            images         : true,
        };
        const productVariantDetail : ProductVariantDetail = (
            !id
            ? await prisma.productVariant.create({
                data   : data,
                select : select,
            })
            : await prisma.productVariant.update({
                where  : {
                    id : id,
                },
                data   : data,
                select : select,
            })
        );
        return NextResponse.json(productVariantDetail); // handled with success
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

You do not have the privilege to delete the product variant.`
    }, { status: 403 }); // handled with error: forbidden
    //#endregion validating privileges
    
    
    
    //#region save changes
    try {
        const deletedProductVariant : Pick<ProductVariantDetail, 'id'> = (
            await prisma.productVariant.delete({
                where  : {
                    id : id,
                },
                select : {
                    id : true,
                },
            })
        );
        return NextResponse.json(deletedProductVariant); // handled with success
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        // if (error instanceof RecordNotFound) return NextResponse.json({ error: 'invalid ID' }, { status: 400 }); // handled with error
        return NextResponse.json({ error: error }, { status: 500 }); // handled with error
    } // try
    //#endregion save changes
});
