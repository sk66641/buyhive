import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { addToCart, deleteItemFromCart, fetchItemsByUserId, updateCart, resetCart } from './CartAPI';

const initialState = {
    status: {
        isAddingToCart: false,
        isFetchingItems: false, // TODO: not used yet
        isUpdatingCart: false,
        isDeletingItem: false,
        isResettingCart: false, // TODO: not used yet
    },
    items: [],
    errors: {
        ErrorAddingToCart: null,
        ErrorFetchingItems: null, // TODO: not used yet
        ErrorUpdatingCart: null,
        ErrorDeletingItem: null,
        ErrorResettingCart: null, // TODO: not used yet
    },
}

export const addToCartAsync = createAsyncThunk(
    'cart/addToCart',
    async ({ item, userId }) => {
        const response = await addToCart(item, userId);
        return response.data;
    })

export const fetchItemsByUserIdAsync = createAsyncThunk(
    'cart/fetchItemsByUserId',
    async () => {
        const response = await fetchItemsByUserId();
        return response.data;
    })

export const updateCartAsync = createAsyncThunk(
    'cart/updateCart',
    async (update) => {
        const response = await updateCart(update);
        return response.data;
    })

export const deleteItemFromCartAsync = createAsyncThunk(
    'cart/deleteItemFromCart',
    async (itemId) => {
        const response = await deleteItemFromCart(itemId);
        return response.data;
    })

export const resetCartAsync = createAsyncThunk(
    'cart/resetCart',
    async () => {
        const response = await resetCart();
        return response.data;
    })

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        resetCartErrors: (state) => {
            state.errors = initialState.errors;
        }
    },
    extraReducers: (builder) => {
        builder
            // addToCartAsync
            .addCase(addToCartAsync.pending, (state) => {
                state.status.isAddingToCart = true;
                state.errors.ErrorAddingToCart = null;
            })
            .addCase(addToCartAsync.fulfilled, (state, action) => {
                state.status.isAddingToCart = false;
                state.items.push(action.payload);
            })
            .addCase(addToCartAsync.rejected, (state, action) => {
                state.status.isAddingToCart = false;
                state.errors.ErrorAddingToCart = action.error.message;
            })

            // fetchItemsByUserIdAsync
            .addCase(fetchItemsByUserIdAsync.pending, (state) => {
                state.status.isFetchingItems = true;
                state.errors.ErrorFetchingItems = null;
            })
            .addCase(fetchItemsByUserIdAsync.fulfilled, (state, action) => {
                state.status.isFetchingItems = false;
                state.items = action.payload;
            })
            .addCase(fetchItemsByUserIdAsync.rejected, (state, action) => {
                state.status.isFetchingItems = false;
                state.errors.ErrorFetchingItems = action.error.message;
            })

            // updateCartAsync
            .addCase(updateCartAsync.pending, (state) => {
                state.status.isUpdatingCart = true;
                state.errors.ErrorUpdatingCart = null;
            })
            .addCase(updateCartAsync.fulfilled, (state, action) => {
                state.status.isUpdatingCart = false;
                const index = state.items.findIndex((item) => item.id === action.payload.id)
                state.items[index] = action.payload;
            })
            .addCase(updateCartAsync.rejected, (state, action) => {
                state.status.isUpdatingCart = false;
                state.errors.ErrorUpdatingCart = action.error.message;
            })

            // deleteItemFromCartAsync
            .addCase(deleteItemFromCartAsync.pending, (state) => {
                state.status.isDeletingItem = true;
                state.errors.ErrorDeletingItem = null;
            })
            .addCase(deleteItemFromCartAsync.fulfilled, (state, action) => {
                state.status.isDeletingItem = false;
                const index = state.items.findIndex((item) => item.id === action.payload.id)
                state.items.splice(index, 1);
            })
            .addCase(deleteItemFromCartAsync.rejected, (state, action) => {
                state.status.isDeletingItem = false;
                state.errors.ErrorDeletingItem = action.error.message;
            })

            // resetCartAsync
            .addCase(resetCartAsync.pending, (state) => {
                state.status.isResettingCart = true;
                state.errors.ErrorResettingCart = null;
            })
            .addCase(resetCartAsync.fulfilled, (state) => {
                state.status.isResettingCart = false;
                state.items = [];
            })
            .addCase(resetCartAsync.rejected, (state, action) => {
                state.status.isResettingCart = false;
                state.errors.ErrorResettingCart = action.error.message;
            })
    }
})

export const selectItems = (state) => state.cart.items;

export const selectIsAddingToCart = (state) => state.cart.status.isAddingToCart;
export const selectIsFetchingItems = (state) => state.cart.status.isFetchingItems;
export const selectIsUpdatingCart = (state) => state.cart.status.isUpdatingCart;
export const selectIsDeletingItem = (state) => state.cart.status.isDeletingItem;
export const selectIsResettingCart = (state) => state.cart.status.isResettingCart;

export const selectErrorAddingToCart = (state) => state.cart.errors.ErrorAddingToCart;
export const selectErrorFetchingItems = (state) => state.cart.errors.ErrorFetchingItems;
export const selectErrorUpdatingCart = (state) => state.cart.errors.ErrorUpdatingCart;
export const selectErrorDeletingItem = (state) => state.cart.errors.ErrorDeletingItem;
export const selectErrorResettingCart = (state) => state.cart.errors.ErrorResettingCart

export const { resetCartErrors } = cartSlice.actions;

export default cartSlice.reducer