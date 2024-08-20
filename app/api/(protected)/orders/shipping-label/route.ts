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
}                           from '@/app/api/auth/[...nextauth]/route'

// models:
import {
    type ShippingLabelRequest,
    type ShippingLabelDetail,
}                           from '@/models'

// easypost:
import {
    getShippingLabels,
}                           from '@/libs/shippings/processors/easypost/labels'



// configs:
export const dynamic    = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const maxDuration = 20; // this function can run for a maximum of 20 seconds for complex transactions



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
.post(async (req) => {
    //#region parsing request
    const {
        // data:
        originAddress,
        shippingAddress,
        totalProductWeight,
    } = await req.json();
    //#endregion parsing request
    
    
    
    //#region validating request
    //#region validate origin address
    if (
           !originAddress.country                                     || (typeof(originAddress.country) !== 'string') // todo validate country id
        || !originAddress.state                                       || (typeof(originAddress.state) !== 'string')
        || !originAddress.city                                        || (typeof(originAddress.city) !== 'string')
        || (!originAddress.zip && ((originAddress.zip ?? '') !== '')) || (typeof(originAddress.zip ?? '') !== 'string')
        || !originAddress.address                                     || (typeof(originAddress.address) !== 'string')
        
        || !originAddress.company                                     || (typeof(originAddress.company) !== 'string')
        || !originAddress.firstName                                   || (typeof(originAddress.firstName) !== 'string')
        || !originAddress.lastName                                    || (typeof(originAddress.lastName) !== 'string')
        || !originAddress.phone                                       || (typeof(originAddress.phone) !== 'string')
        /* TODO: too complicated - validate use ZOD */
    ) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    //#endregion validate origin address
    
    //#region validate shipping address
    if (
           !shippingAddress.country                                       || (typeof(shippingAddress.country) !== 'string') // todo validate country id
        || !shippingAddress.state                                         || (typeof(shippingAddress.state) !== 'string')
        || !shippingAddress.city                                          || (typeof(shippingAddress.city) !== 'string')
        || (!shippingAddress.zip && ((shippingAddress.zip ?? '') !== '')) || (typeof(shippingAddress.zip ?? '') !== 'string')
        || !shippingAddress.address                                       || (typeof(shippingAddress.address) !== 'string')
        
        || !shippingAddress.firstName                                     || (typeof(shippingAddress.firstName) !== 'string')
        || !shippingAddress.lastName                                      || (typeof(shippingAddress.lastName) !== 'string')
        || !shippingAddress.phone                                         || (typeof(shippingAddress.phone) !== 'string')
        /* TODO: too complicated - validate use ZOD */
    ) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    //#endregion validate shipping address
    
    if (
        ((totalProductWeight !== undefined) && (totalProductWeight !== null) && ((typeof(totalProductWeight) !== 'number') || !isFinite(totalProductWeight) || (totalProductWeight < 0)))
    ) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    //#endregion validating request
    
    
    
    const shippingLabels = await getShippingLabels({
        // data:
        originAddress,
        shippingAddress,
        totalProductWeight,
    });
    return Response.json(shippingLabels); // handled with success
});
