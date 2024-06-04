// next-js:
import {
    NextRequest,
    NextResponse,
}                           from 'next/server'

// next-auth:
import {
    getServerSession,
}                           from 'next-auth'

// next-connect:
import {
    createEdgeRouter,
}                           from 'next-connect'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'

// internal auth:
import {
    authOptions,
}                           from '@/app/api/auth/[...nextauth]/route'

// configs:
import {
    credentialsConfigServer,
}                           from '@/credentials.config.server'



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
    if (!session) return NextResponse.json({ error: 'Please sign in.' }, { status: 401 }); // handled with error: unauthorized
    
    
    
    // authorized => next:
    return await next();
})
.get(async (req) => {
    if (process.env.SIMULATE_SLOW_NETWORK === 'true') {
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, 2000);
        });
    } // if
    
    
    
    const {
        email    : {
            minLength      : emailMinLength,
            maxLength      : emailMaxLength,
            
            format         : emailFormat,
        },
    } = credentialsConfigServer;
    
    
    
    // validate the request parameter(s):
    const {
        email,
    } = Object.fromEntries(new URL(req.url, 'https://localhost/').searchParams.entries());
    if ((typeof(email) !== 'string') || !email) {
        return NextResponse.json({
            error: 'The required email is not provided.',
        }, { status: 400 }); // handled with error
    } // if
    if ((typeof(emailMinLength) === 'number') && Number.isFinite(emailMinLength) && (email.length < emailMinLength)) {
        return NextResponse.json({
            error: `The email is too short. Minimum is ${emailMinLength} characters.`,
        }, { status: 400 }); // handled with error
    } // if
    if ((typeof(emailMaxLength) === 'number') && Number.isFinite(emailMaxLength) && (email.length > emailMaxLength)) {
        return NextResponse.json({
            error: `The email is too long. Maximum is ${emailMaxLength} characters.`,
        }, { status: 400 }); // handled with error
    } // if
    if (!email.match(emailFormat)) {
        return NextResponse.json({
            error: `The email is not well formatted.`,
        }, { status: 400 }); // handled with error
    } // if
    
    
    
    //#region query result
    try {
        const result = await prisma.admin.findFirst({
            where  : {
                email : { equals: email, mode: 'insensitive' }, // case-insensitive comparison
            },
            select : {
                id : true,
            },
        });
        if (result) {
            return NextResponse.json({
                error: `The email "${email}" is already taken.`,
            }, { status: 409 }); // handled with error
        } // if
        
        
        
        return NextResponse.json({
            ok       : true,
            message  : `The email "${email}" can be used.`,
        }); // handled with success
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        return NextResponse.json({ error: error }, { status: 500 }); // handled with error
    } // try
    //#endregion query result
});
