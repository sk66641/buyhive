import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchLoggedInUserOrders, updateUser } from './userAPI';

const initialState = {
    state: 'idle',
    userOrders: [],
    userInfo: null,
    error: null,
}
export const fetchLoggedInUserOrdersAsync = createAsyncThunk(
    'cart/fetchLoggedInUserOrders',
    async (userId) => {
        const response = await fetchLoggedInUserOrders(userId);
        return response.data;
    })

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
                // this info can be differenct or more from logged in user info
                state.userOrders = action.payload;
            })
            .addCase(updateUserAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateUserAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.userInfo = action.payload;
            })
    }
})

export const selectUserOrders = (state) => state.user.userOrders;
// export const { increment, decrement, incrementByAmount } = counterSlice.actions

export default userSlice.reducer