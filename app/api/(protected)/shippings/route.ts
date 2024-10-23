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
    type Pagination,
    type ShippingPreview,
    type ShippingDetail,
    type CoverageCountryDetail,
    type CoverageCountryDiff,
    
    
    
    // schemas:
    PaginationArgSchema,
    
    
    
    // utilities:
    shippingPreviewSelect,
    shippingDetailSelect,
    
    selectId,
    selectWithSort,
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
}                           from '@/libs/auth.server'



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
            skip    : page * perPage, // note: not scaleable but works in small commerce app -- will be fixed in the future
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
                        
                        eta       : {
                            select : {
                                // data:
                                min : true,
                                max : true,
                            },
                        },
                        rates     : {
                            select : {
                                // data:
                                start : true,
                                rate  : true,
                            },
                        },
                        
                        useZones  : true,
                        zones     : {
                            select : {
                                id        : true,
                                
                                sort      : true,
                                
                                name      : true,
                                
                                eta       : {
                                    select : {
                                        // data:
                                        min : true,
                                        max : true,
                                    },
                                },
                                rates     : {
                                    select : {
                                        // data:
                                        start : true,
                                        rate  : true,
                                    },
                                },
                                
                                useZones  : true,
                                zones     : {
                                    select : {
                                        id        : true,
                                        
                                        sort      : true,
                                        
                                        name      : true,
                                        
                                        eta       : {
                                            select : {
                                                // data:
                                                min : true,
                                                max : true,
                                            },
                                        },
                                        rates     : {
                                            select : {
                                                // data:
                                                start : true,
                                                rate  : true,
                                            },
                                        },
                                        
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
                
                if (!session.role?.shipping_up && ((autoUpdate !== undefined) || (weightStep !== undefined) || (eta !== undefined) || (rates !== undefined) || (useZones !== undefined))) return Response.json({ error:
`Access denied.

You do not have the privilege to modify the shipping autoUpdate, weightStep, eta, rates, and/or areas.`
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
                        !session.role?.shipping_c
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

You do not have the privilege to add new shipping area.`
                    }, { status: 403 }); // handled with error: forbidden
                    
                    
                    
                    if (
                        !session.role?.shipping_d
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

You do not have the privilege to delete the shipping area.`
                    }, { status: 403 }); // handled with error: forbidden
                    
                    
                    
                    if (
                        !session.role?.shipping_ud
                        &&
                        coverageCountryMods
                        .some(({id, name, eta, coverageStateMods}) => {
                            const coverageCountryOri = coverageCountryOris.find(({id: idOri}) => (idOri === id));
                            return (
                                (name !== coverageCountryOri?.name)
                                ||
                                ((!!eta !== !!coverageCountryOri.eta) || (eta?.min !== coverageCountryOri.eta?.min) || (eta?.max !== coverageCountryOri.eta?.max))
                                ||
                                coverageStateMods
                                .some(({id, name, eta, coverageCityMods}) => {
                                    const coverageStateOri = coverageCountryOri.zones.find(({id: idOri}) => (idOri === id));
                                    return (
                                        (name !== coverageStateOri?.name)
                                        ||
                                        ((!!eta !== !!coverageStateOri.eta) || (eta?.min !== coverageStateOri.eta?.min) || (eta?.max !== coverageStateOri.eta?.max))
                                        ||
                                        coverageCityMods
                                        .some(({id, name, eta}) => {
                                            const coverageCityOri = coverageStateOri.zones.find(({id: idOri}) => (idOri === id));
                                            return (
                                                (name !== coverageCityOri?.name)
                                                ||
                                                ((!!eta !== !!coverageCityOri.eta) || (eta?.min !== coverageCityOri.eta?.min) || (eta?.max !== coverageCityOri.eta?.max))
                                            );
                                        })
                                    );
                                })
                            );
                        })
                    ) return Response.json({ error:
`Access denied.

You do not have the privilege to modify the shipping name and/or shipping eta.`
                    }, { status: 403 }); // handled with error: forbidden
                    
                    
                    
                    if (
                        !session.role?.shipping_up
                        &&
                        coverageCountryMods
                        .some(({id, useZones, rates, coverageStateMods}) => {
                            const coverageCountryOri = coverageCountryOris.find(({id: idOri}) => (idOri === id));
                            return (
                                (useZones !== coverageCountryOri?.useZones)
                                ||
                                ((rates?.length !== coverageCountryOri?.rates.length) || !((): boolean => {
                                    const compareRates = coverageCountryOri.rates;
                                    for (let rateIndex = 0; rateIndex < rates.length; rateIndex++) {
                                        if (rates[rateIndex].start !== compareRates[rateIndex].start) return false; // not_equal
                                        if (rates[rateIndex].rate  !== compareRates[rateIndex].rate ) return false; // not_equal
                                    } // for
                                    return true; // deep_equal
                                })())
                                ||
                                coverageStateMods
                                .some(({id, useZones, rates, coverageCityMods}) => {
                                    const coverageStateOri = coverageCountryOri.zones.find(({id: idOri}) => (idOri === id));
                                    return (
                                        (useZones !== coverageStateOri?.useZones)
                                        ||
                                        ((rates?.length !== coverageStateOri?.rates.length) || !((): boolean => {
                                            const compareRates = coverageStateOri.rates;
                                            for (let rateIndex = 0; rateIndex < rates.length; rateIndex++) {
                                                if (rates[rateIndex].start !== compareRates[rateIndex].start) return false; // not_equal
                                                if (rates[rateIndex].rate  !== compareRates[rateIndex].rate ) return false; // not_equal
                                            } // for
                                            return true; // deep_equal
                                        })())
                                        ||
                                        coverageCityMods
                                        .some(({id, rates}) => {
                                            const coverageCityOri = coverageStateOri.zones.find(({id: idOri}) => (idOri === id));
                                            return (
                                                ((rates?.length !== coverageCityOri?.rates.length) || !((): boolean => {
                                                    const compareRates = coverageCityOri.rates;
                                                    for (let rateIndex = 0; rateIndex < rates.length; rateIndex++) {
                                                        if (rates[rateIndex].start !== compareRates[rateIndex].start) return false; // not_equal
                                                        if (rates[rateIndex].rate  !== compareRates[rateIndex].rate ) return false; // not_equal
                                                    } // for
                                                    return true; // deep_equal
                                                })())
                                            );
                                        })
                                    );
                                })
                            );
                        })
                    ) return Response.json({ error:
`Access denied.

You do not have the privilege to modify the shipping rates and/or shipping zones.`
                    }, { status: 403 }); // handled with error: forbidden
                    
                    
                    
                    if (
                        !session.role?.shipping_ud
                        &&
                        !((): boolean => {
                            // compare the order of coverageCountries|coverageStates:
                            const coverageCountryModIds = coverageCountryMods.map(selectId);
                            const coverageCountryOriIds = coverageCountryOris.map(selectId);
                            if (coverageCountryModIds.length !== coverageCountryOriIds.length) return false; // not_equal
                            for (let coverageCountryIndex = 0; coverageCountryIndex < coverageCountryModIds.length; coverageCountryIndex++) {
                                if (coverageCountryModIds[coverageCountryIndex] !== coverageCountryOriIds[coverageCountryIndex]) return false; // not_equal
                                const {
                                    coverageStateOris,
                                    coverageStateMods,
                                } = coverageCountryMods[coverageCountryIndex];
                                
                                
                                
                                const coverageStateModIds = coverageStateMods.map(selectId);
                                const coverageStateOriIds = coverageStateOris.map(selectId);
                                if (coverageStateModIds.length !== coverageStateOriIds.length) return false; // not_deep_equal
                                for (let coverageStateIndex = 0; coverageStateIndex < coverageStateModIds.length; coverageStateIndex++) {
                                    if (coverageStateModIds[coverageStateIndex] !== coverageStateOriIds[coverageStateIndex]) return false; // not_deep_equal
                                    const {
                                        coverageCityOris,
                                        coverageCityMods,
                                    } = coverageStateMods[coverageStateIndex];
                                    
                                    
                                    
                                    const coverageCityModIds = coverageCityMods.map(selectId);
                                    const coverageCityOriIds = coverageCityOris.map(selectId);
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

You do not have the privilege to modify the shipping order.`
                    }, { status: 403 }); // handled with error: forbidden
                } // if
            } // if
            //#endregion validating privileges
            
            
            
            //#region save changes
            // a workaround for conditional nested_delete:
            const oldData = await prismaTransaction.shippingProvider.findFirst({
                where  : {
                    id : id,
                },
                select : {
                    eta    : {
                        select : {
                            id : true,
                        },
                    },
                },
            });
            const hasEta = oldData?.eta?.id    !== undefined;
            
            const now = new Date();
            const isCreate = !id;
            const shippingProviderData = {
                visibility,
                
                autoUpdate,
                
                name,
                
                weightStep,
                eta : (eta === undefined) /* do NOT modify if undefined */ ? undefined : { // compound_like relation
                    // nested_delete if set to null:
                    delete : ((eta !== null) /* do NOT delete if NOT null */ || isCreate /* do NOT delete if `create` ShippingProvider */ || !hasEta /* do NOT delete if NOTHING to delete */) ? undefined : {
                        // do DELETE
                        // no condition needed because one to one relation
                    },
                    
                    // one_conditional nested_update if create (isCreate === true):
                    create : ((eta === null) /* do NOT update if null */ || !isCreate /* do NOT one_conditional if `update` ShippingProvider */) ? undefined : eta,
                    
                    // two_conditional nested_update if update (isCreate === false):
                    upsert : ((eta === null) /* do NOT update if null */ ||  isCreate /* do NOT two_conditional if `create` ShippingProvider */) ? undefined : {
                        update : eta, // prefer   to `update` if already exist
                        create : eta, // fallback to `create` if not     exist
                    },
                },
                rates      : (rates === undefined) /* do NOT modify if undefined */ ? undefined : { // array_like relation
                    // clear the existing item(s), if any:
                    deleteMany : isCreate ? undefined /* nothing to delete if `create` */ : {
                        // do DELETE ALL related item(s)
                        // no condition is needed because we want to delete all related item(s)
                    },
                    
                    // create all item(s) with sequential order:
                    create : !rates.length /* do NOT update if empty */ ? undefined : rates.map(selectWithSort),
                },
                
                useZones,
                zones /* coverageCountries */ : (coverageCountryDiff === undefined) /* do NOT modify if undefined */ ? undefined : {
                    delete : !coverageCountryDiff.coverageCountryDels.length ? undefined : coverageCountryDiff.coverageCountryDels.map((countryId) => ({
                        // conditions:
                        id : countryId,
                    })),
                    
                    create : !coverageCountryDiff.coverageCountryAdds.length ? undefined : coverageCountryDiff.coverageCountryAdds.map(({coverageStateAdds, eta, rates, ...restCoverageCountry}) => ({
                        // data:
                        ...restCoverageCountry,
                        
                        eta   : (eta === null) /* do NOT create if null */ ? undefined : { // compound_like relation
                            // one_conditional nested_update if create:
                            create : eta,
                        },
                        rates : !rates.length /* do NOT create if empty */ ? undefined : { // array_like relation
                            // create all item(s) with sequential order:
                            create : rates.map(selectWithSort),
                        },
                        
                        // relations:
                        zones /* coverageStates */ : {
                            create : !coverageStateAdds.length ? undefined : coverageStateAdds.map(({coverageCityAdds, eta, rates, ...restCoverageState}) => ({
                                // data:
                                ...restCoverageState,
                                
                                eta   : (eta === null) /* do NOT create if null */ ? undefined : { // compound_like relation
                                    // one_conditional nested_update if create:
                                    create : eta,
                                },
                                rates : !rates.length /* do NOT create if empty */ ? undefined : { // array_like relation
                                    // create all item(s) with sequential order:
                                    create : rates.map(selectWithSort),
                                },
                                
                                // relations:
                                zones /* coverageCities */ : {
                                    create : !coverageCityAdds.length ? undefined : coverageCityAdds.map(({eta, rates, ...restcoverageCity}) => ({
                                        // data:
                                        ...restcoverageCity,
                                        
                                        updatedAt : now, // if has any_updatedAt_date => overwrite to `now`
                                        
                                        eta   : (eta === null) /* do NOT create if null */ ? undefined : { // compound_like relation
                                            // one_conditional nested_update if create:
                                            create : eta,
                                        },
                                        rates : !rates.length /* do NOT create if empty */ ? undefined : { // array_like relation
                                            // create all item(s) with sequential order:
                                            create : rates.map(selectWithSort),
                                        },
                                    })),
                                },
                            })),
                        },
                    })),
                    
                    update : !coverageCountryDiff.coverageCountryMods.length ? undefined : coverageCountryDiff.coverageCountryMods.map(({id: countryId, coverageStateOris, coverageStateDels, coverageStateAdds, coverageStateMods, eta, rates, ...restCoverageCountry}) => ({
                        where : {
                            // conditions:
                            id : countryId,
                        },
                        data  : {
                            // data:
                            ...restCoverageCountry,
                            
                            eta   : { // compound_like relation
                                // nested_delete if set to null:
                                delete : ((eta !== null) /* do NOT delete if NOT null */ || ((coverageCountryDiff.coverageCountryOris.find(({id: findId}) => (findId === countryId))?.eta ?? undefined) === undefined) /* do NOT delete if NOTHING to delete */) ? undefined : {
                                    // do DELETE
                                    // no condition needed because one to one relation
                                },
                                
                                // two_conditional nested_update if update:
                                upsert : (eta === null) /* do NOT update if null */ ? undefined : {
                                    update : eta, // prefer   to `update` if already exist
                                    create : eta, // fallback to `create` if not     exist
                                },
                            },
                            rates : { // array_like relation
                                // clear the existing item(s), if any:
                                deleteMany : {
                                    // do DELETE ALL related item(s)
                                    // no condition is needed because we want to delete all related item(s)
                                },
                                
                                // create all item(s) with sequential order:
                                create : !rates.length /* do NOT update if empty */ ? undefined : rates.map(selectWithSort),
                            },
                            
                            // relations:
                            zones /* coverageStates */ : {
                                delete : !coverageStateDels.length ? undefined : coverageStateDels.map((stateId) => ({
                                    // conditions:
                                    id : stateId,
                                })),
                                
                                create : !coverageStateAdds.length ? undefined : coverageStateAdds.map(({coverageCityAdds, eta, rates, ...restCoverageState}) => ({
                                    // data:
                                    ...restCoverageState,
                                    
                                    eta   : (eta === null) /* do NOT create if null */ ? undefined : { // compound_like relation
                                        // one_conditional nested_update if create:
                                        create : eta,
                                    },
                                    rates : !rates.length /* do NOT create if empty */ ? undefined : { // array_like relation
                                        // create all item(s) with sequential order:
                                        create : rates.map(selectWithSort),
                                    },
                                    
                                    // relations:
                                    zones /* coverageCities */ : {
                                        create : !coverageCityAdds.length ? undefined : coverageCityAdds.map(({eta, rates, ...restcoverageCity}) => ({
                                            // data:
                                            ...restcoverageCity,
                                            
                                            updatedAt : now, // if has any_updatedAt_date => overwrite to `now`
                                            
                                            eta   : (eta === null) /* do NOT create if null */ ? undefined : { // compound_like relation
                                                // one_conditional nested_update if create:
                                                create : eta,
                                            },
                                            rates : !rates.length /* do NOT create if empty */ ? undefined : { // array_like relation
                                                // create all item(s) with sequential order:
                                                create : rates.map(selectWithSort),
                                            },
                                        })),
                                    },
                                })),
                                
                                update : !coverageStateMods.length ? undefined : coverageStateMods.map(({id: stateId, coverageCityOris, coverageCityDels, coverageCityAdds, coverageCityMods, eta, rates, ...restCoverageState}) => ({
                                    where : {
                                        // conditions:
                                        id: stateId,
                                    },
                                    data  : {
                                        // data:
                                        ...restCoverageState,
                                        
                                        eta   : { // compound_like relation
                                            // nested_delete if set to null:
                                            delete : ((eta !== null) /* do NOT delete if NOT null */ || ((coverageStateOris.find(({id: findId}) => (findId === stateId))?.eta ?? undefined) === undefined) /* do NOT delete if NOTHING to delete */) ? undefined : {
                                                // do DELETE
                                                // no condition needed because one to one relation
                                            },
                                            
                                            // two_conditional nested_update if update:
                                            upsert : (eta === null) /* do NOT update if null */ ? undefined : {
                                                update : eta, // prefer   to `update` if already exist
                                                create : eta, // fallback to `create` if not     exist
                                            },
                                        },
                                        rates : { // array_like relation
                                            // clear the existing item(s), if any:
                                            deleteMany : {
                                                // do DELETE ALL related item(s)
                                                // no condition is needed because we want to delete all related item(s)
                                            },
                                            
                                            // create all item(s) with sequential order:
                                            create : !rates.length /* do NOT update if empty */ ? undefined : rates.map(selectWithSort),
                                        },
                                        
                                        // relations:
                                        zones /* coverageCities */ : {
                                            delete : !coverageCityDels.length ? undefined : coverageCityDels.map((cityId) => ({
                                                // conditions:
                                                id : cityId,
                                            })),
                                            
                                            create : !coverageCityAdds.length ? undefined : coverageCityAdds.map(({eta, rates, ...restcoverageCity}) => ({
                                                // data:
                                                ...restcoverageCity,
                                                
                                                updatedAt : now, // if has any_updatedAt_date => overwrite to `now`
                                                
                                                eta   : (eta === null) /* do NOT create if null */ ? undefined : { // compound_like relation
                                                    // one_conditional nested_update if create:
                                                    create : eta,
                                                },
                                                rates : !rates.length /* do NOT create if empty */ ? undefined : { // array_like relation
                                                    // create all item(s) with sequential order:
                                                    create : rates.map(selectWithSort),
                                                },
                                            })),
                                            
                                            update : !coverageCityMods.length ? undefined : coverageCityMods.map(({id: cityId, eta, rates, ...restCoverageCity}) => ({
                                                where : {
                                                    // conditions:
                                                    id: cityId,
                                                },
                                                data  : {
                                                    // data:
                                                    ...restCoverageCity,
                                                    
                                                    updatedAt : !restCoverageCity.updatedAt ? undefined : now, // if has any_updatedAt_date => overwrite to `now`, otherwise undefined
                                                    
                                                    eta   : { // compound_like relation
                                                        // nested_delete if set to null:
                                                        delete : ((eta !== null) /* do NOT delete if NOT null */ || ((coverageCityOris.find(({id: findId}) => (findId === cityId))?.eta ?? undefined) === undefined) /* do NOT delete if NOTHING to delete */) ? undefined : {
                                                            // do DELETE
                                                            // no condition needed because one to one relation
                                                        },
                                                        
                                                        // two_conditional nested_update if update:
                                                        upsert : (eta === null) /* do NOT update if null */ ? undefined : {
                                                            update : eta, // prefer   to `update` if already exist
                                                            create : eta, // fallback to `create` if not     exist
                                                        },
                                                    },
                                                    rates : { // array_like relation
                                                        // clear the existing item(s), if any:
                                                        deleteMany : {
                                                            // do DELETE ALL related item(s)
                                                            // no condition is needed because we want to delete all related item(s)
                                                        },
                                                        
                                                        // create all item(s) with sequential order:
                                                        create : !rates.length /* do NOT update if empty */ ? undefined : rates.map(selectWithSort),
                                                    },
                                                },
                                            })),
                                        },
                                    },
                                })),
                            },
                        },
                    })),
                },
            } satisfies Prisma.ShippingProviderUpsertArgs['create'] & Prisma.ShippingProviderUpsertArgs['update'];
            const shippingDetail : ShippingDetail = (
                isCreate
                ? await prismaTransaction.shippingProvider.create({
                    data   : shippingProviderData,
                    select : shippingDetailSelect,
                })
                : await prismaTransaction.shippingProvider.update({
                    where  : {
                        id : id,
                    },
                    data   : shippingProviderData,
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
