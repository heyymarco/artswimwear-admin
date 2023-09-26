// models:
import type {
    Role as ExtendedRole,
}                           from '@prisma/client'



declare module '@heymarco/next-auth/server' {
    interface Role
        extends
            ExtendedRole
    {
    }
}
