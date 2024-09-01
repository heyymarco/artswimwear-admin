// next-auth:
import {
    getServerSession,
}                           from 'next-auth'

// next-connect:
import {
    createEdgeRouter,
}                           from 'next-connect'

// internal auth:
import {
    authOptions,
}                           from '@/libs/auth.server'

// others:
import {
    State,
}                           from 'country-state-city'



// configs:
export const dynamic    = 'force-dynamic';
export const fetchCache = 'force-cache';
export const revalidate = 1 * 24 * 3600;



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
    /* required for displaying states in a specified country */
    
    
    
    //#region parsing request
    const {
        countryCode,
    } = Object.fromEntries(new URL(req.url, 'https://localhost/').searchParams.entries());
    //#endregion parsing request
    
    
    
    //#region validating request
    if (
        (((typeof(countryCode) !== 'string') || (countryCode.length !== 2)))
    ) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    //#endregion validating request
    
    
    
    const states : Array<string> = (
        State.getStatesOfCountry(countryCode)
        .map(({name}) => name)
    );
    return Response.json(states); // handled with success
});
