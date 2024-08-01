// models:
import {
    revertDraftOrderSelect,
    cancelOrderSelect,
}                           from '@/models'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'

// internals:
import {
    // utilities:
    revertDraftOrder,
    cancelOrder,
}                           from '../../../(protected)/orders/order-utilities'
import {
    sendConfirmationEmail,
    broadcastNotificationEmail,
}                           from '../../../(protected)/orders/email-utilities'

// utilities:
import {
    validateWebhook,
}                           from './utils'

// configs:
import {
    checkoutConfigServer,
}                           from '@/checkout.config.server'



// configs:
export const fetchCache = 'force-no-store';
export const maxDuration = 7; // You must respond within 7 seconds. If no response is sent back, the webhook Event will be considered a failure and it will be sent again.



export async function POST(req: Request, res: Response): Promise<Response> {
    const signature = req.headers.get('X-Hmac-Signature');
    const bodyString = await (new Response(req.body)).text();
    const event = validateWebhook(bodyString, signature, process.env.EASYPOST_SECRET);
    if (!event) {
        return Response.json({
            error: 'Unauthorized.',
        }, { status: 401 }); // handled with error: unauthorized
    } // if
    
    console.log('easypost webhook: ', event);
    
    // Return OK:
    return Response.json({
        ok: true,
    });
};