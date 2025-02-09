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
import {
    // types:
    type Pagination,
    
    type VariantGroupDetail,
    type VariantGroupDiff,
    
    type ProductPreview,
    type ProductDetail,
    type ProductUpdateRequest,
    
    
    
    // schemas:
    ModelIdSchema,
    PaginationArgSchema,
    ProductUpdateRequestSchema,
    
    
    
    // utilities:
    productPreviewSelect,
    convertProductPreviewDataToProductPreview,
    productDetailSelect,
    convertProductDetailDataToProductDetail,
    
    selectId,
    createVariantGroupDiff,
    createStockMap,
    
    extractKeywords,
    extractContentFromWysiwygEditorState,
}                           from '@/models'
import {
    Prisma,
}                           from '@prisma/client'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'

// internal auth:
import {
    authOptions,
}                           from '@/libs/auth.server'



// configs:
export const dynamic    = 'force-dynamic';
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
    //#region parsing and validating request
    const requestData = await (async () => {
        try {
            const data = Object.fromEntries(new URL(req.url, 'https://localhost/').searchParams.entries());
            return {
                id : ModelIdSchema.parse(data?.id),
            };
        }
        catch {
            return null;
        } // try
    })();
    if (requestData === null) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    const {
        id,
    } = requestData;
    //#endregion parsing and validating request
    
    
    
    const productPreviewData = (
        await prisma.product.findUnique({
            where  : {
                id         : id, // find by id
            },
            select : productPreviewSelect,
        })
    );
    
    if (!productPreviewData) {
        return Response.json({
            error: `The product with specified id "${id}" is not found.`,
        }, { status: 404 }); // handled with error
    } // if
    
    return Response.json(convertProductPreviewDataToProductPreview(productPreviewData) satisfies ProductPreview); // handled with success
})
.post(async (req) => {
    //#region parsing and validating request
    const requestData = await (async () => {
        try {
            const data = await req.json();
            return {
                paginationArg : PaginationArgSchema.parse(data),
            };
        }
        catch {
            return null;
        } // try
    })();
    if (requestData === null) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    const {
        paginationArg : {
            page,
            perPage,
        },
    } = requestData;
    //#endregion parsing and validating request
    
    
    
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
            select: productDetailSelect,
            orderBy : {
                createdAt: 'desc',
            },
            skip    : page * perPage, // note: not scaleable but works in small commerce app -- will be fixed in the future
            take    : perPage,
        }),
    ]);
    for (const productDetail of paged) {
        // a workaround of non_working_orderBy of `product.findMany`:
        productDetail.variantGroups.sort(({sort: sortA}, {sort: sortB}) => sortA - sortB); // mutate
        for (const variantGroup of productDetail.variantGroups) {
            variantGroup.variants.sort(({sort: sortA}, {sort: sortB}) => sortA - sortB); // mutate
        } // for
    } // for
    const paginationProductDetail : Pagination<ProductDetail> = {
        total    : total,
        entities : paged.map(convertProductDetailDataToProductDetail),
    };
    return Response.json(paginationProductDetail); // handled with success
})
.patch(async (req) => {
    //#region parsing and validating request
    const requestData = await (async () => {
        try {
            const data = await req.json();
            const productUpdateRequestRaw = ProductUpdateRequestSchema.parse(data);
            if (!productUpdateRequestRaw.id) {
                // when creating a new model (no id), the `visibility`|`name`|`price`|`path` must be exist:
                if ((productUpdateRequestRaw.visibility === undefined) || (productUpdateRequestRaw.name === undefined) || (productUpdateRequestRaw.price === undefined) || (productUpdateRequestRaw.path === undefined)) return null;
                
                
                
                return {
                    productUpdateRequest : productUpdateRequestRaw as ProductUpdateRequest & Required<Pick<ProductUpdateRequest, 'visibility'|'name'|'price'|'path'>>,
                };
            }
            else {
                return {
                    productUpdateRequest : productUpdateRequestRaw satisfies ProductUpdateRequest,
                };
            }
        }
        catch {
            return null;
        } // try
    })();
    if (requestData === null) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    const {
        productUpdateRequest : {
            id,
            
            visibility,
            
            name,
            
            price,
            shippingWeight,
            
            stock,
            
            path,
            
            excerpt,
            description,
            keywords,
            
            images,
            
            variantGroups,
            stocks,
            categories,
        },
    } = requestData;
    //#endregion parsing and validating request
    
    
    
    // generate auto keywords based on name and description:
    const autoKeywords : string[] = Array.from(
        new Set<string>([
            ...extractKeywords(name),
            ...extractKeywords(extractContentFromWysiwygEditorState(description)),
        ])
    );
    
    
    
    try {
        return await prisma.$transaction(async (prismaTransaction): Promise<Response> => {
            //#region normalize variantGroups
            const variantGroupDiff = (variantGroups === undefined) ? undefined : await (async (): Promise<VariantGroupDiff> => {
                const variantGroupOris : VariantGroupDetail[] = !id ? [] : await prismaTransaction.variantGroup.findMany({
                    where : {
                        parentId : id,
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
            
            
            
            //#region validating privileges
            const session = (req as any).session as Session;
            if (!id) {
                if (!session.role?.product_c) return Response.json({ error:
`Access denied.

You do not have the privilege to add new product.`
                }, { status: 403 }); // handled with error: forbidden
            }
            else {
                if (!session.role?.product_ud && ((name !== undefined) || (path !== undefined) || (excerpt !== undefined) || (description !== undefined) || (keywords !== undefined) || (categories !== undefined))) return Response.json({ error:
`Access denied.

You do not have the privilege to modify the product name, path, excerpt, description, and/or categories.`
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
                            const variantGroupModIds = variantGroupMods.map(selectId);
                            const variantGroupOriIds = variantGroupOris.map(selectId);
                            if (variantGroupModIds.length !== variantGroupOriIds.length) return false; // not_equal
                            for (let variantGroupIndex = 0; variantGroupIndex < variantGroupModIds.length; variantGroupIndex++) {
                                if (variantGroupModIds[variantGroupIndex] !== variantGroupOriIds[variantGroupIndex]) return false; // not_equal
                                const {
                                    variantOris,
                                    variantMods,
                                } = variantGroupMods[variantGroupIndex];
                                
                                
                                
                                const variantModIds = variantMods.map(selectId);
                                const variantOriIds = variantOris.map(selectId);
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
                description : (description === null) ? Prisma.DbNull : description,
                autoKeywords,
                keywords,
                
                images,
                
                // relations:
                variantGroups : (variantGroupDiff === undefined) ? undefined : {
                    delete : !variantGroupDiff.variantGroupDels.length ? undefined : variantGroupDiff.variantGroupDels.map((groupId) => ({
                        // conditions:
                        id : groupId,
                    })),
                    
                    create : !variantGroupDiff.variantGroupAdds.length ? undefined : variantGroupDiff.variantGroupAdds.map(({variantAdds, ...restVariantGroup}) => ({
                        // data:
                        ...restVariantGroup,
                        
                        // relations:
                        variants: {
                            create : variantAdds,
                        },
                    })),
                    
                    update : !variantGroupDiff.variantGroupMods.length ? undefined : variantGroupDiff.variantGroupMods.map(({variantOris: _variantOris, id: groupId, variantDels, variantAdds, variantMods, ...restVariantGroup}) => ({
                        where : {
                            // conditions:
                            id : groupId,
                        },
                        data  : {
                            // data:
                            ...restVariantGroup,
                            
                            // relations:
                            variants : {
                                delete : !variantDels.length ? undefined : variantDels.map((variantId) => ({
                                    // conditions:
                                    id : variantId,
                                })),
                                
                                create : !variantAdds.length ? undefined : variantAdds,
                                
                                update : !variantMods.length ? undefined : variantMods.map(({id: variantId, ...restVariant}) => ({
                                    where : {
                                        // conditions:
                                        id: variantId,
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
            const productDetail : ProductDetail = convertProductDetailDataToProductDetail(
                !id
                ? await prismaTransaction.product.create({
                    data   : {
                        ...data as (typeof data & Required<Pick<ProductUpdateRequest, 'visibility'|'name'|'price'|'path'>>),
                        categories : (categories === undefined) ? undefined : {
                            connect : categories.map((categoryId) => ({
                                id : categoryId,
                            })),
                        },
                    },
                    select : productDetailSelect,
                })
                : await prismaTransaction.product.update({
                    where  : {
                        id : id,
                    },
                    data   : {
                        ...data,
                        categories : (categories === undefined) ? undefined : {
                            set : categories.map((categoryId) => ({
                                id : categoryId,
                            })),
                        },
                    },
                    select : productDetailSelect,
                })
            );
            
            // a workaround of non_working_orderBy of `product.create()` & `product.update()`:
            productDetail.variantGroups.sort(({sort: sortA}, {sort: sortB}) => sortA - sortB); // mutate
            for (const variantGroup of productDetail.variantGroups) {
                variantGroup.variants.sort(({sort: sortA}, {sort: sortB}) => sortA - sortB); // mutate
            } // for
            
            
            
            //#region rebuild stock maps
            if (variantGroupDiff) {
                const currentStocks = await prismaTransaction.stock.findMany({
                    where  : {
                        parentId   : productDetail.id,
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
                                parentId : productDetail.id,
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
                                parentId : productDetail.id,
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
    //#region parsing and validating request
    const requestData = await (async () => {
        try {
            const data = Object.fromEntries(new URL(req.url, 'https://localhost/').searchParams.entries());
            return {
                id : ModelIdSchema.parse(data?.id),
            };
        }
        catch {
            return null;
        } // try
    })();
    if (requestData === null) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    const {
        id,
    } = requestData;
    //#endregion parsing and validating request
    
    
    
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
