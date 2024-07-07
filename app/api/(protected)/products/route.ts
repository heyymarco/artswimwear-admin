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
    VariantGroupDetail,
    
    ProductPreview,
    ProductDetail,
}                           from '@/models'
export type {
    VariantPreview,
    VariantDetail,
    VariantGroupDetail,
    
    ProductPreview,
    ProductDetail,
    
    ProductPricePart,
    
    StockDetail,
}                           from '@/models'
import {
    VariantGroupDiff,
    createVariantGroupDiff,
    createStockMap,
}                           from '@/models'
import {
    type Prisma,
}                           from '@prisma/client'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'

// internal auth:
import {
    authOptions,
}                           from '@/app/api/auth/[...nextauth]/route'



// configs:
export const fetchCache = 'force-no-store';
export const maxDuration = 30; // this function can run for a maximum of 30 seconds for rebuild stock maps



// routers:
interface RequestContext {
    params: {
        /* no params yet */
    }
}
const router  = createEdgeRouter<Request, RequestContext>();
const handler = async (req: Request, ctx: RequestContext) => router.run(req, ctx) as Promise<any>;
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
    if (!session) return Response.json({ error: 'Please sign in.' }, { status: 401 }); // handled with error: unauthorized
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
                
                variantGroups : {
                    select : {
                        variants : {
                            select : {
                                id         : true,
                                
                                visibility : true,
                                
                                name       : true,
                            },
                            orderBy : {
                                sort : 'asc',
                            },
                        },
                    },
                    orderBy : {
                        sort : 'asc',
                    },
                },
            },
        }))
        .map((product) => {
            const {
                images,        // take
                variantGroups, // take
            ...restProduct} = product;
            return {
                ...restProduct,
                image         : images?.[0],
                variantGroups : (
                    variantGroups
                    .map(({variants}) =>
                        variants
                    )
                ),
            };
        })
    );
    return Response.json(productPreviews); // handled with success
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
        return Response.json({
            error: 'Invalid parameter(s).',
        }, { status: 400 }); // handled with error
    } // if
    //#endregion validating request
    
    
    
    //#region validating privileges
    const session = (req as any).session as Session;
    if (!session.role?.product_r) return Response.json({ error:
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
                
                variantGroups : {
                    select: {
                        id                 : true,
                        
                        sort               : true,
                        
                        name               : true,
                        hasDedicatedStocks : true,
                        
                        variants           : {
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
                stocks : {
                    select: {
                        id         : true,
                        
                        value      : true,
                        
                        variantIds : true,
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
    return Response.json(paginationProductDetail); // handled with success
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
    // return Response.json({ message: 'not found'    }, { status: 400 }); // handled with error
    // return Response.json({ message: 'server error' }, { status: 500 }); // handled with error
    
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
        
        variantGroups : variantGroupsRaw,
        stocks        : stocksRaw,
    } = await req.json();
    //#endregion parsing request
    
    
    
    //#region validating request
    if (
        (typeof(id)      !== 'string' )
        
        ||
        
        ((visibility     !== undefined)                              && ((typeof(visibility)     !== 'string') || !['PUBLISHED', 'HIDDEN', 'DRAFT'].includes(visibility)))
        ||
        ((name           !== undefined)                              && ((typeof(name)           !== 'string') || (name.length    < 1)))
        ||
        ((price          !== undefined)                              && ((typeof(price)          !== 'number') || !isFinite(price)          || (price          < 0)))
        ||
        ((shippingWeight !== undefined) && (shippingWeight !== null) && ((typeof(shippingWeight) !== 'number') || !isFinite(shippingWeight) || (shippingWeight < 0)))
        ||
        ((stock          !== undefined) && (stock          !== null) && ((typeof(stock)          !== 'number') || !isFinite(stock)          || (stock          < 0) || ((stock % 1) !== 0)))
        ||
        ((path           !== undefined)                              && ((typeof(path)           !== 'string') || (path.length    < 1)))
        ||
        ((excerpt        !== undefined) && (excerpt        !== null) && ((typeof(excerpt)        !== 'string') || (excerpt.length < 1)))
        ||
        ((description    !== undefined) && (description    !== null) &&  (typeof(description)    !== 'object'))
        ||
        ((images         !== undefined)                              && ((Array.isArray(images)  !== true    ) || !images.every((image) => (typeof(image) === 'string') && !!image.length)))
    ) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    
    if (
        (variantGroupsRaw !== undefined)
        &&
        (
            !Array.isArray(variantGroupsRaw)
            ||
            !variantGroupsRaw.every((variantGroupRaw) =>
                (typeof(variantGroupRaw) === 'object')
                &&
                (Object.keys(variantGroupRaw).length === 5)
                &&
                /* 1: */ ((typeof(variantGroupRaw.id) === 'string') && ((!variantGroupRaw.id || (variantGroupRaw.id[0] === ' ')) || (!!id && (variantGroupRaw.id.length <= 40))))
                &&
                /* 2: */ ((typeof(variantGroupRaw.sort) === 'number') && (variantGroupRaw.sort >= Number.MIN_SAFE_INTEGER) && (variantGroupRaw.sort <= Number.MAX_SAFE_INTEGER))
                &&
                /* 3: */ ((typeof(variantGroupRaw.name) === 'string') && !!variantGroupRaw.name)
                &&
                /* 4: */ (typeof(variantGroupRaw.hasDedicatedStocks) === 'boolean')
                &&
                /* 5: */ ((): boolean => {
                    const {variants: variantsRaw} = variantGroupRaw;
                    return (
                        Array.isArray(variantsRaw)
                        &&
                        variantsRaw.every((variantRaw) =>
                            (Object.keys(variantRaw).length === 7)
                            &&
                            /* 1: */ ((typeof(variantRaw.id) === 'string') && ((!variantRaw.id || (variantRaw.id[0] === ' ')) || (!!variantGroupRaw.id && (variantRaw.id.length <= 40))))
                            &&
                            /* 2: */ ((typeof(variantRaw.visibility) === 'string') && ['PUBLISHED', 'DRAFT'].includes(variantRaw.visibility))
                            &&
                            /* 3: */ ((typeof(variantRaw.sort) === 'number') && (variantRaw.sort >= Number.MIN_SAFE_INTEGER) && (variantRaw.sort <= Number.MAX_SAFE_INTEGER))
                            &&
                            /* 4: */ ((typeof(variantGroupRaw.name) === 'string') && !!variantGroupRaw.name)
                            &&
                            /* 5: */ ((variantRaw.price === null) || ((typeof(variantRaw.price) === 'number') && (variantRaw.price >= 0) && (variantRaw.price <= Number.MAX_SAFE_INTEGER)))
                            &&
                            /* 6: */ ((variantRaw.shippingWeight === null) || ((typeof(variantRaw.shippingWeight) === 'number') && (variantRaw.shippingWeight >= 0) && (variantRaw.shippingWeight <= Number.MAX_SAFE_INTEGER)))
                            &&
                            /* 7: */ ((): boolean => {
                                const {images: imagesRaw} = variantRaw;
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
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    
    if (
        (stocksRaw !== undefined)
        &&
        (
            !Array.isArray(stocksRaw)
            ||
            !stocksRaw.every((stock) =>
                ((stock === null) || (typeof(stock) === 'number'))
            )
        )
    ) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    }
    //#endregion validating request
    
    
    
    try {
        return await prisma.$transaction(async (prismaTransaction): Promise<Response> => {
            //#region normalize variantGroups
            const variantGroups : VariantGroupDetail[]|undefined = variantGroupsRaw;
            
            const variantGroupDiff = (variantGroups === undefined) ? undefined : await (async (): Promise<VariantGroupDiff> => {
                const variantGroupOris : VariantGroupDetail[] = !id ? [] : await prismaTransaction.variantGroup.findMany({
                    where : {
                        productId : id,
                    },
                    select: {
                        id                 : true,
                        
                        sort               : true,
                        
                        name               : true,
                        hasDedicatedStocks : true,
                        
                        variants           : {
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
                return createVariantGroupDiff(variantGroups, variantGroupOris);
            })();
            //#endregion normalize variantGroups
            
            const stocks : (number|null)[]|undefined = stocksRaw;
            
            
            
            //#region validating privileges
            const session = (req as any).session as Session;
            if (!id) {
                if (!session.role?.product_c) return Response.json({ error:
`Access denied.

You do not have the privilege to add new product.`
                }, { status: 403 }); // handled with error: forbidden
            }
            else {
                if (!session.role?.product_ud && ((name !== undefined) || (path !== undefined) || (excerpt !== undefined) || (description !== undefined))) return Response.json({ error:
`Access denied.

You do not have the privilege to modify the product name, path, excerpt, and/or description.`
                }, { status: 403 }); // handled with error: forbidden
                
                if (!session.role?.product_ui && (images !== undefined)) return Response.json({ error:
`Access denied.

You do not have the privilege to modify the product images.`
                }, { status: 403 }); // handled with error: forbidden
                
                if (!session.role?.product_up && ((price !== undefined) || (shippingWeight !== undefined))) return Response.json({ error:
`Access denied.

You do not have the privilege to modify the product price and/or shipping weight.`
                }, { status: 403 }); // handled with error: forbidden
                
                if (!session.role?.product_us && (stock !== undefined)) return Response.json({ error:
`Access denied.

You do not have the privilege to modify the product stock.`
                }, { status: 403 }); // handled with error: forbidden
                
                if (!session.role?.product_uv && (visibility !== undefined)) return Response.json({ error:
`Access denied.

You do not have the privilege to modify the product visibility.`
                }, { status: 403 }); // handled with error: forbidden
                
                if (variantGroupDiff !== undefined) {
                    const {
                        variantGroupOris,
                        
                        variantGroupDels,
                        variantGroupAdds,
                        variantGroupMods,
                    } = variantGroupDiff;
                    
                    
                    
                    if (
                        !session.role?.product_c
                        &&
                        (
                            !!variantGroupAdds.length
                            ||
                            variantGroupMods.some(({variantAdds}) => !!variantAdds.length)
                        )
                    ) return Response.json({ error:
`Access denied.

You do not have the privilege to add new product variant.`
                    }, { status: 403 }); // handled with error: forbidden
                    
                    
                    
                    if (
                        !session.role?.product_d
                        &&
                        (
                            !!variantGroupDels.length
                            ||
                            variantGroupMods.some(({variantDels}) => !!variantDels.length)
                        )
                    ) return Response.json({ error:
`Access denied.

You do not have the privilege to delete the product variant.`
                    }, { status: 403 }); // handled with error: forbidden
                    
                    
                    
                    if (
                        !session.role?.product_ud
                        &&
                        variantGroupMods
                        .some(({id, name, variantMods}) => {
                            const variantGroupOri = variantGroupOris.find(({id: idOri}) => (idOri === id));
                            return (
                                (name !== variantGroupOri?.name)
                                ||
                                variantMods
                                .some(({id, name}) => {
                                    const variantOri = variantGroupOri.variants.find(({id: idOri}) => (idOri === id));
                                    return (
                                        (name !== variantOri?.name)
                                    );
                                })
                            );
                        })
                    ) return Response.json({ error:
`Access denied.

You do not have the privilege to modify the product_variant name.`
                    }, { status: 403 }); // handled with error: forbidden
                    
                    
                    
                    if (
                        !session.role?.product_ud
                        &&
                        !((): boolean => {
                            // compare the order of variantGroups|variants:
                            const variantGroupModIds = variantGroupMods.map(({id}) => id);
                            const variantGroupOriIds = variantGroupOris.map(({id}) => id);
                            if (variantGroupModIds.length !== variantGroupOriIds.length) return false; // not_equal
                            for (let variantGroupIndex = 0; variantGroupIndex < variantGroupModIds.length; variantGroupIndex++) {
                                if (variantGroupModIds[variantGroupIndex] !== variantGroupOriIds[variantGroupIndex]) return false; // not_equal
                                const currentVariantGroupMod = variantGroupMods[variantGroupIndex];
                                
                                
                                
                                const variantMods   = currentVariantGroupMod.variantMods;
                                const variantOris   = variantGroupOris.find(({id}) => (id === currentVariantGroupMod.id))?.variants ?? [];
                                const variantModIds = variantMods.map(({id}) => id);
                                const variantOriIds = variantOris.map(({id}) => id);
                                if (variantModIds.length !== variantOriIds.length) return false; // not_deep_equal
                                for (let variantIndex = 0; variantIndex < variantModIds.length; variantIndex++) {
                                    if (variantModIds[variantIndex] !== variantOriIds[variantIndex]) return false; // not_deep_equal
                                } // for
                            } // for
                            
                            
                            
                            return true; // deep_equal
                        })()
                    ) return Response.json({ error:
`Access denied.

You do not have the privilege to modify the product_variant order.`
                    }, { status: 403 }); // handled with error: forbidden
                    
                    
                    
                    if (
                        !session.role?.product_ui
                        &&
                        variantGroupMods
                        .some(({id, variantMods}) => {
                            const variantGroupOri = variantGroupOris.find(({id: idOri}) => (idOri === id));
                            return (
                                !!variantGroupOri
                                &&
                                variantMods
                                .some(({id, images}) => {
                                    const imagesOri = variantGroupOri.variants.find(({id: idOri}) => (idOri === id))?.images ?? [];
                                    return (
                                        (images.length !== (imagesOri.length ?? 0))
                                        ||
                                        ((): boolean => {
                                            for (let index = 0; index < images.length; index++) {
                                                if (images[index] !== imagesOri[index]) return true;
                                            } // for
                                            return false;
                                        })()
                                    );
                                })
                            );
                        })
                    ) return Response.json({ error:
`Access denied.

You do not have the privilege to modify the product_variant images.`
                    }, { status: 403 }); // handled with error: forbidden
                    
                    
                    
                    if (
                        !session.role?.product_up
                        &&
                        variantGroupMods
                        .some(({id, variantMods}) => {
                            const variantGroupOri = variantGroupOris.find(({id: idOri}) => (idOri === id));
                            return (
                                !!variantGroupOri
                                &&
                                variantMods
                                .some(({id, price, shippingWeight}) => {
                                    const variantOri = variantGroupOri.variants.find(({id: idOri}) => (idOri === id));
                                    return (
                                        (price !== variantOri?.price)
                                        ||
                                        (shippingWeight !== variantOri.shippingWeight)
                                    );
                                })
                            );
                        })
                    ) return Response.json({ error:
`Access denied.

You do not have the privilege to modify the product_variant price and/or shipping weight.`
                    }, { status: 403 }); // handled with error: forbidden
                    
                    
                    
                    if (
                        !session.role?.product_us
                        &&
                        variantGroupMods
                        .some(({id, hasDedicatedStocks}) => {
                            const variantGroupOri = variantGroupOris.find(({id: idOri}) => (idOri === id));
                            return (
                                !!variantGroupOri
                                &&
                                (hasDedicatedStocks !== variantGroupOri.hasDedicatedStocks)
                            );
                        })
                    ) return Response.json({ error:
`Access denied.

You do not have the privilege to modify the product_variant stock.`
                    }, { status: 403 }); // handled with error: forbidden
                    
                    
                    
                    if (
                        !session.role?.product_uv
                        &&
                        variantGroupMods
                        .some(({id, variantMods}) => {
                            const variantGroupOri = variantGroupOris.find(({id: idOri}) => (idOri === id));
                            return (
                                !!variantGroupOri
                                &&
                                variantMods
                                .some(({id, visibility}) => {
                                    const variantOri = variantGroupOri.variants.find(({id: idOri}) => (idOri === id));
                                    return (
                                        (visibility !== variantOri?.visibility)
                                    );
                                })
                            );
                        })
                    ) return Response.json({ error:
`Access denied.

You do not have the privilege to modify the product_variant visibility.`
                    }, { status: 403 }); // handled with error: forbidden
                } // if
                
                if (!session.role?.product_us && (stocks !== undefined)) return Response.json({ error:
`Access denied.

You do not have the privilege to modify the product stock(s).`
                }, { status: 403 }); // handled with error: forbidden
            } // if
            //#endregion validating privileges
            
            
            
            //#region save changes
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
                
                // relations:
                variantGroups : (variantGroupDiff === undefined) ? undefined : {
                    delete : !variantGroupDiff.variantGroupDels.length ? undefined : variantGroupDiff.variantGroupDels.map((id) => ({
                        // conditions:
                        id : id,
                    })),
                    
                    create : !variantGroupDiff.variantGroupAdds.length ? undefined : variantGroupDiff.variantGroupAdds.map(({variantAdds, ...restVariantGroup}) => ({
                        // data:
                        ...restVariantGroup,
                        
                        // relations:
                        variants: {
                            create : variantAdds,
                        },
                    })),
                    
                    update : !variantGroupDiff.variantGroupMods.length ? undefined : variantGroupDiff.variantGroupMods.map(({id, variantDels, variantAdds, variantMods, ...restVariantGroup}) => ({
                        where : {
                            // conditions:
                            id : id,
                        },
                        data  : {
                            // data:
                            ...restVariantGroup,
                            
                            // relations:
                            variants : {
                                delete : !variantDels.length ? undefined : variantDels.map((id) => ({
                                    // conditions:
                                    id : id,
                                })),
                                
                                create : !variantAdds.length ? undefined : variantAdds,
                                
                                update : !variantMods.length ? undefined : variantMods.map(({id, ...restVariant}) => ({
                                    where : {
                                        // conditions:
                                        id: id,
                                    },
                                    data  : restVariant,
                                })),
                            },
                        },
                    })),
                },
                stocks : (!id && ((variantGroupDiff === undefined) || (stocks === undefined))) ? { // when create new Product (no id) && (no variants defined || no stocks defined) => auto_create default single_stock
                    create : {
                        // data:
                        value      : null, // defaults to unlimited stock
                        
                        // relations:
                        variantIds : [],   // no related variants
                    }
                } : undefined,
            } satisfies Prisma.ProductUpdateInput;
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
                
                variantGroups : {
                    select: {
                        id                 : true,
                        
                        sort               : true,
                        
                        name               : true,
                        hasDedicatedStocks : true,
                        
                        variants           : {
                            select: {
                                id             : true,
                                
                                visibility     : true,
                                sort           : true,
                                
                                name           : true,
                                price          : true,
                                shippingWeight : true,
                                images         : true,
                            },
                            // doesn't work:
                            // orderBy : {
                            //     sort: 'asc',
                            // },
                        },
                    },
                    // doesn't work:
                    // orderBy : {
                    //     sort: 'asc',
                    // },
                },
                stocks : {
                    select: {
                        id         : true,
                        
                        value      : true,
                        
                        variantIds : true,
                    },
                },
            } satisfies Prisma.ProductSelect;
            const productDetail : ProductDetail = (
                !id
                ? await prismaTransaction.product.create({
                    data   : data,
                    select : select,
                })
                : await prismaTransaction.product.update({
                    where  : {
                        id : id,
                    },
                    data   : data,
                    select : select,
                })
            );
            
            // a workaround of non_working_orderBy of product.create() & product.update():
            productDetail.variantGroups.sort(({sort: sortA}, {sort: sortB}) => sortA - sortB); // mutate
            for (const variantGroup of productDetail.variantGroups) {
                variantGroup.variants.sort(({sort: sortA}, {sort: sortB}) => sortA - sortB); // mutate
            } // for
            
            
            
            //#region rebuild stock maps
            if (variantGroupDiff) {
                const currentStocks = await prismaTransaction.stock.findMany({
                    where  : {
                        productId : productDetail.id,
                    },
                    select : {
                        value      : true,
                        variantIds : true,
                    },
                });
                const stockMap = createStockMap(variantGroupDiff, currentStocks, productDetail.variantGroups);
                
                
                
                // sync stocks:
                if (stocks) {
                    if (stocks.length !== stockMap.length) {
                        return Response.json({
                            error: 'Invalid data.',
                        }, { status: 400 }); // handled with error
                    } // if
                    
                    
                    
                    for (let index = 0; index < stocks.length; index++) {
                        stockMap[index].value = stocks[index];
                    } // for
                } // if
                
                
                
                // update db:
                const changedProduct = await prismaTransaction.product.update({
                    where  : {
                        id: productDetail.id,
                    },
                    data   : {
                        stocks : {
                            deleteMany : {
                                // delete all within current `productId`
                                productId : productDetail.id,
                            },
                            create : stockMap,
                        },
                    },
                    select : {
                        stocks : {
                            select: {
                                id         : true,
                                
                                value      : true,
                                
                                variantIds : true,
                            },
                        },
                    },
                });
                productDetail.stocks = changedProduct.stocks;
            } else if (stocks) {
                const variantGroupDiff = createVariantGroupDiff(productDetail.variantGroups, productDetail.variantGroups);
                const stockMap = createStockMap(variantGroupDiff, productDetail.stocks, productDetail.variantGroups);
                
                
                
                // sync stocks:
                {
                    if (stocks.length !== stockMap.length) {
                        return Response.json({
                            error: 'Invalid data.',
                        }, { status: 400 }); // handled with error
                    } // if
                    
                    
                    
                    for (let index = 0; index < stocks.length; index++) {
                        stockMap[index].value = stocks[index];
                    } // for
                }
                
                
                
                // update db:
                const changedProduct = await prismaTransaction.product.update({
                    where  : {
                        id: productDetail.id,
                    },
                    data   : {
                        stocks : {
                            deleteMany : {
                                // delete all within current `productId`
                                productId : productDetail.id,
                            },
                            create : stockMap,
                        },
                    },
                    select : {
                        stocks : {
                            select: {
                                id         : true,
                                
                                value      : true,
                                
                                variantIds : true,
                            },
                        },
                    },
                });
                productDetail.stocks = changedProduct.stocks;
            } // if
            //#endregion rebuild stock maps
            
            
            
            return Response.json(productDetail); // handled with success
            //#endregion save changes
        }, { timeout: 20000 }); // give a longer timeout for rebuild stock maps
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        // if (error instanceof RecordNotFound) return Response.json({ error: 'invalid ID' }, { status: 400 }); // handled with error
        return Response.json({ error: error }, { status: 500 }); // handled with error
    } // try
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
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    //#endregion validating request
    
    
    
    //#region validating privileges
    const session = (req as any).session as Session;
    if (!session.role?.product_d) return Response.json({ error:
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
        return Response.json(deletedProduct); // handled with success
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        // if (error instanceof RecordNotFound) return Response.json({ error: 'invalid ID' }, { status: 400 }); // handled with error
        return Response.json({ error: error }, { status: 500 }); // handled with error
    } // try
    //#endregion save changes
});
