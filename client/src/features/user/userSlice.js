import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { updateUser, fetchLoggedInUser, fetchUserOrders, addAddress, fetchAddresses, deleteAddress, updateAddress } from './userAPI';

const initialState = {
    status: {
        isFetchingLoggedInUser: true,
        isUpdatingUser: false, // TODO: not used yet
        isFetchingUserOrders: false,
        isAddingAddress: false,
        isFetchingAddresses: false,
        isUpdatingAddress: false,
        isDeletingAddress: false,
    },
    userOrders: [],
    userInfo: null,
    addresses: [],
    errors: {
        ErrorFetchingLoggedInUser: null, // TODO: not used yet
        ErrorUpdatingUser: null, // TODO: not used yet
        ErrorFetchingUserOrders: null,
        ErrorAddingAddress: null,
        ErrorFetchingAddresses: null,
        ErrorUpdatingAddress: null,
        ErrorDeletingAddress: null,
    },
}

export const fetchUserOrdersAsync = createAsyncThunk(
    'user/fetchUserOrders',
    async (params, { rejectWithValue }) => {
        try {
            const data = await fetchUserOrders(params);
            return data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchLoggedInUserAsync = createAsyncThunk(
    'user/fetchLoggedInUser',
    async (_, { rejectWithValue }) => {
        try {
            const data = await fetchLoggedInUser();
            return data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const addAddressAsync = createAsyncThunk(
    'user/addAddress',
    async (address, { rejectWithValue }) => {
        try {
            const data = await addAddress(address);
            return data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchAddressesAsync = createAsyncThunk(
    'user/fetchAddresses',
    async (_, { rejectWithValue }) => {
        try {
            const data = await fetchAddresses();
            return data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const updateAddressAsync = createAsyncThunk(
    'user/updateAddress',
    async (address, { rejectWithValue }) => {
        try {
            const data = await updateAddress(address);
            return data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const deleteAddressAsync = createAsyncThunk(
    'user/deleteAddress',
    async (addressId, { rejectWithValue }) => {
        try {
            const data = await deleteAddress(addressId);
            return data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const updateUserAsync = createAsyncThunk(
    'user/updateUser',
    async (update, { rejectWithValue }) => {
        try {
            const data = await updateUser(update);
            return data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserInfo: (state, action) => {
            state.userInfo = action.payload;
        },
        resetUserErrors: (state) => {
            state.errors = initialState.errors;
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
                state.errors.ErrorFetchingUserOrders = action.payload.message;
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
                state.errors.ErrorUpdatingUser = action.payload.message;
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
                state.errors.ErrorFetchingLoggedInUser = action.payload.message;
            })

            // addAddressAsync
            .addCase(addAddressAsync.pending, (state) => {
                state.errors.ErrorAddingAddress = null;
                state.status.isAddingAddress = true;
            })
            .addCase(addAddressAsync.fulfilled, (state, action) => {
                state.status.isAddingAddress = false;
                state.addresses.push(action.payload);
            })
            .addCase(addAddressAsync.rejected, (state, action) => {
                state.status.isAddingAddress = false;
                state.errors.ErrorAddingAddress = action.payload.message;
            })

            // fetchAddressesAsync
            .addCase(fetchAddressesAsync.pending, (state) => {
                state.errors.ErrorFetchingAddresses = null;
                state.status.isFetchingAddresses = true;
            })
            .addCase(fetchAddressesAsync.fulfilled, (state, action) => {
                state.status.isFetchingAddresses = false;
                state.addresses = action.payload;
            })
            .addCase(fetchAddressesAsync.rejected, (state, action) => {
                state.status.isFetchingAddresses = false;
                state.errors.ErrorFetchingAddresses = action.payload.message;
            })

            // updateAddressAsync
            .addCase(updateAddressAsync.pending, (state) => {
                state.errors.ErrorUpdatingAddress = null;
                state.status.isUpdatingAddress = true;
            })
            .addCase(updateAddressAsync.fulfilled, (state, action) => {
                state.status.isUpdatingAddress = false;
                const index = state.addresses.findIndex(addr => addr.id === action.payload.id);
                if (index !== -1) {
                    state.addresses[index] = action.payload;
                }
            })
            .addCase(updateAddressAsync.rejected, (state, action) => {
                state.status.isUpdatingAddress = false;
                state.errors.ErrorUpdatingAddress = action.payload.message;
            })

            // deleteAddressAsync
            .addCase(deleteAddressAsync.pending, (state) => {
                state.errors.ErrorDeletingAddress = null;
                state.status.isDeletingAddress = true;
            })
            .addCase(deleteAddressAsync.fulfilled, (state, action) => {
                state.status.isDeletingAddress = false;
                state.addresses = state.addresses.filter(addr => addr.id !== action.payload.id);
            })
            .addCase(deleteAddressAsync.rejected, (state, action) => {
                state.status.isDeletingAddress = false;
                state.errors.ErrorDeletingAddress = action.payload.message;
            })
    }
})

export const selectUserOrders = (state) => state.user.userOrders;
export const selectUserInfo = (state) => state.user.userInfo;
export const selectAddresses = (state) => state.user.addresses;

export const selectIsFetchingLoggedInUser = (state) => state.user.status.isFetchingLoggedInUser;
export const selectIsUpdatingUser = (state) => state.user.status.isUpdatingUser;
export const selectIsFetchingUserOrders = (state) => state.user.status.isFetchingUserOrders;
export const selectIsAddingAddress = (state) => state.user.status.isAddingAddress;
export const selectIsFetchingAddresses = (state) => state.user.status.isFetchingAddresses;
export const selectIsUpdatingAddress = (state) => state.user.status.isUpdatingAddress;
export const selectIsDeletingAddress = (state) => state.user.status.isDeletingAddress;

export const selectErrorFetchingLoggedInUser = (state) => state.user.errors.ErrorFetchingLoggedInUser;
export const selectErrorUpdatingUser = (state) => state.user.errors.ErrorUpdatingUser;
export const selectErrorFetchingUserOrders = (state) => state.user.errors.ErrorFetchingUserOrders;
export const selectErrorAddingAddress = (state) => state.user.errors.ErrorAddingAddress;
export const selectErrorFetchingAddresses = (state) => state.user.errors.ErrorFetchingAddresses;
export const selectErrorUpdatingAddress = (state) => state.user.errors.ErrorUpdatingAddress;
export const selectErrorDeletingAddress = (state) => state.user.errors.ErrorDeletingAddress;

export const { setUserInfo, resetUserErrors } = userSlice.actions;

export default userSlice.reducer