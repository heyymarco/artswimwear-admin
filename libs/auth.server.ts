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
    adapter                                  : PrismaAdapterWithCredentials(prisma, {
        modelUser                            : 'admin',
        modelRole                            : 'adminRole',
        modelAccount                         : 'adminAccount',
        modelSession                         : 'adminSession',
        modelCredentials                     : 'adminCredentials',
        modelPasswordResetToken              : 'adminPasswordResetToken',
        modelEmailConfirmationToken          : 'adminEmailConfirmationToken',
        
        modelUserRefRoleId                   : 'roleId',
        modelAccountRefUserId                : 'parentId',
        modelSessionRefUserId                : 'parentId',
        modelCredentialsRefUserId            : 'parentId',
        modelPasswordResetTokenRefUserId     : 'parentId',
        modelEmailConfirmationTokenRefUserId : 'parentId',
    }),
    authConfigServer        : authConfigServer,
    credentialsConfigServer : credentialsConfigServer,
});
const authOptions = authRouteHandler.authOptions;
export {
    authRouteHandler,
    authOptions,
};
