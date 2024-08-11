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
    type ShipmentDetail,
    
    
    
    shipmentDetailSelect,
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
import {
    checkoutConfigServer,
}                           from '@/checkout.config.server'



// configs:
export const dynamic    = 'force-dynamic';
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
    // handler as POST,
    // handler as PUT,
    // handler as PATCH,
    // handler as DELETE,
    // handler as HEAD,
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
    //#region parsing request
    const {
        orderId,
    } = Object.fromEntries(new URL(req.url, 'https://localhost/').searchParams.entries());
    //#endregion parsing request
    
    
    
    //#region validating request
    if (!orderId || (typeof(orderId) !== 'string')) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    //#endregion validating request
    
    
    
    //#region validating privileges
    const session = (req as any).session as Session;
    if (!session.role?.order_r) return Response.json({ error:
`Access denied.

You do not have the privilege to view the orders.`
    }, { status: 403 }); // handled with error: forbidden
    //#endregion validating privileges
    
    
    
    const shipmentDetailData = await prisma.shipment.findUnique({
        where  : {
            parentId : orderId,
        },
        select : shipmentDetailSelect,
    });
    if (!shipmentDetailData) {
        return Response.json({
            error: 'Invalid shipping tracking token.',
        }, { status: 400 }); // handled with error
    } // if
    
    // sort the log by reported date:
    const {
        // relations:
        parent : orderData,
        
        
        
        // data:
        ...restShipmentDetail
    } = shipmentDetailData;
    const shipmentDetail : ShipmentDetail = {
        ...restShipmentDetail,
        preferredTimezone : orderData.customer?.preference?.timezone ?? orderData.guest?.preference?.timezone ?? checkoutConfigServer.intl.defaultTimezone,
    };
    shipmentDetail.logs.sort(({reportedAt: a}, {reportedAt: b}) => {
        if ((a === null) || (b === null)) return 0;
        return a.valueOf() - b.valueOf();
    });
    
    return Response.json(shipmentDetail); // handled with success
});
