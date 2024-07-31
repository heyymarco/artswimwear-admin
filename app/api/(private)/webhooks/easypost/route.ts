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

// configs:
import {
    checkoutConfigServer,
}                           from '@/checkout.config.server'



// configs:
export const fetchCache = 'force-no-store';
export const maxDuration = 7; // You must respond within 7 seconds. If no response is sent back, the webhook Event will be considered a failure and it will be sent again.



export async function POST(req: Request, res: Response): Promise<Response> {
    // const secretHeader = req.headers.get('X-Secret');
    // if (!secretHeader || (secretHeader !== process.env.APP_SECRET)) {
    //     return Response.json({
    //         error: 'Unauthorized.',
    //     }, { status: 401 }); // handled with error: unauthorized
    // } // if
    
    console.log('easypost webhook: ', {
        headers : Array.from(req.headers).map(([key, value]) => ({ key, value })),
        body : await req.json(),
    });
    
    // Return OK:
    return Response.json({
        ok: true,
    });
};