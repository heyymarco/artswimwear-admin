// next-auth:
import {
    getServerSession,
}                           from 'next-auth'

// next-connect:
import {
    createEdgeRouter,
}                           from 'next-connect'

// internal auth:
import {
    authOptions,
}                           from '@/app/api/auth/[...nextauth]/route'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'



// configs:
export const fetchCache = 'force-cache';



// routers:
interface RequestContext {
    params: {
        /* no params yet */
    }
}
const router  = createEdgeRouter<Request, RequestContext>();
const handler = async (req: Request, ctx: RequestContext) => router.run(req, ctx) as Promise<any>;
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
    /* required for displaying states in a specified country */
    
    
    
    let allCountries = await prisma.country.findMany({
        select : {
            enabled : true,
            name    : true,
            
            code    : true,
        },
        // enabled: true
    });
    if (!allCountries.length) {
        const defaultCountries = (await import('@/libs/defaultCountries')).default;
        await prisma.country.createMany({
            data : defaultCountries,
        });
        allCountries = defaultCountries.map((country) => ({
            enabled : country.enabled,
            name    : country.name,
            
            code    : country.code,
        }));
    } // if
    
    
    
    const countryList : string[] = (
        allCountries
        .filter((country) => country.enabled)
        .map((country) => country.name)
    );
    return Response.json(countryList); // handled with success
});
