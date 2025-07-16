import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { checkUser, createUser, signOut, resetPasswordRequest, resetPassword } from './authAPI'
import { updateUser } from '../user/userAPI'

const initialState = {
    status: {
        isCreatingUser: false,
        isCheckingUser: false,
        isUpdatingUser: false,
        isSigningOut: false,
        isSendingResetPasswordRequest: false,
        isResettingPassword: false,
    },
}

export const createUserAsync = createAsyncThunk(
    'user/createUser',
    async (userData, thunkAPI) => {
        const { dispatch } = thunkAPI;
        const response = await createUser(userData, dispatch);
        return response.data;
    })

export const checkUserAsync = createAsyncThunk(
    'user/checkUser',
    async (loginInfo, thunkAPI) => {
        const { dispatch } = thunkAPI;
        const response = await checkUser(loginInfo, dispatch);
        // console.log("checkUserAsync response", response);
        return response.data;
    })

// export const checkTokenAsync = createAsyncThunk(
//     'user/checkToken',
//     async () => {
//         const response = await checkToken();
//         return response.data;
//     })

// export const updateUserAsync = createAsyncThunk(
//     'user/updateUser',
//     async (update) => {
//         const response = await updateUser(update);
//         return response.data;
//     }
// );

export const signOutAsync = createAsyncThunk(
    'user/signOut',
    async () => {
        const response = await signOut();
        return response.data;
    }
);

export const resetPasswordRequestAsync = createAsyncThunk(
    'user/resetPasswordRequest',
    async (email) => {
        const response = await resetPasswordRequest(email);
        return response.data;
    }
);

export const resetPasswordAsync = createAsyncThunk(
    'user/resetPassword',
    async ({ token, email, password }) => {
        const response = await resetPassword(email, token, password);
        return response.data;
    }
);

export const authSlice = createSlice({
    name: 'user',
    initialState,
    extraReducers: (builder) => {
        builder
            // createUserAsync
            .addCase(createUserAsync.pending, (state) => {
                state.status.isCreatingUser = true;
            })
            .addCase(createUserAsync.fulfilled, (state, action) => {
                state.status.isCreatingUser = false;
            })
            .addCase(createUserAsync.rejected, (state, action) => {
                state.status.isCreatingUser = false;
            })

            // checkUserAsync
            .addCase(checkUserAsync.pending, (state) => {
                state.status.isCheckingUser = true;
            })
            .addCase(checkUserAsync.fulfilled, (state, action) => {
                state.status.isCheckingUser = true;
            })
            .addCase(checkUserAsync.rejected, (state, action) => {
                state.status.isCheckingUser = false;
            })

            // checkTokenAsync
            // .addCase(checkTokenAsync.fulfilled, (state, action) => {
            //     state.loggedInUser = action.payload;
            // })

            // updateUserAsync
            // .addCase(updateUserAsync.pending, (state) => {
            //     state.status.isUpdatingUser = true;
            // })
            // .addCase(updateUserAsync.fulfilled, (state, action) => {
            //     state.status.isUpdatingUser = false;
            //     state.loggedInUser = action.payload;
            // })
            // .addCase(updateUserAsync.rejected, (state, action) => {
            //     state.status.isUpdatingUser = false;
            // })

            // signOutAsync
            .addCase(signOutAsync.pending, (state) => {
                state.status.isSigningOut = true;
            })
            .addCase(signOutAsync.fulfilled, (state, action) => {
                state.status.isSigningOut = false;
            })
            .addCase(signOutAsync.rejected, (state, action) => {
                state.status.isSigningOut = false;
            })

            // resetPasswordRequestAsync
            .addCase(resetPasswordRequestAsync.pending, (state) => {
                state.status.isSendingResetPasswordRequest = true;
            })
            .addCase(resetPasswordRequestAsync.fulfilled, (state, action) => {
                state.status.isSendingResetPasswordRequest = false;
            })
            .addCase(resetPasswordRequestAsync.rejected, (state, action) => {
                state.status.isSendingResetPasswordRequest = false;
            })

            // resetPasswordAsync
            .addCase(resetPasswordAsync.pending, (state) => {
                state.status.isResettingPassword = true;
            })
            .addCase(resetPasswordAsync.fulfilled, (state, action) => {
                state.status.isResettingPassword = false;
            })
            .addCase(resetPasswordAsync.rejected, (state, action) => {
                state.status.isResettingPassword = false;
            })
    }
})

// export const selectLoggedInUser = (state) => state.auth.loggedInUser;
export const selectIsCreatingUser = (state) => state.auth.status.isCreatingUser;
export const selectIsCheckingUser = (state) => state.auth.status.isCheckingUser;
export const selectIsUpdatingUser = (state) => state.auth.status.isUpdatingUser;
export const selectIsSigningOut = (state) => state.auth.status.isSigningOut;
export const selectIsSendingResetPasswordRequest = (state) => state.auth.status.isSendingResetPasswordRequest;
export const selectIsResettingPassword = (state) => state.auth.status.isResettingPassword

export default authSlice.reducer