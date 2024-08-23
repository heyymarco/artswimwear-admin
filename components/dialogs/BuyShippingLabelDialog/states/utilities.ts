
import {
    type CheckoutStep,
}                           from './types'



export const calculateCheckoutProgress = (checkoutStep: CheckoutStep): number => {
    return (['INFO', 'SHIPPING', 'PAYMENT', 'PAID'] satisfies CheckoutStep[]).findIndex((progress) => progress === checkoutStep);
}