import { createEntityAdapter, EntityState } from '@reduxjs/toolkit'
import { BaseQueryFn, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Pagination } from '@/libs/types'
import type { ProductPreview, ProductDetail } from '@/pages/api/product'
export type { ProductPreview, ProductDetail } from '@/pages/api/product'
import type { OrderDetail } from '@/pages/api/order'
export type { OrderDetail } from '@/pages/api/order'
import type { ShippingPreview } from '@/pages/api/shipping'
import type { MutationCacheLifecycleApi } from '@reduxjs/toolkit/dist/query/endpointDefinitions'
export type { ShippingPreview } from '@/pages/api/shipping'



const shippingListAdapter = createEntityAdapter<ShippingPreview>({
    selectId : (shippingPreview) => shippingPreview.id,
});
const productListAdapter = createEntityAdapter<ProductPreview>({
    selectId : (productPreview) => productPreview.id,
});



export const apiSlice = createApi({
    reducerPath : 'api',
    baseQuery : fetchBaseQuery({
        baseUrl: '/api'
    }),
    tagTypes: ['Products', 'Orders'],
    endpoints : (builder) => ({
        getProductList  : builder.query<EntityState<ProductPreview>, void>({
            query : () => 'product',
            transformResponse(response: ProductPreview[]) {
                return productListAdapter.addMany(productListAdapter.getInitialState(), response);
            },
        }),
        getProductPage  : builder.query<Pagination<ProductDetail>, { page?: number, perPage?: number }>({
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
                        id   : 'ORDER_LIST',
                    },
                ];
            },
        }),
        updateProduct   : builder.mutation<ProductDetail, Pick<ProductDetail, 'id'> & Partial<Omit<ProductDetail, 'id'>>>({
            query: (patch) => ({
                url    : 'product',
                method : 'PATCH',
                body   : patch
            }),
            
            // inefficient:
            // invalidatesTags: (result, error, page) => [
            //     ...((!result ? [] : [{
            //         type : 'Products',
            //         id   : result.id,
            //     }]) as Array<{ type: 'Products', id: string }>),
            // ],
            
            // more efficient:
            onCacheEntryAdded: async (arg, api) => {
                await handleCumulativeUpdateCacheEntry('getProductPage', (arg.id !== ''), api);
            },
        }),
        
        getOrderPage    : builder.query<Pagination<OrderDetail>, { page?: number, perPage?: number }>({
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
        updateOrder     : builder.mutation<OrderDetail, Pick<OrderDetail, 'id'> & Partial<Omit<OrderDetail, 'id'>>>({
            query: (patch) => ({
                url    : 'order',
                method : 'PATCH',
                body   : patch
            }),
            
            // inefficient:
            // invalidatesTags: (result, error, page) => [
            //     ...((!result ? [] : [{
            //         type : 'Orders',
            //         id   : result.id,
            //     }]) as Array<{ type: 'Orders', id: string }>),
            // ],
            
            // more efficient:
            onCacheEntryAdded: async (arg, api) => {
                await handleCumulativeUpdateCacheEntry('getOrderPage', (arg.id !== ''), api);
            },
        }),
        
        getShippingList : builder.query<EntityState<ShippingPreview>, void>({
            query : () => 'shipping',
            transformResponse(response: ShippingPreview[]) {
                return shippingListAdapter.addMany(shippingListAdapter.getInitialState(), response);
            },
        }),
    }),
});



const handleCumulativeUpdateCacheEntry = async <TEntry extends { id: string }, QueryArg, BaseQuery extends BaseQueryFn>(endpointName: Extract<keyof (typeof apiSlice)['endpoints'], 'getProductPage'|'getOrderPage'>, isUpdating: boolean, api: MutationCacheLifecycleApi<QueryArg, BaseQuery, TEntry, 'api'>) => {
    // updated TEntry data:
    const { data: entry } = await api.cacheDataLoaded;
    const { id } = entry;
    
    
    
    // find related TEntry data(s):
    const state      = api.getState();
    const allQueries = state.api.queries;
    const queries    = (
        Object.values(allQueries)
        .filter((query): query is Exclude<typeof query, undefined> =>
            !!query
            &&
            (query.endpointName === endpointName)
        )
    );
    if (!isUpdating) { // add new data:
        const missingQueries = (
            queries
            .filter((query) =>
                /*missing id: */ !(query.data as Pagination<TEntry>|undefined)?.entities.some((searchEntry) => (searchEntry.id === id))
            )
        );
        if (missingQueries.length) {
            const shiftedDataMap : TEntry[] = [entry];
            for (const query of queries) {
                const {
                    page    = 1,
                    perPage = 1,
                } = query.originalArgs as { page?: number, perPage?: number };
                
                const baseIndex  = (page - 1) * perPage;
                let   subIndex   = 0;
                const shiftCount = 1;
                for (const entry of (query.data as Pagination<TEntry>).entities) {
                    shiftedDataMap[baseIndex + (subIndex++) + shiftCount] = entry;
                } // for
            } // for
            
            
            
            let tailPaginationTotal : number = 0;
            for (const missingQuery of missingQueries) {
                const {
                    page    = 1,
                    perPage = 1,
                } = missingQuery.originalArgs as { page?: number, perPage?: number };
                const baseIndex  = (page - 1) * perPage;
                
                
                
                const insertedEntry : TEntry|undefined = shiftedDataMap?.[baseIndex];
                if (insertedEntry) {
                    api.dispatch(
                        apiSlice.util.updateQueryData(endpointName, missingQuery.originalArgs as any, (draft) => {
                            draft.entities.unshift((insertedEntry as any)); // append at first index
                            tailPaginationTotal = (draft.entities.length > perPage) ? (++draft.total) : 0;
                            if (tailPaginationTotal) draft.entities.pop(); // remove at last index
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
                const perPage = (missingQueries?.[0]?.originalArgs as ({ page?: number, perPage?: number }|undefined))?.perPage ?? 1;
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
        const obsoleteQueries = (
            queries
            .filter((query) =>
                /*found id: */ !!(query.data as Pagination<TEntry>|undefined)?.entities.some((searchEntry) => (searchEntry.id === id))
            )
        );
        if (obsoleteQueries.length) {
            for (const obsoleteQuery of obsoleteQueries) {
                api.dispatch(
                    apiSlice.util.updateQueryData(endpointName, obsoleteQuery.originalArgs as any, (draft) => {
                        const obsoleteEntryIndex = draft.entities.findIndex((searchEntry) => (searchEntry.id === id));
                        if (obsoleteEntryIndex < 0) return;
                        draft.entities[obsoleteEntryIndex] = (entry as any); // update existing data
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
} = apiSlice;
