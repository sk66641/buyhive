import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { updateUser, fetchLoggedInUser, fetchUserOrders, addAddress, fetchAddresses, deleteAddress, updateAddress } from './userAPI';

const initialState = {
    status: {
        isFetchingLoggedInUser: false,
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

export const addAddressAsync = createAsyncThunk(
    'user/addAddress',
    async (address) => {
        const response = await addAddress(address);
        return response.data;
    }
);

export const fetchAddressesAsync = createAsyncThunk(
    'user/fetchAddresses',
    async () => {
        const response = await fetchAddresses();
        return response.data;
    }
);

export const updateAddressAsync = createAsyncThunk(
    'user/updateAddress',
    async (address) => {
        const response = await updateAddress(address);
        return response.data;
    }
);

export const deleteAddressAsync = createAsyncThunk(
    'user/deleteAddress',
    async (addressId) => {
        const response = await deleteAddress(addressId);
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
                state.errors.ErrorAddingAddress = action.error.message;
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
                state.errors.ErrorFetchingAddresses = action.error.message;
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
                state.errors.ErrorUpdatingAddress = action.error.message;
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
                state.errors.ErrorDeletingAddress = action.error.message;
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