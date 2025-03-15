import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { createOrder } from './orderAPI';

const initialState = {
    state: 'idle',
    orders: [],
    currentOrder: null
}

export const createOrderAsync = createAsyncThunk(
    'cart/createOrder',
    async (orderData) => {
        const response = await createOrder(orderData);
        // console.log("createAsyncThunk", response)
        return response.data;
    })



export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        resetCurrentOrder: (state) => {
            state.currentOrder = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createOrderAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createOrderAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.orders.push(action.payload);
                state.currentOrder = action.payload;
            })

    }
})

export const { resetCurrentOrder } = orderSlice.actions;
export const selectOrders = (state) => state.order.orders;
export const selectCurrentOrder = (state) => state.order.currentOrder;
// export const DuplicateItemError = (state) => state.cart.error;
// export const selectError = (state) => state.auth.error;
// export const { increment, decrement, incrementByAmount } = counterSlice.actions

export default orderSlice.reducer