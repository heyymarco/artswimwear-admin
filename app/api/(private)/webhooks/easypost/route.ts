// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'

// internals:
import {
    sendConfirmationEmail,
    NotificationType,
    broadcastNotificationEmail,
}                           from '@/libs/email-utilities'

// utilities:
import {
    validateWebhook,
}                           from './utils'

// easypost:
import {
    type Tracker,
}                           from '@easypost/api'

// configs:
import {
    checkoutConfigServer,
}                           from '@/checkout.config.server'



// configs:
export const fetchCache = 'force-no-store';
export const maxDuration = 7; // You must respond within 7 seconds. If no response is sent back, the webhook Event will be considered a failure and it will be sent again.



export async function POST(req: Request, res: Response): Promise<Response> {
    const signature = req.headers.get('X-Hmac-Signature') ?? req.headers.get('x-hmac-signature');
    const bodyArrayBuffer : ArrayBuffer = await (new Response(req.body)).arrayBuffer();
    const bodyBuffer      : Buffer      = Buffer.from(bodyArrayBuffer);
    const event = await validateWebhook(bodyBuffer, signature, process.env.EASYPOST_WEBHOOK_SECRET);
    if (!event) {
        return Response.json({
            error: 'Unauthorized.',
        }, { status: 401 }); // handled with error: unauthorized
    } // if
    
    
    
    switch (event.description) {
        case 'tracker.created':
        case 'tracker.updated': {
            const shippingTracker = event.result as Tracker;
            if (shippingTracker?.object !== 'Tracker') {
                console.log('Error: invalid tracker object: ',  shippingTracker);
                break;
            } // if
            const shippingDetails = (
                (shippingTracker.tracking_details ?? [])
                .map((detail) => ({
                    ...detail,
                    datetime : new Date(detail.datetime),
                }))
            );
            shippingDetails.sort((a, b) => (a.datetime.valueOf() - b.datetime.valueOf()))
            if (!shippingDetails.length) break; // ignore empty shippingDetails
            
            
            
            const relatedOrder = await prisma.shipment.update({
                where  : {
                    // data:
                    trackerId : shippingTracker.id,
                },
                data   : {
                    // data:
                    logs : {
                        deleteMany : {
                            // do DELETE ALL related log(s)
                            // no condition is needed because we want to delete all related log(s)
                        },
                        create     : shippingDetails.map((shippingDetail) => ({
                            reportedAt : shippingDetail.datetime,
                            log        : shippingDetail.message || shippingDetail.status,
                        })),
                    },
                },
                select : {
                    // relations:
                    parent : {
                        select : {
                            // records:
                            id          : true,
                            
                            // data:
                            orderStatus : true,
                        },
                    },
                },
            });
            
            
            
            const isDelivered = shippingTracker?.status === 'delivered';
            if (isDelivered && (relatedOrder?.parent?.orderStatus === 'ON_THE_WAY')) {
                await Promise.all([
                    prisma.order.update({
                        where  : {
                            // records:
                            id : relatedOrder.parent.id,
                        },
                        data   : {
                            // data:
                            orderStatus : 'COMPLETED',
                        },
                        select : {
                            // records:
                            id : true,
                        },
                    }),
                    
                    
                    
                    sendConfirmationEmail(relatedOrder.parent.id, checkoutConfigServer.customerEmails.completed),
                    broadcastNotificationEmail(relatedOrder.parent.id, checkoutConfigServer.adminEmails.completed, {
                        notificationType : 'emailOrderCompleted',
                    }),
                ]);
                
                
                
                console.log('now updated as DELIVERED: ', relatedOrder);
            } // if
            if (isDelivered && (relatedOrder.parent.orderStatus === 'COMPLETED')) {
                console.log('already DELIVERED: ', relatedOrder);
            } // IF
            
            
            
            break;
        }
    } // switch
    
    
    
    // Return OK:
    return Response.json({
        ok: true,
    });
};