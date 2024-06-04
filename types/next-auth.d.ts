// models:
import type {
    AdminRole,
}                           from '@prisma/client'

// stores:
import type {
    // types:
    AdminDetail,
}                           from '@/store/features/api/apiSlice'



declare module 'next-auth' {
    interface Session
    {
        user ?: Pick<AdminDetail, 'id'|'name'|'email'|'image'>
    }
}
declare module '@heymarco/next-auth' {
    interface Role
        extends
            AdminRole
    {
    }
}
