
import {
    type CheckoutStep,
}                           from './types'



export const calculateCheckoutProgress = (checkoutStep: CheckoutStep): number => {
    return ['info', 'selectCarrier', 'payment', 'paid'].findIndex((progress) => progress === checkoutStep);
}