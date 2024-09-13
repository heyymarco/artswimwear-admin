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

// models:
import {
    type OrderDetail,
    type OrderDetailWithOptions,
    type DefaultShippingOriginDetail,
    type ShippingPreview,
    type ShippingDetail,
    type RoleDetail,
    type ProductPreview,
    type ProductDetail,
    type TemplateVariantGroupDetail,
    type AdminDetail,
    type AdminPreferenceData,
    type AdminPreferenceDetail,
    
    type ShipmentDetail,
    
    type ShippingLabelRequest,
    type ShippingLabelDetail,
}                                               from '@/models'

// apis:
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
const shippingLabelListAdapter        = createEntityAdapter<ShippingLabelDetail>({
    selectId : (shippingLabelDetail) => shippingLabelDetail.id,
});



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
            providesTags: (result, error, paginationArg)  => {
                return [
                    ...(result?.entities ?? []).map((product): { type: 'Products', id: string } => ({
                        type : 'Products',
                        id   : product.id,
                    })),
                    
                    {
                        type : 'Products',
                        id   : paginationArg.page,
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
                await cumulativeUpdatePaginationCache(api, 'getProductPage', (arg.id === '') ? 'CREATE' : 'UPDATE', 'Products');
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
            providesTags: (result, error, paginationArg)  => {
                return [
                    ...(result?.entities ?? []).map((order): { type: 'Orders', id: string } => ({
                        type : 'Orders',
                        id   : order.id,
                    })),
                    
                    {
                        type : 'Orders',
                        id   : paginationArg.page,
                    },
                ];
            },
        }),
        updateOrder                 : builder.mutation<OrderDetail, MutationArgs<OrderDetailWithOptions>>({
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
                await cumulativeUpdatePaginationCache(api, 'getOrderPage', (arg.id === '') ? 'CREATE' : 'UPDATE', 'Orders');
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
        
        getDefaultShippingOrigin    : builder.query<DefaultShippingOriginDetail|null, void>({
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
        updateDefaultShippingOrigin : builder.mutation<DefaultShippingOriginDetail, MutationArgs<DefaultShippingOriginDetail>|null>({
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
            providesTags: (result, error, paginationArg)  => {
                return [
                    ...(result?.entities ?? []).map((shipping): { type: 'Shippings', id: string } => ({
                        type : 'Shippings',
                        id   : shipping.id,
                    })),
                    
                    {
                        type : 'Shippings',
                        id   : paginationArg.page,
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
                await cumulativeUpdatePaginationCache(api, 'getShippingPage', (arg.id === '') ? 'CREATE' : 'UPDATE', 'Shippings');
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
            providesTags: (result, error, paginationArg)  => {
                return [
                    ...(result?.entities ?? []).map((admin): { type: 'Admins', id: string } => ({
                        type : 'Admins',
                        id   : admin.id,
                    })),
                    
                    {
                        type : 'Admins',
                        id   : paginationArg.page,
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
                await cumulativeUpdatePaginationCache(api, 'getAdminPage', (arg.id === '') ? 'CREATE' : 'UPDATE', 'Admins');
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
        
        getPreference               : builder.query<AdminPreferenceDetail, void>({
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
        updatePreference            : builder.mutation<AdminPreferenceDetail, MutationArgs<AdminPreferenceData>>({
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



type UpdateType =
    |'CREATE'
    |'UPDATE'
    |'DELETE'
const cumulativeUpdatePaginationCache = async <TEntry extends { id: string }, TQueryArg, TBaseQuery extends BaseQueryFn>(api: MutationCacheLifecycleApi<TQueryArg, TBaseQuery, TEntry, 'api'>, endpointName: Extract<keyof (typeof apiSlice)['endpoints'], 'getProductPage'|'getOrderPage'|'getShippingPage'|'getAdminPage'>, updateType: UpdateType, invalidateTag: Extract<Parameters<typeof apiSlice.util.invalidateTags>[0][number], string>) => {
    // updated TEntry data:
    const { data: mutatedEntry } = await api.cacheDataLoaded;
    const { id: mutatedId } = mutatedEntry;
    
    
    
    // find related TEntry data(s):
    const state                 = api.getState();
    const allQueryCaches        = state.api.queries;
    const paginationQueryCaches = (
        Object.values(allQueryCaches)
        .filter((allQueryCache): allQueryCache is Exclude<typeof allQueryCache, undefined> =>
            (allQueryCache !== undefined)
            &&
            (allQueryCache.endpointName === endpointName)
            &&
            (allQueryCache.data !== undefined)
        )
    );
    const selectIndexOfId       = (data: unknown, id: string): number => {
        const paginationData = data as Pagination<TEntry>;
        return paginationData.entities.findIndex((searchEntry) => (searchEntry.id === id));
    };
    const selectRangeFromArg    = (originalArg: unknown): { indexStart: number, indexEnd: number, page: number, perPage: number } => {
        const paginationArgs = originalArg as PaginationArgs;
        const {
            page,
            perPage,
        } = paginationArgs;
        
        
        
        /*
            index   [page, perpage]     indexStart              indexEnd
            012	    [1, 3]              (1 - 1) * 3   = 0       (0 + 3) - 1   = 2
            345	    [2, 3]              (2 - 1) * 3   = 3       (3 + 3) - 1   = 5
            678	    [3, 3]              (3 - 1) * 3   = 6       (6 + 3) - 1   = 8
        */
        const indexStart = (page - 1) * perPage; // the entry_index of the first_entry of current pagination
        const indexEnd   = indexStart + (perPage - 1);
        return {
            indexStart,
            indexEnd,
            page,
            perPage,
        };
    };
    const selectEntriesFromData = (data: unknown): TEntry[] => {
        const paginationData = data as Pagination<TEntry>;
        return paginationData.entities;
    };
    const selectTotalFromData   = (data: unknown): number => {
        const paginationData = data as Pagination<TEntry>;
        return paginationData.total;
    };
    
    
    
    const lastPaginationQueryCache       = paginationQueryCaches?.[paginationQueryCaches.length - 1];
    const {
        perPage : validPerPage,
    }                                    = selectRangeFromArg(lastPaginationQueryCache.originalArgs);
    const validTotalEntries              = selectTotalFromData(lastPaginationQueryCache);
    const hasInvalidPaginationQueryCache = paginationQueryCaches.some((paginationQueryCache) =>
        (selectRangeFromArg(paginationQueryCache.originalArgs).perPage !== validPerPage)
        ||
        (selectTotalFromData(paginationQueryCache) !== validTotalEntries)
    );
    if (hasInvalidPaginationQueryCache) {
        // the queryCaches has a/some inconsistent data => panic => clear all the caches and (may) trigger the rtk to re-fetch
        
        // clear caches:
        api.dispatch(
            apiSlice.util.invalidateTags([invalidateTag])
        );
        return; // panic => cannot further reconstruct
    } // if
    
    
    
    /* update existing data: SIMPLE: the number of paginations is unchanged */
    if (updateType === 'UPDATE') {
        const updatedPaginationQueryCaches = (
            paginationQueryCaches
            .filter((paginationQueryCache) =>
                (selectIndexOfId(paginationQueryCache.data, mutatedId) >= 0) // is FOUND
            )
        );
        if (updatedPaginationQueryCaches.length !== 1) {
            // the queryCaches should have ONE valid updated data => panic => clear all the caches and (may) trigger the rtk to re-fetch
            
            // clear caches:
            api.dispatch(
                apiSlice.util.invalidateTags([invalidateTag])
            );
            return; // panic => cannot further reconstruct
        } // if
        const updatedPaginationQueryCache = updatedPaginationQueryCaches[0];
        
        
        
        // reconstructuring the updated entry, so the invalidatesTag can be avoided:
        
        
        
        // update cache:
        api.dispatch(
            apiSlice.util.updateQueryData(endpointName, updatedPaginationQueryCache.originalArgs as PaginationArgs, (updatedPaginationQueryCacheData) => {
                const currentEntryIndex = updatedPaginationQueryCacheData.entities.findIndex((searchEntry) => (searchEntry.id === mutatedId));
                if (currentEntryIndex < 0) return; // not found => nothing to update
                (updatedPaginationQueryCacheData.entities as unknown as TEntry[])[currentEntryIndex] = (mutatedEntry); // replace oldEntry with mutatedEntry
            })
        );
    }
    
    /* add new data: COMPLEX: the number of paginations is scaled_up */
    else if (updateType === 'CREATE') {
        /*
            Adding a_new_entry causing the restPagination(s) shifted their entries to neighboringPagination(s).
            [876] [543] [210] + 9 => [987] [654] [321] [0]
            page1 page2 page3        page1 page2 page3 pageTail
        */
        const shiftedPaginationQueryCaches = paginationQueryCaches;
        if (!shiftedPaginationQueryCaches.length) {
            return; // cache not found => no further reconstruct
        } // if
        
        
        
        // reconstructuring the shifted entries, so the invalidatesTag can be avoided:
        
        
        
        //#region BACKUP the entries from paginations (which will be shifted) 
        const mergedEntryList : TEntry[] = []; // use an `Array<TEntry>` instead of `Map<number, TEntry>`, so we can SHIFT the key easily
        for (const shiftedPaginationQueryCache of shiftedPaginationQueryCaches) {
            const {
                indexStart, // the first_entry_index of the first_entry of current pagination
                indexEnd,   // the last_entry_index  of the first_entry of current pagination
            } = selectRangeFromArg(shiftedPaginationQueryCache.originalArgs);
            
            
            
            /*
                Only the last_entry of current pagination is useful for backup.
                After the whole `mergedEntryList` shifted_down, the last_entry becomes the first_entry of the next pagination chains.
            */
            const paginationEntries = selectEntriesFromData(shiftedPaginationQueryCache.data);
            const relativeIndexEnd = indexEnd - indexStart;
            const entryEnd = (relativeIndexEnd < paginationEntries.length) ? paginationEntries[relativeIndexEnd] : undefined;
            if (entryEnd !== undefined) mergedEntryList[indexEnd] = entryEnd;
        } // for
        //#endregion BACKUP the entries from paginations (which will be shifted) 
        
        
        
        // SHIFT the new_entry at the BEGINNING of the list:
        mergedEntryList.unshift(mutatedEntry);
        // re-calculate the total entries:
        const newTotalEntries = validTotalEntries + 1;
        
        
        
        //#region RESTORE the shifted paginations from the backup
        for (const { originalArgs, data } of shiftedPaginationQueryCaches) {
            const {
                indexStart, // the first_entry_index of the first_entry of current pagination
                page,
            } = selectRangeFromArg(originalArgs);
            
            
            
            const entryStart = mergedEntryList?.[indexStart] as TEntry|undefined; // take the *valid* first_entry of current pagination, the old_first_entry...the_2nd_last_entry will be 2nd_first_entry...last_entry
            if (entryStart === undefined) {
                // UNABLE to reconstruct current pagination cache => invalidate the cache:
                api.dispatch(
                    apiSlice.util.invalidateTags([{ type: invalidateTag, id: page }])
                );
            }
            else {
                // reconstruct current pagination cache:
                api.dispatch(
                    apiSlice.util.updateQueryData(endpointName, originalArgs as PaginationArgs, (shiftedPaginationQueryCacheData) => {
                        (shiftedPaginationQueryCacheData.entities as unknown as TEntry[]).unshift(entryStart); // append the entryStart at first index
                        shiftedPaginationQueryCacheData.total = newTotalEntries; // update the total data
                        
                        // allows growing up to perPage size BUT limits growing more than perPage size:
                        if (shiftedPaginationQueryCacheData.entities.length > validPerPage) shiftedPaginationQueryCacheData.entities.pop();
                    })
                );
            } // if
        } // for
        //#endregion RESTORE the shifted paginations from the backup
    }
    
    /* delete existing data: COMPLEX: the number of paginations is scaled_down */
    else {
        const deletedPaginationIndices = (
            paginationQueryCaches
            .map((paginationQueryCache) => ({
                indexStart        : selectRangeFromArg(paginationQueryCache.originalArgs).indexStart,
                indexLocalDeleted : selectIndexOfId(paginationQueryCache.data, mutatedId),
            }))
            .filter(({ indexLocalDeleted }) =>
                (indexLocalDeleted >= 0) // is FOUND
            )
            .map(({ indexStart, indexLocalDeleted }) =>
                (indexStart + indexLocalDeleted) // convert local index to global index
            )
        );
        if (deletedPaginationIndices.length !== 1) {
            // the queryCaches should have ONE valid deleted data => panic => clear all the caches and (may) trigger the rtk to re-fetch
            
            // clear caches:
            api.dispatch(
                apiSlice.util.invalidateTags([invalidateTag])
            );
            return; // panic => cannot further reconstruct
        } // if
        const indexDeleted = deletedPaginationIndices[0];
        
        
        
        const shiftedPaginationQueryCaches = (
            paginationQueryCaches
            .filter((paginationQueryCache) => {
                const {
                    indexStart,
                    indexEnd,
                } = selectRangeFromArg(paginationQueryCache.originalArgs);
                
                
                
                return (
                    (indexStart >= indexDeleted)
                    &&
                    (indexEnd   <= indexDeleted)
                );
            })
        );
        
        
        
        // reconstructuring the deleted entry, so the invalidatesTag can be avoided:
        
        
        
        //#region BACKUP the entries from paginations (which will be shifted) 
        const mergedEntryList : TEntry[] = [];
        for (const shiftedPaginationQueryCache of shiftedPaginationQueryCaches) {
            const {
                indexStart, // the first_entry_index of the first_entry of current pagination
            } = selectRangeFromArg(shiftedPaginationQueryCache.originalArgs);
            
            
            
            /*
                Only the first_entry of current pagination is useful for backup.
                After the whole `mergedEntryList` shifted_up, the first_entry becomes the last_entry of the prev pagination chains.
            */
            const paginationEntries = selectEntriesFromData(shiftedPaginationQueryCache.data);
            const relativeIndexStart = 0;
            const entryStart = (relativeIndexStart < paginationEntries.length) ? paginationEntries[relativeIndexStart] : undefined;
            if (entryStart !== undefined) mergedEntryList[indexStart] = entryStart;
        } // for
        //#endregion BACKUP the entries from paginations (which will be shifted) 
        
        
        
        // SHIFT the new_entry at the DELETED_INDEX of the list:
        mergedEntryList.splice(indexDeleted, 1);
        // re-calculate the total entries:
        const newTotalEntries = validTotalEntries - 1;
        
        
        
        //#region RESTORE the shifted paginations from the backup
        for (const { originalArgs, data } of shiftedPaginationQueryCaches) {
            const {
                indexStart, // the first_entry_index of the first_entry of current pagination
                indexEnd,   // the last_entry_index  of the first_entry of current pagination
                page,
            } = selectRangeFromArg(originalArgs);
            
            
            
            const entryEnd = mergedEntryList?.[indexEnd] as TEntry|undefined; // take the *valid* last_entry of current pagination, the old_2nd_first_entry...the_last_entry will be first_entry...2nd_last_entry
            // // if (entryEnd === undefined) {
            // //     // UNABLE to reconstruct current pagination cache => invalidate the cache:
            // //     api.dispatch(
            // //         apiSlice.util.invalidateTags([{ type: invalidateTag, id: page }])
            // //     );
            // // }
            // // else {
            // // } // if
            // update cache:
            api.dispatch(
                apiSlice.util.updateQueryData(endpointName, originalArgs as PaginationArgs, (shiftedPaginationQueryCacheData) => {
                    const indexLast = (
                        indexStart
                        +
                        (selectEntriesFromData(data).length - 1)
                    );
                    if ((indexStart >= indexDeleted) && (indexLast <= indexDeleted)) {
                        const relativeIndexDeleted = indexDeleted - indexStart;
                        shiftedPaginationQueryCacheData.entities.splice(relativeIndexDeleted, 1); // remove the deleted entry at specific index
                    }
                    else {
                        shiftedPaginationQueryCacheData.entities.shift(); // remove the first entry for shifting
                    } // if
                    if (entryEnd !== undefined) (shiftedPaginationQueryCacheData.entities as unknown as TEntry[]).push(entryEnd); // append the entryEnd at last index to maintain perPage size
                    shiftedPaginationQueryCacheData.total = newTotalEntries; // update the total data
                    
                    
                    
                    if (!shiftedPaginationQueryCacheData.entities.length) {
                        // EMPTY pagination cache => invalidate the cache:
                        api.dispatch(
                            apiSlice.util.invalidateTags([{ type: invalidateTag, id: page }])
                        );
                    } // if
                })
            );
        } // for
        //#endregion RESTORE the shifted paginations from the backup
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
    useGetShipmentQuery                    : useGetShipment,
    useLazyGetShippingLabelRatesQuery      : useGetShippingLabelRates,
    
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
