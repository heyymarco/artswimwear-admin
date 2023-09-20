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

// types:
import type {
    Pagination,
}                           from '@/libs/types'

// models:
import type {
    User,
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
export interface UserDetail
    extends
        Omit<User,
            |'createdAt'
            |'updatedAt'
            
            |'emailVerified'
        >
{
    username : string|null
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
    return next();
})
.post(async (req) => {
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
    
    
    
    const [total, paged] = await prisma.$transaction([
        prisma.user.count(),
        prisma.user.findMany({
            select: {
                id               : true,
                
                name             : true,
                email            : true,
                image            : true,
                
                roleId           : true,
                
                credentials : {
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
    const paginationUserDetail : Pagination<UserDetail> = {
        total    : total,
        entities : paged.map((user) => {
            const {
                credentials,
            ...restUser} = user;
            
            return {
                ...restUser,
                username : credentials?.username ?? null,
            };
        }),
    };
    return NextResponse.json(paginationUserDetail); // handled with success
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
        ((image !== undefined) && ((typeof(image) !== 'string') || (image.length < 1)))
        ||
        ((username !== undefined) && ((typeof(username) !== 'string') || (username.length < 1)))
        
        // TODO: validating data type & constraints
    ) {
        return NextResponse.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    //#endregion validating request
    
    
    
    //#region save changes
    try {
        const emailVerified : Date|undefined = (
            !id
            ? new Date() // for a new User => mark email as verified
            : (
                !!(await prisma.user.findUnique({
                where  : {
                    id : id,
                },
                select : {
                    emailVerified : true,
                },
                }))?.emailVerified
                ? undefined  // for existing user => if email already verified => do not modify
                : new Date() // for existing user => if email not     verified => mark email as verified
            )
        );
        const data = {
            name,
            email,
            emailVerified,
            image,
            
            roleId,
        };
        const select = {
            id               : true,
            
            name             : true,
            email            : true,
            image            : true,
            
            roleId           : true,
            
            credentials : {
                select : {
                    username : true,
                },
            },
        };
        const {credentials, ...restUser} = (
            !id
            ? await prisma.user.create({
                data   : {
                    ...data,
                    credentials : {
                        create : {
                            username,
                        },
                    },
                },
                select : select,
            })
            : await prisma.user.update({
                where  : {
                    id : id,
                },
                data   : {
                    ...data,
                    credentials : {
                        connectOrCreate : {
                            where  : {
                                userId : id,
                            },
                            create : {
                                username,
                            },
                        },
                        update : {
                            data : {
                                username,
                            },
                        },
                    },
                },
                select : select,
            })
        );
        const userDetail : UserDetail = {
            ...restUser,
            username : credentials?.username ?? null,
        };
        return NextResponse.json(userDetail); // handled with success
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        // if (error instanceof RecordNotFound) return NextResponse.json({ error: 'invalid ID' }, { status: 400 }); // handled with error
        return NextResponse.json({ error: error }, { status: 500 }); // handled with error
    } // try
    //#endregion save changes
});
