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

// types:
import type {
    Pagination,
}                           from '@/libs/types'

// models:
import {
    type AdminDetail,
}                           from '@/models'

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
.post(async (req) => {
    /* required for displaying admins page */
    
    
    
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
        page    : pageStr    = 1,
        perPage : perPageStr = 20,
    } = await req.json();
    const page = Number.parseInt(pageStr as string);
    const perPage = Number.parseInt(perPageStr as string);
    //#endregion parsing request
    
    
    
    //#region validating request
    if ((typeof(page) !== 'number') || !isFinite(page) || (page < 1)
        ||
        (typeof(perPage) !== 'number') || !isFinite(perPage) || (perPage < 1)
    ) {
        return NextResponse.json({
            error: 'Invalid parameter(s).',
        }, { status: 400 }); // handled with error
    } // if
    //#endregion validating request
    
    
    
    //#region validating privileges
    const session = (req as any).session as Session;
    if (!session.role?.admin_r) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to view the admins.`
    }, { status: 403 }); // handled with error: forbidden
    //#endregion validating privileges
    
    
    
    const [total, paged] = await prisma.$transaction([
        prisma.admin.count(),
        prisma.admin.findMany({
            select: {
                id               : true,
                
                name             : true,
                email            : true,
                image            : true,
                
                adminRoleId      : true,
                
                adminCredentials : {
                    select : {
                        username : true,
                    },
                },
            },
            orderBy : {
                createdAt: 'desc',
            },
            skip    : (page - 1) * perPage, // note: not scaleable but works in small commerce app -- will be fixed in the future
            take    : perPage,
        }),
    ]);
    const paginationAdminDetail : Pagination<AdminDetail> = {
        total    : total,
        entities : paged.map((admin) => {
            const {
                adminCredentials,
            ...restAdmin} = admin;
            
            return {
                ...restAdmin,
                username : adminCredentials?.username ?? null,
            };
        }),
    };
    return NextResponse.json(paginationAdminDetail); // handled with success
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
        email,
        password,
        image,
        
        adminRoleId,
        
        username,
    } = await req.json();
    //#endregion parsing request
    
    
    
    //#region validating request
    if (
        // (typeof(id) !== 'string') || (id.length < 1)
        (typeof(id) !== 'string')
        ||
        ((name !== undefined) && ((typeof(name) !== 'string') || (name.length < 1)))
        ||
        ((email !== undefined) && ((typeof(email) !== 'string') || (email.length < 5)))
        ||
        ((password !== undefined) && ((typeof(password) !== 'string') || (password.length < 1)))
        ||
        ((image !== undefined) && (image !== null) && ((typeof(image) !== 'string') || (image.length < 1)))
        ||
        ((username !== undefined) && (username !== null) && ((typeof(username) !== 'string') || (username.length < 1)))
        
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
        if (!session.role?.admin_c) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to add new admin.`
        }, { status: 403 }); // handled with error: forbidden
        
        if (!session.role?.admin_ur && (adminRoleId !== null) && (adminRoleId !== undefined)) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to add new admin with an admin role.`
        }, { status: 403 }); // handled with error: forbidden
    }
    else {
        if (!session.role?.admin_un && (name !== undefined)) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to modify the admin's name.`
        }, { status: 403 }); // handled with error: forbidden
        
        if (!session.role?.admin_uu && (username !== undefined)) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to modify the admin's username.`
        }, { status: 403 }); // handled with error: forbidden
        
        if (!session.role?.admin_ue && (email !== undefined)) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to modify the admin's email.`
        }, { status: 403 }); // handled with error: forbidden
        
        if (!session.role?.admin_up && (password !== undefined)) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to modify the admin's password.`
        }, { status: 403 }); // handled with error: forbidden
        
        if (!session.role?.admin_ui && (image !== undefined)) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to modify the admin's image.`
        }, { status: 403 }); // handled with error: forbidden
        
        if (!session.role?.admin_ur && (adminRoleId !== undefined)) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to modify the admin's role.`
        }, { status: 403 }); // handled with error: forbidden
    } // if
    //#endregion validating privileges
    
    
    
    //#region save changes
    try {
        const emailVerified : Date|undefined = (
            !id
            ? new Date() // for a new Admin => mark email as verified
            : (
                !!(await prisma.admin.findUnique({
                where  : {
                    id : id,
                },
                select : {
                    emailVerified : true,
                },
                }))?.emailVerified
                ? undefined  // for existing admin => if email already verified => do not modify
                : new Date() // for existing admin => if email not     verified => mark email as verified
            )
        );
        const data = {
            name,
            email,
            emailVerified,
            // password : TODO: hashed password,
            image,
            
            adminRoleId,
        };
        const select = {
            id               : true,
            
            name             : true,
            email            : true,
            image            : true,
            
            adminRoleId      : true,
            
            adminCredentials : {
                select : {
                    username : true,
                },
            },
        };
        const {adminCredentials, ...restAdmin} = (
            !id
            ? await prisma.admin.create({
                data   : {
                    ...data,
                    adminCredentials : (username !== undefined) ? {
                        create : {
                            username,
                        },
                    } : undefined,
                },
                select : select,
            })
            : await prisma.admin.update({
                where  : {
                    id : id,
                },
                data   : {
                    ...data,
                    adminCredentials : (username !== undefined) ? {
                        upsert : {
                            update : {
                                username,
                            },
                            create : {
                                username,
                            },
                        },
                    } : undefined,
                },
                select : select,
            })
        );
        const adminDetail : AdminDetail = {
            ...restAdmin,
            username : adminCredentials?.username ?? null,
        };
        return NextResponse.json(adminDetail); // handled with success
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
    if (!session.role?.admin_d) return NextResponse.json({ error:
`Access denied.

You do not have the privilege to delete the admin.`
    }, { status: 403 }); // handled with error: forbidden
    //#endregion validating privileges
    
    
    
    //#region save changes
    try {
        const deletedAdmin : Pick<AdminDetail, 'id'> = (
            await prisma.admin.delete({
                where  : {
                    id : id,
                },
                select : {
                    id : true,
                },
            })
        );
        return NextResponse.json(deletedAdmin); // handled with success
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        // if (error instanceof RecordNotFound) return NextResponse.json({ error: 'invalid ID' }, { status: 400 }); // handled with error
        return NextResponse.json({ error: error }, { status: 500 }); // handled with error
    } // try
    //#endregion save changes
});
