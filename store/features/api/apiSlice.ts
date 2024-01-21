import { createEntityAdapter, EntityState }                         from '@reduxjs/toolkit'
import { BaseQueryFn, createApi, fetchBaseQuery }                   from '@reduxjs/toolkit/query/react'
import type { QuerySubState }                                       from '@reduxjs/toolkit/dist/query/core/apiState'
import type { BaseEndpointDefinition, MutationCacheLifecycleApi }   from '@reduxjs/toolkit/dist/query/endpointDefinitions'

// types:
import type {
    PaginationArgs,
    Pagination,
    
    MutationArgs,
}                           from '@/libs/types'
export type OrderDetailWithOptions = OrderDetail & { sendConfirmationEmail?: boolean }

// apis:
export type { CountryPreview }                  from '@/app/api/(protected)/countries/route'
import type { ProductPreview, ProductDetail }   from '@/app/api/(protected)/products/route'
export type { ProductPreview, ProductDetail }   from '@/app/api/(protected)/products/route'
import type { OrderDetail }                     from '@/app/api/(protected)/orders/route'
export type { OrderDetail }                     from '@/app/api/(protected)/orders/route'
import type { ShippingPreview }                 from '@/app/api/(protected)/shippings/route'
export type { ShippingPreview }                 from '@/app/api/(protected)/shippings/route'
import type { UserDetail }                      from '@/app/api/(protected)/users/route'
export type { UserDetail }                      from '@/app/api/(protected)/users/route'
import type { RoleDetail }                      from '@/app/api/(protected)/roles/route'
export type { RoleDetail }                      from '@/app/api/(protected)/roles/route'
import type { ImageId }                         from '@/app/api/(protected)/uploads/route'
export type { ImageId }                         from '@/app/api/(protected)/uploads/route'

// other libs:
import {
    default as axios,
    AxiosRequestConfig,
    CanceledError,
    AxiosError,
}                           from 'axios'



const shippingListAdapter = createEntityAdapter<ShippingPreview>({
    selectId : (shippingPreview) => shippingPreview.id,
});
const productListAdapter  = createEntityAdapter<ProductPreview>({
    selectId : (productPreview) => productPreview.id,
});
const roleListAdapter     = createEntityAdapter<RoleDetail>({
    selectId : (rolePreview) => rolePreview.id,
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
        baseUrl: `${process.env.WEBSITE_URL ?? ''}/api`
    }),
    tagTypes: ['Products', 'Orders', 'Users', 'Roles'],
    endpoints : (builder) => ({
        getProductList        : builder.query<EntityState<ProductPreview>, void>({
            query : () => ({
                url    : 'products',
                method : 'GET',
            }),
            transformResponse(response: ProductPreview[]) {
                return productListAdapter.addMany(productListAdapter.getInitialState(), response);
            },
        }),
        getProductPage        : builder.query<Pagination<ProductDetail>, PaginationArgs>({
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
        updateProduct         : builder.mutation<ProductDetail, MutationArgs<ProductDetail>>({
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
        deleteProduct         : builder.mutation<Pick<ProductDetail, 'id'>, MutationArgs<Pick<ProductDetail, 'id'>>>({
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
        availablePath         : builder.mutation<boolean, string>({
            query: (path) => ({
                url    : `products/check-path?path=${encodeURIComponent(path)}`,
                method : 'GET',
            }),
        }),
        
        getOrderPage          : builder.query<Pagination<OrderDetail>, PaginationArgs>({
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
        updateOrder           : builder.mutation<OrderDetailWithOptions, MutationArgs<OrderDetail>>({
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
        
        getShippingList       : builder.query<EntityState<ShippingPreview>, void>({
            query : () => ({
                url    : 'shippings',
                method : 'GET',
            }),
            transformResponse(response: ShippingPreview[]) {
                return shippingListAdapter.addMany(shippingListAdapter.getInitialState(), response);
            },
        }),
        
        getUserPage           : builder.query<Pagination<UserDetail>, PaginationArgs>({
            query : (params) => ({
                url    : 'users',
                method : 'POST',
                body   : params,
            }),
            providesTags: (result, error, page)  => {
                return [
                    ...(result?.entities ?? []).map((user): { type: 'Users', id: string } => ({
                        type : 'Users',
                        id   : user.id,
                    })),
                    
                    {
                        type : 'Users',
                        id   : 'USER_LIST',
                    },
                ];
            },
        }),
        updateUser            : builder.mutation<UserDetail, MutationArgs<UserDetail>>({
            query: (patch) => ({
                url    : 'users',
                method : 'PATCH',
                body   : patch
            }),
            
            // inefficient:
            // invalidatesTags: (user, error, arg) => [
            //     ...((!user ? [] : [{
            //         type : 'Users',
            //         id   : user.id,
            //     }]) as Array<{ type: 'Users', id: string }>),
            // ],
            
            // more efficient:
            onCacheEntryAdded: async (arg, api) => {
                await handleCumulativeUpdateCacheEntry('getUserPage', (arg.id !== ''), api);
            },
        }),
        deleteUser            : builder.mutation<Pick<UserDetail, 'id'>, MutationArgs<Pick<UserDetail, 'id'>>>({
            query: (params) => ({
                url    : 'users',
                method : 'DELETE',
                body   : params
            }),
            invalidatesTags: (user, error, arg) => [
                ...((!user ? [{
                    type : 'Users',
                    id   : 'USER_LIST', // delete unspecified => invalidates the whole list
                }] : [{
                    type : 'Users',
                    id   : user.id,     // delete existing    => invalidates the modified
                }]) as Array<{ type: 'Users', id: string }>),
            ],
        }),
        availableUsername     : builder.mutation<boolean, string>({
            query: (username) => ({
                url    : `users/check-username?username=${encodeURIComponent(username)}`, // cloned from @heymarco/next-auth, because this api was disabled in auth.config.shared
                method : 'GET',
            }),
        }),
        notProhibitedUsername : builder.mutation<boolean, string>({
            query: (username) => ({
                url    : `users/check-username?username=${encodeURIComponent(username)}`, // cloned from @heymarco/next-auth, because this api was disabled in auth.config.shared
                method : 'PUT',
            }),
        }),
        availableEmail        : builder.mutation<boolean, string>({
            query: (email) => ({
                url    : `users/check-email?email=${encodeURIComponent(email)}`, // cloned from @heymarco/next-auth, because this api was disabled in auth.config.shared
                method : 'GET',
            }),
        }),
        
        getRoleList           : builder.query<EntityState<RoleDetail>, void>({
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
        updateRole            : builder.mutation<RoleDetail, MutationArgs<RoleDetail>>({
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
        deleteRole            : builder.mutation<Pick<RoleDetail, 'id'>, MutationArgs<Pick<RoleDetail, 'id'>>>({
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
        availableRolename     : builder.mutation<boolean, string>({
            query: (name) => ({
                url    : `roles/check-name?name=${encodeURIComponent(name)}`,
                method : 'GET',
            }),
        }),
        
        postImage             : builder.mutation<ImageId, { image: File, folder?: string, onUploadProgress?: (percentage: number) => void, abortSignal?: AbortSignal }>({
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
        deleteImage           : builder.mutation<ImageId[], { imageId: string[] }>({
            query: ({ imageId: imageIds }) => ({
                url     : 'uploads',
                method  : 'PATCH',
                headers : { 'content-type': 'multipart/form-data' },
                body    : ((): FormData => {
                    const formData = new FormData();
                    for (const imageId of imageIds) formData.append('image' , imageId);
                    return formData;
                })(),
            }),
        }),
    }),
});



const handleCumulativeUpdateCacheEntry = async <TEntry extends { id: string }, QueryArg, BaseQuery extends BaseQueryFn>(endpointName: Extract<keyof (typeof apiSlice)['endpoints'], 'getProductPage'|'getOrderPage'|'getUserPage'>, isUpdating: boolean, api: MutationCacheLifecycleApi<QueryArg, BaseQuery, TEntry, 'api'>) => {
    // updated TEntry data:
    const { data: entry } = await api.cacheDataLoaded;
    const { id } = entry;
    
    
    
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
                /*missing id: */ !paginationQueryCache.data?.entities.some((searchEntry) => (searchEntry.id === id))
            )
        );
        if (missingPaginationQueryCaches.length) {
            const shiftedDataMap : TEntry[] = [entry];
            for (const paginationQueryCache of paginationQueryCaches) {
                const {
                    page    = 1,
                    perPage = 1,
                } = paginationQueryCache.originalArgs as PaginationArgs;
                
                const baseIndex  = (page - 1) * perPage;
                let   subIndex   = 0;
                const shiftCount = 1;
                for (const entry of (paginationQueryCache.data as Pagination<TEntry>).entities) {
                    shiftedDataMap[baseIndex + (subIndex++) + shiftCount] = entry;
                } // for
            } // for
            
            
            
            let tailPaginationTotal : number = 0;
            for (const missingPaginationQueryCache of missingPaginationQueryCaches) {
                const {
                    page    = 1,
                    perPage = 1,
                } = missingPaginationQueryCache.originalArgs as PaginationArgs;
                const baseIndex  = (page - 1) * perPage;
                
                
                
                const insertedEntry : TEntry|undefined = shiftedDataMap?.[baseIndex];
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
            
            
            
            if (tailPaginationTotal && shiftedDataMap.length) {
                const lastPagination : Pagination<TEntry> = {
                    total    : tailPaginationTotal,
                    entities : [
                        shiftedDataMap[shiftedDataMap.length - 1] // take the last
                    ],
                };
                const perPage = (paginationQueryCaches?.[paginationQueryCaches.length - 1]?.originalArgs as (PaginationArgs|undefined))?.perPage ?? 1;
                // append cache:
                api.dispatch(
                    apiSlice.util.upsertQueryData(endpointName, {
                        page    : Math.ceil(tailPaginationTotal / perPage),
                        perPage : perPage
                    }, (lastPagination as Pagination<any>))
                );
            } // if
        } // if
    }
    else { // update existing data:
        const obsoletePaginationQueryCaches = (
            paginationQueryCaches
            .filter((paginationQueryCache) =>
                /*found id: */ !!paginationQueryCache.data?.entities.some((searchEntry) => (searchEntry.id === id))
            )
        );
        if (obsoletePaginationQueryCaches.length) {
            for (const obsoletePaginationQueryCache of obsoletePaginationQueryCaches) {
                // update cache:
                api.dispatch(
                    apiSlice.util.updateQueryData(endpointName, obsoletePaginationQueryCache.originalArgs as any, (paginationCache) => {
                        const obsoleteEntryIndex = paginationCache.entities.findIndex((searchEntry) => (searchEntry.id === id));
                        if (obsoleteEntryIndex < 0) return;
                        paginationCache.entities[obsoleteEntryIndex] = (entry as any); // update existing data
                    })
                );
            } // for
        } // if
    } // if
};



export const {
    useGetProductListQuery           : useGetProductList,
    useGetProductPageQuery           : useGetProductPage,
    useUpdateProductMutation         : useUpdateProduct,
    useDeleteProductMutation         : useDeleteProduct,
    useAvailablePathMutation         : useAvailablePath,
    
    useGetOrderPageQuery             : useGetOrderPage,
    useUpdateOrderMutation           : useUpdateOrder,
    
    useGetShippingListQuery          : useGetShippingList,
    
    useGetUserPageQuery              : useGetUserPage,
    useUpdateUserMutation            : useUpdateUser,
    useDeleteUserMutation            : useDeleteUser,
    useAvailableUsernameMutation     : useAvailableUsername,
    useNotProhibitedUsernameMutation : useNotProhibitedUsername,
    useAvailableEmailMutation        : useAvailableEmail,
    
    useGetRoleListQuery              : useGetRoleList,
    useUpdateRoleMutation            : useUpdateRole,
    useDeleteRoleMutation            : useDeleteRole,
    useAvailableRolenameMutation     : useAvailableRolename,
    
    usePostImageMutation             : usePostImage,
    useDeleteImageMutation           : useDeleteImage,
} = apiSlice;
