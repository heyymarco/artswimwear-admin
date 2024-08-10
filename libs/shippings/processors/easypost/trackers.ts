// models:
import {
    // types:
    type ShippingCarrier,
}                           from '@/models'

// easypost:
import {
    type Tracker as EasyPostTracker,
}                           from '@easypost/api'
import {
    getEasyPostInstance,
}                           from './instance'



export interface RegisterShippingTrackerOptions {
    shippingCarrier ?: string
    shippingNumber   : ShippingCarrier
}
export interface Tracker extends Omit<EasyPostTracker, 'tracking_details'> {
    tracking_details : (Omit<EasyPostTracker['tracking_details'][number], 'datetime'> & {
        datetime : Date
    })[]
}
export const registerShippingTracker = async (options: RegisterShippingTrackerOptions): Promise<Tracker|undefined> => {
    const easyPost = getEasyPostInstance();
    if (!easyPost) return undefined;
    
    
    
    const {
        shippingCarrier,
        shippingNumber,
    } = options;
    
    
    
    try {
        const shippingTracker = await easyPost.Tracker.create({
            tracking_code : shippingNumber,
            carrier       : shippingCarrier,
        });
        const shippingDetails = (
            (shippingTracker.tracking_details ?? [])
            .map((detail) => ({
                ...detail,
                datetime : new Date(detail.datetime),
            }))
        );
        shippingDetails.sort((a, b) => (a.datetime.valueOf() - b.datetime.valueOf()))
        return {
            ...shippingTracker,
            tracking_details : shippingDetails,
        } satisfies Tracker;
    }
    catch (error: any) {
        console.log('Error: ', error);
        return undefined;
    } // try
}
