import { createEntityAdapter, EntityState }                         from '@reduxjs/toolkit'
import { BaseQueryFn, createApi, QueryStatus }                      from '@reduxjs/toolkit/query/react'
import type { QuerySubState }                                       from '@reduxjs/toolkit/dist/query/core/apiState'
import type { BaseEndpointDefinition, MutationCacheLifecycleApi }   from '@reduxjs/toolkit/dist/query/endpointDefinitions'
import type { UseQuery, UseQueryHookResult }                        from '@reduxjs/toolkit/dist/query/react/buildHooks'

// types:
import {
    type Model,
    
    type PaginationArgs,
    type Pagination,
    
    type MutationArgs,
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
    tagTypes: ['Product', 'TemplateVariantGroups', 'Order', 'DefaultShippingOrigins', 'Shipping', 'States', 'Admin', 'Preferences', 'Roles'],
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
            query : (arg) => ({
                url    : 'products',
                method : 'POST',
                body   : arg,
            }),
            providesTags: (result, error, arg)  => {
                return [{
                    type : 'Product',
                    id   : arg.page,
                }];
            },
        }),
        updateProduct               : builder.mutation<ProductDetail, MutationArgs<Omit<ProductDetail, 'stocks'> & { stocks?: (number|null)[] }>>({
            query: (arg) => ({
                url    : 'products',
                method : 'PATCH',
                body   : arg
            }),
            onCacheEntryAdded: async (arg, api) => {
                await cumulativeUpdatePaginationCache(api, 'getProductPage', (arg.id === '') ? 'CREATE' : 'UPDATE', 'Product');
            },
        }),
        deleteProduct               : builder.mutation<Pick<ProductDetail, 'id'>, MutationArgs<Pick<ProductDetail, 'id'>>>({
            query: (arg) => ({
                url    : 'products',
                method : 'DELETE',
                body   : arg
            }),
            onCacheEntryAdded: async (arg, api) => {
                await cumulativeUpdatePaginationCache(api, 'getProductPage', 'DELETE', 'Product');
            },
        }),
        availablePath               : builder.query<boolean, string>({
            query: (arg) => ({
                url    : `products/check-path?path=${encodeURIComponent(arg)}`,
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
            query : (arg) => ({
                url    : 'orders',
                method : 'POST',
                body   : arg,
            }),
            providesTags: (result, error, arg)  => {
                return [{
                    type : 'Order',
                    id   : arg.page,
                }];
            },
        }),
        updateOrder                 : builder.mutation<OrderDetail, MutationArgs<OrderDetailWithOptions>>({
            query: (arg) => ({
                url    : 'orders',
                method : 'PATCH',
                body   : arg
            }),
            onCacheEntryAdded: async (arg, api) => {
                await cumulativeUpdatePaginationCache(api, 'getOrderPage', (arg.id === '') ? 'CREATE' : 'UPDATE', 'Order');
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
            query : (arg) => ({
                url    : 'shippings',
                method : 'POST',
                body   : arg,
            }),
            providesTags: (result, error, arg)  => {
                return [{
                    type : 'Shipping',
                    id   : arg.page,
                }];
            },
        }),
        updateShipping              : builder.mutation<ShippingDetail, MutationArgs<ShippingDetail>>({
            query: (arg) => ({
                url    : 'shippings',
                method : 'PATCH',
                body   : arg
            }),
            onCacheEntryAdded: async (arg, api) => {
                await cumulativeUpdatePaginationCache(api, 'getShippingPage', (arg.id === '') ? 'CREATE' : 'UPDATE', 'Shipping');
            },
        }),
        deleteShipping              : builder.mutation<Pick<ShippingDetail, 'id'>, MutationArgs<Pick<ShippingDetail, 'id'>>>({
            query: (params) => ({
                url    : 'shippings',
                method : 'DELETE',
                body   : params
            }),
            onCacheEntryAdded: async (arg, api) => {
                await cumulativeUpdatePaginationCache(api, 'getShippingPage', 'DELETE', 'Shipping');
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
            providesTags: (result, error, arg)  => {
                return [{
                    type : 'Admin',
                    id   : arg.page,
                }];
            },
        }),
        updateAdmin                 : builder.mutation<AdminDetail, MutationArgs<AdminDetail>>({
            query: (arg) => ({
                url    : 'admins',
                method : 'PATCH',
                body   : arg
            }),
            onCacheEntryAdded: async (arg, api) => {
                await cumulativeUpdatePaginationCache(api, 'getAdminPage', (arg.id === '') ? 'CREATE' : 'UPDATE', 'Admin');
            },
        }),
        deleteAdmin                 : builder.mutation<Pick<AdminDetail, 'id'>, MutationArgs<Pick<AdminDetail, 'id'>>>({
            query: (params) => ({
                url    : 'admins',
                method : 'DELETE',
                body   : params
            }),
            onCacheEntryAdded: async (arg, api) => {
                await cumulativeUpdatePaginationCache(api, 'getAdminPage', 'DELETE', 'Admin');
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



// utilities:
const selectIdFromEntry     = <TEntry extends Model|string>(entry: TEntry): string => {
    return (typeof(entry) === 'string') ? entry : entry.id;
};
const selectEntriesFromData = <TEntry extends Model|string>(data: unknown): TEntry[] => {
    const items = Array.isArray(data) ? (data as TEntry[]) : (data as Pagination<TEntry>).entities;
    return items;
};
const selectIndexOfId       = <TEntry extends Model|string>(data: unknown, id: string): number => {
    return (
        selectEntriesFromData<TEntry>(data)
        .findIndex((searchEntry) =>
            (selectIdFromEntry<TEntry>(searchEntry) === id)
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
const selectTotalFromData   = (data: unknown): number => {
    const paginationData = data as Pagination<unknown>;
    return paginationData.total;
};

type UpdateType =
    |'CREATE'
    |'UPDATE'
    |'DELETE'
const cumulativeUpdatePaginationCache = async <TEntry extends Model|string, TQueryArg, TBaseQuery extends BaseQueryFn>(api: MutationCacheLifecycleApi<TQueryArg, TBaseQuery, TEntry, 'api'>, endpointName: Extract<keyof (typeof apiSlice)['endpoints'], 'getProductPage'|'getOrderPage'|'getShippingPage'|'getAdminPage'>, updateType: UpdateType, invalidateTag: Extract<Parameters<typeof apiSlice.util.invalidateTags>[0][number], string>) => {
    // mutated TEntry data:
    const { data: mutatedEntry } = await api.cacheDataLoaded;
    const mutatedId = selectIdFromEntry<TEntry>(mutatedEntry);
    
    
    
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
    
    
    
    const lastPaginationQueryCache       = paginationQueryCaches?.[paginationQueryCaches.length - 1];
    const validTotalEntries              = selectTotalFromData(lastPaginationQueryCache);
    const hasInvalidPaginationQueryCache = paginationQueryCaches.some((paginationQueryCache) =>
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
                (selectIndexOfId<TEntry>(paginationQueryCache.data, mutatedId) >= 0) // is FOUND
            )
        );
        
        
        
        // reconstructuring the updated entry, so the invalidatesTag can be avoided:
        
        
        
        // update cache:
        for (const updatedPaginationQueryCache of updatedPaginationQueryCaches) {
            api.dispatch(
                apiSlice.util.updateQueryData(endpointName, updatedPaginationQueryCache.originalArgs as PaginationArgs, (updatedPaginationQueryCacheData) => {
                    const currentEntryIndex = updatedPaginationQueryCacheData.entities.findIndex((searchEntry) => (searchEntry.id === mutatedId));
                    if (currentEntryIndex < 0) return; // not found => nothing to update
                    (updatedPaginationQueryCacheData.entities as unknown as TEntry[])[currentEntryIndex] = (mutatedEntry); // replace oldEntry with mutatedEntry
                })
            );
        } // for
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
                indexStart, // the global first_entry_index
                indexEnd,   // the global last_entry_index
            } = selectRangeFromArg(shiftedPaginationQueryCache.originalArgs);
            
            
            
            /*
                Only the last_entry of current pagination is useful for backup.
                After the whole `mergedEntryList` shifted_down, the last_entry becomes the first_entry of the next pagination chains.
            */
            const paginationEntries = selectEntriesFromData<TEntry>(shiftedPaginationQueryCache.data);
            const relativeIndexEnd = indexEnd - indexStart; // a zero based starting index, select the LAST pagination entry
            const entryEnd = (relativeIndexEnd < paginationEntries.length) ? paginationEntries[relativeIndexEnd] : undefined;
            if (entryEnd !== undefined) mergedEntryList[indexEnd] = entryEnd; // if exists, copy the LAST pagination entry
        } // for
        //#endregion BACKUP the entries from paginations (which will be shifted) 
        
        
        
        // INSERT the new_entry at the BEGINNING of the list:
        mergedEntryList.unshift(mutatedEntry);
        // re-calculate the total entries:
        const newTotalEntries = validTotalEntries + 1;
        
        
        
        //#region RESTORE the shifted paginations from the backup
        for (const { originalArgs } of shiftedPaginationQueryCaches) {
            const {
                indexStart, // the global first_entry_index
                page,
                perPage,
            } = selectRangeFromArg(originalArgs);
            
            const entryStart = mergedEntryList[indexStart] as TEntry|undefined; // take the *valid* first_entry of current pagination, the old_first_entry...the_2nd_last_entry will be 2nd_first_entry...last_entry
            
            
            
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
                        // RESTORE the entryStart at the BEGINNING of the pagination:
                        (shiftedPaginationQueryCacheData.entities as unknown as TEntry[]).unshift(entryStart);
                        
                        
                        
                        // update the total data:
                        shiftedPaginationQueryCacheData.total = newTotalEntries;
                        
                        
                        
                        // if OVERFLOW pagination size => remove the last entry:
                        if (shiftedPaginationQueryCacheData.entities.length > perPage) {
                            shiftedPaginationQueryCacheData.entities.pop();
                        } // if
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
            .map(({ originalArgs, data }) => ({
                indexStart        : selectRangeFromArg(originalArgs).indexStart,
                indexLocalDeleted : selectIndexOfId<TEntry>(data, mutatedId),
            }))
            .filter(({ indexLocalDeleted }) =>
                (indexLocalDeleted >= 0) // is FOUND
            )
            .map(({ indexStart, indexLocalDeleted }) =>
                (indexStart + indexLocalDeleted) // convert local index to global index
            )
        );
        const uniqueDeletedPaginationIndices = Array.from(new Set<number>(deletedPaginationIndices));
        if (uniqueDeletedPaginationIndices.length !== 1) {
            // all the deleted queryCaches should have ONE valid deleted index, otherwise => panic => clear all the caches and (may) trigger the rtk to re-fetch
            
            // clear caches:
            api.dispatch(
                apiSlice.util.invalidateTags([invalidateTag])
            );
            return; // panic => cannot further reconstruct
        } // if
        const indexDeleted = uniqueDeletedPaginationIndices[0];
        
        
        
        const shiftedPaginationQueryCaches = (
            paginationQueryCaches
            .filter(({ originalArgs, data }) => {
                const {
                    indexStart,
                } = selectRangeFromArg(originalArgs);
                const indexLast = (
                    indexStart
                    +
                    (selectEntriesFromData<TEntry>(data).length - 1)
                );
                
                
                
                return (
                    ((indexDeleted >= indexStart) && (indexDeleted <= indexLast)) // the deleted_pagination => within indexStart to indexLast
                    ||
                    (indexStart > indexDeleted) // the shifted_up_pagination => below the deleted_pagination
                );
            })
        );
        
        
        
        // reconstructuring the deleted entry, so the invalidatesTag can be avoided:
        
        
        
        //#region BACKUP the entries from paginations (which will be shifted) 
        const mergedEntryList : TEntry[] = []; // use an `Array<TEntry>` instead of `Map<number, TEntry>`, so we can SHIFT the key easily
        for (const shiftedPaginationQueryCache of shiftedPaginationQueryCaches) {
            const {
                indexStart, // the global first_entry_index
            } = selectRangeFromArg(shiftedPaginationQueryCache.originalArgs);
            
            
            
            /*
                Only the first_entry of current pagination is useful for backup.
                After the whole `mergedEntryList` shifted_up, the first_entry becomes the last_entry of the prev pagination chains.
            */
            const paginationEntries = selectEntriesFromData<TEntry>(shiftedPaginationQueryCache.data);
            const entryStart = paginationEntries[0] as TEntry|undefined; // a zero based starting index, select the FIRST pagination entry
            if (entryStart !== undefined) mergedEntryList[indexStart] = entryStart; // if exists, copy the FIRST pagination entry
        } // for
        //#endregion BACKUP the entries from paginations (which will be shifted) 
        
        
        
        // REMOVE the del_entry at the DELETED_INDEX of the list:
        mergedEntryList.splice(indexDeleted, 1);
        // re-calculate the total entries:
        const newTotalEntries = validTotalEntries - 1;
        
        
        
        //#region RESTORE the shifted paginations from the backup
        for (const { originalArgs, data } of shiftedPaginationQueryCaches) {
            const {
                indexStart, // the global first_entry_index
                indexEnd,   // the global last_entry_index
                page,
            } = selectRangeFromArg(originalArgs);
            
            const entryEnd = mergedEntryList[indexEnd] as TEntry|undefined; // take the *valid* last_entry of current pagination, the old_2nd_first_entry...the_last_entry will be first_entry...2nd_last_entry
            
            
            
            // reconstruct current pagination cache:
            api.dispatch(
                apiSlice.util.updateQueryData(endpointName, originalArgs as PaginationArgs, (shiftedPaginationQueryCacheData) => {
                    // Shift up at the top/middle of pagination:
                    const indexLast = (
                        indexStart
                        +
                        (selectEntriesFromData<TEntry>(data).length - 1)
                    );
                    if ((indexDeleted >= indexStart) && (indexDeleted <= indexLast)) { // the deleted_pagination => within indexStart to indexLast
                        // REMOVE the deleted entry at specific index:
                        const relativeIndexDeleted = indexDeleted - indexStart;
                        shiftedPaginationQueryCacheData.entities.splice(relativeIndexDeleted, 1);
                    }
                    else { // the shifted_up_pagination => below the deleted_pagination
                        // because ONE entry in prev pagination has been DELETED => ALL subsequent paginations are SHIFTED_UP:
                        // REMOVE the first entry for shifting:
                        shiftedPaginationQueryCacheData.entities.shift();
                    } // if
                    
                    
                    
                    // a shifting compensation to maintain pagination size (if possible):
                    // RESTORE the entryStart at the END of the pagination:
                    if (entryEnd !== undefined /* if possible */) (shiftedPaginationQueryCacheData.entities as unknown as TEntry[]).push(entryEnd);
                    
                    
                    
                    // update the total data:
                    shiftedPaginationQueryCacheData.total = newTotalEntries;
                    
                    
                    
                    // if UNDERFLOW (empty) pagination size => invalidate the cache:
                    if (!shiftedPaginationQueryCacheData.entities.length) {
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
