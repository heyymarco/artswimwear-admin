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

// apis:
import type { ProductPreview, ProductDetail }   from '@/app/api/(protected)/product/route'
export type { ProductPreview, ProductDetail }   from '@/app/api/(protected)/product/route'
import type { OrderDetail }                     from '@/app/api/(protected)/order/route'
export type { OrderDetail }                     from '@/app/api/(protected)/order/route'
import type { ShippingPreview }                 from '@/app/api/(protected)/shipping/route'
export type { ShippingPreview }                 from '@/app/api/(protected)/shipping/route'
import type { UserDetail }                      from '@/app/api/(protected)/user/route'
export type { UserDetail }                      from '@/app/api/(protected)/user/route'
import type { RolePreview, RoleDetail }         from '@/app/api/(protected)/role/route'
export type { RolePreview, RoleDetail }         from '@/app/api/(protected)/role/route'



const shippingListAdapter = createEntityAdapter<ShippingPreview>({
    selectId : (shippingPreview) => shippingPreview.id,
});
const productListAdapter  = createEntityAdapter<ProductPreview>({
    selectId : (productPreview) => productPreview.id,
});
const roleListAdapter     = createEntityAdapter<RolePreview>({
    selectId : (rolePreview) => rolePreview.id,
});



export const apiSlice = createApi({
    reducerPath : 'api',
    baseQuery : fetchBaseQuery({
        baseUrl: '/api'
    }),
    tagTypes: ['Products', 'Orders', 'Users', 'Roles'],
    endpoints : (builder) => ({
        getProductList  : builder.query<EntityState<ProductPreview>, void>({
            query : () => ({
                url    : 'product',
                method : 'GET',
            }),
            transformResponse(response: ProductPreview[]) {
                return productListAdapter.addMany(productListAdapter.getInitialState(), response);
            },
        }),
        getProductPage  : builder.query<Pagination<ProductDetail>, PaginationArgs>({
            query : (params) => ({
                url    : 'product',
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
        updateProduct   : builder.mutation<ProductDetail, MutationArgs<ProductDetail>>({
            query: (patch) => ({
                url    : 'product',
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
        
        getOrderPage    : builder.query<Pagination<OrderDetail>, PaginationArgs>({
            query : (params) => ({
                url    : 'order',
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
        updateOrder     : builder.mutation<OrderDetail, MutationArgs<OrderDetail>>({
            query: (patch) => ({
                url    : 'order',
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
        
        getShippingList : builder.query<EntityState<ShippingPreview>, void>({
            query : () => ({
                url    : 'shipping',
                method : 'GET',
            }),
            transformResponse(response: ShippingPreview[]) {
                return shippingListAdapter.addMany(shippingListAdapter.getInitialState(), response);
            },
        }),
        
        getUserPage  : builder.query<Pagination<UserDetail>, PaginationArgs>({
            query : (params) => ({
                url    : 'user',
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
        updateUser   : builder.mutation<UserDetail, MutationArgs<UserDetail>>({
            query: (patch) => ({
                url    : 'user',
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
        
        getRoleList  : builder.query<EntityState<RolePreview>, void>({
            query : () => ({
                url    : 'role',
                method : 'GET',
            }),
            transformResponse(response: RolePreview[]) {
                return roleListAdapter.addMany(roleListAdapter.getInitialState(), response);
            },
        }),
        getRolePage  : builder.query<Pagination<RoleDetail>, PaginationArgs>({
            query : (params) => ({
                url    : 'role',
                method : 'POST',
                body   : params,
            }),
            providesTags: (result, error, page)  => {
                return [
                    ...(result?.entities ?? []).map((role): { type: 'Roles', id: string } => ({
                        type : 'Roles',
                        id   : role.id,
                    })),
                    
                    {
                        type : 'Roles',
                        id   : 'ROLE_LIST',
                    },
                ];
            },
        }),
        updateRole   : builder.mutation<RoleDetail, MutationArgs<RoleDetail>>({
            query: (patch) => ({
                url    : 'role',
                method : 'PATCH',
                body   : patch
            }),
            
            // inefficient:
            // invalidatesTags: (role, error, arg) => [
            //     ...((!role ? [] : [{
            //         type : 'Roles',
            //         id   : role.id,
            //     }]) as Array<{ type: 'Roles', id: string }>),
            // ],
            
            // more efficient:
            onCacheEntryAdded: async (arg, api) => {
                await handleCumulativeUpdateCacheEntry('getRolePage', (arg.id !== ''), api);
            },
        }),
    }),
});



const handleCumulativeUpdateCacheEntry = async <TEntry extends { id: string }, QueryArg, BaseQuery extends BaseQueryFn>(endpointName: Extract<keyof (typeof apiSlice)['endpoints'], 'getProductPage'|'getOrderPage'|'getUserPage'|'getRolePage'>, isUpdating: boolean, api: MutationCacheLifecycleApi<QueryArg, BaseQuery, TEntry, 'api'>) => {
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
    useGetProductListQuery   : useGetProductList,
    useGetProductPageQuery   : useGetProductPage,
    useUpdateProductMutation : useUpdateProduct,
    
    useGetOrderPageQuery     : useGetOrderPage,
    useUpdateOrderMutation   : useUpdateOrder,
    
    useGetShippingListQuery  : useGetShippingList,
    
    useGetUserPageQuery      : useGetUserPage,
    useUpdateUserMutation    : useUpdateUser,
    
    useGetRoleListQuery      : useGetRoleList,
    useGetRolePageQuery      : useGetRolePage,
    useUpdateRoleMutation    : useUpdateRole,
} = apiSlice;
