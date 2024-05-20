// types:
import type {
    // types:
    WysiwygEditorState,
}                           from '@/components/editors/WysiwygEditor/types'

// models:
import type {
    Prisma,
    
    Payment,
    Order,
    OrdersOnProducts,
}                           from '@prisma/client'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'



type CancelOrder = Pick<Order,
    |'id'
    
    |'orderId'
    
    |'orderStatus'
> & {
    payment : Pick<Payment,
        |'type'
    >
    items : Pick<OrdersOnProducts,
        |'productId'
        |'variantIds'
        
        |'quantity'
    >[]
}
export interface CancelOrderData {
    order              : CancelOrder
    isExpired         ?: boolean
    deleteOrder       ?: boolean
    orderSelect       ?: Prisma.OrderSelect
    cancelationReason ?: WysiwygEditorState|null
}
export const cancelOrder = async (prismaTransaction: Parameters<Parameters<typeof prisma.$transaction>[0]>[0], cancelOrderData : CancelOrderData) => {
    // data:
    const {
        order,
        isExpired   = false,
        deleteOrder = false,
        orderSelect = {
            id : true,
        },
        cancelationReason,
    } = cancelOrderData;
    
    
    
    const [updatedOrder] = await Promise.all([
        // update/delete (Real)Order:
        deleteOrder
        ? prismaTransaction.order.delete({
            where  : {
                id : order.id,
            },
            select : orderSelect,
        })
        : prismaTransaction.order.update({
            where  : {
                id : order.id,
            },
            data   : {
                orderStatus       : (isExpired ? 'EXPIRED' : 'CANCELED'),
                cancelationReason : cancelationReason,
            },
            select : orderSelect,
        }),
        
        // revert Stock(s):
        ...(
            (
                // Restore the `Product` stocks IF:
                
                // NOT already marked 'CANCELED'|'EXPIRED':
                !['CANCELED', 'EXPIRED'].includes(order.orderStatus)
                
                &&
                
                // only manual payment is cancelable:
                (order.payment.type === 'MANUAL')
            )
            ? (order.items.map(({productId, variantIds, quantity}) =>
                !productId
                ? undefined
                : prismaTransaction.stock.updateMany({
                    where  : {
                        productId  : productId,
                        value      : { not      : null       },
                        variantIds : { hasEvery : variantIds },
                    },
                    data   : {
                        value : { increment : quantity }
                    },
                })
            ))
            : []
        ),
    ]);
    return updatedOrder;
}

export interface CancelOrderByIdData extends Omit<CancelOrderData, 'order'> {
    id        ?: string|null
    orderId   ?: string|null
    paymentId ?: string|null
}
export const cancelOrderById = async (prismaTransaction: Parameters<Parameters<typeof prisma.$transaction>[0]>[0], cancelOrderByIdData: CancelOrderByIdData) => {
    // data:
    const {
        id        : idRaw,
        orderId   : orderIdRaw,
        paymentId : paymentIdRaw,
        ...restCancelOrderData
    } = cancelOrderByIdData;
    const id        = idRaw        || undefined;
    const orderId   = orderIdRaw   || undefined;
    const paymentId = paymentIdRaw || undefined;
    if (!id && !orderId && !paymentId) return false;
    
    
    
    const requiredSelect = {
        id                     : true,
        
        orderId                : true,
        
        orderStatus            : true,
        
        payment : {
            select : {
                type           : true,
            },
        },
        
        items : {
            select : {
                productId      : true,
                variantIds     : true,
                
                quantity       : true,
            },
        },
    };
    const order = await prismaTransaction.order.findUnique({
        where  : {
            id        : id,
            orderId   : orderId,
            paymentId : paymentId,
            
            // NOT already marked 'CANCELED'|'EXPIRED':
            AND : [
                { orderStatus : { not: 'CANCELED' } },
                { orderStatus : { not: 'EXPIRED'  } },
            ],
            
            // only manual payment is cancelable:
            payment : {
                is : {
                    type : 'MANUAL',
                },
            },
        },
        select : requiredSelect,
    });
    if (!order) return false; // the order is not found -or- the order is already DELETED
    
    
    
    // order CANCELED => restore the `Product` stock and (optionally) delete the `order`:
    return cancelOrder(prismaTransaction, { order, ...restCancelOrderData });
}
