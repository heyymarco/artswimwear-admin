import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Pagination } from '@/libs/types'
import type { ProductDetail } from '@/pages/api/product'
export type { ProductDetail } from '@/pages/api/product'
import type { OrderDetail } from '@/pages/api/order'
export type { OrderDetail } from '@/pages/api/order'



export const apiSlice = createApi({
    reducerPath : 'api',
    baseQuery : fetchBaseQuery({
        baseUrl: '/api'
    }),
    tagTypes: ['Products', 'Orders'],
    endpoints : (builder) => ({
        getProductList : builder.query<Pagination<ProductDetail>, { page?: number, perPage?: number }>({
            query : ({ page = 1, perPage = 20 }) => `product?page=${page}&perPage=${perPage}`,
            providesTags: (result, error, page)  => {
                return [
                    ...(result?.entities ?? []).map((product): { type: 'Products', id: string } => ({
                        type : 'Products',
                        id   : product._id,
                    })),
                    
                    {
                        type : 'Products',
                        id   : 'ORDER_LIST',
                    },
                ];
            },
        }),
        updateProduct  : builder.mutation<ProductDetail, Pick<ProductDetail, '_id'> & Partial<Omit<ProductDetail, '_id'>>>({
            query: (patch) => ({
                url    : 'product',
                method : 'PATCH',
                body   : patch
            }),
            
            // inefficient:
            // invalidatesTags: (result, error, page) => [
            //     ...((!result ? [] : [{
            //         type : 'Products',
            //         id   : result._id,
            //     }]) as Array<{ type: 'Products', id: string }>),
            // ],
            
            // more efficient:
            onCacheEntryAdded: async (arg, api) => {
                // updated product data:
                const { data: updatedProduct } = await api.cacheDataLoaded;
                
                // find obsolete product data(s):
                const state = api.getState();
                const queries = state.api.queries;
                const getProductListName = apiSlice.endpoints.getProductList.name;
                const obsoleteQueryArgs = (
                    Object.values(queries)
                    .filter((query): query is Exclude<typeof query, undefined> =>
                        !!query
                        &&
                        (query.endpointName === getProductListName)
                        &&
                        !!(query.data as Pagination<ProductDetail>|undefined)?.entities.some((searchProduct) => (searchProduct._id === updatedProduct._id))
                    )
                    .map((query) => query.originalArgs)
                );
                
                // synch the obsolete product data(s) to the updated one:
                for (const obsoleteQueryArg of obsoleteQueryArgs) {
                    api.dispatch(
                        apiSlice.util.updateQueryData('getProductList', obsoleteQueryArg as any, (draft) => {
                            const obsoleteProductIndex = draft.entities.findIndex((searchProduct) => (searchProduct._id === updatedProduct._id));
                            if (obsoleteProductIndex < 0) return;
                            draft.entities[obsoleteProductIndex] = updatedProduct; // sync
                        })
                    );
                } // for
            },
        }),
        
        getOrderList   : builder.query<Pagination<OrderDetail>, { page?: number, perPage?: number }>({
            query : ({ page = 1, perPage = 20 }) => `order?page=${page}&perPage=${perPage}`,
            providesTags: (result, error, page)  => {
                return [
                    ...(result?.entities ?? []).map((order): { type: 'Orders', id: string } => ({
                        type : 'Orders',
                        id   : order._id,
                    })),
                    
                    {
                        type : 'Orders',
                        id   : 'ORDER_LIST',
                    },
                ];
            },
        }),
        updateOrder    : builder.mutation<OrderDetail, Pick<OrderDetail, '_id'> & Partial<Omit<OrderDetail, '_id'>>>({
            query: (patch) => ({
                url    : 'order',
                method : 'PATCH',
                body   : patch
            }),
            
            // inefficient:
            // invalidatesTags: (result, error, page) => [
            //     ...((!result ? [] : [{
            //         type : 'Orders',
            //         id   : result._id,
            //     }]) as Array<{ type: 'Orders', id: string }>),
            // ],
            
            // more efficient:
            onCacheEntryAdded: async (arg, api) => {
                // updated order data:
                const { data: updatedOrder } = await api.cacheDataLoaded;
                
                // find obsolete order data(s):
                const state = api.getState();
                const queries = state.api.queries;
                const getOrderListName = apiSlice.endpoints.getOrderList.name;
                const obsoleteQueryArgs = (
                    Object.values(queries)
                    .filter((query): query is Exclude<typeof query, undefined> =>
                        !!query
                        &&
                        (query.endpointName === getOrderListName)
                        &&
                        !!(query.data as Pagination<OrderDetail>|undefined)?.entities.some((searchOrder) => (searchOrder._id === updatedOrder._id))
                    )
                    .map((query) => query.originalArgs)
                );
                
                // synch the obsolete order data(s) to the updated one:
                for (const obsoleteQueryArg of obsoleteQueryArgs) {
                    api.dispatch(
                        apiSlice.util.updateQueryData('getOrderList', obsoleteQueryArg as any, (draft) => {
                            const obsoleteOrderIndex = draft.entities.findIndex((searchOrder) => (searchOrder._id === updatedOrder._id));
                            if (obsoleteOrderIndex < 0) return;
                            draft.entities[obsoleteOrderIndex] = updatedOrder; // sync
                        })
                    );
                } // for
            },
        }),
    }),
});



export const {
    useGetProductListQuery   : useGetProductList,
    useUpdateProductMutation : useUpdateProduct,
    
    useGetOrderListQuery     : useGetOrderList,
    useUpdateOrderMutation   : useUpdateOrder,
} = apiSlice;
