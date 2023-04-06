import type { RootState } from '@/store/store'
import { createEntityAdapter, EntityState } from '@reduxjs/toolkit'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'



export interface ProductEntry {
    _id        : string
    visibility : string
    name       : string
    price      : number
    stock      : string
    image      : string
}
export interface PagedProductEntries {
    total    : number
    entities : ProductEntry[]
}
const productListAdapter = createEntityAdapter<ProductEntry>({
    selectId : (productEntry) => productEntry._id,
});


export const apiSlice = createApi({
    reducerPath : 'api',
    baseQuery : fetchBaseQuery({
        baseUrl: '/api'
    }),
    tagTypes: ['Products'],
    endpoints : (builder) => ({
        getProductList   : builder.query<PagedProductEntries, { page?: number, perPage?: number }>({
            query : ({ page = 1, perPage = 20 }) => `product?page=${page}&perPage=${perPage}`,
            providesTags: (result, error, page)  => {
                return [
                    ...(result?.entities ?? []).map((product): { type: 'Products', id: string } => ({
                        type : 'Products',
                        id   : product._id,
                    })),
                    
                    {
                        type : 'Products',
                        id   : 'PARTIAL_LIST',
                    },
                ];
            },
        }),
        updateProduct : builder.mutation<ProductEntry, Pick<ProductEntry, '_id'> & Partial<Omit<ProductEntry, '_id'>>>({
            query: (patch) => ({
                url    : 'product',
                method : 'PATCH',
                body   : patch
            }),
            invalidatesTags: (result, error, page) => [
                ...((!result ? [] : [{
                    type : 'Products',
                    id   : result._id,
                }]) as Array<{ type: 'Products', id: string }>),
            ],
        }),
    }),
});



export const {
    useGetProductListQuery   : useGetProductList,
    useUpdateProductMutation : useUpdateProduct,
} = apiSlice;
