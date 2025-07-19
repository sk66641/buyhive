import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { createOrder, fetchAllOrders, updateOrder } from './orderAPI';

const initialState = {
    status: {
        isCreatingOrder: false,
        isFetchingAllOrders: false, // (admin)
        isUpdatingOrder: false, // TODO: not used yet (admin)
    },
    orders: [],
    currentOrder: null,
    totalOrders: 0,
    OrderSuccess: false,
    errors: {
        ErrorCreatingOrder: null,
        ErrorFetchingAllOrders: null, // (admin)
        ErrorUpdatingOrder: null, // (admin)
    }
}

export const createOrderAsync = createAsyncThunk(
    'order/createOrder',
    async (orderData, { rejectWithValue }) => {
        try {
            const data = await createOrder(orderData);
            return data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchAllOrdersAsync = createAsyncThunk(
    'order/fetchAllOrders',
    async ({ sort, pagination }, { rejectWithValue }) => {
        try {
            const data = await fetchAllOrders(sort, pagination);
            return data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const updateOrderAsync = createAsyncThunk(
    'order/updateOrder',
    async (order, { rejectWithValue }) => {
        try {
            const data = await updateOrder(order);
            return data;
        } catch (error) {
            return rejectWithValue(error);
        }
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
        },
        setOrderSuccess: (state, action) => {
            state.OrderSuccess = action.payload;
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
                state.totalOrders += 1;
            })
            .addCase(createOrderAsync.rejected, (state, action) => {
                state.status.isCreatingOrder = false;
                state.errors.ErrorCreatingOrder = action.payload.message;
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
                state.errors.ErrorFetchingAllOrders = action.payload.message;
            })

            // updateOrderAsync
            .addCase(updateOrderAsync.pending, (state) => {
                state.status.isUpdatingOrder = true;
                state.errors.ErrorUpdatingOrder = null;
            })
            .addCase(updateOrderAsync.fulfilled, (state, action) => {
                state.status.isUpdatingOrder = false;
                const index = state.orders.findIndex((order) => order.id === action.payload.id);
                state.orders[index] = action.payload;
            })
            .addCase(updateOrderAsync.rejected, (state, action) => {
                state.status.isUpdatingOrder = false;
                state.errors.ErrorUpdatingOrder = action.payload.message;
            })

    }
})

export const selectOrders = (state) => state.order.orders;
export const selectTotalOrders = (state) => state.order.totalOrders;
export const selectCurrentOrder = (state) => state.order.currentOrder;
export const selectOrderSuccess = (state) => state.order.OrderSuccess;

export const selectIsCreatingOrder = (state) => state.order.status.isCreatingOrder;
export const selectIsFetchingAllOrders = (state) => state.order.status.isFetchingAllOrders;
export const selectIsUpdatingOrder = (state) => state.order.status.isUpdatingOrder;

export const selectErrorCreatingOrder = (state) => state.order.errors.ErrorCreatingOrder;
export const selectErrorFetchingAllOrders = (state) => state.order.errors.ErrorFetchingAllOrders;
export const selectErrorUpdatingOrder = (state) => state.order.errors.ErrorUpdatingOrder;

export const { resetCurrentOrder, resetOrderErrors, setOrderSuccess } = orderSlice.actions;

export default orderSlice.reducer