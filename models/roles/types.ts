// models:
import {
    type AdminRole,
}                           from '@prisma/client'



// types:
export interface RoleDetail
    extends
        Omit<AdminRole,
            |'createdAt'
            |'updatedAt'
        >
{
}
