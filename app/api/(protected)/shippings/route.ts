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
import {
    type ShippingPreview,
    type ShippingDetail,
    type CoverageCountryDetail,
    
    
    
    shippingPreviewSelect,
    shippingDetailSelect,
    type CoverageCountryDiff,
    createCoverageCountryDiff,
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
.get(async () => {
    /* required for displaying related_shippings in orders page */
    
    
    
    const shippingPreviews : Array<ShippingPreview> = (
        await prisma.shippingProvider.findMany({
            select: shippingPreviewSelect,
        }) // get all shippings including the disabled ones
    );
    return Response.json(shippingPreviews); // handled with success
})
.post(async (req) => {
    /* required for displaying shippings page */
    
    
    
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
    if (!session.role?.shipping_r) return Response.json({ error:
`Access denied.

You do not have the privilege to view the shippings.`
    }, { status: 403 }); // handled with error: forbidden
    //#endregion validating privileges
    
    
    
    const [total, paged] = await prisma.$transaction([
        prisma.shippingProvider.count(),
        prisma.shippingProvider.findMany({
            select  : shippingDetailSelect,
            orderBy : {
                createdAt: 'desc',
            },
            skip    : (page - 1) * perPage, // note: not scaleable but works in small commerce app -- will be fixed in the future
            take    : perPage,
        }),
    ]);
    const paginationShippingDetail : Pagination<ShippingDetail> = {
        total    : total,
        entities : paged,
    };
    return Response.json(paginationShippingDetail); // handled with success
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
        
        autoUpdate,
        origin,
        
        name,
        
        weightStep,
        eta,
        rates,
        
        useZones,
        zones : zonesRaw,
    } = await req.json();
    //#endregion parsing request
    
    
    
    //#region validating request
    if (
        (typeof(id)  !== 'string' )
        
        ||
        
        ((visibility !== undefined)                      && ((typeof(visibility)      !== 'string') || !['PUBLISHED', 'DRAFT'].includes(visibility)))
        ||
        ((autoUpdate !== undefined)                      && (typeof(autoUpdate)       !== 'boolean'))
        ||
        ((origin     !== undefined) && (origin !== null) && ((typeof(origin)          !== 'object') || (Object.keys(origin).length !== 3)))
        ||
        ((name       !== undefined)                      && ((typeof(name)            !== 'string') || (name.length < 1)))
        ||
        ((weightStep !== undefined)                      && ((typeof(weightStep)      !== 'number') || !isFinite(weightStep) || (weightStep < 0)))
        ||
        ((eta        !== undefined) && (eta !== null)    && ((typeof(eta)             !== 'object') || (Object.keys(eta).length !== 2)))
        ||
        ((rates      !== undefined)                      && ((Array.isArray(rates)    !== true    ) || (rates.length && rates.some((rate) =>
            (typeof(rate) !== 'object')
            ||
            (Object.keys(rate).length !== 2)
            ||
            ((typeof(rate.start) !== 'number') || !isFinite(rate.start) || (rate.start < 0))
            ||
            ((typeof(rate.rate)  !== 'number') || !isFinite(rate.rate)  || (rate.rate  < 0))
        ))))
        ||
        ((useZones   !== undefined)                      && (typeof(useZones)         !== 'boolean'))
        ||
        ((zonesRaw   !== undefined)                      && ((Array.isArray(zonesRaw) !== true    ) || (zonesRaw.length && zonesRaw.some((zone) =>
            (typeof(zone) !== 'object')
            ||
            (Object.keys(zone).length !== 5)
            ||
            ((typeof(zone.name)  !== 'string') || (zone.name.length < 1))
            ||
            ((zone.eta !== null) && ((typeof(zone.eta) !== 'object') || (Object.keys(zone.eta).length !== 2)))
        ))))
        /* TODO: too complicated - validate use ZOD */
    ) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    //#endregion validating request
    
    
    
    try {
        return await prisma.$transaction(async (prismaTransaction): Promise<Response> => {
            //#region normalize coverageCountry
            const coverageCountries : CoverageCountryDetail[]|undefined = zonesRaw;
            
            const coverageCountryDiff = (coverageCountries === undefined) ? undefined : await (async (): Promise<CoverageCountryDiff> => {
                const coverageCountryOris : CoverageCountryDetail[] = !id ? [] : await prismaTransaction.coverageCountry.findMany({
                    where  : {
                        parentId : id,
                    },
                    select : {
                        id        : true,
                        
                        sort      : true,
                        
                        name      : true,
                        
                        eta       : true,
                        rates     : true,
                        
                        useZones  : true,
                        zones     : {
                            select : {
                                id        : true,
                                
                                sort      : true,
                                
                                name      : true,
                                
                                eta       : true,
                                rates     : true,
                                
                                useZones  : true,
                                zones     : {
                                    select : {
                                        id        : true,
                                        
                                        sort      : true,
                                        
                                        name      : true,
                                        
                                        eta       : true,
                                        rates     : true,
                                        
                                        // updatedAt : true, // not shown to <EditShippingDialog>
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
                        sort: 'asc',
                    },
                });
                return createCoverageCountryDiff(coverageCountries, coverageCountryOris);
            })();
            //#endregion normalize coverageCountry
            
            
            
            //#region validating privileges
            const session = (req as any).session as Session;
            if (!id) {
                if (!session.role?.shipping_c) return Response.json({ error:
`Access denied.

You do not have the privilege to add new shipping.`
                }, { status: 403 }); // handled with error: forbidden
            }
            else {
                if (!session.role?.shipping_ud && ((name !== undefined))) return Response.json({ error:
`Access denied.

You do not have the privilege to modify the shipping name.`
                }, { status: 403 }); // handled with error: forbidden
                
                if (!session.role?.shipping_up && ((autoUpdate !== undefined) || (origin !== undefined) || (weightStep !== undefined) || (eta !== undefined) || (rates !== undefined) || (useZones !== undefined))) return Response.json({ error:
`Access denied.

You do not have the privilege to modify the shipping autoUpdate, origin, weightStep, eta, rates, and/or areas.`
                }, { status: 403 }); // handled with error: forbidden
                
                if (!session.role?.shipping_uv && (visibility !== undefined)) return Response.json({ error:
`Access denied.

You do not have the privilege to modify the shipping visibility.`
                }, { status: 403 }); // handled with error: forbidden
                
                if (coverageCountryDiff !== undefined) {
                    const {
                        coverageCountryOris,
                        
                        coverageCountryDels,
                        coverageCountryAdds,
                        coverageCountryMods,
                    } = coverageCountryDiff;
                    
                    
                    
                    if (
                        !session.role?.shipping_up
                        &&
                        (
                            !!coverageCountryAdds.length
                            ||
                            coverageCountryMods.some(({coverageStateAdds, coverageStateMods}) =>
                                !!coverageStateAdds.length
                                ||
                                coverageStateMods.some(({coverageCityAdds}) =>
                                    !!coverageCityAdds.length
                                )
                            )
                        )
                    ) return Response.json({ error:
`Access denied.

You do not have the privilege to add new shippingProvider area.`
                    }, { status: 403 }); // handled with error: forbidden
                    
                    
                    
                    if (
                        !session.role?.shipping_up
                        &&
                        (
                            !!coverageCountryDels.length
                            ||
                            coverageCountryMods.some(({coverageStateDels, coverageStateMods}) =>
                                !!coverageStateDels.length
                                ||
                                coverageStateMods.some(({coverageCityDels}) =>
                                    !!coverageCityDels.length
                                )
                            )
                        )
                    ) return Response.json({ error:
`Access denied.

You do not have the privilege to delete the shippingProvider area.`
                    }, { status: 403 }); // handled with error: forbidden
                    
                    
                    
                    if (
                        !session.role?.shipping_up
                        &&
                        (
                            !!coverageCountryMods.length
                        )
                    ) return Response.json({ error:
`Access denied.

You do not have the privilege to modify the shippingProvider area.`
                    }, { status: 403 }); // handled with error: forbidden
                    
                    
                    
                    if (
                        !session.role?.shipping_up
                        &&
                        !((): boolean => {
                            // compare the order of coverageCountries|coverageStates:
                            const coverageCountryModIds = coverageCountryMods.map(({id}) => id);
                            const coverageCountryOriIds = coverageCountryOris.map(({id}) => id);
                            if (coverageCountryModIds.length !== coverageCountryOriIds.length) return false; // not_equal
                            for (let coverageCountryIndex = 0; coverageCountryIndex < coverageCountryModIds.length; coverageCountryIndex++) {
                                if (coverageCountryModIds[coverageCountryIndex] !== coverageCountryOriIds[coverageCountryIndex]) return false; // not_equal
                                const currentCoverageCountryMod = coverageCountryMods[coverageCountryIndex];
                                
                                
                                
                                const coverageStateMods   = currentCoverageCountryMod.coverageStateMods;
                                const coverageStateOris   = coverageCountryOris.find(({id}) => (id === currentCoverageCountryMod.id))?.zones ?? [];
                                const coverageStateModIds = coverageStateMods.map(({id}) => id);
                                const coverageStateOriIds = coverageStateOris.map(({id}) => id);
                                if (coverageStateModIds.length !== coverageStateOriIds.length) return false; // not_deep_equal
                                for (let coverageStateIndex = 0; coverageStateIndex < coverageStateModIds.length; coverageStateIndex++) {
                                    if (coverageStateModIds[coverageStateIndex] !== coverageStateOriIds[coverageStateIndex]) return false; // not_deep_equal
                                    const currentCoverageStateMod = coverageStateMods[coverageStateIndex];
                                    
                                    
                                    
                                    const coverageCityMods   = currentCoverageStateMod.coverageCityMods;
                                    const coverageCityOris   = coverageStateOris.find(({id}) => (id === currentCoverageStateMod.id))?.zones ?? [];
                                    const coverageCityModIds = coverageCityMods.map(({id}) => id);
                                    const coverageCityOriIds = coverageCityOris.map(({id}) => id);
                                    if (coverageCityModIds.length !== coverageCityOriIds.length) return false; // not_deep_equal
                                    for (let coverageCityIndex = 0; coverageCityIndex < coverageCityModIds.length; coverageCityIndex++) {
                                        if (coverageCityModIds[coverageCityIndex] !== coverageCityOriIds[coverageCityIndex]) return false; // not_deep_equal
                                    } // for
                                } // for
                            } // for
                            
                            
                            
                            return true; // deep_equal
                        })()
                    ) return Response.json({ error:
`Access denied.

You do not have the privilege to modify the shippingProvider order.`
                    }, { status: 403 }); // handled with error: forbidden
                } // if
            } // if
            //#endregion validating privileges
            
            
            
            //#region save changes
            const data = {
                visibility,
                
                autoUpdate,
                origin,
                
                name,
                
                weightStep,
                eta,
                rates,
                
                useZones,
                zones : (coverageCountryDiff === undefined) ? undefined : {
                    delete : !coverageCountryDiff.coverageCountryDels.length ? undefined : coverageCountryDiff.coverageCountryDels.map((id) => ({
                        // conditions:
                        id : id,
                    })),
                    
                    create : !coverageCountryDiff.coverageCountryAdds.length ? undefined : coverageCountryDiff.coverageCountryAdds.map(({coverageStateAdds, ...restCoverageCountry}) => ({
                        // data:
                        ...restCoverageCountry,
                        
                        // relations:
                        zones : {
                            create : !coverageStateAdds.length ? undefined : coverageStateAdds.map(({coverageCityAdds, ...restCoverageState}) => ({
                                // data:
                                ...restCoverageState,
                                
                                // relations:
                                zones : {
                                    create : coverageCityAdds,
                                },
                            })),
                        },
                    })),
                    
                    update : !coverageCountryDiff.coverageCountryMods.length ? undefined : coverageCountryDiff.coverageCountryMods.map(({id, coverageStateDels, coverageStateAdds, coverageStateMods, ...restCoverageCountry}) => ({
                        where : {
                            // conditions:
                            id : id,
                        },
                        data  : {
                            // data:
                            ...restCoverageCountry,
                            
                            // relations:
                            zones : {
                                delete : !coverageStateDels.length ? undefined : coverageStateDels.map((id) => ({
                                    // conditions:
                                    id : id,
                                })),
                                
                                create : !coverageStateAdds.length ? undefined : coverageStateAdds.map(({coverageCityAdds, ...restCoverageState}) => ({
                                    // data:
                                    ...restCoverageState,
                                    
                                    // relations:
                                    zones : {
                                        create : coverageCityAdds,
                                    },
                                })),
                                
                                update : !coverageStateMods.length ? undefined : coverageStateMods.map(({id, coverageCityDels, coverageCityAdds, coverageCityMods, ...restCoverageState}) => ({
                                    where : {
                                        // conditions:
                                        id: id,
                                    },
                                    data  : {
                                        // data:
                                        ...restCoverageState,
                                        
                                        // relations:
                                        zones : {
                                            delete : !coverageCityDels.length ? undefined : coverageCityDels.map((id) => ({
                                                // conditions:
                                                id : id,
                                            })),
                                            
                                            create : !coverageCityAdds.length ? undefined : coverageCityAdds,
                                            
                                            update : !coverageCityMods.length ? undefined : coverageCityMods.map(({id, ...restCoverageCity}) => ({
                                                where : {
                                                    // conditions:
                                                    id: id,
                                                },
                                                data  : restCoverageCity,
                                            })),
                                        },
                                    },
                                })),
                            },
                        },
                    })),
                },
            } satisfies Prisma.ShippingProviderUpdateInput;
            const shippingDetail : ShippingDetail = (
                !id
                ? await prismaTransaction.shippingProvider.create({
                    data   : data,
                    select : shippingDetailSelect,
                })
                : await prismaTransaction.shippingProvider.update({
                    where  : {
                        id : id,
                    },
                    data   : data,
                    select : shippingDetailSelect,
                })
            );
            
            
            
            return Response.json(shippingDetail); // handled with success
            //#endregion save changes
        });
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
    if (!session.role?.shipping_d) return Response.json({ error:
`Access denied.

You do not have the privilege to delete the shipping.`
    }, { status: 403 }); // handled with error: forbidden
    //#endregion validating privileges
    
    
    
    //#region save changes
    try {
        const deletedShipping : Pick<ShippingDetail, 'id'> = (
            await prisma.shippingProvider.delete({
                where  : {
                    id : id,
                },
                select : {
                    id : true,
                },
            })
        );
        return Response.json(deletedShipping); // handled with success
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        // if (error instanceof RecordNotFound) return Response.json({ error: 'invalid ID' }, { status: 400 }); // handled with error
        return Response.json({ error: error }, { status: 500 }); // handled with error
    } // try
    //#endregion save changes
});
