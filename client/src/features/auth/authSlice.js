import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { checkUser, createUser, signOut, resetPasswordRequest, resetPassword } from './authAPI'

const initialState = {
    status: {
        isCreatingUser: false,
        isCheckingUser: false,
        isSigningOut: false,
        isSendingResetPasswordRequest: false,
        isResettingPassword: false,
    },
    errors: {
        ErrorCreatingUser: null,
        ErrorCheckingUser: null,
        ErrorSigningOut: null,
        ErrorSendingResetPasswordRequest: null,
        ErrorResettingPassword: null,
    }
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
        return response.data;
    })

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
    reducers: {
        resetAuthErrors: (state) => {
            state.errors = initialState.errors;
        }
    },
    extraReducers: (builder) => {
        builder
            // createUserAsync
            .addCase(createUserAsync.pending, (state) => {
                state.errors.ErrorCreatingUser = null;
                state.status.isCreatingUser = true;
            })
            .addCase(createUserAsync.fulfilled, (state, action) => {
                state.status.isCreatingUser = false;
            })
            .addCase(createUserAsync.rejected, (state, action) => {
                state.errors.ErrorCreatingUser = action.error.message;
                state.status.isCreatingUser = false;
            })

            // checkUserAsync
            .addCase(checkUserAsync.pending, (state) => {
                state.errors.ErrorCheckingUser = null;
                state.status.isCheckingUser = true;
            })
            .addCase(checkUserAsync.fulfilled, (state, action) => {
                state.status.isCheckingUser = false;
            })
            .addCase(checkUserAsync.rejected, (state, action) => {
                state.errors.ErrorCheckingUser = action.error.message;
                state.status.isCheckingUser = false;
            })

            // signOutAsync
            .addCase(signOutAsync.pending, (state) => {
                state.errors.ErrorSigningOut = null;
                state.status.isSigningOut = true;
            })
            .addCase(signOutAsync.fulfilled, (state, action) => {
                state.status.isSigningOut = false;
            })
            .addCase(signOutAsync.rejected, (state, action) => {
                state.errors.ErrorSigningOut = action.error.message;
                state.status.isSigningOut = false;
            })

            // resetPasswordRequestAsync
            .addCase(resetPasswordRequestAsync.pending, (state) => {
                state.errors.ErrorSendingResetPasswordRequest = null;
                state.status.isSendingResetPasswordRequest = true;
            })
            .addCase(resetPasswordRequestAsync.fulfilled, (state, action) => {
                state.status.isSendingResetPasswordRequest = false;
            })
            .addCase(resetPasswordRequestAsync.rejected, (state, action) => {
                state.errors.ErrorSendingResetPasswordRequest = action.error.message;
                state.status.isSendingResetPasswordRequest = false;
            })

            // resetPasswordAsync
            .addCase(resetPasswordAsync.pending, (state) => {
                state.errors.ErrorResettingPassword = null;
                state.status.isResettingPassword = true;
            })
            .addCase(resetPasswordAsync.fulfilled, (state, action) => {
                state.status.isResettingPassword = false;
            })
            .addCase(resetPasswordAsync.rejected, (state, action) => {
                state.errors.ErrorResettingPassword = action.error.message;
                state.status.isResettingPassword = false;
            })
    }
})

export const selectIsCreatingUser = (state) => state.auth.status.isCreatingUser;
export const selectIsCheckingUser = (state) => state.auth.status.isCheckingUser;
export const selectIsSigningOut = (state) => state.auth.status.isSigningOut;
export const selectIsSendingResetPasswordRequest = (state) => state.auth.status.isSendingResetPasswordRequest;
export const selectIsResettingPassword = (state) => state.auth.status.isResettingPassword

export const selectErrorCreatingUser = (state) => state.auth.errors.ErrorCreatingUser;
export const selectErrorCheckingUser = (state) => state.auth.errors.ErrorCheckingUser;
export const selectErrorSigningOut = (state) => state.auth.errors.ErrorSigningOut;
export const selectErrorSendingResetPasswordRequest = (state) => state.auth.errors.ErrorSendingResetPasswordRequest;
export const selectErrorResettingPassword = (state) => state.auth.errors.ErrorReset

export const { resetAuthErrors } = authSlice.actions;

export default authSlice.reducer