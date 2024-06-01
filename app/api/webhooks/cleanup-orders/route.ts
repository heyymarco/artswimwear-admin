// models:
import {
    orderDetailSelect,
    convertOrderDetailDataToOrderDetail,
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
}                           from '../../(protected)/orders/order-utilities'
import {
    sendConfirmationEmail,
}                           from '../../(protected)/orders/email-utilities'

// configs:
import {
    checkoutConfigServer,
}                           from '@/checkout.config.server'



// configs:
export const fetchCache = 'force-no-store';
export const maxDuration = 60; // This function can run for a maximum of 60 seconds



export async function POST(req: Request, res: Response): Promise<Response> {
    const secretHeader = req.headers.get('X-Secret');
    console.log('webhook:cleanup-orders called: ', {secretHeader});
    if (!secretHeader || (secretHeader !== process.env.APP_SECRET)) {
        return Response.json({
            error: 'Unauthorized.',
        }, { status: 401 }); // handled with error: unauthorized
    } // if
    
    
    
    // find expired (Real)Order & cleaning up:
    const expiredOrderDetails = (
        (await prisma.$transaction(async (prismaTransaction) => {
            const now = new Date();
            const expiredOrders = await prismaTransaction.order.findMany({
                where  : {
                    orderStatus : {
                        notIn : ['EXPIRED', 'CANCELED'],
                    },
                    payment : {
                        // expiresAt : { lte }
                        is : {
                            expiresAt : { lt: now },
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
                            order             : expiredOrder,
                            isExpired         : true,
                            
                            orderSelect       : orderDetailSelect,
                        })
                    ),
                ))
                .filter((result): result is Exclude<typeof result, PromiseRejectedResult> => (result.status === 'fulfilled'))
                .map((succeededResult) => succeededResult.value)
            );
        }, { timeout: 30000 }))
        .map(convertOrderDetailDataToOrderDetail)
    );
    
    //#region send email confirmation
    await Promise.allSettled(
        expiredOrderDetails
        .map((expiredOrderDetail) =>
            // notify that the order has been expired:
            sendConfirmationEmail(expiredOrderDetail.orderId, checkoutConfigServer.emails.expired)
        )
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
    });
    
    
    
    // Return OK:
    return Response.json({
        ok: true,
    });
};