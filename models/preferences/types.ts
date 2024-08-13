// models:
import type {
    AdminPreference,
}                           from '@prisma/client'



// types:
export interface AdminPreferenceData
    extends
        // the id is mandatory:
        Pick<AdminPreference,
            // records:
            |'id'
        >,
        
        // other than id & parentId are optional:
        Partial<Omit<AdminPreference,
            // records:
            |'id'
            
            
            
            // relations:
            |'parentId'
        >>
{
}



export interface AdminPreferenceDetail
    extends
        Omit<AdminPreference,
            // relations:
            |'parentId'
        >
{
}

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
