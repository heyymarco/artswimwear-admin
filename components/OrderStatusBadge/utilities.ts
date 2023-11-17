// reusable-ui core:
import type {
    // color options of UI:
    ThemeName,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// models:
import type {
    PaymentType,
    OrderStatus,
}                           from '@prisma/client'



// utilities:
export const orderStatusTheme = (orderStatus : OrderStatus, paymentType?: PaymentType): ThemeName => {
    switch (orderStatus) {
        case 'NEW_ORDER':
            if ((paymentType !== undefined) && (paymentType === 'MANUAL')) return 'secondary';
            return 'danger';
        case 'COMPLETED': return 'success';
        default         : return 'warning';
    } // switch
};
export const orderStatusText = (orderStatus : OrderStatus, paymentType?: PaymentType): ThemeName => {
    switch (orderStatus) {
        case 'NEW_ORDER':
            if ((paymentType !== undefined) && (paymentType === 'MANUAL')) return 'Waiting for Payment';
            return 'New Order';
        case 'PROCESSED': return 'Being Processed';
        case 'SHIPPED'  : return 'Shipped';
        case 'ON_HOLD'  : return 'On Hold';
        case 'COMPLETED': return 'Completed';
    } // switch
};
