import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { createOrder, fetchAllOrders, updateOrder } from './orderAPI';

const initialState = {
    status: {
        isCreatingOrder: false,
        isFetchingAllOrders: false,
        isUpdatingOrder: false, // TODO: not used yet (admin)
    },
    orders: [],
    currentOrder: null,
    totalOrders: 0,
    errors: {
        ErrorCreatingOrder: null,
        ErrorFetchingAllOrders: null,
        ErrorUpdatingOrder: null,
    }
}

export const createOrderAsync = createAsyncThunk(
    'order/createOrder',
    async (orderData) => {
        const response = await createOrder(orderData);
        return response.data;
    })

export const fetchAllOrdersAsync = createAsyncThunk(
    'order/fetchAllOrders',
    async ({ sort, pagination }) => {
        const response = await fetchAllOrders(sort, pagination);
        return response.data;
    }
);

export const updateOrderAsync = createAsyncThunk(
    'order/updateOrder',
    async (order) => {
        const response = await updateOrder(order);
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
        resetOrderErrors: (state) => {
            state.errors = initialState.errors;
        }
    },
    extraReducers: (builder) => {
        builder
            // createOrderAsync
            .addCase(createOrderAsync.pending, (state) => {
                state.status.isCreatingOrder = true;
                state.errors.ErrorCreatingOrder = null;
            })
            .addCase(createOrderAsync.fulfilled, (state, action) => {
                state.status.isCreatingOrder = false;
                state.orders.push(action.payload);
                state.currentOrder = action.payload;
            })
            .addCase(createOrderAsync.rejected, (state, action) => {
                state.status.isCreatingOrder = false;
                state.errors.ErrorCreatingOrder = action.error.message;
            })

            // fetchAllOrdersAsync
            .addCase(fetchAllOrdersAsync.pending, (state) => {
                state.status.isFetchingAllOrders = true;
                state.errors.ErrorFetchingAllOrders = null;
            })
            .addCase(fetchAllOrdersAsync.fulfilled, (state, action) => {
                state.status.isFetchingAllOrders = false;
                state.orders = action.payload.orders;
                state.totalOrders = action.payload.totalOrders;
            })
            .addCase(fetchAllOrdersAsync.rejected, (state, action) => {
                state.status.isFetchingAllOrders = false;
                state.errors.ErrorFetchingAllOrders = action.error.message;
            })

            // updateOrderAsync
            .addCase(updateOrderAsync.pending, (state) => {
                state.status.isUpdatingOrder = true;
                state.errors.ErrorUpdatingOrder = null;
            })
            .addCase(updateOrderAsync.fulfilled, (state, action) => {
                state.status.isUpdatingOrder = false;
                const index = state.orders.data.findIndex((order) => order.id === action.payload.id);
                state.orders.data[index] = action.payload;
            })
            .addCase(updateOrderAsync.rejected, (state, action) => {
                state.status.isUpdatingOrder = false;
                state.errors.ErrorUpdatingOrder = action.error.message;
            })

    }
})

export const selectOrders = (state) => state.order.orders;
export const selectTotalOrders = (state) => state.order.totalOrders;
export const selectCurrentOrder = (state) => state.order.currentOrder;

export const selectIsCreatingOrder = (state) => state.order.status.isCreatingOrder;
export const selectIsFetchingAllOrders = (state) => state.order.status.isFetchingAllOrders;
export const selectIsUpdatingOrder = (state) => state.order.status.isUpdatingOrder;

export const selectErrorCreatingOrder = (state) => state.order.errors.ErrorCreatingOrder;
export const selectErrorFetchingAllOrders = (state) => state.order.errors.ErrorFetchingAllOrders;
export const selectErrorUpdatingOrder = (state) => state.order.errors.ErrorUpdatingOrder;

export const { resetCurrentOrder, resetOrderErrors } = orderSlice.actions;

export default orderSlice.reducer