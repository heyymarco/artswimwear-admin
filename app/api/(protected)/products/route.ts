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
    Stock,
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
                /* 1: */ ((typeof(productVariantGroupRaw.id) === 'string') && ((!productVariantGroupRaw.id || (productVariantGroupRaw.id[0] === ' ')) || (!!id && (productVariantGroupRaw.id.length <= 40))))
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
                            /* 1: */ ((typeof(productVariantRaw.id) === 'string') && ((!productVariantRaw.id || (productVariantRaw.id[0] === ' ')) || (!!productVariantGroupRaw.id && (productVariantRaw.id.length <= 40))))
                            &&
                            /* 2: */ ((typeof(productVariantRaw.visibility) === 'string') && ['PUBLISHED', 'DRAFT'].includes(productVariantRaw.visibility))
                            &&
                            /* 3: */ ((typeof(productVariantRaw.sort) === 'number') && (productVariantRaw.sort >= Number.MIN_SAFE_INTEGER) && (productVariantRaw.sort <= Number.MAX_SAFE_INTEGER))
                            &&
                            /* 4: */ ((typeof(productVariantGroupRaw.name) === 'string') && !!productVariantGroupRaw.name)
                            &&
                            /* 5: */ ((productVariantRaw.price === null) || ((typeof(productVariantRaw.price) === 'number') && (productVariantRaw.price >= 0) && (productVariantRaw.price <= Number.MAX_SAFE_INTEGER)))
                            &&
                            /* 6: */ ((productVariantRaw.shippingWeight === null) || ((typeof(productVariantRaw.shippingWeight) === 'number') && (productVariantRaw.shippingWeight >= 0) && (productVariantRaw.shippingWeight <= Number.MAX_SAFE_INTEGER)))
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
    //#endregion validating request
    
    
    
    //#region normalize productVariantGroups
    const productVariantGroups : ProductVariantGroupDetail[]|undefined = productVariantGroupsRaw;
    
    interface ProductVariantDiff {
        productVariantDels      : string[]
        productVariantAdds      : Omit<ProductVariantDetail, 'id'>[]
        productVariantMods      : ProductVariantDetail[]
    }
    interface ProductVariantGroupDiff {
        productVariantGroupOris : ProductVariantGroupDetail[]
        productVariantGroupDels : string[]
        productVariantGroupAdds : (Omit<ProductVariantGroupDetail, 'id'|'productVariants'> & Pick<ProductVariantDiff, 'productVariantAdds'>)[]
        productVariantGroupMods : (Omit<ProductVariantGroupDetail,      'productVariants'> & ProductVariantDiff)[]
    }
    const productVariantGroupDiffs = (productVariantGroups === undefined) ? undefined : await (async (): Promise<ProductVariantGroupDiff> => {
        const productVariantGroupOris : ProductVariantGroupDetail[] = !id ? [] : await prisma.productVariantGroup.findMany({
            where : {
                productId : id,
            },
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
        
        
        
        const productVariantGroupDels : ProductVariantGroupDiff['productVariantGroupDels'] = (() => {
            const postedIds  : string[] = productVariantGroups.map(({id}) => id);
            const currentIds : string[] = productVariantGroupOris.map(({id}) => id);
            return currentIds.filter((currentId) => !postedIds.includes(currentId));
        })();
        const productVariantGroupAdds : ProductVariantGroupDiff['productVariantGroupAdds'] = [];
        const productVariantGroupMods : ProductVariantGroupDiff['productVariantGroupMods'] = [];
        let productVariantGroupSortCounter = 0;
        for (const {id, sort, productVariants, ...restProductVariantGroup} of productVariantGroups) {
            const {
                productVariantDels,
                productVariantAdds,
                productVariantMods,
            } = ((): ProductVariantDiff => {
                const productVariantDels : ProductVariantDiff['productVariantDels'] = (() => {
                    const postedIds  : string[] = productVariants.map(({id}) => id);
                    const currentIds : string[] = productVariantGroupOris.find(({id: groupId}) => (groupId === id))?.productVariants.map(({id}) => id) ?? [];
                    return currentIds.filter((currentId) => !postedIds.includes(currentId));
                })();
                const productVariantAdds : ProductVariantDiff['productVariantAdds'] = [];
                const productVariantMods : ProductVariantDiff['productVariantMods'] = [];
                let productVariantSortCounter = 0;
                for (const {id, sort, ...restProductVariant} of productVariants) {
                    if (!id || (id[0] === ' ')) {
                        productVariantAdds.push({
                            // data:
                            sort: productVariantSortCounter++, // normalize sort, zero based
                            ...restProductVariant,
                        });
                        continue;
                    } // if
                    
                    
                    
                    productVariantMods.push({
                        // data:
                        id,
                        sort: productVariantSortCounter++, // normalize sort, zero based
                        ...restProductVariant,
                    });
                } // for
                return {
                    productVariantDels,
                    productVariantAdds,
                    productVariantMods,
                };
            })();
            
            
            
            if (!id || (id[0] === ' ')) {
                productVariantGroupAdds.push({
                    // data:
                    sort: productVariantGroupSortCounter++, // normalize sort, zero based
                    ...restProductVariantGroup,
                    
                    // relations:
                    productVariantAdds,
                });
                continue;
            } // if
            
            
            
            productVariantGroupMods.push({
                // data:
                id,
                sort: productVariantGroupSortCounter++, // normalize sort, zero based
                ...restProductVariantGroup,
                
                // relations:
                productVariantDels,
                productVariantAdds,
                productVariantMods,
            });
        } // for
        return {
            productVariantGroupOris,
            
            productVariantGroupDels,
            productVariantGroupAdds,
            productVariantGroupMods,
        };
    })();
    //#endregion normalize productVariantGroups
    
    
    
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
        
        if (productVariantGroupDiffs !== undefined) {
            const {
                productVariantGroupOris,
                
                productVariantGroupDels,
                productVariantGroupAdds,
                productVariantGroupMods,
            } = productVariantGroupDiffs;
            
            
            
            if (
                !session.role?.product_c
                &&
                (
                    !!productVariantGroupAdds.length
                    ||
                    productVariantGroupMods.some(({productVariantAdds}) => !!productVariantAdds.length)
                )
            ) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to add new product variant.`
            }, { status: 403 }); // handled with error: forbidden
            
            
            
            if (
                !session.role?.product_d
                &&
                (
                    !!productVariantGroupDels.length
                    ||
                    productVariantGroupMods.some(({productVariantDels}) => !!productVariantDels.length)
                )
            ) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to delete the product variant.`
            }, { status: 403 }); // handled with error: forbidden
            
            
            
            if (
                !session.role?.product_ud
                &&
                productVariantGroupMods
                .some(({id, name, productVariantMods}) => {
                    const productVariantGroupOri = productVariantGroupOris.find(({id: idOri}) => (idOri === id));
                    return (
                        (name !== productVariantGroupOri?.name)
                        ||
                        productVariantMods
                        .some(({id, name}) => {
                            const productVariantOri = productVariantGroupOri.productVariants.find(({id: idOri}) => (idOri === id));
                            return (
                                (name !== productVariantOri?.name)
                            );
                        })
                    );
                })
            ) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to modify the product_variant name.`
            }, { status: 403 }); // handled with error: forbidden
            
            
            
            if (
                !session.role?.product_ud
                &&
                !((): boolean => {
                    // compare the modified order items, ignore added|deleted items:
                    const productVariantGroupModSortIds = productVariantGroupMods.map(({id}) => id);
                    const productVariantGroupOriSortIds = productVariantGroupOris.map(({id}) => id);
                    if (productVariantGroupModSortIds.length !== productVariantGroupOriSortIds.length) return false; // not_equal
                    for (let index = 0; index < productVariantGroupModSortIds.length; index++) {
                        if (productVariantGroupModSortIds[index] !== productVariantGroupOriSortIds[index]) return false; // not_equal
                        
                        
                        
                        const productVariantModSortIds = productVariantGroupMods[index].productVariantMods.map(({id}) => id);
                        const productVariantDeletedIds = productVariantGroupMods[index].productVariantDels;
                        const productVariantOriSortIds = productVariantGroupOris[index].productVariants.map(({id}) => id).filter((id) => !productVariantDeletedIds.includes(id));
                        if (productVariantModSortIds.length !== productVariantOriSortIds.length) return false; // not_deep_equal
                        for (let index = 0; index < productVariantModSortIds.length; index++) {
                            if (productVariantModSortIds[index] !== productVariantOriSortIds[index]) return false; // not_deep_equal
                        } // for
                    } // for
                    
                    
                    
                    return true; // deep_equal
                })()
            ) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to modify the product_variant order.`
            }, { status: 403 }); // handled with error: forbidden
            
            
            
            if (
                !session.role?.product_ui
                &&
                productVariantGroupMods
                .some(({id, productVariantMods}) => {
                    const productVariantGroupOri = productVariantGroupOris.find(({id: idOri}) => (idOri === id));
                    return (
                        !!productVariantGroupOri
                        &&
                        productVariantMods
                        .some(({id, images}) => {
                            const imagesOri = productVariantGroupOri.productVariants.find(({id: idOri}) => (idOri === id))?.images ?? [];
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
            ) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to modify the product_variant images.`
            }, { status: 403 }); // handled with error: forbidden
            
            
            
            if (
                !session.role?.product_up
                &&
                productVariantGroupMods
                .some(({id, productVariantMods}) => {
                    const productVariantGroupOri = productVariantGroupOris.find(({id: idOri}) => (idOri === id));
                    return (
                        !!productVariantGroupOri
                        &&
                        productVariantMods
                        .some(({id, price, shippingWeight}) => {
                            const productVariantOri = productVariantGroupOri.productVariants.find(({id: idOri}) => (idOri === id));
                            return (
                                (price !== productVariantOri?.price)
                                ||
                                (shippingWeight !== productVariantOri.shippingWeight)
                            );
                        })
                    );
                })
            ) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to modify the product_variant price and/or shipping weight.`
            }, { status: 403 }); // handled with error: forbidden
            
            
            
            if (
                !session.role?.product_uv
                &&
                productVariantGroupMods
                .some(({id, productVariantMods}) => {
                    const productVariantGroupOri = productVariantGroupOris.find(({id: idOri}) => (idOri === id));
                    return (
                        !!productVariantGroupOri
                        &&
                        productVariantMods
                        .some(({id, visibility}) => {
                            const productVariantOri = productVariantGroupOri.productVariants.find(({id: idOri}) => (idOri === id));
                            return (
                                (visibility !== productVariantOri?.visibility)
                            );
                        })
                    );
                })
            ) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to modify the product_variant visibility.`
            }, { status: 403 }); // handled with error: forbidden
        } // if
    } // if
    //#endregion validating privileges
    
    
    
    //#region save changes
    // console.log(productVariantGroupDiffs);
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
            
            // relations:
            productVariantGroups : (productVariantGroupDiffs === undefined) ? undefined : {
                delete : !productVariantGroupDiffs.productVariantGroupDels.length ? undefined : productVariantGroupDiffs.productVariantGroupDels.map((id) => ({
                    // conditions:
                    id : id,
                })),
                
                create : !productVariantGroupDiffs.productVariantGroupAdds.length ? undefined : productVariantGroupDiffs.productVariantGroupAdds.map(({productVariantAdds, ...restProductVariantGroup}) => ({
                    // data:
                    ...restProductVariantGroup,
                    
                    // relations:
                    productVariants: {
                        create : productVariantAdds,
                    },
                })),
                
                update : !productVariantGroupDiffs.productVariantGroupMods.length ? undefined : productVariantGroupDiffs.productVariantGroupMods.map(({id, productVariantDels, productVariantAdds, productVariantMods, ...restProductVariantGroup}) => ({
                    where : {
                        // conditions:
                        id : id,
                    },
                    data  : {
                        // data:
                        ...restProductVariantGroup,
                        
                        // relations:
                        productVariants : {
                            delete : !productVariantDels.length ? undefined : productVariantDels.map((id) => ({
                                // conditions:
                                id : id,
                            })),
                            
                            create : !productVariantAdds.length ? undefined : productVariantAdds,
                            
                            update : !productVariantMods.length ? undefined : productVariantMods.map(({id, ...restProductVariant}) => ({
                                where : {
                                    // conditions:
                                    id: id,
                                },
                                data  : restProductVariant,
                            })),
                        },
                    },
                })),
            },
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
        
        // a workaround of non_working_orderBy of product.create() & product.update():
        productDetail.productVariantGroups.sort(({sort: sortA}, {sort: sortB}) => sortA - sortB); // mutate
        for (const productVariantGroup of productDetail.productVariantGroups) {
            productVariantGroup.productVariants.sort(({sort: sortA}, {sort: sortB}) => sortA - sortB); // mutate
        } // for
        
        
        
        //#region rebuild stock maps
        if (productVariantGroupDiffs) {
            //#region normalize productVariantGroupUpdated
            const updatedProductVariantGroups = productDetail.productVariantGroups;
            
            interface ProductVariantUpdated {
                productVariantAdds      : ProductVariantDetail[]
                productVariantMods      : ProductVariantDetail[]
            }
            interface ProductVariantGroupUpdated {
                productVariantGroupAdds : (Omit<ProductVariantGroupDetail, 'productVariants'> & Pick<ProductVariantUpdated, 'productVariantAdds'>)[]
                productVariantGroupMods : (Omit<ProductVariantGroupDetail, 'productVariants'> & ProductVariantUpdated)[]
            }
            const {
                productVariantGroupAdds,
                productVariantGroupMods,
            } = ((): ProductVariantGroupUpdated => {
                const productVariantGroupModIds = productVariantGroupDiffs.productVariantGroupMods.map(({id}) => id);
                const productVariantGroupAdds   : ProductVariantGroupUpdated['productVariantGroupAdds'] = [];
                const productVariantGroupMods   : ProductVariantGroupUpdated['productVariantGroupMods'] = [];
                for (const {id, productVariants, ...restProductVariantGroup} of updatedProductVariantGroups) {
                    const {
                        productVariantAdds,
                        productVariantMods,
                    } = ((): ProductVariantUpdated => {
                        const productVariantGroupMod = productVariantGroupDiffs.productVariantGroupMods.find(({id: groupId}) => (groupId === id));
                        const productVariantModIds   = productVariantGroupMod?.productVariantMods.map(({id}) => id);
                        const productVariantAdds     : ProductVariantUpdated['productVariantAdds'] = [];
                        for (const {id, ...restProductVariant} of productVariants) {
                            if (!productVariantModIds?.includes(id)) {
                                productVariantAdds.push({
                                    // data:
                                    id,
                                    ...restProductVariant,
                                });
                                continue;
                            } // if
                        } // for
                        return {
                            productVariantAdds,
                            productVariantMods : productVariantGroupMod?.productVariantMods ?? [],
                        };
                    })();
                    
                    
                    
                    if (!productVariantGroupModIds.includes(id)) {
                        productVariantGroupAdds.push({
                            // data:
                            id,
                            ...restProductVariantGroup,
                            
                            // relations:
                            productVariantAdds,
                        });
                        continue;
                    } // if
                    
                    
                    
                    productVariantGroupMods.push({
                        // data:
                        id,
                        ...restProductVariantGroup,
                        
                        // relations:
                        productVariantAdds,
                        productVariantMods,
                    });
                } // for
                return {
                    productVariantGroupAdds,
                    productVariantGroupMods,
                };
            })();
            //#endregion normalize productVariantGroupUpdated
            
            
            
            interface StockInfo {
                stock      : number|null
                variantIds : string[]
            }
            type ProductVariantUpd = Pick<ProductVariantUpdated, 'productVariantAdds'> & Partial<Pick<ProductVariantUpdated, 'productVariantMods'>>
            const expandStockInfo = async (productVariantUpds : ProductVariantUpd[], index: number, currentStocks: Pick<Stock, 'value'|'productVariantIds'>[], baseStockInfo: StockInfo, expandedStockInfos: StockInfo[]): Promise<void> => {
                const productVariantUpd = productVariantUpds[index];
                if (!productVariantUpd) { // end of variantGroup(s) => resolved as current `baseStockInfo`
                    expandedStockInfos.push(baseStockInfo);
                    return;
                } // if
                
                
                
                // recursively expands:
                
                const baseVariantIds = baseStockInfo.variantIds;
                
                if (productVariantUpd.productVariantMods) {
                    for (const productVariantMod of productVariantUpd.productVariantMods) {
                        const currentVariantIds = [...baseVariantIds, productVariantMod.id];
                        
                        
                        
                        const currentStock = (
                            currentStocks
                            .find(({productVariantIds}) =>
                                (productVariantIds.length === currentVariantIds.length)
                                &&
                                productVariantIds.every((idA) => currentVariantIds.includes(idA))
                                &&
                                currentVariantIds.every((idB) => productVariantIds.includes(idB))
                            )
                            ?.value
                            ??
                            null
                        );
                        
                        
                        
                        await expandStockInfo(
                            productVariantUpds,
                            index + 1,
                            currentStocks,
                            /* baseStockInfo: */{
                                stock      : currentStock,
                                variantIds : currentVariantIds,
                            },
                            expandedStockInfos
                        );
                    } // for
                } // if
                
                for (const productVariantAdd of productVariantUpd.productVariantAdds) {
                    const currentVariantIds = [...baseVariantIds, productVariantAdd.id];
                    
                    
                    
                    await expandStockInfo(
                        productVariantUpds,
                        index + 1,
                        currentStocks,
                        /* baseStockInfo: */{
                            stock      : (
                                (productVariantAdd === productVariantUpd.productVariantAdds[0])
                                ? baseStockInfo.stock
                                : null
                            ),
                            variantIds : currentVariantIds,
                        },
                        expandedStockInfos
                    );
                } // for
            }
            
            
            
            const productVariantUpds : ProductVariantUpd[] = [
                ...productVariantGroupMods, // the mods first
                ...productVariantGroupAdds, // then the adds
            ];
            const currentStocks = await prisma.stock.findMany({
                where  : {
                    productId : productDetail.id,
                },
                select : {
                    value             : true,
                    productVariantIds : true,
                },
            });
            const expandedStockInfos: StockInfo[] = [];
            await expandStockInfo(productVariantUpds, 0, currentStocks, /* baseStockInfo: */{ stock: null, variantIds: [] }, expandedStockInfos);
            
            
            
            debugger;
            return NextResponse.json({ error: 'test' }, { status: 500 }); // handled with error
            // await prisma.product.update({
            //     where  : {
            //         id: productDetail.id,
            //     },
            //     data   : {
            //         stocks : {
            //             deleteMany : {
            //                 // delete all within current `productId`
            //                 productId : productDetail.id,
            //             },
            //             create : expandedStockInfos.map(({variantIds, stock}) => ({
            //                 productVariantIds : variantIds,
            //                 value             : stock,
            //             })),
            //         },
            //     },
            //     select : {
            //         id : true,
            //     },
            // });
        } // if
        //#endregion rebuild stock maps
        
        
        
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
