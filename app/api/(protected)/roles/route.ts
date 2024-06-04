// next-js:
import {
    NextRequest,
    NextResponse,
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
import type {
    AdminRole,
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
export interface RoleDetail
    extends
        Omit<AdminRole,
            |'createdAt'
            |'updatedAt'
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
    (req as any).session = session;
    
    
    
    // authorized => next:
    return await next();
})
.get(async (req) => {
    /* required for constraining the privileges */
    
    
    
    const roleDetails : RoleDetail[] = (
        (await prisma.adminRole.findMany({
            select: {
                id         : true,
                
                name       : true,
                
                product_r  : true,
                product_c  : true,
                product_ud : true,
                product_ui : true,
                product_up : true,
                product_us : true,
                product_uv : true,
                product_d  : true,
                
                admin_r    : true,
                admin_c    : true,
                admin_un   : true,
                admin_uu   : true,
                admin_ue   : true,
                admin_up   : true,
                admin_ui   : true,
                admin_ur   : true,
                admin_d    : true,
                
                order_r    : true,
                order_us   : true,
                order_usa  : true,
                order_upmu : true,
                order_upmp : true,
                
                role_c     : true,
                role_u     : true,
                role_d     : true,
            },
            orderBy : {
                name : 'asc',
            },
        }))
    );
    return NextResponse.json(roleDetails); // handled with success
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
    // return NextResponse.json({ message: 'not found'    }, { status: 400 }); // handled with error
    // return NextResponse.json({ message: 'server error' }, { status: 500 }); // handled with error
    
    //#region parsing request
    const {
        id,
        
        name,
        
        product_r,
        product_c,
        product_ud,
        product_ui,
        product_up,
        product_us,
        product_uv,
        product_d,
        
        admin_r,
        admin_c,
        admin_un,
        admin_uu,
        admin_ue,
        admin_up,
        admin_ui,
        admin_ur,
        admin_d,
        
        order_r,
        order_us,
        order_usa,
        order_upmu,
        order_upmp,
        
        role_c,
        role_u,
        role_d,
    } = await req.json();
    //#endregion parsing request
    
    
    
    //#region validating request
    if (
        // (typeof(id) !== 'string') || (id.length < 1)
        (typeof(id) !== 'string')
        ||
        ((name !== undefined) && ((typeof(name) !== 'string') || (name.length < 1)))
        
        // TODO: validating data type & constraints
    ) {
        return NextResponse.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    //#endregion validating request
    
    
    
    //#region validating privileges
    const session = (req as any).session as Session;
    if (!id) {
        if (!session.role?.role_c) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to add new role.`
        }, { status: 403 }); // handled with error: forbidden
    }
    else {
        if (!session.role?.role_u) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to modify the role.`
        }, { status: 403 }); // handled with error: forbidden
    } // if
    //#endregion validating privileges
    
    
    
    //#region save changes
    try {
        const data = {
            name,
            
            product_r,
            product_c,
            product_ud,
            product_ui,
            product_up,
            product_us,
            product_uv,
            product_d,
            
            admin_r,
            admin_c,
            admin_un,
            admin_uu,
            admin_ue,
            admin_up,
            admin_ui,
            admin_ur,
            admin_d,
            
            order_r,
            order_us,
            order_usa,
            order_upmu,
            order_upmp,
            
            role_c,
            role_u,
            role_d,
        };
        const select = {
            id         : true,
            
            name       : true,
            
            product_r  : true,
            product_c  : true,
            product_ud : true,
            product_ui : true,
            product_up : true,
            product_us : true,
            product_uv : true,
            product_d  : true,
            
            admin_r     : true,
            admin_c     : true,
            admin_un    : true,
            admin_uu    : true,
            admin_ue    : true,
            admin_up    : true,
            admin_ui    : true,
            admin_ur    : true,
            admin_d     : true,
            
            order_r    : true,
            order_us   : true,
            order_usa  : true,
            order_upmu : true,
            order_upmp : true,
            
            role_c     : true,
            role_u     : true,
            role_d     : true,
        };
        const roleDetail : RoleDetail = (
            !id
            ? await prisma.adminRole.create({
                data   : data,
                select : select,
            })
            : await prisma.adminRole.update({
                where  : {
                    id : id,
                },
                data   : data,
                select : select,
            })
        );
        return NextResponse.json(roleDetail); // handled with success
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        // if (error instanceof RecordNotFound) return NextResponse.json({ error: 'invalid ID' }, { status: 400 }); // handled with error
        return NextResponse.json({ error: error }, { status: 500 }); // handled with error
    } // try
    //#endregion save changes
})
.delete(async (req) => {
    if (process.env.SIMULATE_SLOW_NETWORK === 'true') {
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, 2000);
        });
    } // if
    
    
    
    //#region parsing request
    const {
        id,
    } = await req.json();
    //#endregion parsing request
    
    
    
    //#region validating request
    if (
        ((typeof(id) !== 'string') || (id.length < 1))
    ) {
        return NextResponse.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    //#endregion validating request
    
    
    
    //#region validating privileges
    const session = (req as any).session as Session;
    if (!session.role?.role_d) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to delete the role.`
    }, { status: 403 }); // handled with error: forbidden
    //#endregion validating privileges
    
    
    
    //#region save changes
    try {
        const deletedRole : Pick<RoleDetail, 'id'> = (
            await prisma.adminRole.delete({
                where  : {
                    id : id,
                },
                select : {
                    id : true,
                },
            })
        );
        return NextResponse.json(deletedRole); // handled with success
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        // if (error instanceof RecordNotFound) return NextResponse.json({ error: 'invalid ID' }, { status: 400 }); // handled with error
        return NextResponse.json({ error: error }, { status: 500 }); // handled with error
    } // try
    //#endregion save changes
});
