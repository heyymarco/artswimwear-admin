import { createEntityAdapter, EntityState } from '@reduxjs/toolkit'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Pagination } from '@/libs/types'
import type { ProductPreview, ProductDetail } from '@/pages/api/product'
export type { ProductPreview, ProductDetail } from '@/pages/api/product'
import type { OrderDetail } from '@/pages/api/order'
export type { OrderDetail } from '@/pages/api/order'
import type { ShippingPreview } from '@/pages/api/shipping'
export type { ShippingPreview } from '@/pages/api/shipping'



const shippingListAdapter = createEntityAdapter<ShippingPreview>({
    selectId : (shippingPreview) => shippingPreview._id,
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
                // updated product data:
                const { data: updatedProduct } = await api.cacheDataLoaded;
                
                // find obsolete product data(s):
                const state = api.getState();
                const queries = state.api.queries;
                const getProductPageName  = apiSlice.endpoints.getProductPage.name;
                const getProductPageQueries = (
                    Object.values(queries)
                    .filter((query): query is Exclude<typeof query, undefined> =>
                        !!query
                        &&
                        (query.endpointName === getProductPageName)
                    )
                );
                const obsoleteQueries = (
                    getProductPageQueries
                    .filter((query) =>
                        /*found id: */ !!(query.data as Pagination<ProductDetail>|undefined)?.entities.some((searchProduct) => (searchProduct.id === updatedProduct.id))
                    )
                );
                const missingQueries = (
                    getProductPageQueries
                    .filter((query) =>
                        /*missing id: */ !(query.data as Pagination<ProductDetail>|undefined)?.entities.some((searchProduct) => (searchProduct.id === updatedProduct.id))
                    )
                );
                
                // synch the obsolete product data(s) to the updated one:
                if (obsoleteQueries.length) {
                    for (const obsoleteQuery of obsoleteQueries) {
                        api.dispatch(
                            apiSlice.util.updateQueryData('getProductPage', obsoleteQuery.originalArgs as any, (draft) => {
                                const obsoleteProductIndex = draft.entities.findIndex((searchProduct) => (searchProduct.id === updatedProduct.id));
                                if (obsoleteProductIndex < 0) return;
                                draft.entities[obsoleteProductIndex] = updatedProduct; // sync
                            })
                        );
                    } // for
                } // if
                if (missingQueries.length) {
                    const shiftedDataMap : ProductDetail[] = [updatedProduct];
                    for (const getProductPageQuery of getProductPageQueries) {
                        const {
                            page    = 1,
                            perPage = 1,
                        } = getProductPageQuery.originalArgs as { page?: number, perPage?: number };
                        
                        const baseIndex  = (page - 1) * perPage;
                        let   subIndex   = 0;
                        const shiftCount = 1;
                        for (const productDetail of (getProductPageQuery.data as Pagination<ProductDetail>).entities) {
                            shiftedDataMap[baseIndex + (subIndex++) + shiftCount] = productDetail;
                        } // for
                    } // for
                    
                    let tailPaginationTotal : number = 0;
                    for (const missingQuery of missingQueries) {
                        api.dispatch(
                            apiSlice.util.updateQueryData('getProductPage', missingQuery.originalArgs as any, (draft) => {
                                const {
                                    page    = 1,
                                    perPage = 1,
                                } = missingQuery.originalArgs as { page?: number, perPage?: number };
                                
                                const baseIndex  = (page - 1) * perPage;
                                const insertedProduct : ProductDetail|undefined = shiftedDataMap?.[baseIndex];
                                if (insertedProduct) {
                                    draft.entities.unshift(insertedProduct); // append at first index
                                    tailPaginationTotal = (draft.entities.length > perPage) ? (++draft.total) : 0;
                                    if (tailPaginationTotal) draft.entities.pop(); // remove at last index
                                }
                                else {
                                    tailPaginationTotal = 0;
                                } // if
                            })
                        );
                    } // for
                    if (tailPaginationTotal && shiftedDataMap.length) {
                        const lastPagination : Pagination<ProductDetail> = {
                            total    : tailPaginationTotal,
                            entities : [
                                shiftedDataMap[shiftedDataMap.length - 1] // take the last
                            ],
                        };
                        const perPage = (missingQueries?.[0]?.originalArgs as ({ page?: number, perPage?: number }|undefined))?.perPage ?? 1;
                        api.dispatch(
                            apiSlice.util.upsertQueryData('getProductPage', {
                                page    : Math.ceil(tailPaginationTotal / perPage),
                                perPage : perPage
                            }, lastPagination)
                        );
                    } // if
                } // if
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
                        id   : order._id,
                    })),
                    
                    {
                        type : 'Orders',
                        id   : 'ORDER_LIST',
                    },
                ];
            },
        }),
        updateOrder     : builder.mutation<OrderDetail, Pick<OrderDetail, '_id'> & Partial<Omit<OrderDetail, '_id'>>>({
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
                const getOrderPageName = apiSlice.endpoints.getOrderPage.name;
                const obsoleteQueryArgs = (
                    Object.values(queries)
                    .filter((query): query is Exclude<typeof query, undefined> =>
                        !!query
                        &&
                        (query.endpointName === getOrderPageName)
                        &&
                        !!(query.data as Pagination<OrderDetail>|undefined)?.entities.some((searchOrder) => (searchOrder._id === updatedOrder._id))
                    )
                    .map((query) => query.originalArgs)
                );
                
                // synch the obsolete order data(s) to the updated one:
                for (const obsoleteQueryArg of obsoleteQueryArgs) {
                    api.dispatch(
                        apiSlice.util.updateQueryData('getOrderPage', obsoleteQueryArg as any, (draft) => {
                            const obsoleteOrderIndex = draft.entities.findIndex((searchOrder) => (searchOrder._id === updatedOrder._id));
                            if (obsoleteOrderIndex < 0) return;
                            draft.entities[obsoleteOrderIndex] = updatedOrder; // sync
                        })
                    );
                } // for
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



export const {
    useGetProductListQuery   : useGetProductList,
    useGetProductPageQuery   : useGetProductPage,
    useUpdateProductMutation : useUpdateProduct,
    
    useGetOrderPageQuery     : useGetOrderPage,
    useUpdateOrderMutation   : useUpdateOrder,
    
    useGetShippingListQuery  : useGetShippingList,
} = apiSlice;
