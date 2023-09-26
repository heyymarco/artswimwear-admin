// next-js:
import {
    NextRequest,
    NextResponse,
}                           from 'next/server'

// next-next:
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
    
    // throw '';
    
    //#region parsing request
    const {
        name,
    } = Object.fromEntries(new URL(req.url, 'https://localhost/').searchParams.entries());
    //#endregion parsing request
    
    
    
    //#region validating request
    if (
        (((typeof(name) !== 'string') || (name.length < 1) || (name.length > 30)))
    ) {
        return NextResponse.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    //#endregion validating request
    
    
    
    //#region query result
    try {
        const result = await prisma.role.findFirst({
            where  : {
                name : { equals: name, mode: 'insensitive' } // case-insensitive comparison
            },
            select : {
                id : true,
            },
        });
        if (result) {
            return NextResponse.json({
                error: `The name "${name}" is already taken.`,
            }, { status: 409 }); // handled with error
        } // if
        
        
        
        return NextResponse.json({
            ok       : true,
            message  : `The name "${name}" can be used.`,
        }); // handled with success
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        return NextResponse.json({ error: error }, { status: 500 }); // handled with error
    } // try
    //#endregion query result
});
