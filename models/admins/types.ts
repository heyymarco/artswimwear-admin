// models:
import {
    type Admin,
    AdminPreference,
}                           from '@prisma/client'



// types:
export interface AdminPreview
    extends
        Omit<Admin,
            // records:
            |'createdAt'
            |'updatedAt'
            
            // data:
            |'emailVerified'
            
            // relations:
            |'roleId'
        >
{
    username : string|null
}
export interface AdminDetail
    extends
        Omit<Admin,
            // records:
            |'createdAt'
            |'updatedAt'
            
            // data:
            |'emailVerified'
        >
{
    username : string|null
}



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
