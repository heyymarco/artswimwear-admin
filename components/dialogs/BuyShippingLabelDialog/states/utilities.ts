
import {
    type CheckoutStep,
}                           from './types'



export const calculateCheckoutProgress = (checkoutStep: CheckoutStep): number => {
    return ['info', 'shipping', 'payment', 'paid'].findIndex((progress) => progress === checkoutStep);
}