import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { updateUser, fetchLoggedInUser, fetchUserOrders } from './userAPI';

const initialState = {
    status: {
        isFetchingLoggedInUser: false,
        isUpdatingUser: false,
        isFetchingUserOrders: false,
    },
    userOrders: [],
    userInfo: null,
    errors: {
        ErrorFetchingLoggedInUser: null, // TODO: not used till now
        ErrorUpdatingUser: null, // TODO: not used till now
        ErrorFetchingUserOrders: null,
    },
}

export const fetchUserOrdersAsync = createAsyncThunk(
    'user/fetchUserOrders',
    async () => {
        const response = await fetchUserOrders();
        return response.data;
    })

export const fetchLoggedInUserAsync = createAsyncThunk(
    'user/fetchLoggedInUser',
    async () => {
        console.log("Fetching logged in user");
        const response = await fetchLoggedInUser();
        return response.data;
    }
);

export const updateUserAsync = createAsyncThunk(
    'user/updateUser',
    async (update) => {
        const response = await updateUser(update);
        return response.data;
    })

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserInfo: (state, action) => {
            state.userInfo = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetchUserOrdersAsync
            .addCase(fetchUserOrdersAsync.pending, (state) => {
                state.errors.ErrorFetchingUserOrders = null;
                state.status.isFetchingUserOrders = true;
            })
            .addCase(fetchUserOrdersAsync.fulfilled, (state, action) => {
                state.status.isFetchingUserOrders = false;
                state.userOrders = action.payload;
            })
            .addCase(fetchUserOrdersAsync.rejected, (state, action) => {
                state.status.isFetchingUserOrders = false;
                state.errors.ErrorFetchingUserOrders = action.error.message;
            })

            // updateUserAsync
            .addCase(updateUserAsync.pending, (state) => {
                state.errors.ErrorUpdatingUser = null;
                state.status.isUpdatingUser = true;
            })
            .addCase(updateUserAsync.fulfilled, (state, action) => {
                state.status.isUpdatingUser = false;
                state.userInfo = action.payload;
            })
            .addCase(updateUserAsync.rejected, (state, action) => {
                state.status.isUpdatingUser = false;
                state.errors.ErrorUpdatingUser = action.error.message;
            })

            // fetchLoggedInUserAsync
            .addCase(fetchLoggedInUserAsync.pending, (state) => {
                state.errors.ErrorFetchingLoggedInUser = null;
                state.status.isFetchingLoggedInUser = true;
            })
            .addCase(fetchLoggedInUserAsync.fulfilled, (state, action) => {
                state.status.isFetchingLoggedInUser = false;
                state.userInfo = action.payload;
            })
            .addCase(fetchLoggedInUserAsync.rejected, (state, action) => {
                state.status.isFetchingLoggedInUser = false;
                state.errors.ErrorFetchingLoggedInUser = action.error.message;
            })
    }
})

export const selectUserOrders = (state) => state.user.userOrders;
export const selectUserInfo = (state) => state.user.userInfo;

export const selectIsFetchingLoggedInUser = (state) => state.user.status.isFetchingLoggedInUser;
export const selectIsUpdatingUser = (state) => state.user.status.isUpdatingUser;
export const selectIsFetchingUserOrders = (state) => state.user.status.isFetchingUserOrders;

export const selectErrorFetchingLoggedInUser = (state) => state.user.errors.ErrorFetchingLoggedInUser;
export const selectErrorUpdatingUser = (state) => state.user.errors.ErrorUpdatingUser;
export const selectErrorFetchingUserOrders = (state) => state.user.errors.ErrorFetchingUserOrders;

export const { setUserInfo } = userSlice.actions;

export default userSlice.reducer