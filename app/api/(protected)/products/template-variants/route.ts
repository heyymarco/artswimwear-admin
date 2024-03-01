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
    TemplateVariant,
    TemplateVariantGroup,
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
export interface TemplateVariantDetail
    extends
        Omit<TemplateVariant,
            |'createdAt'
            |'updatedAt'
            
            |'templateVariantGroupId'
        >
{
}
export interface TemplateVariantGroupDetail
    extends
        Omit<TemplateVariantGroup,
            |'createdAt'
            |'updatedAt'
        >
{
    templateVariants : TemplateVariantDetail[]
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
    /* required for constraining the privileges */
    
    
    
    const templateVariantGroupDetails : TemplateVariantGroupDetail[] = (
        (await prisma.templateVariantGroup.findMany({
            select: {
                id              : true,
                
                sort            : true,
                
                name            : true,
                
                templateVariants : {
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
    const templateVariantGroupRaw = await req.json();
    //#endregion parsing request
    
    
    
    //#region validating request
    if (!(
        (typeof(templateVariantGroupRaw) === 'object')
        &&
        (Object.keys(templateVariantGroupRaw).length === 4)
        &&
        /* 1: */ ((typeof(templateVariantGroupRaw.id) === 'string') && (!templateVariantGroupRaw.id || (templateVariantGroupRaw.id.length <= 40)))
        &&
        /* 2: */ ((typeof(templateVariantGroupRaw.sort) === 'number') && (templateVariantGroupRaw.sort >= Number.MIN_SAFE_INTEGER) && (templateVariantGroupRaw.sort <= Number.MAX_SAFE_INTEGER))
        &&
        /* 3: */ ((typeof(templateVariantGroupRaw.name) === 'string') && !!templateVariantGroupRaw.name)
        &&
        /* 4: */ ((): boolean => {
            const {templateVariants: templateVariantsRaw} = templateVariantGroupRaw;
            return (
                Array.isArray(templateVariantsRaw)
                &&
                templateVariantsRaw.every((templateVariantRaw) =>
                    (Object.keys(templateVariantRaw).length === 7)
                    &&
                    /* 1: */ ((typeof(templateVariantRaw.id) === 'string') && (!templateVariantRaw.id || (!!templateVariantGroupRaw.id && (templateVariantRaw.id.length <= 40))))
                    &&
                    /* 2: */ ((typeof(templateVariantRaw.visibility) === 'string') && ['PUBLISHED', 'DRAFT'].includes(templateVariantRaw.visibility))
                    &&
                    /* 3: */ ((typeof(templateVariantRaw.sort) === 'number') && (templateVariantRaw.sort >= Number.MIN_SAFE_INTEGER) && (templateVariantRaw.sort <= Number.MAX_SAFE_INTEGER))
                    &&
                    /* 4: */ ((typeof(templateVariantGroupRaw.name) === 'string') && !!templateVariantGroupRaw.name)
                    &&
                    /* 5: */ ((templateVariantRaw.price === null) || ((typeof(templateVariantRaw.price) === 'number') && (templateVariantRaw.price >= 0) && (templateVariantRaw.price <= Number.MAX_SAFE_INTEGER)))
                    &&
                    /* 6: */ ((templateVariantRaw.shippingWeight === null) || ((typeof(templateVariantRaw.shippingWeight) === 'number') && (templateVariantRaw.shippingWeight >= 0) && (templateVariantRaw.shippingWeight <= Number.MAX_SAFE_INTEGER)))
                    &&
                    /* 7: */ ((): boolean => {
                        const {images: imagesRaw} = templateVariantRaw;
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
    const templateVariantGroup : TemplateVariantGroupDetail = templateVariantGroupRaw;
    const {
        id,
        name,
    } = templateVariantGroup;
    
    interface TemplateVariantDiff {
        templateVariantOris      : TemplateVariantDetail[]
        
        templateVariantDels      : string[]
        templateVariantAdds      : Omit<TemplateVariantDetail, 'id'>[]
        templateVariantMods      : TemplateVariantDetail[]
    }
    const templateVariantDiff = await (async (): Promise<TemplateVariantDiff> => {
        const {
            templateVariants,
        } = templateVariantGroup;
        
        
        
        const templateVariantOris : TemplateVariantDetail[] = await prisma.templateVariant.findMany({
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
        
        
        
        const templateVariantDels : TemplateVariantDiff['templateVariantDels'] = (() => {
            const postedIds  : string[] = templateVariants.map(({id}) => id);
            const currentIds : string[] = templateVariantOris.map(({id}) => id) ?? [];
            return currentIds.filter((currentId) => !postedIds.includes(currentId));
        })();
        const templateVariantAdds : TemplateVariantDiff['templateVariantAdds'] = [];
        const templateVariantMods : TemplateVariantDiff['templateVariantMods'] = [];
        let templateVariantSortCounter = 0;
        for (const {id, sort, ...restTemplateVariant} of templateVariants) {
            if (!id || (id[0] === ' ')) {
                templateVariantAdds.push({
                    // data:
                    sort: templateVariantSortCounter++, // normalize sort, zero based
                    ...restTemplateVariant,
                });
                continue;
            } // if
            
            
            
            templateVariantMods.push({
                // data:
                id,
                sort: templateVariantSortCounter++, // normalize sort, zero based
                ...restTemplateVariant,
            });
        } // for
        return {
            templateVariantOris,
            
            templateVariantDels,
            templateVariantAdds,
            templateVariantMods,
        };
    })();
    //#endregion normalize templateVariant
    
    
    
    //#region validating privileges
    const session = (req as any).session as Session;
    const {
        templateVariantOris,
        
        templateVariantDels,
        templateVariantAdds,
        templateVariantMods,
    } = templateVariantDiff;
    if (!id) {
        if (
            !session.role?.product_c
            &&
            !!templateVariantAdds.length
        ) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to add new template_variant.`
        }, { status: 403 }); // handled with error: forbidden
    }
    else {
        if (
            !session.role?.product_d
            &&
            !!templateVariantDels.length
        ) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to delete the template_variant.`
        }, { status: 403 }); // handled with error: forbidden
        
        
        
        if (
            !session.role?.product_ud
            &&
            templateVariantMods
            .some(({id, name}) => {
                const templateVariantOri = templateVariantOris.find(({id: idOri}) => (idOri === id));
                return (
                    (name !== templateVariantOri?.name)
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
                // compare the modified order items, ignore added|deleted items:
                const templateVariantModSortIds = templateVariantMods.map(({id}) => id);
                const templateVariantDeletedIds = templateVariantDels;
                const templateVariantOriSortIds = templateVariantOris.map(({id}) => id).filter((id) => !templateVariantDeletedIds.includes(id));
                if (templateVariantModSortIds.length !== templateVariantOriSortIds.length) return false; // not_deep_equal
                for (let index = 0; index < templateVariantModSortIds.length; index++) {
                    if (templateVariantModSortIds[index] !== templateVariantOriSortIds[index]) return false; // not_deep_equal
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
            templateVariantMods
            .some(({id, price, shippingWeight}) => {
                const templateVariantOri = templateVariantOris.find(({id: idOri}) => (idOri === id));
                return (
                    (price !== templateVariantOri?.price)
                    ||
                    (shippingWeight !== templateVariantOri.shippingWeight)
                );
            })
        ) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to modify the template_variant price and/or shipping weight.`
        }, { status: 403 }); // handled with error: forbidden
        
        
        
        if (
            !session.role?.product_uv
            &&
            templateVariantMods
            .some(({id, visibility}) => {
                const templateVariantOri = templateVariantOris.find(({id: idOri}) => (idOri === id));
                return (
                    (visibility !== templateVariantOri?.visibility)
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
            sort : 0,
            
            name,
            
            templateVariant : {
                delete : templateVariantDiff.templateVariantDels.map((id) => ({
                    // conditions:
                    id : id,
                })),
                
                create : templateVariantDiff.templateVariantAdds,
                
                update : templateVariantDiff.templateVariantMods.map(({id, ...restTemplateVariant}) => ({
                    where : {
                        // conditions:
                        id : id,
                    },
                    data  : restTemplateVariant,
                })),
            },
        };
        const select = {
            id             : true,
            
            sort           : true,
            
            name           : true,
            
            templateVariants : {
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
        };
        const templateVariantGroupDetail : TemplateVariantGroupDetail = (
            !id
            ? await prisma.templateVariantGroup.create({
                data   : data,
                select : select,
            })
            : await prisma.templateVariantGroup.update({
                where  : {
                    id : id,
                },
                data   : data,
                select : select,
            })
        );
        
        // a workaround of non_working_orderBy of template.create() & template.update():
        templateVariantGroupDetail.templateVariants.sort(({sort: sortA}, {sort: sortB}) => sortA - sortB); // mutate
        
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
