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
