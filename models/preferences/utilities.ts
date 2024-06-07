// models:
import {
    type PreferenceDetail,
}                           from './types'
import {
    type Prisma,
}                           from '@prisma/client'

// ORMs:
import {
    type prisma,
}                           from '@/libs/prisma.server'



export const preferenceDetailSelect = {
    // data:
    emailOrderNewPending : true,
    emailOrderNewPaid    : true,
    emailOrderCanceled   : true,
    emailOrderExpired    : true,
    emailOrderConfirmed  : true,
    emailOrderRejected   : true,
    emailOrderProcessing : true,
    emailOrderShipping   : true,
    emailOrderCompleted  : true,
    
    
    
    // relations:
    adminId              : true,
} satisfies Prisma.AdminPreferenceSelect;
export const convertPreferenceDetailDataToPreferenceDetail = (preferenceDetailData: Awaited<ReturnType<typeof prisma.adminPreference.findFirstOrThrow<{ select: typeof preferenceDetailSelect }>>>): PreferenceDetail => {
    const {
        adminId,
        ...restPreferenceDetail
    } = preferenceDetailData;
    return {
        id : adminId, // use adminId as the id of PreferenceDetail model
        ...restPreferenceDetail,
    } satisfies PreferenceDetail;
};