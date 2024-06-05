// models:
import type {
    AdminPreference,
}                           from '@prisma/client'



// types:
export interface PreferenceData
    extends
        Pick<AdminPreference,
            // records:
            |'id'
        >,
        Partial<Omit<AdminPreference,
            // records:
            |'id'
            
            
            
            // relations:
            |'adminId'
        >>
{
}
export interface PreferenceDetail
    extends
        Omit<AdminPreference,
            // relations:
            |'adminId'
        >
{
}

type NoUndefinedField<T> = { [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>> }
export const defaultPreferenceDetail : NoUndefinedField<Omit<PreferenceDetail, 'id'>> = {
    // data:
    emailOrderNewPending : true,
    emailOrderNewPaid    : true,
    emailOrderCanceled   : false,
    emailOrderExpired    : false,
    emailOrderRejected   : false,
    emailOrderShipping   : false,
    emailOrderCompleted  : false,
}
