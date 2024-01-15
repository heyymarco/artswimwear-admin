// heymarco:
import type {
    // types:
    AuthConfigShared,
}                               from '@heymarco/next-auth'



export const authConfigShared : AuthConfigShared = {
    business                 : {
        name                 : process.env.BUSINESS_NAME ?? '',
        url                  : process.env.BUSINESS_URL  ?? '',
    },
    signUp                   : {
        enabled              : false, // no signUp for admin page
    },
    signIn                   : {
        path                 : '/signin',
    },
    reset                    : {
        enabled              : true,
    },
};
