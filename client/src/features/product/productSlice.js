import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { createProduct, fetchProductsByFilters, fetchProductsById, updateProduct } from './productAPI'

const initialState = {
    products: [],
    status: {
        isFetchingProducts: false,
        isFetchingProductById: false,
        isCreatingProduct: false,
        isUpdatingProduct: false,
    },
    totalItems: 0,
    selectedProduct: null,
    errors: {
        ErrorFetchingProducts: null,
        ErrorFetchingProductById: null,
        ErrorCreatingProduct: null,
        ErrorUpdatingProduct: null,
    }
}

export const fetchProductsByFiltersAsync = createAsyncThunk(
    'product/fetchProductsByFilters',
    async ({ filter, sort, pagination }, { rejectWithValue }) => {
        try {
            const data = await fetchProductsByFilters(filter, sort, pagination);
            return data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchProductsByIdAsync = createAsyncThunk(
    'product/fetchProductsById',
    async (id, { rejectWithValue }) => {
        try {
            const data = await fetchProductsById(id);
            return data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const createProductAsync = createAsyncThunk(
    'product/createProduct',
    async (product, { rejectWithValue }) => {
        try {
            const data = await createProduct(product);
            return data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const updateProductAsync = createAsyncThunk(
    'product/updateProduct',
    async (product, { rejectWithValue }) => {
        try {
            const data = await updateProduct(product);
            return data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        resetProductErrors: (state) => {
            state.errors = initialState.errors;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchProductsByFiltersAsync
            .addCase(fetchProductsByFiltersAsync.pending, (state) => {
                state.status.isFetchingProducts = true;
                state.errors.ErrorFetchingProducts = null;
            })
            .addCase(fetchProductsByFiltersAsync.fulfilled, (state, action) => {
                state.products = action.payload.products.data;
                state.totalItems = action.payload.totalItems;
                state.status.isFetchingProducts = false;
            })
            .addCase(fetchProductsByFiltersAsync.rejected, (state, action) => {
                state.status.isFetchingProducts = false;
                state.errors.ErrorFetchingProducts = action.payload.message;
            })

            // fetchProductsByIdAsync
            .addCase(fetchProductsByIdAsync.pending, (state) => {
                state.status.isFetchingProductById = true;
                state.errors.ErrorFetchingProductById = null;
            })
            .addCase(fetchProductsByIdAsync.fulfilled, (state, action) => {
                state.selectedProduct = action.payload;
                state.status.isFetchingProductById = false;
            })
            .addCase(fetchProductsByIdAsync.rejected, (state, action) => {
                state.status.isFetchingProductById = false;
                state.errors.ErrorFetchingProductById = action.payload.message;
            })

            // createProductAsync
            .addCase(createProductAsync.pending, (state) => {
                state.status.isCreatingProduct = true;
                state.errors.ErrorCreatingProduct = null;
            })
            .addCase(createProductAsync.fulfilled, (state, action) => {
                state.products.push(action.payload);
                state.status.isCreatingProduct = false;
            })
            .addCase(createProductAsync.rejected, (state, action) => {
                state.status.isCreatingProduct = false;
                state.errors.ErrorCreatingProduct = action.payload.message;
            })

            // updateProductAsync
            .addCase(updateProductAsync.pending, (state) => {
                state.status.isUpdatingProduct = true;
                state.errors.ErrorUpdatingProduct = null;
            })
            .addCase(updateProductAsync.fulfilled, (state, action) => {
                const index = state.products.findIndex((product) => product.id === action.payload.id)
                state.products[index] = action.payload;
                state.status.isUpdatingProduct = false;
                state.selectedProduct = null;
            })
            .addCase(updateProductAsync.rejected, (state, action) => {
                state.status.isUpdatingProduct = false;
                state.errors.ErrorUpdatingProduct = action.payload.message;
            })
    }
})

export const selectAllProducts = (state) => state.product.products;
export const selectTotalItems = (state) => state.product.totalItems;
export const selectedProductById = (state) => state.product.selectedProduct

export const selectIsFetchingProducts = (state) => state.product.status.isFetchingProducts;
export const selectIsFetchingProductById = (state) => state.product.status.isFetchingProductById;
export const selectIsCreatingProduct = (state) => state.product.status.isCreatingProduct
export const selectIsUpdatingProduct = (state) => state.product.status.isUpdatingProduct;

export const selectErrorFetchingProducts = (state) => state.product.errors.ErrorFetchingProducts;
export const selectErrorFetchingProductById = (state) => state.product.errors.ErrorFetchingProductById;
export const selectErrorCreatingProduct = (state) => state.product.errors.ErrorCreatingProduct
export const selectErrorUpdatingProduct = (state) => state.product.errors.ErrorUpdatingProduct;

export const { resetProductErrors } = productSlice.actions;

export default productSlice.reducer