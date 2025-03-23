import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { createOrder, fetchAllOrders, updateOrder } from './orderAPI';

const initialState = {
    state: 'idle',
    orders: [],
    currentOrder: null,
    totalOrders: 0
}

export const createOrderAsync = createAsyncThunk(
    'order/createOrder',
    async (orderData) => {
        const response = await createOrder(orderData);
        // console.log("createAsyncThunk", response)
        return response.data;
    })

export const fetchAllOrdersAsync = createAsyncThunk(
    'order/fetchAllOrders',
    async ({ sort, pagination }) => {
        // console.log("fetchProductsByFiltersAsync", filter)
        const response = await fetchAllOrders(sort, pagination);
        // console.log(response)
        // The value we return becomes the `fulfilled` action payload
        return response.data;
    }
);

export const updateOrderAsync = createAsyncThunk(
    'order/updateOrder',
    async (order) => {
        const response = await updateOrder(order);
        // The value we return becomes the `fulfilled` action payload
        return response.data;
    }
);


export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        resetCurrentOrder: (state) => {
            state.currentOrder = null;
        },
        resetOrders: (state) => {
            // state.Orders = null;
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
            .addCase(fetchAllOrdersAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAllOrdersAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.orders = action.payload.orders;
                state.totalOrders = action.payload.totalOrders;
            })
            .addCase(updateOrderAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateOrderAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                const index = state.orders.data.findIndex((order) => order.id === action.payload.id);
                state.orders.data[index] = action.payload;
            })

    }
})

export const { resetCurrentOrder } = orderSlice.actions;
export const selectOrders = (state) => state.order.orders;
export const selectTotalOrders = (state) => state.order.totalOrders;
export const selectCurrentOrder = (state) => state.order.currentOrder;
// export const DuplicateItemError = (state) => state.cart.error;
// export const selectError = (state) => state.auth.error;
// export const { increment, decrement, incrementByAmount } = counterSlice.actions

export default orderSlice.reducer