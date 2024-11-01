// internals:
import {
    sendConfirmationEmail,
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
    
    
    
    await Promise.allSettled([
        // notify to the customer that the order has been expired:
        sendConfirmationEmail(orderId, checkoutConfigServer.customerEmails.expired),
        
        // notify to admins that the order has been expired:
        broadcastNotificationEmail(orderId, checkoutConfigServer.adminEmails.expired, { notificationType: 'emailOrderExpired' }),
    ]);
    
    
    
    // Return OK:
    return Response.json({
        ok: true,
    });
};