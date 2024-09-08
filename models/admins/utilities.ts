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



export const adminPreferenceDetailSelect = {
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
export const convertAdminPreferenceDetailDataToPreferenceDetail = (preferenceDetailData: Awaited<ReturnType<typeof prisma.adminPreference.findFirstOrThrow<{ select: typeof adminPreferenceDetailSelect }>>>): AdminPreferenceDetail => {
    const {
        parentId, // rename `parentId` (adminId) to `id`, as the id of `AdminPreferenceDetail` model
        ...restPreferenceDetail
    } = preferenceDetailData;
    return {
        id : parentId, // rename `parentId` (adminId) to `id`, as the id of `AdminPreferenceDetail` model
        ...restPreferenceDetail,
    } satisfies AdminPreferenceDetail;
};