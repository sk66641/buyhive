import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchLoggedInUserOrders, updateUser, fetchLoggedInUser } from './userAPI';

const initialState = {
    state: 'idle',
    userOrders: [],
    userInfo: null,
    error: null,
}
export const fetchLoggedInUserOrdersAsync = createAsyncThunk(
    'user/fetchLoggedInUserOrders',
    async (userId) => {
        const response = await fetchLoggedInUserOrders(userId);
        return response.data;
    })

export const fetchLoggedInUserAsync = createAsyncThunk(
    'user/fetchLoggedInUser',
    async (id) => {
        const response = await fetchLoggedInUser(id);
        // The value we return becomes the `fulfilled` action payload
        return response.data;
    }
);

export const updateUserAsync = createAsyncThunk(
    'user/updateUser',
    async (update) => {
        const response = await updateUser(update);
        // console.log("createAsyncThunk", response)
        return response.data;
    })

export const userSlice = createSlice({
    name: 'user',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchLoggedInUserOrdersAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchLoggedInUserOrdersAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.userOrders = action.payload;
            })
            .addCase(updateUserAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateUserAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.userInfo = action.payload;
            })
            .addCase(fetchLoggedInUserAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchLoggedInUserAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                // this info can be differenct or more from logged in user info
                state.userInfo = action.payload;
            })
    }
})

export const selectUserOrders = (state) => state.user.userOrders;
export const selectUserInfo = (state) => state.user.userInfo;
// export const { increment, decrement, incrementByAmount } = counterSlice.actions

export default userSlice.reducer