// next-js:
import {
    NextRequest,
}                           from 'next/server'

// next-auth:
import {
    getServerSession,
}                           from 'next-auth'

// heymarco:
import type {
    Session,
}                           from '@heymarco/next-auth/server'

// next-connect:
import {
    createEdgeRouter,
}                           from 'next-connect'

// models:
import {
    defaultPreferenceDetail,
    preferenceDetailSelect,
    convertPreferenceDetailDataToPreferenceDetail,
}                           from '@/models'
export {
    type PreferenceData,
    type PreferenceDetail,
}                           from '@/models'
import {
    prisma,
}                           from '@/libs/prisma.server'

// internal auth:
import {
    authOptions,
}                           from '@/app/api/auth/[...nextauth]/route'



// configs:
export const fetchCache = 'force-no-store';



// routers:
interface RequestContext {
    params: {
        /* no params yet */
    }
}
const router  = createEdgeRouter<NextRequest, RequestContext>();
const handler = async (req: NextRequest, ctx: RequestContext) => router.run(req, ctx) as Promise<any>;
export {
    handler as GET,
    handler as POST,
    handler as PUT,
    handler as PATCH,
    handler as DELETE,
    handler as HEAD,
}

router
.use(async (req, ctx, next) => {
    // conditions:
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: 'Please sign in.' }, { status: 401 }); // handled with error: unauthorized
    (req as any).session = session;
    
    
    
    // authorized => next:
    return await next();
})
.get(async (req) => {
    /* required for displaying adminPreferences */
    
    
    
    //#region validating privileges
    const session = (req as any).session as Session;
    const adminId = session.user?.id;
    if (!adminId) return Response.json({ error: 'Please sign in.' }, { status: 401 }); // handled with error: unauthorized
    //#endregion validating privileges
    
    
    
    const preferenceDetailData = (
        (await prisma.adminPreference.findUnique({
            where  : {
                adminId : adminId,
            },
            select : preferenceDetailSelect,
        }))
        ??
        (await prisma.adminPreference.create({
            data   : {
                adminId : adminId,
                ...defaultPreferenceDetail,
            },
            select : preferenceDetailSelect,
        }))
    );
    return Response.json(convertPreferenceDetailDataToPreferenceDetail(preferenceDetailData)); // handled with success
})
.patch(async (req) => {
    if (process.env.SIMULATE_SLOW_NETWORK === 'true') {
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, 2000);
        });
    } // if
    
    // throw '';
    // return Response.json({ message: 'not found'    }, { status: 400 }); // handled with error
    // return Response.json({ message: 'server error' }, { status: 500 }); // handled with error
    
    //#region parsing request
    const {
        // data:
        emailOrderNewPending,
        emailOrderNewPaid,
        emailOrderCanceled,
        emailOrderExpired,
        emailOrderConfirmed,
        emailOrderRejected,
        emailOrderProcessing,
        emailOrderShipping,
        emailOrderCompleted,
    } = await req.json();
    //#endregion parsing request
    
    
    
    //#region validating request
    if (
        ((emailOrderNewPending !== undefined) && (typeof(emailOrderNewPending) !== 'boolean'))
        ||
        ((emailOrderNewPaid    !== undefined) && (typeof(emailOrderNewPaid)    !== 'boolean'))
        ||
        ((emailOrderCanceled   !== undefined) && (typeof(emailOrderCanceled)   !== 'boolean'))
        ||
        ((emailOrderExpired    !== undefined) && (typeof(emailOrderExpired)    !== 'boolean'))
        ||
        ((emailOrderConfirmed  !== undefined) && (typeof(emailOrderConfirmed)  !== 'boolean'))
        ||
        ((emailOrderRejected   !== undefined) && (typeof(emailOrderRejected)   !== 'boolean'))
        ||
        ((emailOrderProcessing !== undefined) && (typeof(emailOrderProcessing) !== 'boolean'))
        ||
        ((emailOrderShipping   !== undefined) && (typeof(emailOrderShipping)   !== 'boolean'))
        ||
        ((emailOrderCompleted  !== undefined) && (typeof(emailOrderCompleted)  !== 'boolean'))
    ) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    //#endregion validating request
    
    
    
    //#region validating privileges
    const session = (req as any).session as Session;
    const adminId = session.user?.id;
    if (!adminId) return Response.json({ error: 'Please sign in.' }, { status: 401 }); // handled with error: unauthorized
    //#endregion validating privileges
    
    
    
    try {
        const preferenceDetailData = await prisma.adminPreference.update({
            where  : {
                adminId : adminId,
            },
            data   : {
                // data:
                emailOrderNewPending,
                emailOrderNewPaid,
                emailOrderCanceled,
                emailOrderExpired,
                emailOrderConfirmed,
                emailOrderRejected,
                emailOrderProcessing,
                emailOrderShipping,
                emailOrderCompleted,
            },
            select : preferenceDetailSelect,
        });
        return Response.json(convertPreferenceDetailDataToPreferenceDetail(preferenceDetailData)); // handled with success
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        // if (error instanceof RecordNotFound) return Response.json({ error: 'invalid ID' }, { status: 400 }); // handled with error
        return Response.json({ error: error }, { status: 500 }); // handled with error
    } // try
});
