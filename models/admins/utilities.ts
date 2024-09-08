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



type NoUndefinedField<T> = { [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>> }
export const defaultAdminPreferenceDetail : NoUndefinedField<Omit<AdminPreferenceDetail, 'id'>> = {
    // data:
    // emailOrderNewPending : true, // TODO: restore this line
    // emailOrderNewPaid    : true, // TODO: restore this line
    emailOrderNewPending : false,   // TODO: remove this line
    emailOrderNewPaid    : false,   // TODO: remove this line
    emailOrderCanceled   : false,
    emailOrderExpired    : false,
    // emailOrderConfirmed  : true, // TODO: restore this line
    emailOrderConfirmed  : false,   // TODO: remove this line
    emailOrderRejected   : false,
    emailOrderProcessing : false,
    emailOrderShipping   : false,
    emailOrderCompleted  : false,
}



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
export const convertAdminPreferenceDetailDataToAdminPreferenceDetail = (preferenceDetailData: Awaited<ReturnType<typeof prisma.adminPreference.findFirstOrThrow<{ select: typeof adminPreferenceDetailSelect }>>>): AdminPreferenceDetail => {
    const {
        parentId, // rename `parentId` (adminId) to `id`, as the id of `AdminPreferenceDetail` model
        ...restPreferenceDetail
    } = preferenceDetailData;
    return {
        id : parentId, // rename `parentId` (adminId) to `id`, as the id of `AdminPreferenceDetail` model
        ...restPreferenceDetail,
    } satisfies AdminPreferenceDetail;
};
