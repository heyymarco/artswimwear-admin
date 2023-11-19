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
    'ON_THE_WAY',
    'IN_TROUBLE',
    'COMPLETED',
];

export const orderStatusTheme = (orderStatus : OrderStatus, paymentType?: PaymentType): ThemeName => {
    switch (orderStatus) {
        case 'NEW_ORDER'  :
            if (paymentType === 'MANUAL') return 'secondary';
            return 'danger';
        case 'COMPLETED'  : return 'success';
        case 'IN_TROUBLE' : return 'danger';
        default           : return 'warning';
    } // switch
};
export const orderStatusText = (orderStatus : OrderStatus, paymentType?: PaymentType): ThemeName => {
    switch (orderStatus) {
        case 'NEW_ORDER'  :
            if (paymentType === 'MANUAL') return 'Waiting for Payment';
            return 'New Order';
        case 'PROCESSED'  : return 'Being Processed';
        case 'ON_THE_WAY' : return 'On the Way';
        case 'IN_TROUBLE' : return 'In Trouble';
        case 'COMPLETED'  : return 'Completed';
    } // switch
};
export const orderStatusIcon = (orderStatus : OrderStatus, paymentType?: PaymentType): IconList => {
    switch (orderStatus) {
        case 'NEW_ORDER'  :
            if (paymentType === 'MANUAL') return 'timer';
            return 'mark_as_unread';
        case 'PROCESSED'  : return 'directions_run';
        case 'ON_THE_WAY' : return 'local_shipping';
        case 'IN_TROUBLE' : return 'report_problem';
        case 'COMPLETED'  : return 'done';
    } // switch
};

export const orderStatusNext = (orderStatus : OrderStatus): OrderStatus => {
    switch (orderStatus) {
        case 'NEW_ORDER'  : return 'PROCESSED';
        case 'PROCESSED'  : return 'ON_THE_WAY';
        case 'ON_THE_WAY' : return 'COMPLETED';
        case 'IN_TROUBLE' : return 'COMPLETED';
        case 'COMPLETED'  : return 'COMPLETED';
        default           : return 'PROCESSED';
    } // switch
}
export const orderStatusTextNext = (orderStatus : OrderStatus, paymentType?: PaymentType): ThemeName => {
    return orderStatusText(orderStatusNext(orderStatus), paymentType);
}
