// models:
import {
    // types:
    type ShippingCarrier,
}                           from '@/models'

// easypost:
import {
    getEasyPostInstance,
}                           from './instance'



export interface RegisterShippingTrackerOptions {
    shippingCarrier ?: string
    shippingNumber   : ShippingCarrier
}
export const registerShippingTracker = async (options: RegisterShippingTrackerOptions): Promise<boolean> => {
    const easyPost = getEasyPostInstance();
    if (!easyPost) return false;
    
    
    
    const {
        shippingCarrier,
        shippingNumber,
    } = options;
    
    
    
    try {
        const shippingTracker = await easyPost.Tracker.create({
            tracking_code : shippingNumber,
            carrier       : shippingCarrier,
        });
        return !shippingTracker?.id;
    }
    catch (error: any) {
        console.log('Error: ', error);
        return false;
    } // try
}
