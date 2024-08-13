// models:
import {
    type AdminPreferenceDetail,
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
    parentId             : true,
} satisfies Prisma.AdminPreferenceSelect;
export const convertPreferenceDetailDataToPreferenceDetail = (preferenceDetailData: Awaited<ReturnType<typeof prisma.adminPreference.findFirstOrThrow<{ select: typeof preferenceDetailSelect }>>>): AdminPreferenceDetail => {
    const {
        parentId,
        ...restPreferenceDetail
    } = preferenceDetailData;
    return {
        id : parentId, // use parentId (adminId) as the id of AdminPreferenceDetail model
        ...restPreferenceDetail,
    } satisfies AdminPreferenceDetail;
};