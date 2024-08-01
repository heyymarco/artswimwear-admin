// next-auth:
import {
    getServerSession,
}                           from 'next-auth'

// next-connect:
import {
    createEdgeRouter,
}                           from 'next-connect'

// models:
import {
    type DefaultShippingOriginDetail,
    
    
    
    // utilities:
    defaultShippingOriginSelect,
}                           from '@/models'

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
    
    
    
    const shippingOrigin : DefaultShippingOriginDetail|null = (
        await prisma.defaultShippingOrigin.findFirst({
            select: defaultShippingOriginSelect,
        }) // get all shippings including the disabled ones
    );
    return Response.json(shippingOrigin); // handled with success
})
.patch(async (req) => {
    if (process.env.SIMULATE_SLOW_NETWORK === 'true') {
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, 2000);
        });
    } // if
    
    
    
    //#region parsing request
    const {
        // identifiers:
        id,
        
        
        
        // data:
        country,
        state,
        city,
    } = await req.json();
    const setToNull = (!country && !state && !city);
    //#endregion parsing request
    
    
    
    //#region validating request
    if (!setToNull) {
        if (
            ((id !== undefined) && (typeof(id)  !== 'string' )) // no id => create new; has id => update|delete existing
            
            ||
            
            !country   || (typeof(country) !== 'string') // todo validate country id
            || !state     || (typeof(state) !== 'string')
            || !city      || (typeof(city) !== 'string')
            /* TODO: too complicated - validate use ZOD */
        ) {
            return Response.json({
                error: 'Invalid data.',
            }, { status: 400 }); // handled with error
        } // if
    } // if
    //#endregion validating request
    
    
    
    try {
        if (setToNull) {
            await prisma.defaultShippingOrigin.deleteMany() // delete all
            return Response.json(null); // handled with success
        }
        else {
            const shippingOrigin : DefaultShippingOriginDetail =  await prisma.defaultShippingOrigin.upsert({
                where  : {
                    id : id,
                    OR : [
                        { id: { not: '' } }, // a hack: always match
                    ],
                },
                update : {
                    // data:
                    country,
                    state,
                    city,
                },
                create : {
                    // data:
                    country,
                    state,
                    city,
                },
                select : defaultShippingOriginSelect,
            });
            return Response.json(shippingOrigin); // handled with success
        } // if
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        // if (error instanceof RecordNotFound) return Response.json({ error: 'invalid ID' }, { status: 400 }); // handled with error
        return Response.json({ error: error }, { status: 500 }); // handled with error
    } // try
});
