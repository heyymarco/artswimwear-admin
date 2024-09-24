// redux:
import {
    type Dictionary,
    type EntityState,
    
    createEntityAdapter,
}                           from '@reduxjs/toolkit'
import {
    type BaseQueryFn,
    
    createApi,
}                           from '@reduxjs/toolkit/query/react'
import {
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
    tagTypes: ['ProductPage', 'TemplateVariantGroupEntity', 'OrderPage', 'ShippingPage', 'DefaultShippingOriginData', 'AdminPage', 'RoleEntity', 'PreferenceData'],
    endpoints : (builder) => ({
        getProductPage              : builder.query<Pagination<ProductDetail>, PaginationArgs>({
            query : (arg) => ({
                url    : 'products',
                method : 'POST',
                body   : arg,
            }),
            providesTags: (data, error, arg) => [{ type: 'ProductPage', id: arg.page }],
        }),
        updateProduct               : builder.mutation<ProductDetail, MutationArgs<Omit<ProductDetail, 'stocks'> & { stocks?: (number|null)[] }>>({
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
                url    : 'products',
                method : 'DELETE',
                body   : arg
            }),
            onQueryStarted: async (arg, api) => {
                await cumulativeUpdatePaginationCache(api, 'getProductPage', 'DELETE', 'ProductPage');
            },
        }),
        
        getProductPreview           : builder.query<ProductPreview, string>({
            query : (arg: string) => ({
                url    : `products?id=${encodeURIComponent(arg)}`,
                method : 'GET',
            }),
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
    useLazyAvailablePathQuery              : useAvailablePath,
    
    
    
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
const selectEntriesFromData = <TEntry extends Model|string>(data: unknown): TEntry[] => {
    const items = (
        ('ids' in (data as EntityState<TEntry>|Pagination<TEntry>))
        ? Object.values((data as EntityState<TEntry>).entities).filter((entity) : entity is Exclude<typeof entity, undefined> => (entity !== undefined))
        : (data as Pagination<TEntry>).entities
    );
    return items;
};
const selectIdFromEntry     = <TEntry extends Model|string>(entry: TEntry): string => {
    return (typeof(entry) === 'string') ? entry : entry.id;
};
const selectIndexOfId       = <TEntry extends Model|string>(data: unknown, id: string): number => {
    return (
        ('ids' in (data as EntityState<TEntry>|Pagination<TEntry>))
        ? (
            (data as EntityState<TEntry>).ids
            .findIndex((searchId) =>
                (searchId === id)
            )
        )
        : (
            (data as Pagination<TEntry>).entities
            .findIndex((searchEntry) =>
                (selectIdFromEntry<TEntry>(searchEntry) === id)
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

type PaginationUpdateType =
    |'CREATE'
    |'UPDATE'
    |'UPSERT'
    |'DELETE'
interface PaginationUpdateOptions<TEntry extends Model|string> {
    providedMutatedEntry ?: TEntry
    predicate            ?: (originalArgs: unknown) => boolean
}
const cumulativeUpdatePaginationCache = async <TEntry extends Model|string, TQueryArg, TBaseQuery extends BaseQueryFn>(api: MutationLifecycleApi<TQueryArg, TBaseQuery, TEntry, 'api'>, endpointName: Extract<keyof (typeof apiSlice)['endpoints'], 'getProductPage'|'getOrderPage'|'getShippingPage'|'getAdminPage'>, updateType: PaginationUpdateType, invalidateTag: Extract<Parameters<typeof apiSlice.util.invalidateTags>[0][number], string>, options?: PaginationUpdateOptions<TEntry>) => {
    // options
    const {
        providedMutatedEntry,
        predicate,
    } = options ?? {};
    
    
    
    // mutated TEntry data:
    const mutatedEntry : TEntry|undefined = (providedMutatedEntry !== undefined) ? providedMutatedEntry : await (async (): Promise<TEntry|undefined> => {
        try {
            const { data: mutatedEntry } = await api.queryFulfilled;
            return mutatedEntry;
        }
        catch {
            return undefined;
        } // try
    })();
    if (mutatedEntry === undefined) return; // api request aborted|failed => nothing to update
    const mutatedId = selectIdFromEntry<TEntry>(mutatedEntry);
    
    
    
    // find related TEntry data(s):
    const state                 = api.getState();
    const allQueryCaches        = state.api.queries;
    const collectionQueryCaches = (
        Object.values(allQueryCaches)
        .filter((allQueryCache): allQueryCache is Exclude<typeof allQueryCache, undefined> =>
            (allQueryCache !== undefined)
            &&
            (allQueryCache.endpointName === endpointName)
            &&
            (allQueryCache.data !== undefined)
            &&
            ((predicate === undefined) || predicate(allQueryCache.originalArgs))
        )
    );
    
    
    
    const lastCollectionQueryCache       = collectionQueryCaches.length ? collectionQueryCaches[collectionQueryCaches.length - 1] : undefined;
    if (lastCollectionQueryCache === undefined) {
        // there's no queryCaches to update => nothing to do
        return;
    } // if
    const validTotalEntries              = selectTotalFromData(lastCollectionQueryCache.data);
    const hasInvalidCollectionQueryCache = collectionQueryCaches.some(({ data }) =>
        (selectTotalFromData(data) !== validTotalEntries)
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
    if ((updateType === 'UPDATE') || (updateType === 'UPSERT')) {
        const mutatedPaginationIndices = (
            collectionQueryCaches
            .map(({ originalArgs, data }) => ({
                indexStart        : selectRangeFromArg(originalArgs).indexStart,
                indexLocalMutated : selectIndexOfId<TEntry>(data, mutatedId),
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
            if (updateType === 'UPSERT') { // UPSERT
                // nothing to update => switch to CREATE mode:
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
        
        
        
        // reconstructuring the updated entry, so the invalidatesTag can be avoided:
        
        
        
        // update cache:
        for (const { originalArgs } of mutatedCollectionQueryCaches) {
            api.dispatch(
                apiSlice.util.updateQueryData(endpointName, originalArgs as PaginationArgs, (data) => {
                    const currentEntryIndex = selectIndexOfId<TEntry>(data, mutatedId);
                    if (currentEntryIndex < 0) return; // not found => nothing to update
                    const currentEntry = (data.entities as unknown as TEntry[])[currentEntryIndex];
                    (data.entities as unknown as TEntry[])[currentEntryIndex] = (
                        ((typeof(currentEntry) === 'object') && (typeof(mutatedEntry) === 'object'))
                        ? {
                            ...currentEntry,
                            ...mutatedEntry, // partially|fully replace oldEntry with mutatedEntry
                        }
                        : mutatedEntry       // fully           replace oldEntry with mutatedEntry
                    );
                })
            );
        } // for
    }
    
    /* add new data: COMPLEX: the number of collection_items is scaled_up */
    else if (updateType === 'CREATE') {
        /*
            Adding a_new_entry causing the restPagination(s) shifted their entries to neighboringPagination(s).
            [876] [543] [210] + 9 => [987] [654] [321] [0]
            page1 page2 page3        page1 page2 page3 pageTail
        */
        const shiftedCollectionQueryCaches = collectionQueryCaches;
        
        
        
        // reconstructuring the shifted entries, so the invalidatesTag can be avoided:
        
        
        
        //#region BACKUP the entries from paginations (which will be shifted) 
        const mergedEntryList : TEntry[] = []; // use an `Array<TEntry>` instead of `Map<number, TEntry>`, so we can SHIFT the key easily
        for (const { originalArgs, data } of shiftedCollectionQueryCaches) {
            const {
                indexStart, // the global first_entry_index
                indexEnd,   // the global last_entry_index
            } = selectRangeFromArg(originalArgs);
            
            
            
            /*
                Assumes the next paginations having the same perPage size:
                Only the last_entry of current pagination is useful for backup.
                After the whole `mergedEntryList` shifted_down, the last_entry becomes the first_entry of the next pagination chains.
            */
            const paginationEntries = selectEntriesFromData<TEntry>(data);
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
        for (const { originalArgs } of shiftedCollectionQueryCaches) {
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
                    apiSlice.util.updateQueryData(endpointName, originalArgs as PaginationArgs, (data) => {
                        // RESTORE the entryStart at the BEGINNING of the pagination:
                        (data.entities as unknown as TEntry[]).unshift(entryStart);
                        
                        
                        
                        // update the total data:
                        data.total = newTotalEntries;
                        
                        
                        
                        // if OVERFLOW pagination size => remove the last entry:
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
        
        
        
        // reconstructuring the deleted entry, so the invalidatesTag can be avoided:
        
        
        
        //#region BACKUP the entries from paginations (which will be shifted) 
        const mergedEntryList : TEntry[] = []; // use an `Array<TEntry>` instead of `Map<number, TEntry>`, so we can SHIFT the key easily
        for (const { originalArgs, data } of shiftedCollectionQueryCaches) {
            const {
                indexStart, // the global first_entry_index
            } = selectRangeFromArg(originalArgs);
            
            
            
            /*
                Assumes the prev paginations having the same perPage size:
                Only the first_entry of current pagination is useful for backup.
                After the whole `mergedEntryList` shifted_up, the first_entry becomes the last_entry of the prev pagination chains.
            */
            const paginationEntries = selectEntriesFromData<TEntry>(data);
            const entryStart = paginationEntries[0] as TEntry|undefined; // a zero based starting index, select the FIRST pagination entry
            if (entryStart !== undefined) mergedEntryList[indexStart] = entryStart; // if exists, copy the FIRST pagination entry
        } // for
        //#endregion BACKUP the entries from paginations (which will be shifted) 
        
        
        
        // REMOVE the del_entry at the DELETED_INDEX of the list:
        mergedEntryList.splice(indexDeleted, 1);
        // re-calculate the total entries:
        const newTotalEntries = validTotalEntries - 1;
        
        
        
        //#region RESTORE the shifted paginations from the backup
        for (const { originalArgs, data } of shiftedCollectionQueryCaches) {
            const {
                indexStart, // the global first_entry_index
                indexEnd,   // the global last_entry_index
                page,
            } = selectRangeFromArg(originalArgs);
            const indexLast = (
                indexStart
                +
                (selectTotalFromData(data) - 1)
            );
            
            const entryEnd = mergedEntryList[indexEnd] as TEntry|undefined; // take the *valid* last_entry of current pagination, the old_2nd_first_entry...the_last_entry will be first_entry...2nd_last_entry
            
            
            
            // reconstruct current pagination cache:
            api.dispatch(
                apiSlice.util.updateQueryData(endpointName, originalArgs as PaginationArgs, (data) => {
                    // Shift up at the top/middle of pagination:
                    if ((indexDeleted >= indexStart) && (indexDeleted <= indexLast)) { // the deleted_pagination => within indexStart to indexLast
                        // REMOVE the deleted entry at specific index:
                        const relativeIndexDeleted = indexDeleted - indexStart;
                        data.entities.splice(relativeIndexDeleted, 1);
                    }
                    else { // the shifted_up_pagination => below the deleted_pagination
                        // because ONE entry in prev pagination has been DELETED => ALL subsequent paginations are SHIFTED_UP:
                        // REMOVE the first entry for shifting:
                        data.entities.shift();
                    } // if
                    
                    
                    
                    // a shifting compensation to maintain pagination size (if possible):
                    // RESTORE the entryStart at the END of the pagination:
                    if (entryEnd !== undefined /* if possible */) (data.entities as unknown as TEntry[]).push(entryEnd);
                    
                    
                    
                    // update the total data:
                    data.total = newTotalEntries;
                    
                    
                    
                    // if UNDERFLOW (empty) pagination size => invalidate the cache:
                    if (!data.entities.length) {
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

type EntityUpdateType =
    |'UPSERT'
    |'DELETE'
interface EntityUpdateOptions<TEntry extends Model|string> {
    providedMutatedEntry ?: TEntry
    predicate            ?: (originalArgs: unknown) => boolean
}
const cumulativeUpdateEntityCache     = async <TEntry extends Model|string, TQueryArg, TBaseQuery extends BaseQueryFn>(api: MutationLifecycleApi<TQueryArg, TBaseQuery, TEntry, 'api'>, endpointName: Extract<keyof (typeof apiSlice)['endpoints'], 'getTemplateVariantGroupList'|'getRoleList'>, updateType: EntityUpdateType, invalidateTag: Extract<Parameters<typeof apiSlice.util.invalidateTags>[0][number], string>, options?: EntityUpdateOptions<TEntry>) => {
    // options
    const {
        providedMutatedEntry,
        predicate,
    } = options ?? {};
    
    
    
    // mutated TEntry data:
    const mutatedEntry : TEntry|undefined = (providedMutatedEntry !== undefined) ? providedMutatedEntry : await (async (): Promise<TEntry|undefined> => {
        try {
            const { data: mutatedEntry } = await api.queryFulfilled;
            return mutatedEntry;
        }
        catch {
            return undefined;
        } // try
    })();
    if (mutatedEntry === undefined) return; // api request aborted|failed => nothing to update
    const mutatedId = selectIdFromEntry<TEntry>(mutatedEntry);
    
    
    
    // find related TEntry data(s):
    const state                 = api.getState();
    const allQueryCaches        = state.api.queries;
    const collectionQueryCaches = (
        Object.values(allQueryCaches)
        .filter((allQueryCache): allQueryCache is Exclude<typeof allQueryCache, undefined> =>
            (allQueryCache !== undefined)
            &&
            (allQueryCache.endpointName === endpointName)
            &&
            (allQueryCache.data !== undefined)
            &&
            ((predicate === undefined) || predicate(allQueryCache.originalArgs))
        )
    );
    
    
    
    const lastCollectionQueryCache       = collectionQueryCaches.length ? collectionQueryCaches[collectionQueryCaches.length - 1] : undefined;
    if (lastCollectionQueryCache === undefined) {
        // there's no queryCaches to update => nothing to do
        return;
    } // if
    const validTotalEntries              = selectTotalFromData(lastCollectionQueryCache.data);
    const hasInvalidCollectionQueryCache = collectionQueryCaches.some(({ data }) =>
        (selectTotalFromData(data) !== validTotalEntries)
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
        
        
        
        // reconstructuring the shifted entries, so the invalidatesTag can be avoided:
        
        
        
        //#region INSERT the new entry to the cache's entity
        for (const { originalArgs } of shiftedCollectionQueryCaches) {
            // reconstruct current entity cache:
            api.dispatch(
                apiSlice.util.updateQueryData(endpointName, originalArgs as any, (data) => {
                    if (selectIndexOfId<TEntry>(data, mutatedId) >= 0) { // is FOUND
                        // UPDATE the existing entry:
                        const currentEntry = (data.entities as Dictionary<TEntry>)[mutatedId];
                        (data.entities as Dictionary<TEntry>)[mutatedId] = (
                            ((typeof(currentEntry) === 'object') && (typeof(mutatedEntry) === 'object'))
                            ? {
                                ...currentEntry,
                                ...mutatedEntry, // partially|fully replace oldEntry with mutatedEntry
                            }
                            : mutatedEntry       // fully           replace oldEntry with mutatedEntry
                        );
                    }
                    else {
                        // INSERT the new entry:
                        (data.entities as Dictionary<TEntry>) = {
                            [mutatedId] : mutatedEntry, // place the inserted entry to the first property
                            ...data.entities as Dictionary<TEntry>,
                        } satisfies Dictionary<TEntry>;
                        
                        
                        
                        // INSERT the new entry's id at the BEGINNING of the ids:
                        data.ids.unshift(mutatedId);
                    } // if
                })
            );
        } // for
        //#endregion INSERT the new entry to the cache's entity
    }
    
    /* delete existing data: COMPLEX: the number of collection_items is scaled_down */
    else {
        const shiftedCollectionQueryCaches = (
            collectionQueryCaches
            .filter(({ data }) =>
                (selectIndexOfId<TEntry>(data, mutatedId) >= 0) // is FOUND
            )
        );
        
        
        
        // reconstructuring the deleted entry, so the invalidatesTag can be avoided:
        
        
        
        //#region REMOVE the deleted entry from the cache's entity
        for (const { originalArgs } of shiftedCollectionQueryCaches) {
            // reconstruct current entity cache:
            api.dispatch(
                apiSlice.util.updateQueryData(endpointName, originalArgs as any, (data) => {
                    // REMOVE the deleted entry:
                    delete (data.entities as Dictionary<TEntry>)[mutatedId];
                    
                    
                    
                    // REMOVE the deleted entry's id at the BEGINNING of the ids:
                    const indexOfId = selectIndexOfId<TEntry>(data, mutatedId);
                    if (indexOfId >= 0) data.ids.splice(indexOfId, 1);
                })
            );
        } // for
        //#endregion REMOVE the deleted entry from the cache's entity
    } // if
};
