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
    type CategoryUpdateRequest,
    
    
    
    // schemas:
    ModelIdSchema,
    PaginationArgSchema,
    
    CategoryPageRequestSchema,
    CategoryUpdateRequestSchema,
    CategoryDeleteRequestSchema,
    
    
    
    // utilities:
    categoryDetailSelect,
    
    convertCategoryDetailDataToCategoryDetail,
    type CategoryDiff,
    createCategoryDiff,
    createVariantGroupDiff,
    createCoverageCountryDiff,
    createTemplateVariantDiff,
}                           from '@/models'
import {
    Prisma,
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
    
    
    
    // if (process.env.SIMULATE_SLOW_NETWORK === 'true') {
    //     await new Promise<void>((resolve) => {
    //         setTimeout(() => {
    //             resolve();
    //         }, 2000);
    //     });
    // } // if
    
    // throw '';
    
    
    
    //#region parsing and validating request
    const requestData = await (async () => {
        try {
            const data = await req.json();
            return {
                categoryPageRequest : CategoryPageRequestSchema.parse(data),
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
        categoryPageRequest : {
            page,
            perPage,
            parent,
        },
    } = requestData;
    //#endregion parsing and validating request
    
    
    
    //#region validating privileges
    const session = (req as any).session as Session;
    if (!session.role?.category_r) return Response.json({ error:
`Access denied.

You do not have the privilege to view the categories.`
    }, { status: 403 }); // handled with error: forbidden
    //#endregion validating privileges
    
    
    
    const [total, paged] = await prisma.$transaction(async (prismaTransaction) => {
        const categoryOrderBy : ReturnType<typeof categoryDetailSelect>['subcategories']['orderBy'] = {
            createdAt: 'desc',
        };
        const categorySelect = categoryDetailSelect(categoryOrderBy);
        
        const [total, paged] = await Promise.all([
            prismaTransaction.category.count({
                where   : {
                    parentId : parent,
                },
            }),
            prismaTransaction.category.findMany({
                where   : {
                    parentId : parent,
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
    
    
    
    //#region parsing and validating request
    const requestData = await (async () => {
        try {
            const data = await req.json();
            const categoryUpdateRequestRaw = CategoryUpdateRequestSchema.parse(data);
            if (!categoryUpdateRequestRaw.id) {
                // when creating a new model (no id), the `visibility`|`name`|`path` must be exist:
                if ((categoryUpdateRequestRaw.visibility === undefined) || (categoryUpdateRequestRaw.name === undefined) || (categoryUpdateRequestRaw.path === undefined)) return null;
                
                
                
                return {
                    categoryUpdateRequest : categoryUpdateRequestRaw as CategoryUpdateRequest & Required<Pick<CategoryUpdateRequest, 'visibility'|'name'|'path'>>,
                };
            }
            else {
                return {
                    categoryUpdateRequest : categoryUpdateRequestRaw satisfies CategoryUpdateRequest,
                };
            }
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
        categoryUpdateRequest : {
            parent,
            
            id,
            
            visibility,
            
            name,
            
            path,
            
            excerpt,
            description,
            
            images,
            
            subcategories,
        },
    } = requestData;
    if (parent === id) { // cannot place into itself
        return Response.json({
            error: 'Invalid data.',
        }, { status: 400 }); // handled with error
    } // if
    //#endregion parsing and validating request
    
    
    
    try {
        return await prisma.$transaction(async (prismaTransaction): Promise<Response> => {
            //#region diffing subcategories
            const subcategoryDiff = (subcategories === undefined) ? undefined : await (async (): Promise<CategoryDiff> => {
                const categoryOrderBy: ReturnType<typeof categoryDetailSelect>['subcategories']['orderBy'] = {
                    createdAt: 'desc',
                };
                const categorySelect = categoryDetailSelect(categoryOrderBy);
                const subcategoryOrisData = !id ? [] : await prismaTransaction.category.findMany({
                    where  : {
                        parentId : id,
                    },
                    select : categorySelect,
                });
                return createCategoryDiff(subcategories, await convertCategoryDetailDataToCategoryDetail(categorySelect, subcategoryOrisData, prismaTransaction));
            })()
            //#endregion diffing subcategories
            
            
            
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
                
                if (subcategoryDiff !== undefined) {
                    // const {
                    //     categoryOris : subcategoryOris,
                    //     
                    //     categoryDels : subcategoryDels,
                    //     categoryAdds : subcategoryAdds,
                    //     categoryMods : subcategoryMods,
                    // } = subcategoryDiff;
                    
                    
                    
                    if (!session.role?.category_c && ((): boolean => {
                        const hasDeepNestedAdd = (categoryDiff: CategoryDiff): boolean => {
                            if (categoryDiff.categoryAdds.length) return true;
                            for (const categoryMod of categoryDiff.categoryMods) {
                                if (hasDeepNestedAdd(categoryMod)) return true;
                            } // for
                            return false;
                        };
                        return hasDeepNestedAdd(subcategoryDiff);
                    })()) return Response.json({ error:
`Access denied.

You do not have the privilege to add new category.`
                    }, { status: 403 }); // handled with error: forbidden
                    
                    
                    
                    if (!session.role?.category_d && ((): boolean => {
                        const hasDeepNestedDel = (categoryDiff: CategoryDiff): boolean => {
                            if (categoryDiff.categoryDels.length) return true;
                            for (const categoryMod of categoryDiff.categoryMods) {
                                if (hasDeepNestedDel(categoryMod)) return true;
                            } // for
                            return false;
                        };
                        return hasDeepNestedDel(subcategoryDiff);
                    })()) return Response.json({ error:
`Access denied.

You do not have the privilege to delete the category.`
                    }, { status: 403 }); // handled with error: forbidden
                    
                    
                    
                    if (!session.role?.category_ud && ((): boolean => {
                        const hasDeepNestedModDescription = (categoryDiff: CategoryDiff): boolean => {
                            if (categoryDiff.categoryMods.some(({id, categoryOris: subcategoryOris, name, path, excerpt, description}): boolean => {
                                const subcategoryOri = subcategoryOris.find(({id: idOri}) => (idOri === id));
                                return (
                                    (name        !== subcategoryOri?.name       )
                                    ||
                                    (path        !== subcategoryOri?.path       )
                                    ||
                                    (excerpt     !== subcategoryOri?.excerpt    )
                                    ||
                                    (description !== subcategoryOri?.description)
                                );
                            })) return true;
                            for (const categoryMod of categoryDiff.categoryMods) {
                                if (hasDeepNestedModDescription(categoryMod)) return true;
                            } // for
                            return false;
                        };
                        return hasDeepNestedModDescription(subcategoryDiff);
                    })()) return Response.json({ error:
`Access denied.

You do not have the privilege to modify the category name, path, excerpt, and/or description.`
                    }, { status: 403 }); // handled with error: forbidden
                    
                    
                    
                    if (!session.role?.category_ui && ((): boolean => {
                        const hasDeepNestedModDescription = (categoryDiff: CategoryDiff): boolean => {
                            if (categoryDiff.categoryMods.some(({id, categoryOris: subcategoryOris, images}): boolean => {
                                const imagesOri = subcategoryOris.find(({id: idOri}) => (idOri === id))?.images ?? [];
                                return (
                                    (images.length !== imagesOri.length)
                                    ||
                                    ((): boolean => {
                                        for (let index = 0; index < images.length; index++) {
                                            if (images[index] !== imagesOri[index]) return true;
                                        } // for
                                        return false;
                                    })()
                                );
                            })) return true;
                            for (const categoryMod of categoryDiff.categoryMods) {
                                if (hasDeepNestedModDescription(categoryMod)) return true;
                            } // for
                            return false;
                        };
                        return hasDeepNestedModDescription(subcategoryDiff);
                    })()) return Response.json({ error:
`Access denied.

You do not have the privilege to modify the category images.`
                    }, { status: 403 }); // handled with error: forbidden
                    
                    
                    
                    if (!session.role?.category_uv && ((): boolean => {
                        const hasDeepNestedModDescription = (categoryDiff: CategoryDiff): boolean => {
                            if (categoryDiff.categoryMods.some(({id, categoryOris: subcategoryOris, visibility}): boolean => {
                                const subcategoryOri = subcategoryOris.find(({id: idOri}) => (idOri === id));
                                return (
                                    (visibility !== subcategoryOri?.visibility)
                                );
                            })) return true;
                            for (const categoryMod of categoryDiff.categoryMods) {
                                if (hasDeepNestedModDescription(categoryMod)) return true;
                            } // for
                            return false;
                        };
                        return hasDeepNestedModDescription(subcategoryDiff);
                    })()) return Response.json({ error:
`Access denied.

You do not have the privilege to modify the category visibility.`
                    }, { status: 403 }); // handled with error: forbidden
                } // if
            } // if
            //#endregion validating privileges
            
            
            
            //#region save changes
            const data = {
                visibility,
                
                name,
                
                path,
                
                excerpt,
                description : (description === null) ? Prisma.DbNull : description,
                
                images,
                
                // relations:
                parent : (parent === undefined) ? undefined : {
                    connect    : (parent === null) ? undefined : {
                        id: parent,
                    },
                    disconnect : (parent !== null) ? undefined : true,
                },
            } satisfies Prisma.CategoryUpdateInput;
            
            const categoryOrderBy: ReturnType<typeof categoryDetailSelect>['subcategories']['orderBy'] = {
                createdAt: 'desc',
            };
            const categorySelect = categoryDetailSelect(categoryOrderBy);
            const categoryDetailData = (
                !id
                ? await prismaTransaction.category.create({
                    data   : data as (typeof data & Required<Pick<CategoryUpdateRequest, 'visibility'|'name'|'path'>>),
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
    //#region parsing and validating request
    const requestData = await (async () => {
        try {
            const data = Object.fromEntries(new URL(req.url, 'https://localhost/').searchParams.entries());
            return {
                categoryDeleteRequest : CategoryDeleteRequestSchema.parse(data),
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
        categoryDeleteRequest: {
            id,
        },
    } = requestData;
    //#endregion parsing and validating request
    
    
    
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
