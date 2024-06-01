// models:
import type {
    OrderDetail,
}                           from '@/models'



// utilities:
export const getTotalQuantity = (items: OrderDetail['items']): number => {
    return items.reduce((counter, item) => {
        return counter + item.quantity;
    }, 0);
};
