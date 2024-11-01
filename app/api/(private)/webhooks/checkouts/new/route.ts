// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'

// internals:
import {
    broadcastNotificationEmail,
}                           from '@/libs/email-utilities'

// configs:
import {
    checkoutConfigServer,
}                           from '@/checkout.config.server'



// configs:
export const fetchCache = 'force-no-store';
export const maxDuration = 20; // this function can run for a maximum of 20 seconds for complex transactions



export async function POST(req: Request): Promise<Response> {
    const secretHeader = req.headers.get('X-Secret');
    if (!secretHeader || (secretHeader !== process.env.APP_SECRET)) {
        return Response.json({
            error: 'Unauthorized.',
        }, { status: 401 }); // handled with error: unauthorized
    } // if
    
    
    
    //#region parsing request
    const {
        orderId,
    } = await req.json();
    //#endregion parsing request
    
    
    
    //#region validating request
    if ((typeof(orderId) !== 'string') && !orderId) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    //#endregion validating request
    
    
    
    // find the related order record:
    const orderData = await prisma.order.findUnique({
        where  : {
            orderId : orderId,
        },
        select : {
            orderStatus  : true,
            payment      : {
                select   : {
                    type : true,
                },
            },
        },
    });
    if (!orderData) {
        return Response.json({
            error: 'Order not found.',
        }, { status: 404 }); // handled with error
    } // if
    
    
    
    const isCanceled          = (orderData.orderStatus === 'CANCELED');
    const isExpired           = (orderData.orderStatus === 'EXPIRED');
    const isCanceledOrExpired = isCanceled || isExpired;
    const isPaid              = !isCanceledOrExpired && (!!orderData.payment && orderData.payment.type !== 'MANUAL');
    
    
    
    await Promise.allSettled([
        // already done in storeApp:
        // // notify to the customer that a new order comes in:
        // sendConfirmationEmail(orderId, checkoutConfigServer.customerEmails.checkout),
        
        // notify to admins that a new order comes in:
        broadcastNotificationEmail(orderId, checkoutConfigServer.adminEmails.checkout, { notificationType: isPaid ? 'emailOrderNewPaid' : 'emailOrderNewPending' }),
    ]);
    
    
    
    // Return OK:
    return Response.json({
        ok: true,
    });
};