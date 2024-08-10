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
}                           from '@/libs/email-utilities'

// configs:
import {
    checkoutConfigServer,
}                           from '@/checkout.config.server'



// configs:
export const fetchCache = 'force-no-store';
export const maxDuration = 60; // this function can run for a maximum of 60 seconds for many & complex transactions



export async function POST(req: Request, res: Response): Promise<Response> {
    const secretHeader = req.headers.get('X-Secret');
    if (!secretHeader || (secretHeader !== process.env.APP_SECRET)) {
        return Response.json({
            error: 'Unauthorized.',
        }, { status: 401 }); // handled with error: unauthorized
    } // if
    
    
    
    // find expired (Real)Order & cleaning up:
    const expiredOrderDatas = (
        (await prisma.$transaction(async (prismaTransaction) => {
            const now = new Date();
            const expiredOrders = await prismaTransaction.order.findMany({
                where  : {
                    orderStatus       : 'NEW_ORDER', // only new_order can be 'EXPIRED', ignore prcessed orders
                    payment : {
                        is : {
                            type      : 'MANUAL',    // only manual_payment can be 'EXPIRED'
                            expiresAt : { lt: now }, // only payment_with_expires can be 'EXPIRED'
                        },
                    },
                },
                select : cancelOrderSelect,
            });
            return (
                (await Promise.allSettled(
                    expiredOrders.map(async (expiredOrder) =>
                        // (Real)Order EXPIRED => restore the `Product` stock and mark Order as 'EXPIRED':
                        cancelOrder(prismaTransaction, {
                            order       : expiredOrder,
                            isExpired   : true,
                            
                            orderSelect : {
                                orderId : true,
                            },
                        })
                    ),
                ))
                .filter((result): result is Exclude<typeof result, PromiseRejectedResult> => (result.status !== 'rejected'))
                .map((succeededResult) => succeededResult.value)
            );
        }, { timeout: 50000 })) // give a longer timeout for `cancelOrder`(s)
    );
    
    
    
    //#region send email confirmation
    await Promise.allSettled(
        expiredOrderDatas
        .flatMap(({orderId}) => [
            // notify to the customer that the order has been expired:
            sendConfirmationEmail(orderId, checkoutConfigServer.customerEmails.expired),
            
            // notify to admins that the order has been expired:
            broadcastNotificationEmail(orderId, checkoutConfigServer.adminEmails.expired, { notificationType: 'emailOrderExpired' }),
        ])
    );
    //#endregion send email confirmation
    
    
    
    // find expired DraftOrder & cleaning up:
    await prisma.$transaction(async (prismaTransaction): Promise<void> => {
        const now = new Date();
        const expiredDraftOrders = await prismaTransaction.draftOrder.findMany({
            where  : {
                expiresAt : { lt: now },
            },
            select : revertDraftOrderSelect,
        });
        await Promise.allSettled(
            expiredDraftOrders.map(async (expiredDraftOrder) =>
                // DraftOrder EXPIRED => restore the `Product` stock and mark DraftOrder as 'EXPIRED':
                revertDraftOrder(prismaTransaction, {
                    draftOrder        : expiredDraftOrder,
                })
            ),
        );
    }, { timeout: 50000 }); // give a longer timeout for `revertDraftOrder`(s)
    
    
    
    // Return OK:
    return Response.json({
        ok: true,
    });
};