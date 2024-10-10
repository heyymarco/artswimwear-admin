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
    // types:
    type Pagination,
    
    type CategoryDetail,
    
    
    
    // utilities:
    categoryDetailSelect,
    
    convertCategoryDetailDataToCategoryDetail,
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
.post(async (req) => {
    /* required for displaying categories page */
    
    
    
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
        return Response.json({
            error: 'Invalid parameter(s).',
        }, { status: 400 }); // handled with error
    } // if
    //#endregion validating request
    
    
    
    //#region validating privileges
    const session = (req as any).session as Session;
    if (!session.role?.category_r) return Response.json({ error:
`Access denied.

You do not have the privilege to view the categories.`
    }, { status: 403 }); // handled with error: forbidden
    //#endregion validating privileges
    
    
    
    const [total, paged] = await prisma.$transaction(async (prismaTransaction) => {
        const categoryOrderBy: Extract<Prisma.CategorySelect['subcategories'], object>['orderBy'] = {
            createdAt: 'desc',
        };
        const categorySelect = categoryDetailSelect(categoryOrderBy);
        
        const [total, paged] = await Promise.all([
            prismaTransaction.category.count(),
            prismaTransaction.category.findMany({
                where   : {
                    parentId : null, // important to avoid cyclic `parent` reference, we select the top_most category
                },
                select  : categorySelect,
                orderBy : categoryOrderBy,
                skip    : (page - 1) * perPage, // note: not scaleable but works in small commerce app -- will be fixed in the future
                take    : perPage,
            }),
        ]);
        const pagedCategories = await convertCategoryDetailDataToCategoryDetail(categorySelect, paged, prismaTransaction);
        
        return [total, pagedCategories];
    });
    const paginationCategoryDetail : Pagination<CategoryDetail> = {
        total    : total,
        entities : paged,
    };
    return Response.json(paginationCategoryDetail); // handled with success
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
        
        visibility,
        
        name,
        
        path,
        
        excerpt,
        description,
        
        images,
    } = await req.json();
    //#endregion parsing request
    
    
    
    //#region validating request
    if (
        (typeof(id)      !== 'string' )
        
        ||
        
        ((visibility     !== undefined)                              && ((typeof(visibility)     !== 'string') || !['PUBLISHED', 'HIDDEN', 'DRAFT'].includes(visibility)))
        ||
        ((name           !== undefined)                              && ((typeof(name)           !== 'string') || (name.length    < 1)))
        ||
        ((path           !== undefined)                              && ((typeof(path)           !== 'string') || (path.length    < 1)))
        ||
        ((excerpt        !== undefined) && (excerpt        !== null) && ((typeof(excerpt)        !== 'string') || (excerpt.length < 1)))
        ||
        ((description    !== undefined) && (description    !== null) &&  (typeof(description)    !== 'object'))
        ||
        ((images         !== undefined)                              && ((Array.isArray(images)  !== true    ) || !images.every((image) => (typeof(image) === 'string') && !!image.length)))
    ) {
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    //#endregion validating request
    
    
    
    try {
        return await prisma.$transaction(async (prismaTransaction): Promise<Response> => {
            //#region validating privileges
            const session = (req as any).session as Session;
            if (!id) {
                if (!session.role?.category_c) return Response.json({ error:
`Access denied.

You do not have the privilege to add new category.`
                }, { status: 403 }); // handled with error: forbidden
            }
            else {
                if (!session.role?.category_ud && ((name !== undefined) || (path !== undefined) || (excerpt !== undefined) || (description !== undefined))) return Response.json({ error:
`Access denied.

You do not have the privilege to modify the category name, path, excerpt, and/or description.`
                }, { status: 403 }); // handled with error: forbidden
                
                if (!session.role?.category_ui && (images !== undefined)) return Response.json({ error:
`Access denied.

You do not have the privilege to modify the category images.`
                }, { status: 403 }); // handled with error: forbidden
                
                if (!session.role?.category_uv && (visibility !== undefined)) return Response.json({ error:
`Access denied.

You do not have the privilege to modify the category visibility.`
                }, { status: 403 }); // handled with error: forbidden
            } // if
            //#endregion validating privileges
            
            
            
            //#region save changes
            const data = {
                visibility,
                
                name,
                
                path,
                
                excerpt,
                description,
                
                images,
                
                // relations:
            } satisfies Prisma.CategoryUpdateInput;
            
            const categoryOrderBy: Extract<Prisma.CategorySelect['subcategories'], object>['orderBy'] = {
                createdAt: 'desc',
            };
            const categorySelect = categoryDetailSelect(categoryOrderBy);
            const categoryDetailData = (
                !id
                ? await prismaTransaction.category.create({
                    data   : data,
                    select : categorySelect,
                })
                : await prismaTransaction.category.update({
                    where  : {
                        id : id,
                    },
                    data   : data,
                    select : categorySelect,
                })
            );
            const [categoryDetail] = await convertCategoryDetailDataToCategoryDetail(categorySelect, [categoryDetailData], prismaTransaction);
            
            
            
            return Response.json(categoryDetail); // handled with success
            //#endregion save changes
        });
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        // if (error instanceof RecordNotFound) return Response.json({ error: 'invalid ID' }, { status: 400 }); // handled with error
        return Response.json({ error: error }, { status: 500 }); // handled with error
    } // try
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
    if (!session.role?.category_d) return Response.json({ error:
`Access denied.

You do not have the privilege to delete the category.`
    }, { status: 403 }); // handled with error: forbidden
    //#endregion validating privileges
    
    
    
    //#region save changes
    try {
        const deletedCategory : Pick<CategoryDetail, 'id'> = (
            await prisma.category.delete({
                where  : {
                    id : id,
                },
                select : {
                    id : true,
                },
            })
        );
        return Response.json(deletedCategory); // handled with success
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        // if (error instanceof RecordNotFound) return Response.json({ error: 'invalid ID' }, { status: 400 }); // handled with error
        return Response.json({ error: error }, { status: 500 }); // handled with error
    } // try
    //#endregion save changes
});
