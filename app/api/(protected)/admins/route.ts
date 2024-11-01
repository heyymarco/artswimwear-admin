// next-js:
import {
    type NextRequest,
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
    type Prisma,
    type Pagination,
    type AdminDetail,
    
    
    
    // schemas:
    PaginationArgSchema,
}                           from '@/models'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'

// internal auth:
import {
    authOptions,
}                           from '@/libs/auth.server'



// configs:
export const dynamic    = 'force-dynamic';
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
.post(async (req) => {
    //#region parsing and validating request
    const requestData = await (async () => {
        try {
            const data = await req.json();
            return {
                paginationArg : PaginationArgSchema.parse(data),
            };
        }
        catch {
            return null;
        } // try
    })();
    if (requestData === null) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    const {
        paginationArg : {
            page,
            perPage,
        },
    } = requestData;
    //#endregion parsing and validating request
    
    
    
    //#region validating privileges
    const session = (req as any).session as Session;
    if (!session.role?.admin_r) return Response.json({ error:
`Access denied.

You do not have the privilege to view the admins.`
    }, { status: 403 }); // handled with error: forbidden
    //#endregion validating privileges
    
    
    
    const [total, paged] = await prisma.$transaction([
        prisma.admin.count(),
        prisma.admin.findMany({
            select: {
                id          : true,
                
                name        : true,
                email       : true,
                image       : true,
                
                credentials : {
                    select : {
                        username : true,
                    },
                },
                
                roleId      : true,
            },
            orderBy : {
                createdAt: 'desc',
            },
            skip    : page * perPage, // note: not scaleable but works in small commerce app -- will be fixed in the future
            take    : perPage,
        }),
    ]);
    const paginationAdminDetail : Pagination<AdminDetail> = {
        total    : total,
        entities : paged.map((admin) => {
            const {
                credentials,
            ...restAdmin} = admin;
            
            return {
                ...restAdmin,
                username : credentials?.username ?? null,
            };
        }),
    };
    return Response.json(paginationAdminDetail); // handled with success
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
        id,
        
        name,
        email,
        password,
        image,
        
        roleId,
        
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
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    //#endregion validating request
    
    
    
    //#region validating privileges
    const session = (req as any).session as Session;
    if (!id) {
        if (!session.role?.admin_c) return Response.json({ error:
`Access denied.

You do not have the privilege to add new admin.`
        }, { status: 403 }); // handled with error: forbidden
        
        if (!session.role?.admin_ur && (roleId !== null) && (roleId !== undefined)) return Response.json({ error:
`Access denied.

You do not have the privilege to add new admin with an admin role.`
        }, { status: 403 }); // handled with error: forbidden
    }
    else {
        if (!session.role?.admin_un && (name !== undefined)) return Response.json({ error:
`Access denied.

You do not have the privilege to modify the admin's name.`
        }, { status: 403 }); // handled with error: forbidden
        
        if (!session.role?.admin_uu && (username !== undefined)) return Response.json({ error:
`Access denied.

You do not have the privilege to modify the admin's username.`
        }, { status: 403 }); // handled with error: forbidden
        
        if (!session.role?.admin_ue && (email !== undefined)) return Response.json({ error:
`Access denied.

You do not have the privilege to modify the admin's email.`
        }, { status: 403 }); // handled with error: forbidden
        
        if (!session.role?.admin_up && (password !== undefined)) return Response.json({ error:
`Access denied.

You do not have the privilege to modify the admin's password.`
        }, { status: 403 }); // handled with error: forbidden
        
        if (!session.role?.admin_ui && (image !== undefined)) return Response.json({ error:
`Access denied.

You do not have the privilege to modify the admin's image.`
        }, { status: 403 }); // handled with error: forbidden
        
        if (!session.role?.admin_ur && (roleId !== undefined)) return Response.json({ error:
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
            
            roleId,
        };
        const select = {
            id          : true,
            
            name        : true,
            email       : true,
            image       : true,
            
            credentials : {
                select : {
                    username : true,
                },
            },
            
            roleId      : true,
        } satisfies Prisma.AdminSelect;
        const {credentials, ...restAdmin} = (
            !id
            ? await prisma.admin.create({
                data   : {
                    ...data,
                    credentials : (username !== undefined) ? {
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
                    credentials : (username !== undefined) ? {
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
            username : credentials?.username ?? null,
        };
        return Response.json(adminDetail); // handled with success
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        // if (error instanceof RecordNotFound) return Response.json({ error: 'invalid ID' }, { status: 400 }); // handled with error
        return Response.json({ error: error }, { status: 500 }); // handled with error
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
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    //#endregion validating request
    
    
    
    //#region validating privileges
    const session = (req as any).session as Session;
    if (!session.role?.admin_d) return Response.json({ error:
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
        return Response.json(deletedAdmin); // handled with success
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        // if (error instanceof RecordNotFound) return Response.json({ error: 'invalid ID' }, { status: 400 }); // handled with error
        return Response.json({ error: error }, { status: 500 }); // handled with error
    } // try
    //#endregion save changes
});
