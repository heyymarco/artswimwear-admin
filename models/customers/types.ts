// models:
import {
    type Customer,
    type CustomerPreference,
    type Guest,
    type GuestPreference,
}                           from '@prisma/client'



// types:
export type CustomerOrGuestDetail =
    &Pick<CustomerDetail, keyof CustomerDetail & keyof GuestDetail>
    &Pick<GuestDetail   , keyof CustomerDetail & keyof GuestDetail>

export interface CustomerDetail
    extends
        Omit<Customer,
            // records:
            |'createdAt'
            |'updatedAt'
            
            // data:
            |'paypalCustomerId'
            |'stripeCustomerId'
            |'midtransCustomerId'
            
            |'emailVerified'
            |'image'
        >
{
    // data:
    // username : string|null
    
    
    
    // relations:
    preference : CustomerOrGuestPreferenceDetail|null
}

export interface GuestDetail
    extends
        Omit<Guest,
            // records:
            |'createdAt'
            |'updatedAt'
        >
{
    // relations:
    preference : CustomerOrGuestPreferenceDetail|null
}



export interface CustomerPreferenceData
    extends
        // the id is mandatory:
        Pick<CustomerPreference,
            // records:
            |'id'
        >,
        
        // other than id & parentId are optional:
        Partial<Omit<CustomerPreference,
            // records:
            |'id'
            
            
            
            // relations:
            |'parentId'
        >>
{
}



export type CustomerOrGuestPreferenceDetail =
    &Pick<CustomerPreferenceDetail, keyof CustomerPreferenceDetail & keyof GuestPreferenceDetail>
    &Pick<GuestPreferenceDetail   , keyof CustomerPreferenceDetail & keyof GuestPreferenceDetail>

export interface CustomerPreferenceDetail
    extends
        Omit<CustomerPreference,
            // records:
            |'id'
            
            // relations:
            |'parentId'
        >
{
}

export interface GuestPreferenceDetail
    extends
        Omit<GuestPreference,
            // records:
            |'id'
            
            // relations:
            |'parentId'
        >
{
}
