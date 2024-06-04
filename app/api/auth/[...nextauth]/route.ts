// heymarco components:
import {
    createAuthRouteHandler,
    PrismaAdapterWithCredentials,
}                           from '@heymarco/next-auth/server'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'

// configs:
import {
    authConfigServer,
}                           from '@/auth.config.server'
import {
    credentialsConfigServer,
}                           from '@/credentials.config.server'



const authRouteHandler = createAuthRouteHandler({
    adapter                 : PrismaAdapterWithCredentials(prisma, {
        account                : 'adminAccount',
        session                : 'adminSession',
        user                   : 'admin',
        credentials            : 'adminCredentials',
        passwordResetToken     : 'adminPasswordResetToken',
        emailConfirmationToken : 'adminEmailConfirmationToken',
        role                   : 'adminRole',
    }),
    authConfigServer        : authConfigServer,
    credentialsConfigServer : credentialsConfigServer,
});
const authOptions = authRouteHandler.authOptions;
export {
    authRouteHandler as GET,
    authRouteHandler as POST,
    authRouteHandler as PATCH,
    authRouteHandler as PUT,
    authOptions,
};
