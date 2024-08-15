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
import {
    // types:
    type Prisma,
    type TemplateVariantDetail,
    type TemplateVariantGroupDetail,
    type TemplateVariantDiff,
    
    
    
    // utilities:
    templateVariantGroupDetailSelect,
    
    selectId,
    createTemplateVariantDiff,
}                           from '@/models'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'

// internal auth:
import {
    authOptions,
}                           from '@/app/api/auth/[...nextauth]/route'



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
    /* required for displaying templates page */
    
    
    
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
    
    //#region validating privileges
    const session = (req as any).session as Session;
    if (!session.role?.product_r) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to view the template_variant.`
    }, { status: 403 }); // handled with error: forbidden
    //#endregion validating privileges
    
    
    
    const templateVariantGroupDetails : TemplateVariantGroupDetail[] = (
        (await prisma.templateVariantGroup.findMany({
            select: {
                id                 : true,
                
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
                createdAt: 'desc',
            },
        }))
    );
    return NextResponse.json(templateVariantGroupDetails); // handled with success
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
    const variantGroupRaw = await req.json();
    //#endregion parsing request
    
    
    
    //#region validating request
    if (!(
        (typeof(variantGroupRaw) === 'object')
        &&
        (Object.keys(variantGroupRaw).length === 4)
        &&
        /* 1: */ ((typeof(variantGroupRaw.id) === 'string') && (!variantGroupRaw.id || (variantGroupRaw.id.length <= 40)))
        &&
        /* 2: */ ((typeof(variantGroupRaw.name) === 'string') && !!variantGroupRaw.name)
        &&
        /* 3: */ (typeof(variantGroupRaw.hasDedicatedStocks) === 'boolean')
        &&
        /* 4: */ ((): boolean => {
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
    )) {
        return NextResponse.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    //#endregion validating request
    
    
    
    //#region normalize templateVariant
    const variantGroup : TemplateVariantGroupDetail = variantGroupRaw;
    const {
        id,
        name,
        hasDedicatedStocks,
    } = variantGroup;
    
    const templateVariantDiff = await (async (): Promise<TemplateVariantDiff> => {
        const {
            variants,
        } = variantGroup;
        
        
        
        const variantOris : TemplateVariantDetail[] = !id ? [] : await prisma.templateVariant.findMany({
            where : {
                parentId       : id,
            },
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
        });
        return createTemplateVariantDiff(variants, variantOris);
    })();
    //#endregion normalize templateVariant
    
    
    
    //#region validating privileges
    const session = (req as any).session as Session;
    const {
        variantOris,
        
        variantDels,
        variantAdds,
        variantMods,
    } = templateVariantDiff;
    if (!id) {
        if (
            !session.role?.product_c
            &&
            !!variantAdds.length
        ) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to add new template_variant.`
        }, { status: 403 }); // handled with error: forbidden
    }
    else {
        if (
            !session.role?.product_d
            &&
            !!variantDels.length
        ) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to delete the template_variant.`
        }, { status: 403 }); // handled with error: forbidden
        
        
        
        if (
            !session.role?.product_ud
            &&
            variantMods
            .some(({id, name}) => {
                const variantOri = variantOris.find(({id: idOri}) => (idOri === id));
                return (
                    (name !== variantOri?.name)
                );
            })
        ) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to modify the template_variant name.`
        }, { status: 403 }); // handled with error: forbidden
        
        
        
        if (
            !session.role?.product_ud
            &&
            !((): boolean => {
                // compare the order of variants, ignore added|deleted items:
                const variantModIds = variantMods.map(selectId);
                const variantDelIds = variantDels;
                const variantOriIds = variantOris.map(selectId).filter((id) => !variantDelIds.includes(id));
                if (variantModIds.length !== variantOriIds.length) return false; // not_deep_equal
                for (let variantIndex = 0; variantIndex < variantModIds.length; variantIndex++) {
                    if (variantModIds[variantIndex] !== variantOriIds[variantIndex]) return false; // not_deep_equal
                } // for
                
                
                
                return true; // deep_equal
            })()
        ) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to modify the template_variant order.`
        }, { status: 403 }); // handled with error: forbidden
        
        
        
        if (
            !session.role?.product_up
            &&
            variantMods
            .some(({id, price, shippingWeight}) => {
                const variantOri = variantOris.find(({id: idOri}) => (idOri === id));
                return (
                    (price !== variantOri?.price)
                    ||
                    (shippingWeight !== variantOri.shippingWeight)
                );
            })
        ) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to modify the template_variant price and/or shipping weight.`
        }, { status: 403 }); // handled with error: forbidden
        
        
        
        if (
            !session.role?.product_uv
            &&
            variantMods
            .some(({id, visibility}) => {
                const variantOri = variantOris.find(({id: idOri}) => (idOri === id));
                return (
                    (visibility !== variantOri?.visibility)
                );
            })
        ) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to modify the template_variant visibility.`
        }, { status: 403 }); // handled with error: forbidden
    } // if
    //#endregion validating privileges
    
    
    
    //#region save changes
    // console.log(templateVariantGroupDiffs);
    try {
        const data = {
            name,
            hasDedicatedStocks,
            
            // relations:
            variants : {
                delete : !templateVariantDiff.variantDels.length ? undefined : templateVariantDiff.variantDels.map((templateId) => ({
                    // conditions:
                    id : templateId,
                })),
                
                create : !templateVariantDiff.variantAdds.length ? undefined : templateVariantDiff.variantAdds,
                
                update : !templateVariantDiff.variantMods.length ? undefined : templateVariantDiff.variantMods.map(({id: templateId, ...restTemplateVariant}) => ({
                    where : {
                        // conditions:
                        id : templateId,
                    },
                    data  : restTemplateVariant,
                })),
            },
        } satisfies Prisma.TemplateVariantGroupUpdateInput;
        const templateVariantGroupDetail : TemplateVariantGroupDetail = (
            !id
            ? await prisma.templateVariantGroup.create({
                data   : data,
                select : templateVariantGroupDetailSelect,
            })
            : await prisma.templateVariantGroup.update({
                where  : {
                    id : id,
                },
                data   : data,
                select : templateVariantGroupDetailSelect,
            })
        );
        
        // a workaround of non_working_orderBy of template.create() & template.update():
        templateVariantGroupDetail.variants.sort(({sort: sortA}, {sort: sortB}) => sortA - sortB); // mutate
        
        return NextResponse.json(templateVariantGroupDetail); // handled with success
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

You do not have the privilege to delete the template.`
    }, { status: 403 }); // handled with error: forbidden
    //#endregion validating privileges
    
    
    
    //#region save changes
    try {
        const deletedTemplate : Pick<TemplateVariantDetail, 'id'> = (
            await prisma.templateVariantGroup.delete({
                where  : {
                    id : id,
                },
                select : {
                    id : true,
                },
            })
        );
        return NextResponse.json(deletedTemplate); // handled with success
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        // if (error instanceof RecordNotFound) return NextResponse.json({ error: 'invalid ID' }, { status: 400 }); // handled with error
        return NextResponse.json({ error: error }, { status: 500 }); // handled with error
    } // try
    //#endregion save changes
});
