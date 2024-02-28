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
    ProductVariant,
    ProductVariantGroup,
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

export interface ProductVariantDetail
    extends
        Omit<ProductVariant,
            |'createdAt'
            |'updatedAt'
            
            |'productVariantGroupId'
        >
{
}
export interface ProductVariantGroupDetail
    extends
        Omit<ProductVariantGroup,
            |'createdAt'
            |'updatedAt'
            
            |'productId'
        >
{
    productVariants : ProductVariantDetail[]
}
export interface ProductDetail
    extends
        Omit<Product,
            |'createdAt'
            |'updatedAt'
        >
{
    productVariantGroups : ProductVariantGroupDetail[]
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
    if (!session.role?.product_r) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to view the products.`
    }, { status: 403 }); // handled with error: forbidden
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
                
                productVariantGroups : {
                    select: {
                        id              : true,
                        
                        sort            : true,
                        
                        name            : true,
                        
                        productVariants : {
                            select: {
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
                        },
                    },
                    orderBy : {
                        sort: 'asc',
                    },
                },
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
        
        productVariantGroups : productVariantGroupsRaw,
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
    
    if (
        (productVariantGroupsRaw !== undefined)
        &&
        (
            !Array.isArray(productVariantGroupsRaw)
            ||
            !productVariantGroupsRaw.every((productVariantGroupRaw) =>
                (typeof(productVariantGroupRaw) === 'object')
                &&
                (Object.keys(productVariantGroupRaw).length === 4)
                &&
                /* 1: */ ((typeof(productVariantGroupRaw.id) === 'string') && (!productVariantGroupRaw.id || (!!id && (productVariantGroupRaw.id.length <= 40))))
                &&
                /* 2: */ ((typeof(productVariantGroupRaw.sort) === 'number') && (productVariantGroupRaw.sort >= Number.MIN_SAFE_INTEGER) && (productVariantGroupRaw.sort <= Number.MAX_SAFE_INTEGER))
                &&
                /* 3: */ ((typeof(productVariantGroupRaw.name) === 'string') && !!productVariantGroupRaw.name)
                &&
                /* 4: */ ((): boolean => {
                    const {productVariants: productVariantsRaw} = productVariantGroupRaw;
                    return (
                        Array.isArray(productVariantsRaw)
                        &&
                        productVariantsRaw.every((productVariantRaw) =>
                            (Object.keys(productVariantRaw).length === 7)
                            &&
                            /* 1: */ ((typeof(productVariantRaw.id) === 'string') && (!productVariantRaw.id || (!!productVariantGroupRaw.id && (productVariantRaw.id.length <= 40))))
                            &&
                            /* 2: */ ((typeof(productVariantRaw.visibility) === 'string') && ['PUBLISHED', 'DRAFT'].includes(productVariantRaw.visibility))
                            &&
                            /* 3: */ ((typeof(productVariantRaw.sort) === 'number') && (productVariantRaw.sort >= Number.MIN_SAFE_INTEGER) && (productVariantRaw.sort <= Number.MAX_SAFE_INTEGER))
                            &&
                            /* 4: */ ((typeof(productVariantGroupRaw.name) === 'string') && !!productVariantGroupRaw.name)
                            &&
                            /* 5: */ ((typeof(productVariantRaw.price) === 'number') && ((productVariantRaw.price === null) || (productVariantRaw.price >= 0) && (productVariantRaw.price <= Number.MAX_SAFE_INTEGER)))
                            &&
                            /* 6: */ ((typeof(productVariantRaw.shippingWeight) === 'number') && ((productVariantRaw.shippingWeight === null) || (productVariantRaw.shippingWeight >= 0) && (productVariantRaw.shippingWeight <= Number.MAX_SAFE_INTEGER)))
                            &&
                            /* 7: */ ((): boolean => {
                                const {images: imagesRaw} = productVariantRaw;
                                return (
                                    Array.isArray(imagesRaw)
                                    &&
                                    imagesRaw.every((imageRaw) =>
                                        (typeof(imageRaw) === 'string')
                                    )
                                );
                            })()
                        )
                    );
                })()
            )
        )
    ) {
        return NextResponse.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    const productVariantGroups : ProductVariantGroupDetail[]|undefined = productVariantGroupsRaw;
    //#endregion validating request
    
    
    
    //#region validating privileges
    const session = (req as any).session as Session;
    if (!id) {
        if (!session.role?.product_c) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to add new product.`
        }, { status: 403 }); // handled with error: forbidden
    }
    else {
        if (!session.role?.product_ud && ((name !== undefined) || (path !== undefined) || (excerpt !== undefined) || (description !== undefined))) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to modify the product name, path, excerpt, and/or description.`
        }, { status: 403 }); // handled with error: forbidden
        
        if (!session.role?.product_ui && (images !== undefined)) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to modify the product images.`
        }, { status: 403 }); // handled with error: forbidden
        
        if (!session.role?.product_up && ((price !== undefined) || (shippingWeight !== undefined))) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to modify the product price and/or shipping weight.`
        }, { status: 403 }); // handled with error: forbidden
        
        if (!session.role?.product_us && (stock !== undefined)) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to modify the product stock.`
        }, { status: 403 }); // handled with error: forbidden
        
        if (!session.role?.product_uv && (visibility !== undefined)) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to modify the product visibility.`
        }, { status: 403 }); // handled with error: forbidden
        
        if (productVariantGroups !== undefined) {
            if (
                !session.role?.product_c
                &&
                productVariantGroups
                .some((variantGroup) =>
                    !variantGroup.id
                    ||
                    variantGroup.productVariants
                    .some((variant) =>
                        !variant.id
                    )
                )
            ) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to add new product variant.`
            }, { status: 403 }); // handled with error: forbidden
            
            
            
            const originalProductVariantGroups = await prisma.productVariantGroup.findMany({
                select: {
                    id              : true,
                    
                    sort            : true,
                    
                    name            : true,
                    
                    productVariants : {
                        select: {
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
                    },
                },
                orderBy : {
                    sort: 'asc',
                },
            });
            const originalProductVariants      = originalProductVariantGroups.flatMap((originalVariantGroup) => originalVariantGroup.productVariants);
            
            
            
            const variantGroupIds : string[]               = productVariantGroups.map((variantGroup) => variantGroup.id);
            const productVariants : ProductVariantDetail[] = productVariantGroups.flatMap((variantGroup) => variantGroup.productVariants);
            const variantIds      : string[]               = productVariants.map((variant) => variant.id);
            if (
                !session.role?.product_d
                &&
                (
                    originalProductVariantGroups
                    .some((originalVariantGroup) =>
                        !variantGroupIds.includes(originalVariantGroup.id)
                    )
                    ||
                    originalProductVariants
                    .some((originalVariant) =>
                        !variantIds.includes(originalVariant.id)
                    )
                )
            ) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to delete the product variant.`
            }, { status: 403 }); // handled with error: forbidden
            
            
            
            if (
                !session.role?.product_ud
                &&
                (
                    productVariantGroups
                    .some(({id, name, sort}) => {
                        const originalVariantGroup = originalProductVariantGroups.find((originalVariantGroup) => (originalVariantGroup.id === id));
                        return (
                            (name !== originalVariantGroup?.name)
                            ||
                            (sort !== originalVariantGroup.sort)
                        );
                    })
                    ||
                    productVariants
                    .some(({id, name, sort}) => {
                        const originalVariant = originalProductVariants.find((originalVariant) => (originalVariant.id === id));
                        return (
                            (name !== originalVariant?.name)
                            ||
                            (sort !== originalVariant.sort)
                        );
                    })
                )
            ) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to modify the product_variant name and/or order.`
            }, { status: 403 }); // handled with error: forbidden
            
            
            
            if (
                !session.role?.product_ui
                &&
                productVariants
                .some(({id, images}) => {
                    const originalImages = originalProductVariants.find((originalVariant) => (originalVariant.id === id))?.images;
                    if (images.length !== originalImages?.length) return true;
                    for (let index = 0; index < images.length; index++) {
                        if (images[index] !== originalImages[index]) return false;
                    } // for
                    return true;
                })
            ) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to modify the product_variant images.`
            }, { status: 403 }); // handled with error: forbidden
            
            
            
            if (
                !session.role?.product_up
                &&
                productVariants
                .some(({id, price, shippingWeight}) => {
                    const originalVariant = originalProductVariants.find((originalVariant) => (originalVariant.id === id));
                    return (
                        (price !== originalVariant?.price)
                        ||
                        (shippingWeight !== originalVariant.shippingWeight)
                    );
                })
            ) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to modify the product_variant price and/or shipping weight.`
            }, { status: 403 }); // handled with error: forbidden
            
            
            
            if (
                !session.role?.product_uv
                &&
                productVariants
                .some(({id, visibility}) => {
                    const originalVariant = originalProductVariants.find((originalVariant) => (originalVariant.id === id));
                    return (visibility !== originalVariant?.visibility);
                })
            ) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to modify the product_variant visibility.`
            }, { status: 403 }); // handled with error: forbidden
        } // if
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
            
            productVariantGroups,
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
            
            productVariantGroups : {
                select: {
                    id              : true,
                    
                    sort            : true,
                    
                    name            : true,
                    
                    productVariants : {
                        select: {
                            id             : true,
                            
                            visibility     : true,
                            sort           : true,
                            
                            name           : true,
                            price          : true,
                            shippingWeight : true,
                            images         : true,
                        },
                        // orderBy : {
                        //     sort: 'asc',
                        // },
                    },
                },
                // orderBy : {
                //     sort: 'asc',
                // },
            },
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
