// stores:
import {
    // types:
    OrderDetail,
}                           from '@/store/features/api/apiSlice'



// utilities:
export const getTotalQuantity = (items: OrderDetail['items']): number => {
    return items.reduce((counter, item) => {
        return counter + item.quantity;
    }, 0);
};
