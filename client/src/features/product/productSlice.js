import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchAllProducts, fetchProductsByFilters } from './productAPI'

const initialState = {
    products: [],
    status: 'idle',
    totalItems: 0,
}

export const fetchAllProductsAsync = createAsyncThunk('product/fetchAllProducts', async () => {

    const response = await fetchAllProducts();
    // The value we return becomes the `fulfilled` action payload
    return response.data;

})

export const fetchProductsByFiltersAsync = createAsyncThunk(
    'product/fetchProductsByFilters',
    async ({ filter, sort, pagination }) => {
        // console.log("fetchProductsByFiltersAsync", filter)
        const response = await fetchProductsByFilters(filter, sort, pagination);
        // console.log(response)
        // The value we return becomes the `fulfilled` action payload
        return response.data;
    }
);


export const productSlice = createSlice({
    name: 'product',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllProductsAsync.pending, (state) => {
                state.loading = 'loading';
            })
            .addCase(fetchAllProductsAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.products = action.payload
            })
            .addCase(fetchProductsByFiltersAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProductsByFiltersAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.products = action.payload.products.data;
                state.totalItems = action.payload.totalItems;
            });
    }
})

export const selectAllProducts = (state) => state.product.products;
export const selectTotalItems = (state) => state.product.totalItems;

export default productSlice.reducer