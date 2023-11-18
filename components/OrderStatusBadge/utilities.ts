// reusable-ui core:
import type {
    // color options of UI:
    ThemeName,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import type {
    // simple-components:
    IconList,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// models:
import type {
    PaymentType,
    OrderStatus,
}                           from '@prisma/client'



// utilities:
export const orderStatusValues : OrderStatus[] = [
    'NEW_ORDER',
    'PROCESSED',
    'SHIPPED',
    'ON_HOLD',
    'COMPLETED',
];

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
export const orderStatusIcon = (orderStatus : OrderStatus, paymentType?: PaymentType): IconList => {
    switch (orderStatus) {
        case 'NEW_ORDER':
            if ((paymentType !== undefined) && (paymentType === 'MANUAL')) return 'timer';
            return 'mark_as_unread';
        case 'PROCESSED': return 'directions_run';
        case 'SHIPPED'  : return 'local_shipping';
        case 'ON_HOLD'  : return 'report_problem';
        case 'COMPLETED': return 'done';
    } // switch
};

export const orderStatusNext = (orderStatus : OrderStatus): OrderStatus => {
    switch (orderStatus) {
        case 'NEW_ORDER': return 'PROCESSED';
        case 'PROCESSED': return 'SHIPPED';
        case 'SHIPPED'  : return 'COMPLETED';
        case 'ON_HOLD'  : return 'COMPLETED';
        case 'COMPLETED': return 'COMPLETED';
        default         : return 'PROCESSED';
    } // switch
}
export const orderStatusTextNext = (orderStatus : OrderStatus, paymentType?: PaymentType): ThemeName => {
    return orderStatusText(orderStatusNext(orderStatus));
}
