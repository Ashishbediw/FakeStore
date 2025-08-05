
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const StoreApi = createApi({
    reducerPath: 'storeApi',    // unique name for the api slice
    baseQuery: fetchBaseQuery({ baseUrl: 'https://fakestoreapi.in/api' }),
    endpoints: (builder) => ({
        getProducts: builder.query({
            //for fetching all the products
            query: () => 'products',
        }),
        getProductById: builder.query({
            query: (id: number | string) => `products/${id}`,
        }),

        getCategories: builder.query({
            query: () => 'products/categories',
        }),

        getProductsByCategory: builder.query({
            query: (category: string) => `products/category/${category}`
        })
    })
})

export const {
    useGetProductsQuery,
    useGetProductByIdQuery,
    useGetCategoriesQuery,
    useGetProductsByCategoryQuery,

} = StoreApi