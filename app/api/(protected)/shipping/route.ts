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

// models:
import type {
    ShippingProvider,
}                           from '@prisma/client'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'

// internal auth:
import {
    authOptions,
}                           from '@/app/api/auth/[...nextauth]/route'



// types:
export interface ShippingPreview
    extends
        Pick<ShippingProvider,
            |'id'
            |'name'
        >
{
}



// routers:
interface RequestContext {
    params: {
        /* no params yet */
    }
}
const router  = createEdgeRouter<NextRequest, RequestContext>();
const handler = async (req: NextRequest, ctx: RequestContext) => router.run(req, ctx);
export {
    handler as GET,
    handler as POST,
    handler as PATCH,
    handler as PUT,
}

router
.use(async (req, ctx, next) => {
    // conditions:
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Please sign in.' }, { status: 401 }); // handled with error: unauthorized
    
    
    
    // authorized => next:
    return next();
})
.get(async () => {
    const shippingPreviews : Array<ShippingPreview> = (
        await prisma.shippingProvider.findMany({
            select: {
                id   : true,
                
                name : true,
            },
        }) // get all shippings including the disabled ones
    );
    return NextResponse.json(shippingPreviews); // handled with success
});
