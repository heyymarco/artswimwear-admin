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
import {
    type RoleDetail,
    roleDetailSelect,
}                           from '@/models'
import {
    type Prisma,
}                           from '@prisma/client'

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
    (req as any).session = session;
    
    
    
    // authorized => next:
    return await next();
})
.get(async (req) => {
    /* required for constraining the privileges */
    
    
    
    const roleDetails : RoleDetail[] = (
        (await prisma.adminRole.findMany({
            select: roleDetailSelect,
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
        
        order_r,
        order_us,
        order_usa,
        order_upmu,
        order_upmp,
        
        shipping_r,
        shipping_c,
        shipping_ud,
        shipping_up,
        shipping_d,
        
        admin_r,
        admin_c,
        admin_un,
        admin_uu,
        admin_ue,
        admin_up,
        admin_ui,
        admin_ur,
        admin_d,
        
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
            
            order_r,
            order_us,
            order_usa,
            order_upmu,
            order_upmp,
            
            shipping_r,
            shipping_c,
            shipping_ud,
            shipping_up,
            shipping_d,
            
            admin_r,
            admin_c,
            admin_un,
            admin_uu,
            admin_ue,
            admin_up,
            admin_ui,
            admin_ur,
            admin_d,
            
            role_c,
            role_u,
            role_d,
        } satisfies Prisma.AdminRoleUpdateInput;
        const roleDetail : RoleDetail = (
            !id
            ? await prisma.adminRole.create({
                data   : data,
                select : roleDetailSelect,
            })
            : await prisma.adminRole.update({
                where  : {
                    id : id,
                },
                data   : data,
                select : roleDetailSelect,
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
