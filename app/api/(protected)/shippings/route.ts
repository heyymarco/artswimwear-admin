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
    
    
    
    shippingPreviewSelect,
    shippingDetailSelect,
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
        
        name,
        
        weightStep,
        eta,
        shippingRates,
        
        useZones,
        zones,
    } = await req.json();
    //#endregion parsing request
    
    
    
    //#region validating request
    if (
        (typeof(id)       !== 'string' )
        
        ||
        
        ((visibility      !== undefined)                   && ((typeof(visibility)           !== 'string') || !['PUBLISHED', 'DRAFT'].includes(visibility)))
        ||
        ((name            !== undefined)                   && ((typeof(name)                 !== 'string') || (name.length     < 1)))
        ||
        ((weightStep      !== undefined)                   && ((typeof(weightStep)           !== 'number') || !isFinite(weightStep) || (weightStep < 0)))
        ||
        ((eta             !== undefined) && (eta !== null) && ((typeof(eta)                  !== 'string') || (eta.length < 1)))
        ||
        ((shippingRates   !== undefined)                   && ((Array.isArray(shippingRates) !== true    ) || (shippingRates.length && shippingRates.some((shippingRate) =>
            (typeof(shippingRate) !== 'object')
            ||
            (Object.keys(shippingRate).length !== 2)
            ||
            ((typeof(shippingRate.startingWeight) !== 'number') || !isFinite(shippingRate.startingWeight) || (shippingRate.startingWeight < 0))
            ||
            ((typeof(shippingRate.rate)           !== 'number') || !isFinite(shippingRate.rate)           || (shippingRate.rate           < 0))
        ))))
        ||
        ((useZones        !== undefined)                   && (typeof(useZones)        !== 'boolean'))
        ||
        ((zones           !== undefined)                   && ((Array.isArray(zones)   !== true    ) || (zones.length && zones.some((zone) =>
            (typeof(zone) !== 'object')
            ||
            (Object.keys(zone).length !== 5)
            ||
            ((typeof(zone.name)  !== 'string') || (zone.name.length < 1))
            ||
            ((zone.eta !== null) && (typeof(zone.eta) !== 'string') || (zone.eta.length < 1))
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
                
                if (!session.role?.shipping_up && ((weightStep !== undefined) || (eta !== undefined) || (shippingRates !== undefined) || (useZones !== undefined) || (zones !== undefined))) return Response.json({ error:
`Access denied.

You do not have the privilege to modify the shipping weightStep, eta, shippingRates, and/or areas.`
                }, { status: 403 }); // handled with error: forbidden
                
                if (!session.role?.shipping_uv && (visibility !== undefined)) return Response.json({ error:
`Access denied.

You do not have the privilege to modify the shipping visibility.`
                }, { status: 403 }); // handled with error: forbidden
            } // if
            //#endregion validating privileges
            
            
            
            //#region save changes
            const data = {
                visibility,
                
                name,
                
                weightStep,
                eta,
                shippingRates,
                
                useZones,
                zones,
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
