import { createEntityAdapter, EntityState }                         from '@reduxjs/toolkit'
import { BaseQueryFn, createApi, QueryStatus }                      from '@reduxjs/toolkit/query/react'
import type { QuerySubState }                                       from '@reduxjs/toolkit/dist/query/core/apiState'
import type { BaseEndpointDefinition, MutationCacheLifecycleApi }   from '@reduxjs/toolkit/dist/query/endpointDefinitions'
import type { UseQuery, UseQueryHookResult }                        from '@reduxjs/toolkit/dist/query/react/buildHooks'

// types:
import type {
    PaginationArgs,
    Pagination,
    
    MutationArgs,
}                           from '@/libs/types'
export type OrderDetailWithOptions = OrderDetail & { sendConfirmationEmail?: boolean }

// models:
import {
    type OrderDetail,
    type DefaultShippingOriginDetail,
    type ShippingPreview,
    type ShippingDetail,
    type RoleDetail,
    type ProductPreview,
    type ProductDetail,
    type TemplateVariantGroupDetail,
    type AdminDetail,
}                                               from '@/models'

// apis:
import type {
    PreferenceData,
    PreferenceDetail,
}                                               from '@/app/api/(protected)/preferences/route'
export type {
    PreferenceData,
    PreferenceDetail,
}                                               from '@/app/api/(protected)/preferences/route'
import type { ImageId }                         from '@/app/api/(protected)/uploads/route'
export type { ImageId }                         from '@/app/api/(protected)/uploads/route'

// other libs:
import {
    default as axios,
    AxiosRequestConfig,
    CanceledError,
    AxiosError,
}                           from 'axios'



const shippingListAdapter             = createEntityAdapter<ShippingPreview>({
    selectId : (shippingPreview) => shippingPreview.id,
});
const productListAdapter              = createEntityAdapter<ProductPreview>({
    selectId : (productPreview) => productPreview.id,
});
const templateVariantGroupListAdapter = createEntityAdapter<TemplateVariantGroupDetail>({
    selectId : (roleDetail) => roleDetail.id,
});
const roleListAdapter                 = createEntityAdapter<RoleDetail>({
    selectId : (roleDetail) => roleDetail.id,
});



const axiosBaseQuery = (
    { baseUrl }: { baseUrl: string } = { baseUrl: '' }
): BaseQueryFn<
    AxiosRequestConfig<any> & { body ?: {}, abortSignal?: AbortSignal },
    unknown,
    unknown
> => {
    return async ({ url, body, data, abortSignal, signal, ...restAxiosRequestConfig }) => {
        try {
            const result = await axios({
                ...restAxiosRequestConfig,
                url    : `${baseUrl}/${url}`,
                data   : data ?? body,
                signal : signal ?? abortSignal,
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
    tagTypes: ['Products', 'TemplateVariantGroups', 'Orders', 'DefaultShippingOrigins', 'Shippings', 'States', 'Admins', 'Preferences', 'Roles'],
    endpoints : (builder) => ({
        getProductList              : builder.query<EntityState<ProductPreview>, void>({
            query : () => ({
                url    : 'products',
                method : 'GET',
            }),
            transformResponse(response: ProductPreview[]) {
                return productListAdapter.addMany(productListAdapter.getInitialState(), response);
            },
        }),
        getProductPage              : builder.query<Pagination<ProductDetail>, PaginationArgs>({
            query : (params) => ({
                url    : 'products',
                method : 'POST',
                body   : params,
            }),
            providesTags: (result, error, page)  => {
                return [
                    ...(result?.entities ?? []).map((product): { type: 'Products', id: string } => ({
                        type : 'Products',
                        id   : product.id,
                    })),
                    
                    {
                        type : 'Products',
                        id   : 'PRODUCT_LIST',
                    },
                ];
            },
        }),
        updateProduct               : builder.mutation<ProductDetail, MutationArgs<Omit<ProductDetail, 'stocks'> & { stocks?: (number|null)[] }>>({
            query: (patch) => ({
                url    : 'products',
                method : 'PATCH',
                body   : patch
            }),
            
            // inefficient:
            // invalidatesTags: (product, error, arg) => [
            //     ...((!product ? [] : [{
            //         type : 'Products',
            //         id   : product.id,
            //     }]) as Array<{ type: 'Products', id: string }>),
            // ],
            
            // more efficient:
            onCacheEntryAdded: async (arg, api) => {
                await handleCumulativeUpdateCacheEntry('getProductPage', (arg.id !== ''), api);
            },
        }),
        deleteProduct               : builder.mutation<Pick<ProductDetail, 'id'>, MutationArgs<Pick<ProductDetail, 'id'>>>({
            query: (params) => ({
                url    : 'products',
                method : 'DELETE',
                body   : params
            }),
            invalidatesTags: (product, error, arg) => [
                ...((!product ? [{
                    type : 'Products',
                    id   : 'PRODUCT_LIST', // delete unspecified => invalidates the whole list
                }] : [{
                    type : 'Products',
                    id   : product.id,     // delete existing    => invalidates the modified
                }]) as Array<{ type: 'Products', id: string }>),
            ],
        }),
        availablePath               : builder.query<boolean, string>({
            query: (path) => ({
                url    : `products/check-path?path=${encodeURIComponent(path)}`,
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
            providesTags: (result, error, page)  => {
                return [
                    ...(result?.ids ?? []).map((id): { type: 'TemplateVariantGroups', id: string } => ({
                        type : 'TemplateVariantGroups',
                        id   : `${id}`,
                    })),
                    
                    {
                        type : 'TemplateVariantGroups',
                        id   : 'TEMPLATE_VARIANT_LIST',
                    },
                ];
            },
        }),
        updateTemplateVariantGroup  : builder.mutation<TemplateVariantGroupDetail, MutationArgs<TemplateVariantGroupDetail>>({
            query: (patch) => ({
                url    : 'products/template-variants',
                method : 'PATCH',
                body   : patch
            }),
            invalidatesTags: (templateVariantGroup, error, arg) => [
                ...(((!arg.id || !templateVariantGroup) ? [{
                    type : 'TemplateVariantGroups',
                    id   : 'TEMPLATE_VARIANT_LIST', // create new      => invalidates the whole list
                }] : [{
                    type : 'TemplateVariantGroups',
                    id   : templateVariantGroup.id,     // update existing => invalidates the modified
                }]) as Array<{ type: 'TemplateVariantGroups', id: string }>),
            ],
        }),
        deleteTemplateVariantGroup  : builder.mutation<Pick<TemplateVariantGroupDetail, 'id'>, MutationArgs<Pick<TemplateVariantGroupDetail, 'id'>>>({
            query: (params) => ({
                url    : 'products/template-variants',
                method : 'DELETE',
                body   : params
            }),
            invalidatesTags: (templateVariantGroup, error, arg) => [
                ...((!templateVariantGroup ? [{
                    type : 'TemplateVariantGroups',
                    id   : 'TEMPLATE_VARIANT_LIST', // delete unspecified => invalidates the whole list
                }] : [{
                    type : 'TemplateVariantGroups',
                    id   : templateVariantGroup.id,     // delete existing    => invalidates the modified
                }]) as Array<{ type: 'TemplateVariantGroups', id: string }>),
            ],
        }),
        
        getOrderPage                : builder.query<Pagination<OrderDetail>, PaginationArgs>({
            query : (params) => ({
                url    : 'orders',
                method : 'POST',
                body   : params,
            }),
            providesTags: (result, error, page)  => {
                return [
                    ...(result?.entities ?? []).map((order): { type: 'Orders', id: string } => ({
                        type : 'Orders',
                        id   : order.id,
                    })),
                    
                    {
                        type : 'Orders',
                        id   : 'ORDER_LIST',
                    },
                ];
            },
        }),
        updateOrder                 : builder.mutation<OrderDetailWithOptions, MutationArgs<OrderDetail>>({
            query: (patch) => ({
                url    : 'orders',
                method : 'PATCH',
                body   : patch
            }),
            
            // inefficient:
            // invalidatesTags: (order, error, arg) => [
            //     ...((!order ? [] : [{
            //         type : 'Orders',
            //         id   : order.id,
            //     }]) as Array<{ type: 'Orders', id: string }>),
            // ],
            
            // more efficient:
            onCacheEntryAdded: async (arg, api) => {
                await handleCumulativeUpdateCacheEntry('getOrderPage', (arg.id !== ''), api);
            },
        }),
        
        getDefaultShippingOrigin               : builder.query<DefaultShippingOriginDetail|null, void>({
            query : () => ({
                url    : 'shippings/origin',
                method : 'GET',
            }),
            providesTags: (result, error, page)  => {
                return [
                    {
                        type : 'DefaultShippingOrigins',
                        id   : 'DEFAULT_SHIPPING_ORIGIN',
                    },
                ];
            },
        }),
        updateDefaultShippingOrigin            : builder.mutation<DefaultShippingOriginDetail, MutationArgs<DefaultShippingOriginDetail>|null>({
            query: (patch) => ({
                url    : 'shippings/origin',
                method : 'PATCH',
                body   : patch ?? {}
            }),
            invalidatesTags: (defaultShippingOrigin, error, arg) => [
                {
                    type : 'DefaultShippingOrigins',
                    id   : 'DEFAULT_SHIPPING_ORIGIN',
                },
            ],
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
        getShippingPage             : builder.query<Pagination<ShippingDetail>, PaginationArgs>({
            query : (params) => ({
                url    : 'shippings',
                method : 'POST',
                body   : params,
            }),
            providesTags: (result, error, page)  => {
                return [
                    ...(result?.entities ?? []).map((shipping): { type: 'Shippings', id: string } => ({
                        type : 'Shippings',
                        id   : shipping.id,
                    })),
                    
                    {
                        type : 'Shippings',
                        id   : 'SHIPPING_LIST',
                    },
                ];
            },
        }),
        updateShipping              : builder.mutation<ShippingDetail, MutationArgs<ShippingDetail>>({
            query: (patch) => ({
                url    : 'shippings',
                method : 'PATCH',
                body   : patch
            }),
            
            // inefficient:
            // invalidatesTags: (shipping, error, arg) => [
            //     ...((!shipping ? [] : [{
            //         type : 'Shippings',
            //         id   : shipping.id,
            //     }]) as Array<{ type: 'Shippings', id: string }>),
            // ],
            
            // more efficient:
            onCacheEntryAdded: async (arg, api) => {
                await handleCumulativeUpdateCacheEntry('getShippingPage', (arg.id !== ''), api);
            },
        }),
        deleteShipping              : builder.mutation<Pick<ShippingDetail, 'id'>, MutationArgs<Pick<ShippingDetail, 'id'>>>({
            query: (params) => ({
                url    : 'shippings',
                method : 'DELETE',
                body   : params
            }),
            invalidatesTags: (shipping, error, arg) => [
                ...((!shipping ? [{
                    type : 'Shippings',
                    id   : 'SHIPPING_LIST', // delete unspecified => invalidates the whole list
                }] : [{
                    type : 'Shippings',
                    id   : shipping.id,     // delete existing    => invalidates the modified
                }]) as Array<{ type: 'Shippings', id: string }>),
            ],
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
            query : (params) => ({
                url    : 'admins',
                method : 'POST',
                body   : params,
            }),
            providesTags: (result, error, page)  => {
                return [
                    ...(result?.entities ?? []).map((admin): { type: 'Admins', id: string } => ({
                        type : 'Admins',
                        id   : admin.id,
                    })),
                    
                    {
                        type : 'Admins',
                        id   : 'ADMIN_LIST',
                    },
                ];
            },
        }),
        updateAdmin                 : builder.mutation<AdminDetail, MutationArgs<AdminDetail>>({
            query: (patch) => ({
                url    : 'admins',
                method : 'PATCH',
                body   : patch
            }),
            
            // inefficient:
            // invalidatesTags: (admin, error, arg) => [
            //     ...((!admin ? [] : [{
            //         type : 'Admins',
            //         id   : admin.id,
            //     }]) as Array<{ type: 'Admins', id: string }>),
            // ],
            
            // more efficient:
            onCacheEntryAdded: async (arg, api) => {
                await handleCumulativeUpdateCacheEntry('getAdminPage', (arg.id !== ''), api);
            },
        }),
        deleteAdmin                 : builder.mutation<Pick<AdminDetail, 'id'>, MutationArgs<Pick<AdminDetail, 'id'>>>({
            query: (params) => ({
                url    : 'admins',
                method : 'DELETE',
                body   : params
            }),
            invalidatesTags: (admin, error, arg) => [
                ...((!admin ? [{
                    type : 'Admins',
                    id   : 'ADMIN_LIST', // delete unspecified => invalidates the whole list
                }] : [{
                    type : 'Admins',
                    id   : admin.id,     // delete existing    => invalidates the modified
                }]) as Array<{ type: 'Admins', id: string }>),
            ],
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
            providesTags: (result, error, page)  => {
                return [
                    ...(result?.ids ?? []).map((id): { type: 'Roles', id: string } => ({
                        type : 'Roles',
                        id   : `${id}`,
                    })),
                    
                    {
                        type : 'Roles',
                        id   : 'ROLE_LIST',
                    },
                ];
            },
        }),
        updateRole                  : builder.mutation<RoleDetail, MutationArgs<RoleDetail>>({
            query: (patch) => ({
                url    : 'roles',
                method : 'PATCH',
                body   : patch
            }),
            invalidatesTags: (role, error, arg) => [
                ...(((!arg.id || !role) ? [{
                    type : 'Roles',
                    id   : 'ROLE_LIST', // create new      => invalidates the whole list
                }] : [{
                    type : 'Roles',
                    id   : role.id,     // update existing => invalidates the modified
                }]) as Array<{ type: 'Roles', id: string }>),
            ],
        }),
        deleteRole                  : builder.mutation<Pick<RoleDetail, 'id'>, MutationArgs<Pick<RoleDetail, 'id'>>>({
            query: (params) => ({
                url    : 'roles',
                method : 'DELETE',
                body   : params
            }),
            invalidatesTags: (role, error, arg) => [
                ...((!role ? [{
                    type : 'Roles',
                    id   : 'ROLE_LIST', // delete unspecified => invalidates the whole list
                }] : [{
                    type : 'Roles',
                    id   : role.id,     // delete existing    => invalidates the modified
                }]) as Array<{ type: 'Roles', id: string }>),
            ],
        }),
        availableRolename           : builder.query<boolean, string>({
            query: (name) => ({
                url    : `roles/check-name?name=${encodeURIComponent(name)}`,
                method : 'GET',
            }),
        }),
        
        getPreference               : builder.query<PreferenceDetail, void>({
            query : () => ({
                url    : 'preferences',
                method : 'GET',
            }),
            providesTags: (result, error, page)  => {
                return [
                    {
                        type : 'Preferences',
                        id   : 'PREFERENCES',
                    },
                ];
            },
        }),
        updatePreference            : builder.mutation<PreferenceDetail, MutationArgs<PreferenceData>>({
            query: (patch) => ({
                url    : 'preferences',
                method : 'PATCH',
                body   : patch
            }),
            invalidatesTags: (preference, error, arg) => [
                {
                    type : 'Preferences',
                    id   : 'PREFERENCES',
                },
            ],
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



const handleCumulativeUpdateCacheEntry = async <TEntry extends { id: string }, QueryArg, BaseQuery extends BaseQueryFn>(endpointName: Extract<keyof (typeof apiSlice)['endpoints'], 'getProductPage'|'getOrderPage'|'getShippingPage'|'getAdminPage'>, isUpdating: boolean, api: MutationCacheLifecycleApi<QueryArg, BaseQuery, TEntry, 'api'>) => {
    // updated TEntry data:
    const { data: mutatedEntry } = await api.cacheDataLoaded;
    const { id: mutatedId } = mutatedEntry;
    
    
    
    // find related TEntry data(s):
    const state                 = api.getState();
    const allQueryCaches        = state.api.queries;
    const paginationQueryCaches = (
        Object.values(allQueryCaches)
        .filter((allQueryCache): allQueryCache is QuerySubState<BaseEndpointDefinition<QueryArg, BaseQuery, Pagination<TEntry>>> =>
            !!allQueryCache
            &&
            (allQueryCache.endpointName === endpointName)
        )
    );
    if (!isUpdating) { // add new data:
        const missingPaginationQueryCaches = (
            paginationQueryCaches
            .filter((paginationQueryCache) =>
                /*missing id: */ !paginationQueryCache.data?.entities.some((searchEntry) => (searchEntry.id === mutatedId))
            )
        );
        if (missingPaginationQueryCaches.length) {
            const accumDataMap : TEntry[] = [mutatedEntry];
            for (const paginationQueryCache of paginationQueryCaches) {
                const {
                    page    = 1,
                    perPage = 1,
                } = paginationQueryCache.originalArgs as PaginationArgs;
                
                const baseIndex  = (page - 1) * perPage;
                let   subIndex   = 0;
                const shiftCount = 1;
                for (const entry of (paginationQueryCache.data as Pagination<TEntry>).entities) {
                    accumDataMap[baseIndex + (subIndex++) + shiftCount] = entry;
                } // for
            } // for
            
            
            
            let tailPaginationTotal : number = 0;
            for (const missingPaginationQueryCache of missingPaginationQueryCaches) {
                const {
                    page    = 1,
                    perPage = 1,
                } = missingPaginationQueryCache.originalArgs as PaginationArgs;
                const baseIndex  = (page - 1) * perPage;
                
                
                
                const insertedEntry : TEntry|undefined = accumDataMap?.[baseIndex];
                if (insertedEntry) {
                    // update cache:
                    api.dispatch(
                        apiSlice.util.updateQueryData(endpointName, missingPaginationQueryCache.originalArgs as any, (paginationCache) => {
                            paginationCache.entities.unshift((insertedEntry as any)); // append at first index
                            tailPaginationTotal = (paginationCache.entities.length > perPage) ? (++paginationCache.total) : 0;
                            if (tailPaginationTotal) paginationCache.entities.pop(); // remove at last index
                        })
                    );
                }
                else {
                    tailPaginationTotal = 0;
                } // if
            } // for
            
            
            
            if (tailPaginationTotal && accumDataMap.length) {
                const lastPagination : Pagination<TEntry> = {
                    total    : tailPaginationTotal,
                    entities : [
                        accumDataMap[accumDataMap.length - 1] // take the last
                    ],
                };
                const perPage = (paginationQueryCaches?.[paginationQueryCaches.length - 1]?.originalArgs as (PaginationArgs|undefined))?.perPage ?? 1;
                // append new cache:
                api.dispatch(
                    apiSlice.util.upsertQueryData(endpointName, /* args: */ {
                        page    : Math.ceil(tailPaginationTotal / perPage),
                        perPage : perPage
                    }, /* value: */ (lastPagination as Pagination<any>))
                );
            } // if
        } // if
    }
    else { // update existing data:
        const obsoletePaginationQueryCaches = (
            paginationQueryCaches
            .filter((paginationQueryCache) =>
                /*found id: */ !!paginationQueryCache.data?.entities.some((searchEntry) => (searchEntry.id === mutatedId))
            )
        );
        if (obsoletePaginationQueryCaches.length) {
            for (const obsoletePaginationQueryCache of obsoletePaginationQueryCaches) {
                // update cache:
                api.dispatch(
                    apiSlice.util.updateQueryData(endpointName, obsoletePaginationQueryCache.originalArgs as any, (paginationCache) => {
                        const obsoleteEntryIndex = paginationCache.entities.findIndex((searchEntry) => (searchEntry.id === mutatedId));
                        if (obsoleteEntryIndex < 0) return;
                        paginationCache.entities[obsoleteEntryIndex] = (mutatedEntry as any); // replace oldEntry with mutatedEntry
                    })
                );
            } // for
        } // if
    } // if
};



export const {
    useGetProductListQuery                 : useGetProductList,
    useGetProductPageQuery                 : useGetProductPage,
    useUpdateProductMutation               : useUpdateProduct,
    useDeleteProductMutation               : useDeleteProduct,
    useLazyAvailablePathQuery              : useAvailablePath,
    
    useGetTemplateVariantGroupListQuery    : useGetTemplateVariantGroupList,
    useUpdateTemplateVariantGroupMutation  : useUpdateTemplateVariantGroup,
    useDeleteTemplateVariantGroupMutation  : useDeleteTemplateVariantGroup,
    
    useGetOrderPageQuery                   : useGetOrderPage,
    useUpdateOrderMutation                 : useUpdateOrder,
    
    useGetDefaultShippingOriginQuery       : useGetDefaultShippingOrigin,
    useUpdateDefaultShippingOriginMutation : useUpdateDefaultShippingOrigin,
    useGetShippingListQuery                : useGetShippingList,
    useGetShippingPageQuery                : useGetShippingPage,
    useUpdateShippingMutation              : useUpdateShipping,
    useDeleteShippingMutation              : useDeleteShipping,
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
    getCountryList : { initiate : getCountryList },
    getStateList   : { initiate : getStateList   },
    getCityList    : { initiate : getCityList    },
} = apiSlice.endpoints;
