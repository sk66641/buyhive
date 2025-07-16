import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { addToCart, deleteItemFromCart, fetchItemsByUserId, updateCart, resetCart } from './CartAPI';

const initialState = {
    state: 'idle',
    items: [],
    error: null,
}

export const addToCartAsync = createAsyncThunk(
    'cart/addToCart',
    async ({ item, userId }) => {
        const response = await addToCart(item, userId);
        // console.log("createAsyncThunk", response)
        return response.data;
    })

export const fetchItemsByUserIdAsync = createAsyncThunk(
    'cart/fetchItemsByUserId',
    async () => {
        const response = await fetchItemsByUserId();
        // console.log("createAsyncThunk", response)
        return response.data;
    })

export const updateCartAsync = createAsyncThunk(
    'cart/updateCart',
    async (update) => {
        const response = await updateCart(update);
        // console.log("createAsyncThunk", response)
        return response.data;
    })

export const deleteItemFromCartAsync = createAsyncThunk(
    'cart/deleteItemFromCart',
    async (itemId) => {
        const response = await deleteItemFromCart(itemId);
        // console.log("createAsyncThunk", response)
        return response.data;
    })

export const resetCartAsync = createAsyncThunk(
    'cart/resetCart',
    async (userId) => {
        const response = await resetCart(userId);
        return response.data;
    })

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(addToCartAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addToCartAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.items.push(action.payload);
            })
            .addCase(addToCartAsync.rejected, (state, action) => {
                state.status = 'error';
                // console.log(action.error)
                state.error = action.error;
            })
            .addCase(fetchItemsByUserIdAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchItemsByUserIdAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.items = action.payload;
            })
            .addCase(updateCartAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateCartAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                const index = state.items.findIndex((item) => item.id === action.payload.id)
                state.items[index] = action.payload;
            })
            .addCase(deleteItemFromCartAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteItemFromCartAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                const index = state.items.findIndex((item) => item.id === action.payload.id)
                state.items.splice(index, 1);
            })
            .addCase(resetCartAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(resetCartAsync.fulfilled, (state) => {
                state.status = 'idle';
                state.items = [];
            })
    }
})

export const selectItems = (state) => state.cart.items;
// export const DuplicateItemError = (state) => state.cart.error;
// export const selectError = (state) => state.auth.error;
// export const { increment, decrement, incrementByAmount } = counterSlice.actions

export default cartSlice.reducer