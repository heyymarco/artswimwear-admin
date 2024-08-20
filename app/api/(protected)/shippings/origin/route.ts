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
    type Prisma,
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
.get(async (req) => {
    //#region validating privileges
    const session = (req as any).session as Session;
    if (!session.role?.shipping_r) return Response.json({ error:
`Access denied.

You do not have the privilege to view the shippings.`
    }, { status: 403 }); // handled with error: forbidden
    //#endregion validating privileges
    
    
    
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
        zip,
        address,
        
        company,
        firstName,
        lastName,
        phone,
    } = await req.json();
    const setToNull = (
        ((country   === undefined) || (country   === ''))
        &&
        ((state     === undefined) || (state     === ''))
        &&
        ((city      === undefined) || (city      === ''))
        &&
        ((zip       === undefined) || (zip       === ''))
        &&
        ((address   === undefined) || (address   === ''))
        
        &&
        
        ((company   === undefined) || (company   === ''))
        &&
        ((firstName === undefined) || (firstName === ''))
        &&
        ((lastName  === undefined) || (lastName  === ''))
        &&
        ((phone     === undefined) || (phone     === ''))
    );
    //#endregion parsing request
    
    
    
    //#region validating privileges
    const session = (req as any).session as Session;
    if (!session.role?.shipping_up) return Response.json({ error:
`Access denied.

You do not have the privilege to modify the shipping origin.`
    }, { status: 403 }); // handled with error: forbidden
    //#endregion validating privileges
    
    
    
    //#region validating request
    if (!setToNull) {
        if (
            ((id !== undefined) && (typeof(id)  !== 'string' )) // no id => create new; has id => update|delete existing
            
            ||
            
               !country                       || (typeof(country) !== 'string') // todo validate country id
            || !state                         || (typeof(state) !== 'string')
            || !city                          || (typeof(city) !== 'string')
            || (!zip && ((zip ?? '') !== '')) || (typeof(zip ?? '') !== 'string')
            || !address                       || (typeof(address) !== 'string')
            
            || !company                       || (typeof(company) !== 'string')
            || !firstName                     || (typeof(firstName) !== 'string')
            || !lastName                      || (typeof(lastName) !== 'string')
            || !phone                         || (typeof(phone) !== 'string')
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
            const shippingData = {
                    // data:
                    country,
                    state,
                    city,
                    zip,
                    address,
                    
                    company,
                    firstName,
                    lastName,
                    phone,
            } satisfies Prisma.DefaultShippingOriginUpdateInput;
            const shippingOrigin : DefaultShippingOriginDetail =  await prisma.defaultShippingOrigin.upsert({
                where  : {
                    id : id,
                    OR : [
                        { id: { not: '' } }, // a hack: always match
                    ],
                },
                update : shippingData,
                create : shippingData,
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
