// models:
import type {
    Role as ExtendedRole,
}                           from '@prisma/client'

// stores:
import type {
    // types:
    UserDetail,
}                           from '@/store/features/api/apiSlice'



declare module 'next-auth' {
    interface Session
    {
        user ?: Pick<UserDetail, 'id'|'name'|'email'|'image'>
    }
}
declare module '@heymarco/next-auth' {
    interface Role
        extends
            ExtendedRole
    {
    }
}
