// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'

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



export async function POST(req: Request, res: Response): Promise<Response> {
    const secretHeader = req.headers.get('X-Secret');
    if (!secretHeader || (secretHeader !== process.env.APP_SECRET)) {
        return Response.json({
            error: 'Unauthorized.',
        }, { status: 401 }); // handled with error: unauthorized
    } // if
    
    
    
    //#region parsing request
    const {
        token,
    } = await req.json();
    //#endregion parsing request
    
    
    
    //#region validating request
    if ((typeof(token) !== 'string') && !token) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    //#endregion validating request
    
    
    
    // find the related paymentConfirmation record:
    const paymentConfirmationData = await prisma.paymentConfirmation.findUnique({
        where  : {
            token : token,
        },
        select : {
            order : {
                select : {
                    orderId : true,
                },
            },
        },
    });
    if (!paymentConfirmationData) {
        return Response.json({
            error: 'Order not found.',
        }, { status: 404 }); // handled with error
    } // if
    
    
    
    await Promise.allSettled([
        // notify to the customer that the paymentConfirmation has been received:
        sendConfirmationEmail(paymentConfirmationData.order.orderId, checkoutConfigServer.customerEmails.confirmed),
        
        // notify to admins that the paymentConfirmation has been received:
        broadcastNotificationEmail(paymentConfirmationData.order.orderId, checkoutConfigServer.adminEmails.confirmed, { notificationType: 'emailOrderConfirmed' }),
    ]);
    
    
    
    // Return OK:
    return Response.json({
        ok: true,
    });
};