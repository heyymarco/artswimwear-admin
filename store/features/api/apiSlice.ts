// redux:
import {
    type Dictionary,
    type EntityState,
    
    createEntityAdapter,
}                           from '@reduxjs/toolkit'
import {
    type QuerySubState,
    type BaseQueryFn,
    QueryStatus,
    
    createApi,
}                           from '@reduxjs/toolkit/query/react'
import {
    type BaseEndpointDefinition,
    type MutationLifecycleApi,
}                           from '@reduxjs/toolkit/dist/query/endpointDefinitions'

// models:
import {
    type Model,
    
    type Pagination,
    
    type MutationArgs,
    type PaginationArgs,
    
    type OrderDetail,
    type OrderDetailWithOptions,
    type DefaultShippingOriginDetail,
    type ShippingPreview,
    type ShippingDetail,
    type RoleDetail,
    type ProductPreview,
    type ProductDetail,
    type ProductUpdateRequest,
    type CategoryDetail,
    type CategoryPageRequest,
    type CategoryUpdateRequest,
    type CategoryDeleteParam,
    type TemplateVariantGroupDetail,
    type AdminDetail,
    type AdminPreferenceData,
    type AdminPreferenceDetail,
    
    type ShipmentDetail,
    
    type ShippingLabelRequest,
    type ShippingLabelDetail,
}                           from '@/models'

// apis:
import {
    type ImageId,
}                           from '@/app/api/(protected)/uploads/route'

// other libs:
import {
    type AxiosRequestConfig,
    type AxiosError,
    
    default as axios,
    CanceledError,
}                           from 'axios'



const shippingListAdapter             = createEntityAdapter<ShippingPreview>({
    selectId : (shippingPreview) => shippingPreview.id,
});
const templateVariantGroupListAdapter = createEntityAdapter<TemplateVariantGroupDetail>({
    selectId : (roleDetail) => roleDetail.id,
});
const roleListAdapter                 = createEntityAdapter<RoleDetail>({
    selectId : (roleDetail) => roleDetail.id,
});
const shippingLabelListAdapter        = createEntityAdapter<ShippingLabelDetail>({
    selectId : (shippingLabelDetail) => shippingLabelDetail.id,
});



// utilities:
const updateDeepNestedCategory = (pagination: Pagination<CategoryDetail>, parentCategoryId: string, updatedCategory: CategoryDetail|string): void => {
    for (const categoryDetail of pagination.entities) {
        updateDeepNestedCategoryReqursive(categoryDetail, parentCategoryId, updatedCategory);
    } // for
};
const updateDeepNestedCategoryReqursive = (categoryDetail: CategoryDetail, parentCategoryId: string, updatedCategory: CategoryDetail|string): void => {
    if (categoryDetail.id === parentCategoryId) { // found => update
        const updatedCategoryId = (typeof(updatedCategory) === 'string') ? updatedCategory : updatedCategory.id;
        const modelIndex = categoryDetail.subcategories.findIndex(({id: searchId}) => (searchId === updatedCategoryId));
        if (typeof(updatedCategory) === 'string') {
            if (modelIndex >= 0) { // delete existing model
                categoryDetail.subcategories.splice(modelIndex, 1);
            } // if
        }
        else {
            if (modelIndex < 0) { // append new model
                categoryDetail.subcategories.unshift(updatedCategory);
            }
            else { // update existing model
                categoryDetail.subcategories[modelIndex] = updatedCategory;
            } // if
        } // if
    }
    else { // not found => deep search
        for (const nestedCategoryDetail of categoryDetail.subcategories) {
            updateDeepNestedCategoryReqursive(nestedCategoryDetail, parentCategoryId, updatedCategory);
        } // for
    } // if
};



const axiosBaseQuery = (
    { baseUrl }: { baseUrl: string } = { baseUrl: '' }
): BaseQueryFn<
    AxiosRequestConfig<any> & { body ?: {}, abortSignal?: AbortSignal },
    unknown,
    unknown
> => {
    return async ({ url, body, data, abortSignal, signal, ...restAxiosRequestConfig }, api) => {
        try {
            const result = await axios({
                ...restAxiosRequestConfig,
                url    : `${baseUrl}/${url}`,
                data   : data ?? body,
                signal : signal ?? abortSignal ?? api.signal,
            });
            
            return {
                data: result.data,
            };
        }
        catch (error) {
            if (error instanceof CanceledError) {
                const canceledError = error;
                return {
                    error : {
                        status : 0, // non_standard HTTP status code: a request was aborted
                        data   : canceledError.message,
                    },
                };
            } // if
            
            
            
            let axiosError = error as AxiosError;
            return {
                error: {
                    status : axiosError.response?.status,
                    data   : axiosError.response?.data || axiosError.message,
                },
            };
        }
    };
};

export const apiSlice = createApi({
    reducerPath : 'api',
    baseQuery : axiosBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/api`
    }),
    tagTypes: ['ProductPage', 'CategoryPage', 'TemplateVariantGroupEntity', 'OrderPage', 'ShippingPage', 'DefaultShippingOriginData', 'AdminPage', 'RoleEntity', 'PreferenceData'],
    endpoints : (builder) => ({
        getProductPage              : builder.query<Pagination<ProductDetail>, PaginationArgs>({
            query : (arg) => ({
                url    : 'products',
                method : 'POST',
                body   : arg,
            }),
            providesTags: (data, error, arg) => [{ type: 'ProductPage', id: arg.page }],
        }),
        updateProduct               : builder.mutation<ProductDetail, ProductUpdateRequest>({
            query: (arg) => ({
                url    : 'products',
                method : 'PATCH',
                body   : arg
            }),
            onQueryStarted: async (arg, api) => {
                await cumulativeUpdatePaginationCache(api, 'getProductPage', (arg.id === '') ? 'CREATE' : 'UPDATE', 'ProductPage');
            },
        }),
        deleteProduct               : builder.mutation<Pick<ProductDetail, 'id'>, MutationArgs<Pick<ProductDetail, 'id'>>>({
            query: (arg) => ({
                url    : `products?id=${encodeURIComponent(arg.id)}`,
                method : 'DELETE',
                body   : arg
            }),
            onQueryStarted: async (arg, api) => {
                await cumulativeUpdatePaginationCache(api, 'getProductPage', 'DELETE', 'ProductPage');
            },
        }),
        
        getProductPreview           : builder.query<ProductPreview, string>({
            query : (arg) => ({
                url    : `products?id=${encodeURIComponent(arg)}`,
                method : 'GET',
            }),
        }),
        productAvailablePath        : builder.query<boolean, string>({
            query: (arg) => ({
                url    : `products/check-path?path=${encodeURIComponent(arg)}`,
                method : 'GET',
            }),
        }),
        
        
        
        getCategoryPage             : builder.query<Pagination<CategoryDetail>, CategoryPageRequest>({
            query : (arg) => ({
                url    : 'products/categories',
                method : 'POST',
                body   : arg,
            }),
            providesTags: (data, error, arg) => [{ type: 'CategoryPage', id: `${arg.parent ?? ''}:${arg.page}` }],
        }),
        updateCategory              : builder.mutation<CategoryDetail, CategoryUpdateRequest>({
            query: (arg) => ({
                url    : 'products/categories',
                method : 'PATCH',
                body   : arg
            }),
            onQueryStarted: async (arg, api) => {
                await cumulativeUpdatePaginationCache(api, 'getCategoryPage', (arg.id === '') ? 'CREATE' : 'UPDATE', { type: 'CategoryPage', id: arg.parent ?? ''}, { predicate: (arg.id === '') ? (originalArgs) => ((originalArgs as CategoryUpdateRequest).parent === arg.parent) : undefined, });
                
                
                
                //#region pesimistic update
                // update related_affected_category in `getCategoryPage`:
                await (async (): Promise<void> => {
                    if (!arg.parent) return;
                    const parentCategoryId = arg.parent;
                    
                    
                    
                    const updatedCategory = await(async () => {
                        try {
                            return (await api.queryFulfilled).data;
                        }
                        catch {
                            return undefined;
                        } // try
                    })();
                    if (!updatedCategory) return;
                    
                    
                    
                    // find related TModel data(s):
                    const endpointName        = 'getCategoryPage';
                    const categoryQueryCaches = getQueryCaches<Pagination<CategoryDetail>, CategoryPageRequest>(api, endpointName);
                    
                    
                    
                    // update cache:
                    for (const { originalArgs } of categoryQueryCaches) {
                        if (originalArgs === undefined) continue;
                        api.dispatch(
                            apiSlice.util.updateQueryData(endpointName, originalArgs, (data) => {
                                updateDeepNestedCategory(data, parentCategoryId, updatedCategory);
                            })
                        );
                    } // for
                })();
                //#endregion pesimistic update
            },
        }),
        deleteCategory              : builder.mutation<Pick<CategoryDetail, 'id'>, CategoryDeleteParam>({
            query: ({ id }) => ({
                url    : `products/categories?id=${encodeURIComponent(id)}`,
                method : 'DELETE',
            }),
            onQueryStarted: async (arg, api) => {
                await cumulativeUpdatePaginationCache(api, 'getCategoryPage', 'DELETE', { type: 'CategoryPage', id: arg.parent ?? ''});
                
                
                
                //#region pesimistic update
                // update related_affected_category in `getCategoryPage`:
                await (async (): Promise<void> => {
                    if (!arg.parent) return;
                    const parentCategoryId = arg.parent;
                    
                    
                    
                    const deletedCategoryId = await(async () => {
                        try {
                            await api.queryFulfilled;
                            return arg.id;
                        }
                        catch {
                            return undefined;
                        } // try
                    })();
                    if (!deletedCategoryId) return;
                    
                    
                    
                    // find related TModel data(s):
                    const endpointName        = 'getCategoryPage';
                    const categoryQueryCaches = getQueryCaches<Pagination<CategoryDetail>, CategoryPageRequest>(api, endpointName);
                    
                    
                    
                    // update cache:
                    for (const { originalArgs } of categoryQueryCaches) {
                        if (originalArgs === undefined) continue;
                        api.dispatch(
                            apiSlice.util.updateQueryData(endpointName, originalArgs, (data) => {
                                updateDeepNestedCategory(data, parentCategoryId, deletedCategoryId);
                            })
                        );
                    } // for
                })();
                //#endregion pesimistic update
            },
        }),
        
        categoryAvailablePath       : builder.query<boolean, string>({
            query: (arg) => ({
                url    : `products/categories/check-path?path=${encodeURIComponent(arg)}`,
                method : 'GET',
            }),
        }),
        
        
        
        getTemplateVariantGroupList : builder.query<EntityState<TemplateVariantGroupDetail>, void>({
            query : () => ({
                url    : 'products/template-variants',
                method : 'GET',
            }),
            transformResponse(response: TemplateVariantGroupDetail[]) {
                return templateVariantGroupListAdapter.addMany(templateVariantGroupListAdapter.getInitialState(), response);
            },
            providesTags: ['TemplateVariantGroupEntity'],
        }),
        updateTemplateVariantGroup  : builder.mutation<TemplateVariantGroupDetail, MutationArgs<TemplateVariantGroupDetail>>({
            query: (arg) => ({
                url    : 'products/template-variants',
                method : 'PATCH',
                body   : arg
            }),
            onQueryStarted: async (arg, api) => {
                await cumulativeUpdateEntityCache(api, 'getTemplateVariantGroupList', 'UPSERT', 'TemplateVariantGroupEntity');
            },
        }),
        deleteTemplateVariantGroup  : builder.mutation<Pick<TemplateVariantGroupDetail, 'id'>, MutationArgs<Pick<TemplateVariantGroupDetail, 'id'>>>({
            query: (arg) => ({
                url    : 'products/template-variants',
                method : 'DELETE',
                body   : arg
            }),
            onQueryStarted: async (arg, api) => {
                await cumulativeUpdateEntityCache(api, 'getTemplateVariantGroupList', 'DELETE', 'TemplateVariantGroupEntity');
            },
        }),
        
        
        
        getOrderPage                : builder.query<Pagination<OrderDetail>, PaginationArgs>({
            query : (arg) => ({
                url    : 'orders',
                method : 'POST',
                body   : arg,
            }),
            providesTags: (data, error, arg) => [{ type: 'OrderPage', id: arg.page }],
        }),
        updateOrder                 : builder.mutation<OrderDetail, MutationArgs<OrderDetailWithOptions>>({
            query: (arg) => ({
                url    : 'orders',
                method : 'PATCH',
                body   : arg
            }),
            onQueryStarted: async (arg, api) => {
                await cumulativeUpdatePaginationCache(api, 'getOrderPage', (arg.id === '') ? 'CREATE' : 'UPDATE', 'OrderPage');
            },
        }),
        
        getShipment                 : builder.query<ShipmentDetail, string>({
            query : (orderId) => ({
                url    : `orders/shipment?orderId=${encodeURIComponent(orderId)}`,
                method : 'GET',
            }),
        }),
        getShippingLabelRates       : builder.query<EntityState<ShippingLabelDetail>, ShippingLabelRequest>({
            query : (shippingLabelRequest) => ({
                url    : 'orders/shipping-label',
                method : 'POST',
                body   : shippingLabelRequest,
            }),
            transformResponse(response: ShippingLabelDetail[]) {
                return shippingLabelListAdapter.addMany(shippingLabelListAdapter.getInitialState(), response);
            },
        }),
        
        
        
        getShippingPage             : builder.query<Pagination<ShippingDetail>, PaginationArgs>({
            query : (arg) => ({
                url    : 'shippings',
                method : 'POST',
                body   : arg,
            }),
            providesTags: (data, error, arg) => [{ type: 'ShippingPage', id: arg.page }],
        }),
        updateShipping              : builder.mutation<ShippingDetail, MutationArgs<ShippingDetail>>({
            query: (arg) => ({
                url    : 'shippings',
                method : 'PATCH',
                body   : arg
            }),
            onQueryStarted: async (arg, api) => {
                await cumulativeUpdatePaginationCache(api, 'getShippingPage', (arg.id === '') ? 'CREATE' : 'UPDATE', 'ShippingPage');
            },
        }),
        deleteShipping              : builder.mutation<Pick<ShippingDetail, 'id'>, MutationArgs<Pick<ShippingDetail, 'id'>>>({
            query: (params) => ({
                url    : 'shippings',
                method : 'DELETE',
                body   : params
            }),
            onQueryStarted: async (arg, api) => {
                await cumulativeUpdatePaginationCache(api, 'getShippingPage', 'DELETE', 'ShippingPage');
            },
        }),
        
        getDefaultShippingOrigin    : builder.query<DefaultShippingOriginDetail|null, void>({
            query : () => ({
                url    : 'shippings/origin',
                method : 'GET',
            }),
            providesTags: ['DefaultShippingOriginData'],
        }),
        updateDefaultShippingOrigin : builder.mutation<DefaultShippingOriginDetail, MutationArgs<DefaultShippingOriginDetail>|null>({
            query: (arg) => ({
                url    : 'shippings/origin',
                method : 'PATCH',
                body   : arg ?? {}
            }),
            invalidatesTags: ['DefaultShippingOriginData'],
        }),
        
        getShippingList             : builder.query<EntityState<ShippingPreview>, void>({
            query : () => ({
                url    : 'shippings',
                method : 'GET',
            }),
            transformResponse(response: ShippingPreview[]) {
                return shippingListAdapter.addMany(shippingListAdapter.getInitialState(), response);
            },
        }),
        
        getCountryList              : builder.query<string[], void>({
            query : () => ({
                url    : `shippings/countries`,
                method : 'GET',
            }),
        }),
        getStateList                : builder.query<string[], { countryCode: string }>({
            query : ({countryCode}) => ({
                url    : `shippings/states?countryCode=${encodeURIComponent(countryCode)}`,
                method : 'GET',
            }),
        }),
        getCityList                 : builder.query<string[], { countryCode: string, state: string }>({
            query : ({countryCode, state}) => ({
                url    : `shippings/cities?countryCode=${encodeURIComponent(countryCode)}&state=${encodeURIComponent(state)}`,
                method : 'GET',
            }),
        }),
        
        
        
        getAdminPage                : builder.query<Pagination<AdminDetail>, PaginationArgs>({
            query : (arg) => ({
                url    : 'admins',
                method : 'POST',
                body   : arg,
            }),
            providesTags: (data, error, arg) => [{ type: 'AdminPage', id: arg.page }],
        }),
        updateAdmin                 : builder.mutation<AdminDetail, MutationArgs<AdminDetail>>({
            query: (arg) => ({
                url    : 'admins',
                method : 'PATCH',
                body   : arg
            }),
            onQueryStarted: async (arg, api) => {
                await cumulativeUpdatePaginationCache(api, 'getAdminPage', (arg.id === '') ? 'CREATE' : 'UPDATE', 'AdminPage');
            },
        }),
        deleteAdmin                 : builder.mutation<Pick<AdminDetail, 'id'>, MutationArgs<Pick<AdminDetail, 'id'>>>({
            query: (params) => ({
                url    : 'admins',
                method : 'DELETE',
                body   : params
            }),
            onQueryStarted: async (arg, api) => {
                await cumulativeUpdatePaginationCache(api, 'getAdminPage', 'DELETE', 'AdminPage');
            },
        }),
        
        availableUsername           : builder.query<boolean, string>({
            query: (username) => ({
                url    : `admins/check-username?username=${encodeURIComponent(username)}`, // cloned from @heymarco/next-auth, because this api was disabled in auth.config.shared
                method : 'GET',
            }),
        }),
        notProhibitedUsername       : builder.query<boolean, string>({
            query: (username) => ({
                url    : `admins/check-username?username=${encodeURIComponent(username)}`, // cloned from @heymarco/next-auth, because this api was disabled in auth.config.shared
                method : 'PUT',
            }),
        }),
        availableEmail              : builder.query<boolean, string>({
            query: (email) => ({
                url    : `admins/check-email?email=${encodeURIComponent(email)}`, // cloned from @heymarco/next-auth, because this api was disabled in auth.config.shared
                method : 'GET',
            }),
        }),
        
        
        
        getRoleList                 : builder.query<EntityState<RoleDetail>, void>({
            query : () => ({
                url    : 'roles',
                method : 'GET',
            }),
            transformResponse(response: RoleDetail[]) {
                return roleListAdapter.addMany(roleListAdapter.getInitialState(), response);
            },
            providesTags: ['RoleEntity'],
        }),
        updateRole                  : builder.mutation<RoleDetail, MutationArgs<RoleDetail>>({
            query: (arg) => ({
                url    : 'roles',
                method : 'PATCH',
                body   : arg
            }),
            onQueryStarted: async (arg, api) => {
                await cumulativeUpdateEntityCache(api, 'getRoleList', 'UPSERT', 'RoleEntity');
            },
        }),
        deleteRole                  : builder.mutation<Pick<RoleDetail, 'id'>, MutationArgs<Pick<RoleDetail, 'id'>>>({
            query: (arg) => ({
                url    : 'roles',
                method : 'DELETE',
                body   : arg
            }),
            onQueryStarted: async (arg, api) => {
                await cumulativeUpdateEntityCache(api, 'getRoleList', 'DELETE', 'RoleEntity');
            },
        }),
        
        availableRolename           : builder.query<boolean, string>({
            query: (name) => ({
                url    : `roles/check-name?name=${encodeURIComponent(name)}`,
                method : 'GET',
            }),
        }),
        
        
        
        getPreference               : builder.query<AdminPreferenceDetail, void>({
            query : () => ({
                url    : 'admins/preferences',
                method : 'GET',
            }),
            providesTags: ['PreferenceData'],
        }),
        updatePreference            : builder.mutation<AdminPreferenceDetail, MutationArgs<AdminPreferenceData>>({
            query: (arg) => ({
                url    : 'admins/preferences',
                method : 'PATCH',
                body   : arg
            }),
            invalidatesTags: ['PreferenceData'],
        }),
        
        
        
        postImage                   : builder.mutation<ImageId, { image: File, folder?: string, onUploadProgress?: (percentage: number) => void, abortSignal?: AbortSignal }>({
            query: ({ image, folder, onUploadProgress, abortSignal }) => ({
                url     : 'uploads',
                method  : 'POST',
                headers : { 'content-type': 'multipart/form-data' },
                body    : ((): FormData => {
                    const formData = new FormData();
                    formData.append('image' , image);
                    if (folder) formData.append('folder', folder);
                    return formData;
                })(),
                onUploadProgress(event) {
                    onUploadProgress?.(
                        (event.loaded * 100) / (event.total ?? 100)
                    );
                },
                abortSignal,
            }),
        }),
        deleteImage                 : builder.mutation<ImageId[], { imageId: string[] }>({
            query: ({ imageId }) => ({
                url     : 'uploads',
                method  : 'PATCH',
                body    : {
                    image : imageId,
                },
            }),
        }),
        moveImage                   : builder.mutation<{ from: string, to: string }[], { imageId: string[], folder?: string }>({
            query: ({ imageId, folder }) => ({
                url     : 'uploads',
                method  : 'PUT',
                body    : {
                    image  : imageId,
                    folder : folder,
                },
            }),
        }),
    }),
});



export const {
    useGetProductPageQuery                 : useGetProductPage,
    useUpdateProductMutation               : useUpdateProduct,
    useDeleteProductMutation               : useDeleteProduct,
    
    useGetProductPreviewQuery              : useGetProductPreview,
    useLazyProductAvailablePathQuery       : useProductAvailablePath,
    
    
    
    useGetCategoryPageQuery                : useGetCategoryPage,
    useUpdateCategoryMutation              : useUpdateCategory,
    useDeleteCategoryMutation              : useDeleteCategory,
    
    useLazyCategoryAvailablePathQuery      : useCategoryAvailablePath,
    
    
    
    useGetTemplateVariantGroupListQuery    : useGetTemplateVariantGroupList,
    useUpdateTemplateVariantGroupMutation  : useUpdateTemplateVariantGroup,
    useDeleteTemplateVariantGroupMutation  : useDeleteTemplateVariantGroup,
    
    
    
    useGetOrderPageQuery                   : useGetOrderPage,
    useUpdateOrderMutation                 : useUpdateOrder,
    
    useGetShipmentQuery                    : useGetShipment,
    useLazyGetShippingLabelRatesQuery      : useGetShippingLabelRates,
    
    
    
    useGetShippingPageQuery                : useGetShippingPage,
    useUpdateShippingMutation              : useUpdateShipping,
    useDeleteShippingMutation              : useDeleteShipping,
    
    useGetDefaultShippingOriginQuery       : useGetDefaultShippingOrigin,
    useUpdateDefaultShippingOriginMutation : useUpdateDefaultShippingOrigin,
    
    useGetShippingListQuery                : useGetShippingList,
    
    // useLazyGetCountryListQuery             : useGetCountryList,
    // useLazyGetStateListQuery               : useGetStateList,
    // useLazyGetCityListQuery                : useGetCityList,
    
    
    
    useGetAdminPageQuery                   : useGetAdminPage,
    useUpdateAdminMutation                 : useUpdateAdmin,
    useDeleteAdminMutation                 : useDeleteAdmin,
    
    useLazyAvailableUsernameQuery          : useAvailableUsername,
    useLazyNotProhibitedUsernameQuery      : useNotProhibitedUsername,
    useLazyAvailableEmailQuery             : useAvailableEmail,
    
    
    
    useGetRoleListQuery                    : useGetRoleList,
    useUpdateRoleMutation                  : useUpdateRole,
    useDeleteRoleMutation                  : useDeleteRole,
    
    useLazyAvailableRolenameQuery          : useAvailableRolename,
    
    
    
    useGetPreferenceQuery                  : useGetPreference,
    useUpdatePreferenceMutation            : useUpdatePreference,
    
    
    
    usePostImageMutation                   : usePostImage,
    useDeleteImageMutation                 : useDeleteImage,
    useMoveImageMutation                   : useMoveImage,
} = apiSlice;

export const {
    getProductPreview : { initiate : getProductPreview },
    
    
    
    getCountryList    : { initiate : getCountryList    },
    getStateList      : { initiate : getStateList      },
    getCityList       : { initiate : getCityList       },
} = apiSlice.endpoints;



// utilities:
const selectTotalFromData   = (data: unknown): number => {
    return (
        ('ids' in (data as EntityState<unknown>|Pagination<unknown>))
        ? (data as EntityState<unknown>).ids.length
        : (data as Pagination<unknown>).total
    );
};
const selectModelsFromData  = <TModel extends Model|string>(data: unknown): TModel[] => {
    const items = (
        ('ids' in (data as EntityState<TModel>|Pagination<TModel>))
        ? Object.values((data as EntityState<TModel>).entities).filter((entity) : entity is Exclude<typeof entity, undefined> => (entity !== undefined))
        : (data as Pagination<TModel>).entities
    );
    return items;
};
const selectIdFromModel     = <TModel extends Model|string>(model: TModel): string => {
    return (typeof(model) === 'string') ? model : model.id;
};
const selectIndexOfId       = <TModel extends Model|string>(data: unknown, id: string): number => {
    return (
        ('ids' in (data as EntityState<TModel>|Pagination<TModel>))
        ? (
            (data as EntityState<TModel>).ids
            .findIndex((searchId) =>
                (searchId === id)
            )
        )
        : (
            (data as Pagination<TModel>).entities
            .findIndex((searchModel) =>
                (selectIdFromModel<TModel>(searchModel) === id)
            )
        )
    );
};
const selectRangeFromArg    = (originalArg: unknown): { indexStart: number, indexEnd: number, page: number, perPage: number } => {
    const paginationArgs = originalArg as PaginationArgs;
    const {
        page,
        perPage,
    } = paginationArgs;
    
    
    
    /*
        index   [page, perpage]     indexStart          indexEnd
        012	    [0, 3]              0 * 3   = 0       (0 + 3) - 1   = 2
        345	    [1, 3]              1 * 3   = 3       (3 + 3) - 1   = 5
        678	    [2, 3]              2 * 3   = 6       (6 + 3) - 1   = 8
    */
    const indexStart = page * perPage; // the model_index of the first_model of current pagination
    const indexEnd   = indexStart + (perPage - 1);
    return {
        indexStart,
        indexEnd,
        page,
        perPage,
    };
};



interface GetQueryCachesOptions {
    predicate ?: (originalArgs: unknown) => boolean
}
const getQueryCaches = <TModel, TQueryArg, TBaseQuery extends BaseQueryFn = BaseQueryFn>(api: MutationLifecycleApi<unknown, TBaseQuery, unknown, 'api'>, endpointName: keyof (typeof apiSlice)['endpoints'], options?: GetQueryCachesOptions) => {
    // options
    const {
        predicate,
    } = options ?? {};
    
    
    
    // find related TModel data(s):
    const state                 = api.getState();
    const allQueryCaches        = state.api.queries;
    const collectionQueryCaches = (
        Object.values(allQueryCaches)
        .filter((allQueryCache): allQueryCache is Exclude<typeof allQueryCache, undefined> =>
            (allQueryCache !== undefined)
            &&
            (allQueryCache.status === QueryStatus.fulfilled)
            &&
            (allQueryCache.endpointName === endpointName)
            &&
            (allQueryCache.data !== undefined)
            &&
            ((predicate === undefined) || predicate(allQueryCache.originalArgs))
        )
    );
    return collectionQueryCaches as QuerySubState<BaseEndpointDefinition<TQueryArg, TBaseQuery, TModel>>[];
};

type PaginationUpdateType =
    |'CREATE'
    |'UPDATE'
    |'UPSERT'
    |'UPDATE_OR_INVALIDATE'
    |'DELETE'
interface PaginationUpdateOptions<TModel extends Model|string>
    extends
        GetQueryCachesOptions
{
    providedMutatedModel ?: TModel
    invalidatePageTag    ?: (tag: Parameters<typeof apiSlice.util.invalidateTags>[0][number], page: number) => string|number
}
const cumulativeUpdatePaginationCache = async <TModel extends Model|string, TQueryArg, TBaseQuery extends BaseQueryFn>(api: MutationLifecycleApi<TQueryArg, TBaseQuery, TModel, 'api'>, endpointName: Extract<keyof (typeof apiSlice)['endpoints'], 'getProductPage'|'getCategoryPage'|'getOrderPage'|'getShippingPage'|'getAdminPage'>, updateType: PaginationUpdateType, invalidateTag: Parameters<typeof apiSlice.util.invalidateTags>[0][number], options?: PaginationUpdateOptions<TModel>) => {
    // options
    const {
        providedMutatedModel,
        invalidatePageTag = (tag: Parameters<typeof apiSlice.util.invalidateTags>[0][number], page: number) => {
            if (typeof(tag) === 'string') {
                return page; // the tag doesn't have id => just use page number
            }
            else {
                const { id } = tag;
                return `${id}:${page}`; // merges tag's id and page number
            } // if
        },
    } = options ?? {};
    
    
    
    // mutated TModel data:
    const mutatedModel : TModel|undefined = (providedMutatedModel !== undefined) ? providedMutatedModel : await (async (): Promise<TModel|undefined> => {
        try {
            const { data: mutatedModel } = await api.queryFulfilled;
            return mutatedModel;
        }
        catch {
            return undefined;
        } // try
    })();
    if (mutatedModel === undefined) return; // api request aborted|failed => nothing to update
    const mutatedId = selectIdFromModel<TModel>(mutatedModel);
    
    
    
    // find related TModel data(s):
    const collectionQueryCaches = getQueryCaches<Pagination<TModel>, TQueryArg, TBaseQuery>(api, endpointName, options);
    
    
    
    const lastCollectionQueryCache       = collectionQueryCaches.length ? collectionQueryCaches[collectionQueryCaches.length - 1] : undefined;
    if (lastCollectionQueryCache === undefined) {
        // there's no queryCaches to update => nothing to do
        return;
    } // if
    const validTotalModels               = selectTotalFromData(lastCollectionQueryCache.data);
    const hasInvalidCollectionQueryCache = collectionQueryCaches.some(({ data }) =>
        (selectTotalFromData(data) !== validTotalModels)
    );
    if (hasInvalidCollectionQueryCache) {
        // the queryCaches has a/some inconsistent data => panic => clear all the caches and (may) trigger the rtk to re-fetch
        
        // clear caches:
        api.dispatch(
            apiSlice.util.invalidateTags([invalidateTag])
        );
        return; // panic => cannot further reconstruct
    } // if
    
    
    
    /* update existing data: SIMPLE: the number of collection_items is unchanged */
    if ((updateType === 'UPDATE') || (updateType === 'UPSERT') || (updateType === 'UPDATE_OR_INVALIDATE')) {
        const mutatedPaginationIndices = (
            collectionQueryCaches
            .map(({ originalArgs, data }) => ({
                indexStart        : selectRangeFromArg(originalArgs).indexStart,
                indexLocalMutated : selectIndexOfId<TModel>(data, mutatedId),
            }))
            .filter(({ indexLocalMutated }) =>
                (indexLocalMutated >= 0) // is FOUND
            )
            .map(({ indexStart, indexLocalMutated }) =>
                (indexStart + indexLocalMutated) // convert local index to global index
            )
        );
        const uniqueMutatedPaginationIndices = Array.from(new Set<number>(mutatedPaginationIndices));
        if (uniqueMutatedPaginationIndices.length === 0) { // not found
            if (updateType === 'UPDATE_OR_INVALIDATE') {
                // UNABLE to update current pagination cache => invalidate all caches:
                api.dispatch(
                    apiSlice.util.invalidateTags([invalidateTag])
                );
                return; // invalidated => done
            }
            else if (updateType === 'UPSERT') { // UPSERT
                // nothing to update => fallback to CREATE mode:
                return cumulativeUpdatePaginationCache(api, endpointName, 'CREATE', invalidateTag, options);
            }
            else { // UPDATE
                return; // nothing to update => nothing to do
            } // if
        }
        else if (uniqueMutatedPaginationIndices.length !== 1) { // ambigous
            // all the mutated queryCaches should have ONE valid mutated index, otherwise => panic => clear all the caches and (may) trigger the rtk to re-fetch
            
            // clear caches:
            api.dispatch(
                apiSlice.util.invalidateTags([invalidateTag])
            );
            return; // panic => cannot further reconstruct
        } // if
        const indexMutated = uniqueMutatedPaginationIndices[0];
        
        
        
        const mutatedCollectionQueryCaches = (
            collectionQueryCaches
            .filter(({ originalArgs, data }) => {
                const {
                    indexStart,
                } = selectRangeFromArg(originalArgs);
                const indexLast = (
                    indexStart
                    +
                    (selectTotalFromData(data) - 1)
                );
                
                
                
                return (
                    ((indexMutated >= indexStart) && (indexMutated <= indexLast)) // the updated_pagination => within indexStart to indexLast
                );
            })
        );
        
        
        
        // reconstructuring the updated model, so the invalidatesTag can be avoided:
        
        
        
        // update cache:
        for (const { originalArgs } of mutatedCollectionQueryCaches) {
            api.dispatch(
                apiSlice.util.updateQueryData(endpointName, originalArgs as PaginationArgs, (data) => {
                    const currentModelIndex = selectIndexOfId<TModel>(data, mutatedId);
                    if (currentModelIndex < 0) return; // not found => nothing to update
                    const currentModel = (data.entities as unknown as TModel[])[currentModelIndex];
                    (data.entities as unknown as TModel[])[currentModelIndex] = (
                        ((typeof(currentModel) === 'object') && (typeof(mutatedModel) === 'object'))
                        ? {
                            ...currentModel,
                            ...mutatedModel, // partially|fully replace oldModel with mutatedModel
                        }
                        : mutatedModel       // fully           replace oldModel with mutatedModel
                    );
                })
            );
        } // for
    }
    
    /* add new data: COMPLEX: the number of collection_items is scaled_up */
    else if (updateType === 'CREATE') {
        /*
            Adding a_new_model causing the restPagination(s) shifted their models to neighboringPagination(s).
            [876] [543] [210] + 9 => [987] [654] [321] [0]
            page1 page2 page3        page1 page2 page3 pageTail
        */
        const shiftedCollectionQueryCaches = collectionQueryCaches;
        
        
        
        // reconstructuring the shifted models, so the invalidatesTag can be avoided:
        
        
        
        //#region BACKUP the models from paginations (which will be shifted) 
        const mergedModelList : TModel[] = []; // use an `Array<TModel>` instead of `Map<number, TModel>`, so we can SHIFT the key easily
        for (const { originalArgs, data } of shiftedCollectionQueryCaches) {
            const {
                indexStart, // the global first_model_index
                indexEnd,   // the global last_model_index
            } = selectRangeFromArg(originalArgs);
            
            
            
            /*
                Assumes the next paginations having the same perPage size:
                Only the last_model of current pagination is useful for backup.
                After the whole `mergedModelList` shifted_down, the last_model becomes the first_model of the next pagination chains.
            */
            const paginationModels = selectModelsFromData<TModel>(data);
            const relativeIndexEnd = indexEnd - indexStart; // a zero based starting index, select the LAST pagination model
            const modelEnd = (relativeIndexEnd < paginationModels.length) ? paginationModels[relativeIndexEnd] : undefined;
            if (modelEnd !== undefined) mergedModelList[indexEnd] = modelEnd; // if exists, copy the LAST pagination model
        } // for
        //#endregion BACKUP the models from paginations (which will be shifted) 
        
        
        
        // INSERT the new_model at the BEGINNING of the list:
        mergedModelList.unshift(mutatedModel);
        // re-calculate the total models:
        const newTotalModels = validTotalModels + 1;
        
        
        
        //#region RESTORE the shifted paginations from the backup
        for (const { originalArgs } of shiftedCollectionQueryCaches) {
            const {
                indexStart, // the global first_model_index
                page,
                perPage,
            } = selectRangeFromArg(originalArgs);
            
            const modelStart = mergedModelList[indexStart] as TModel|undefined; // take the *valid* first_model of current pagination, the old_first_model...the_2nd_last_model will be 2nd_first_model...last_model
            
            
            
            if (modelStart === undefined) {
                // UNABLE to reconstruct current pagination cache => invalidate the cache:
                api.dispatch(
                    apiSlice.util.invalidateTags([{ type: (typeof(invalidateTag) === 'string') ? invalidateTag : invalidateTag.id as any, id: invalidatePageTag(invalidateTag, page) }])
                );
            }
            else {
                // reconstruct current pagination cache:
                api.dispatch(
                    apiSlice.util.updateQueryData(endpointName, originalArgs as PaginationArgs, (data) => {
                        // RESTORE the modelStart at the BEGINNING of the pagination:
                        (data.entities as unknown as TModel[]).unshift(modelStart);
                        
                        
                        
                        // update the total data:
                        data.total = newTotalModels;
                        
                        
                        
                        // if OVERFLOW pagination size => remove the last model:
                        if (data.entities.length > perPage) {
                            data.entities.pop();
                        } // if
                    })
                );
            } // if
        } // for
        //#endregion RESTORE the shifted paginations from the backup
    }
    
    /* delete existing data: COMPLEX: the number of collection_items is scaled_down */
    else {
        const deletedPaginationIndices = (
            collectionQueryCaches
            .map(({ originalArgs, data }) => ({
                indexStart        : selectRangeFromArg(originalArgs).indexStart,
                indexLocalDeleted : selectIndexOfId<TModel>(data, mutatedId),
            }))
            .filter(({ indexLocalDeleted }) =>
                (indexLocalDeleted >= 0) // is FOUND
            )
            .map(({ indexStart, indexLocalDeleted }) =>
                (indexStart + indexLocalDeleted) // convert local index to global index
            )
        );
        const uniqueDeletedPaginationIndices = Array.from(new Set<number>(deletedPaginationIndices));
        if (uniqueDeletedPaginationIndices.length === 0) { // not found
            return; // nothing to delete => nothing to do
        }
        else if (uniqueDeletedPaginationIndices.length !== 1) { // ambigous
            // all the deleted queryCaches should have ONE valid deleted index, otherwise => panic => clear all the caches and (may) trigger the rtk to re-fetch
            
            // clear caches:
            api.dispatch(
                apiSlice.util.invalidateTags([invalidateTag])
            );
            return; // panic => cannot further reconstruct
        } // if
        const indexDeleted = uniqueDeletedPaginationIndices[0];
        
        
        
        const shiftedCollectionQueryCaches = (
            collectionQueryCaches
            .filter(({ originalArgs, data }) => {
                const {
                    indexStart,
                } = selectRangeFromArg(originalArgs);
                const indexLast = (
                    indexStart
                    +
                    (selectTotalFromData(data) - 1)
                );
                
                
                
                return (
                    ((indexDeleted >= indexStart) && (indexDeleted <= indexLast)) // the deleted_pagination => within indexStart to indexLast
                    ||
                    (indexStart > indexDeleted) // the shifted_up_pagination => below the deleted_pagination
                );
            })
        );
        
        
        
        // reconstructuring the deleted model, so the invalidatesTag can be avoided:
        
        
        
        //#region BACKUP the models from paginations (which will be shifted) 
        const mergedModelList : TModel[] = []; // use an `Array<TModel>` instead of `Map<number, TModel>`, so we can SHIFT the key easily
        for (const { originalArgs, data } of shiftedCollectionQueryCaches) {
            const {
                indexStart, // the global first_model_index
            } = selectRangeFromArg(originalArgs);
            
            
            
            /*
                Assumes the prev paginations having the same perPage size:
                Only the first_model of current pagination is useful for backup.
                After the whole `mergedModelList` shifted_up, the first_model becomes the last_model of the prev pagination chains.
            */
            const paginationModels = selectModelsFromData<TModel>(data);
            const modelStart = paginationModels[0] as TModel|undefined; // a zero based starting index, select the FIRST pagination model
            if (modelStart !== undefined) mergedModelList[indexStart] = modelStart; // if exists, copy the FIRST pagination model
        } // for
        //#endregion BACKUP the models from paginations (which will be shifted) 
        
        
        
        // REMOVE the del_model at the DELETED_INDEX of the list:
        mergedModelList.splice(indexDeleted, 1);
        // re-calculate the total models:
        const newTotalModels = validTotalModels - 1;
        
        
        
        //#region RESTORE the shifted paginations from the backup
        for (const { originalArgs, data } of shiftedCollectionQueryCaches) {
            const {
                indexStart, // the global first_model_index
                indexEnd,   // the global last_model_index
                page,
            } = selectRangeFromArg(originalArgs);
            const indexLast = (
                indexStart
                +
                (selectTotalFromData(data) - 1)
            );
            
            const modelEnd = mergedModelList[indexEnd] as TModel|undefined; // take the *valid* last_model of current pagination, the old_2nd_first_model...the_last_model will be first_model...2nd_last_model
            
            
            
            // reconstruct current pagination cache:
            api.dispatch(
                apiSlice.util.updateQueryData(endpointName, originalArgs as PaginationArgs, (data) => {
                    // Shift up at the top/middle of pagination:
                    if ((indexDeleted >= indexStart) && (indexDeleted <= indexLast)) { // the deleted_pagination => within indexStart to indexLast
                        // REMOVE the deleted model at specific index:
                        const relativeIndexDeleted = indexDeleted - indexStart;
                        data.entities.splice(relativeIndexDeleted, 1);
                    }
                    else { // the shifted_up_pagination => below the deleted_pagination
                        // because ONE model in prev pagination has been DELETED => ALL subsequent paginations are SHIFTED_UP:
                        // REMOVE the first model for shifting:
                        data.entities.shift();
                    } // if
                    
                    
                    
                    // a shifting compensation to maintain pagination size (if possible):
                    // RESTORE the modelStart at the END of the pagination:
                    if (modelEnd !== undefined /* if possible */) (data.entities as unknown as TModel[]).push(modelEnd);
                    
                    
                    
                    // update the total data:
                    data.total = newTotalModels;
                    
                    
                    
                    // if UNDERFLOW (empty) pagination size => invalidate the cache:
                    if (!data.entities.length) {
                        api.dispatch(
                            apiSlice.util.invalidateTags([{ type: (typeof(invalidateTag) === 'string') ? invalidateTag : invalidateTag.id as any, id: invalidatePageTag(invalidateTag, page) }])
                        );
                    } // if
                })
            );
        } // for
        //#endregion RESTORE the shifted paginations from the backup
    } // if
};

type EntityUpdateType =
    |'UPSERT'
    |'DELETE'
interface EntityUpdateOptions<TModel extends Model|string>
    extends
        GetQueryCachesOptions
{
    providedMutatedModel ?: TModel
}
const cumulativeUpdateEntityCache     = async <TModel extends Model|string, TQueryArg, TBaseQuery extends BaseQueryFn>(api: MutationLifecycleApi<TQueryArg, TBaseQuery, TModel, 'api'>, endpointName: Extract<keyof (typeof apiSlice)['endpoints'], 'getTemplateVariantGroupList'|'getRoleList'>, updateType: EntityUpdateType, invalidateTag: Parameters<typeof apiSlice.util.invalidateTags>[0][number], options?: EntityUpdateOptions<TModel>) => {
    // options
    const {
        providedMutatedModel,
    } = options ?? {};
    
    
    
    // mutated TModel data:
    const mutatedModel : TModel|undefined = (providedMutatedModel !== undefined) ? providedMutatedModel : await (async (): Promise<TModel|undefined> => {
        try {
            const { data: mutatedModel } = await api.queryFulfilled;
            return mutatedModel;
        }
        catch {
            return undefined;
        } // try
    })();
    if (mutatedModel === undefined) return; // api request aborted|failed => nothing to update
    const mutatedId = selectIdFromModel<TModel>(mutatedModel);
    
    
    
    // find related TModel data(s):
    const collectionQueryCaches = getQueryCaches<Pagination<TModel>, TQueryArg, TBaseQuery>(api, endpointName, options);
    
    
    
    const lastCollectionQueryCache       = collectionQueryCaches.length ? collectionQueryCaches[collectionQueryCaches.length - 1] : undefined;
    if (lastCollectionQueryCache === undefined) {
        // there's no queryCaches to update => nothing to do
        return;
    } // if
    const validTotalModels               = selectTotalFromData(lastCollectionQueryCache.data);
    const hasInvalidCollectionQueryCache = collectionQueryCaches.some(({ data }) =>
        (selectTotalFromData(data) !== validTotalModels)
    );
    if (hasInvalidCollectionQueryCache) {
        // the queryCaches has a/some inconsistent data => panic => clear all the caches and (may) trigger the rtk to re-fetch
        
        // clear caches:
        api.dispatch(
            apiSlice.util.invalidateTags([invalidateTag])
        );
        return; // panic => cannot further reconstruct
    } // if
    
    
    
    /* update existing data -or- add new data: COMPLEX: the number of collection_items MAY scaled_up */
    if (updateType === 'UPSERT') {
        const shiftedCollectionQueryCaches = collectionQueryCaches;
        
        
        
        // reconstructuring the shifted models, so the invalidatesTag can be avoided:
        
        
        
        //#region INSERT the new model to the cache's entity
        for (const { originalArgs } of shiftedCollectionQueryCaches) {
            // reconstruct current entity cache:
            api.dispatch(
                apiSlice.util.updateQueryData(endpointName, originalArgs as any, (data) => {
                    if (selectIndexOfId<TModel>(data, mutatedId) >= 0) { // is FOUND
                        // UPDATE the existing model:
                        const currentModel = (data.entities as Dictionary<TModel>)[mutatedId];
                        (data.entities as Dictionary<TModel>)[mutatedId] = (
                            ((typeof(currentModel) === 'object') && (typeof(mutatedModel) === 'object'))
                            ? {
                                ...currentModel,
                                ...mutatedModel, // partially|fully replace oldModel with mutatedModel
                            }
                            : mutatedModel       // fully           replace oldModel with mutatedModel
                        );
                    }
                    else {
                        // INSERT the new model:
                        (data.entities as Dictionary<TModel>) = {
                            [mutatedId] : mutatedModel, // place the inserted model to the first property
                            ...data.entities as Dictionary<TModel>,
                        } satisfies Dictionary<TModel>;
                        
                        
                        
                        // INSERT the new model's id at the BEGINNING of the ids:
                        data.ids.unshift(mutatedId);
                    } // if
                })
            );
        } // for
        //#endregion INSERT the new model to the cache's entity
    }
    
    /* delete existing data: COMPLEX: the number of collection_items is scaled_down */
    else {
        const shiftedCollectionQueryCaches = (
            collectionQueryCaches
            .filter(({ data }) =>
                (selectIndexOfId<TModel>(data, mutatedId) >= 0) // is FOUND
            )
        );
        
        
        
        // reconstructuring the deleted model, so the invalidatesTag can be avoided:
        
        
        
        //#region REMOVE the deleted model from the cache's entity
        for (const { originalArgs } of shiftedCollectionQueryCaches) {
            // reconstruct current entity cache:
            api.dispatch(
                apiSlice.util.updateQueryData(endpointName, originalArgs as any, (data) => {
                    // REMOVE the deleted model:
                    delete (data.entities as Dictionary<TModel>)[mutatedId];
                    
                    
                    
                    // REMOVE the deleted model's id at the BEGINNING of the ids:
                    const indexOfId = selectIndexOfId<TModel>(data, mutatedId);
                    if (indexOfId >= 0) data.ids.splice(indexOfId, 1);
                })
            );
        } // for
        //#endregion REMOVE the deleted model from the cache's entity
    } // if
};
