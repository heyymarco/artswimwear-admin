import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Pagination } from '@/libs/types'
import type { ProductDetail } from '@/pages/api/product'
export type { ProductDetail } from '@/pages/api/product'



export const apiSlice = createApi({
    reducerPath : 'api',
    baseQuery : fetchBaseQuery({
        baseUrl: '/api'
    }),
    tagTypes: ['Products'],
    endpoints : (builder) => ({
        getProductList   : builder.query<Pagination<ProductDetail>, { page?: number, perPage?: number }>({
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
        updateProduct : builder.mutation<ProductDetail, Pick<ProductDetail, '_id'> & Partial<Omit<ProductDetail, '_id'>>>({
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
    }),
});



export const {
    useGetProductListQuery   : useGetProductList,
    useUpdateProductMutation : useUpdateProduct,
} = apiSlice;
