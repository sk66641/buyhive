import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { checkUser, createUser } from './authAPI'

const initialState = {
    loggedInUser: null,
    status: 'idle',
    error: null,
}

export const createUserAsync = createAsyncThunk(
    'user/createUser',
    async (userData) => {
        const response = await createUser(userData);
        // console.log("createAsyncThunk", response)
        return response.data;
    })
export const checkUserAsync = createAsyncThunk(
    'user/checkUser',
    async (loginInfo) => {
        const response = await checkUser(loginInfo);
        // console.log("createAsyncThunk", response)
        return response.data;
    })

export const authSlice = createSlice({
    name: 'user',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(createUserAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createUserAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.loggedInUser = action.payload;
            })
            .addCase(checkUserAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(checkUserAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.loggedInUser = action.payload;
            })
            .addCase(checkUserAsync.rejected, (state, action) => {
                state.status = 'error';
                // console.log(action)
                state.error = action.error;
            })
    }
})

export const selectLoggedInUser = (state) => state.auth.loggedInUser;
export const selectError = (state) => state.auth.error;
// export const { increment, decrement, incrementByAmount } = counterSlice.actions

export default authSlice.reducer