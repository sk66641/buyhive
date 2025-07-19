import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addAddressAsync, deleteAddressAsync, fetchAddressesAsync, resetUserErrors, selectAddresses, selectErrorAddingAddress, selectErrorDeletingAddress, selectErrorFetchingAddresses, selectErrorUpdatingAddress, selectIsAddingAddress, selectIsDeletingAddress, selectIsFetchingAddresses, selectIsUpdatingAddress, selectUserInfo, updateAddressAsync } from '../user/userSlice';
import { useForm } from 'react-hook-form';
import { resetAuthErrors, selectErrorSigningOut, selectIsSigningOut, signOutAsync } from '../auth/authSlice';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(selectUserInfo);
    const addresses = useSelector(selectAddresses);
    const [selectedEditIndex, setSelectedEditIndex] = useState(-1);
    const [showAddAddressForm, setShowAddAddressForm] = useState(false);
    const [deletingAddressId, setDeletingAddressId] = useState(null);

    const isSigningOut = useSelector(selectIsSigningOut);
    const ErrorSigningOut = useSelector(selectErrorSigningOut);

    const isAddingAddress = useSelector(selectIsAddingAddress);
    const ErrorAddingAddress = useSelector(selectErrorAddingAddress);

    const isUpdatingAddress = useSelector(selectIsUpdatingAddress);
    const ErrorUpdatingAddress = useSelector(selectErrorUpdatingAddress);

    const isDeletingAddress = useSelector(selectIsDeletingAddress);
    const ErrorDeletingAddress = useSelector(selectErrorDeletingAddress);

    const isFetchingAddresses = useSelector(selectIsFetchingAddresses);
    const ErrorFetchingAddresses = useSelector(selectErrorFetchingAddresses);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm();

    const handleAddAddress = (address) => {
        dispatch(addAddressAsync({ ...address, userId: user.id })).unwrap()
            .then(() => {
                setShowAddAddressForm(false);
                reset();
                toast.success("Address added successfully")
            });
    }

    const handleEdit = (data) => {
        data.id = addresses[selectedEditIndex].id;
        dispatch(updateAddressAsync(data)).unwrap().then(() => {
            setSelectedEditIndex(-1);
            reset();
            toast.success("Address updated successfully")
        });
    }

    const handleRemove = (id) => {
        setDeletingAddressId(id);
        dispatch(deleteAddressAsync(id)).unwrap().then(() => {
            setDeletingAddressId(null);
            toast.success("Address deleted successfully")
        });
    }

    const handleEditForm = (index) => {
        setShowAddAddressForm(false);
        setSelectedEditIndex(index);
        const address = addresses[index];
        setValue('name', address.name)
        setValue('street', address.street)
        setValue('phone', address.phone)
        setValue('city', address.city)
        setValue('region', address.region)
        setValue('pinCode', address.pinCode)
    }


    const handleSignOut = () => {
        dispatch(signOutAsync()).
            unwrap().then(() => {
                navigate('/', { replace: true });
            });
    }

    useEffect(() => {
        if (ErrorSigningOut) {
            toast.error(ErrorSigningOut);
            dispatch(resetAuthErrors());
        }
        if (ErrorAddingAddress) {
            toast.error(ErrorAddingAddress);
        }
        if (ErrorUpdatingAddress) {
            toast.error(ErrorUpdatingAddress);
        }
        if (ErrorDeletingAddress) {
            toast.error(ErrorDeletingAddress);
        }
        if (ErrorFetchingAddresses) {
            toast.error(ErrorFetchingAddresses);
        }
        dispatch(resetUserErrors());
    }, [ErrorSigningOut, ErrorAddingAddress, ErrorUpdatingAddress, ErrorDeletingAddress, ErrorFetchingAddresses, dispatch]);

    useEffect(() => {
        dispatch(fetchAddressesAsync());
    }, [dispatch])

    return (
        <div className="lg:col-span-2">
            <div className="mx-auto bg-white px-0 sm:px-0 lg:px-0">
                <div className="flex h-full flex-col bg-white shadow-xl">
                    <div className='flex items-center justify-between flex-wrap gap-3 px-4 py-6 sm:px-6'>
                        <div className="flex flex-col overflow-y-auto">
                            <div className="text-lg font-medium text-gray-900">Name: {user.name}</div>
                            <div>Email Address: {user.email}</div>
                            {user.role === 'admin' && <div>Role: {user.role}</div>}
                        </div>
                        <button disabled={isSigningOut} type='button' onClick={handleSignOut}
                            className={`rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${isSigningOut ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            {isSigningOut ? 'Signing out...' : 'Sign out'}
                        </button>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-6 space-y-1 sm:px-6">


                        {showAddAddressForm ?
                            <form noValidate onSubmit={
                                handleSubmit((data) => {
                                    handleAddAddress(data);
                                })} className="bg-white px-5 py-12 border-solid border-2 border-gray-200 mb-12">
                                <div className="space-y-12">
                                    <div className="border-b border-gray-900/10 pb-12">
                                        <h2 className="text-2xl font-semibold leading-7 text-gray-900">
                                            Personal Information
                                        </h2>
                                        <p className="mt-1 text-sm leading-6 text-gray-600">
                                            Use a permanent address where you can receive mail.
                                        </p>

                                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                            <div className="sm:col-span-3">
                                                <label
                                                    htmlFor="first-name"
                                                    className="block text-sm font-medium leading-6 text-gray-900"
                                                >
                                                    Full name
                                                </label>
                                                <div className="mt-2">
                                                    <input
                                                        type="text"
                                                        {...register('name', { required: "name is required" })}
                                                        id="name"
                                                        autoComplete="given-name"
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    />
                                                </div>
                                                {errors.name && <p className="text-pink-600 text-sm mt-1">{errors.name.message}</p>}
                                            </div>

                                            <div className="sm:col-span-3">
                                                <label
                                                    htmlFor="phone"
                                                    className="block text-sm font-medium leading-6 text-gray-900"
                                                >
                                                    Phone
                                                </label>
                                                <div className="mt-2">
                                                    <input
                                                        type="tel"
                                                        {...register('phone', {
                                                            required: "phone is required",
                                                            pattern: {
                                                                value: /^[0-9]{10}$/,
                                                                message: 'Phone number must be 10 digits and contain only numbers'
                                                            }
                                                        })}
                                                        id="phone-number"
                                                        autoComplete="phone-number"
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    />
                                                </div>
                                                {errors.phone && <p className="text-pink-600 text-sm mt-1">{errors.phone.message}</p>}
                                            </div>

                                            <div className="col-span-full">
                                                <label
                                                    htmlFor="street-address"
                                                    className="block text-sm font-medium leading-6 text-gray-900"
                                                >
                                                    Street address
                                                </label>
                                                <div className="mt-2">
                                                    <input
                                                        type="text"
                                                        {...register('street', { required: "street is required" })}
                                                        id="street-address"
                                                        autoComplete="street-address"
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    />
                                                </div>
                                                {errors.street && <p className="text-pink-600 text-sm mt-1">{errors.street.message}</p>}
                                            </div>

                                            <div className="sm:col-span-2 sm:col-start-1">
                                                <label
                                                    htmlFor="city"
                                                    className="block text-sm font-medium leading-6 text-gray-900"
                                                >
                                                    City
                                                </label>
                                                <div className="mt-2">
                                                    <input
                                                        type="text"
                                                        {...register('city', { required: "city is required" })}
                                                        id="city"
                                                        autoComplete="address-level2"
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    />
                                                </div>
                                                {errors.city && <p className="text-pink-600 text-sm mt-1">{errors.city.message}</p>}
                                            </div>

                                            <div className="sm:col-span-2">
                                                <label
                                                    htmlFor="region"
                                                    className="block text-sm font-medium leading-6 text-gray-900"
                                                >
                                                    State / Province
                                                </label>
                                                <div className="mt-2">
                                                    <input
                                                        type="text"
                                                        {...register('region', { required: "region is required" })}
                                                        id="region"
                                                        autoComplete="address-level1"
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    />
                                                </div>
                                                {errors.region && <p className="text-pink-600 text-sm mt-1">{errors.region.message}</p>}
                                            </div>

                                            <div className="sm:col-span-2">
                                                <label
                                                    htmlFor="postal-code"
                                                    className="block text-sm font-medium leading-6 text-gray-900"
                                                >
                                                    ZIP / Pin code
                                                </label>
                                                <div className="mt-2">
                                                    <input
                                                        type="text"
                                                        {...register('pinCode', { required: "pinCode is required" })}
                                                        id="pinCode"
                                                        autoComplete="pinCode"
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    />
                                                </div>
                                                {errors.pinCode && <p className="text-pink-600 text-sm mt-1">{errors.pinCode.message}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-center justify-end gap-x-6">
                                        <button
                                            onClick={() => { setShowAddAddressForm(false); reset(); }}
                                            type="button"
                                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isAddingAddress}
                                            className={`rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${isAddingAddress ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                        >
                                            {isAddingAddress ? 'Adding Address...' : 'Add Address'}
                                        </button>
                                    </div>
                                </div>
                            </form> :
                            <button
                                onClick={() => {
                                    setSelectedEditIndex(-1);
                                    reset();
                                    setShowAddAddressForm(true);
                                }}
                                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mb-3.5 cursor-pointer"
                            >
                                Add Address
                            </button>}


                        <p className="mt-0.5 text-sm text-gray-500">My Addresses:</p>
                        <div>
                            {isFetchingAddresses ? (
                                <div className="flex flex-col gap-4">
                                    {[1, 2, 3].map((_, idx) => (
                                        <div key={idx} className="animate-pulse bg-gray-100 border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div className="flex flex-col gap-1 w-32">
                                                <div className="h-4 bg-gray-300 rounded w-3/4 mb-1"></div>
                                                <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                                                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                                            </div>
                                            <div className="flex flex-col gap-1 sm:items-end w-24">
                                                <div className="h-4 bg-gray-300 rounded w-2/3 mb-1"></div>
                                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                            </div>
                                            <div className="flex flex-col gap-1 min-w-[80px] w-16">
                                                <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
                                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : addresses.length > 0 ?
                                addresses.map((address, index) => {
                                    return (
                                        <div key={address.id}>
                                            <div

                                                className="flex justify-between gap-x-6 px-5 py-5 border-solid border-2 border-gray-200 overflow-auto"
                                            >

                                                <div className="flex gap-x-4">

                                                    <div className="min-w-0 flex-auto">
                                                        <p className="text-sm font-semibold leading-6 text-gray-900 text-wrap">
                                                            {address.name}
                                                        </p>
                                                        <p className="mt-1 truncate text-xs leading-5 text-gray-500 text-wrap">
                                                            {address.street}
                                                        </p>
                                                        <p className="mt-1 truncate text-xs leading-5 text-gray-500 text-wrap">
                                                            {address.pinCode}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="hidden sm:flex sm:flex-col sm:items-end">
                                                    <p className="text-sm leading-6 text-gray-900">
                                                        Phone: {address.phone}
                                                    </p>
                                                    <p className="text-sm leading-6 text-gray-500">
                                                        {address.city}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col">
                                                    <button type='button' onClick={() => handleEditForm(index)} className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">
                                                        Edit
                                                    </button>
                                                    <button
                                                        type='button'
                                                        disabled={isDeletingAddress && deletingAddressId !== address.id}
                                                        onClick={() => handleRemove(address.id)}
                                                        className={`font-medium text-red-600 hover:text-red-500 ${isDeletingAddress && deletingAddressId === address.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                    >
                                                        {isDeletingAddress && deletingAddressId === address.id ? 'Deleting...' : 'Delete'}
                                                    </button>
                                                </div>
                                            </div>
                                            {index === selectedEditIndex &&
                                                <form noValidate onSubmit={
                                                    handleSubmit((data) => {
                                                        handleEdit(data);
                                                    })} className="bg-white px-5 py-12 border-solid border-2 border-gray-200 mb-12">
                                                    <div className="space-y-12">
                                                        <div className="border-b border-gray-900/10 pb-12">
                                                            <h2 className="text-2xl font-semibold leading-7 text-gray-900">
                                                                Personal Information
                                                            </h2>
                                                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                                                Use a permanent address where you can receive mail.
                                                            </p>

                                                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                                                <div className="sm:col-span-3">
                                                                    <label
                                                                        htmlFor="first-name"
                                                                        className="block text-sm font-medium leading-6 text-gray-900"
                                                                    >
                                                                        Full name
                                                                    </label>
                                                                    <div className="mt-2">
                                                                        <input
                                                                            type="text"
                                                                            {...register('name', { required: "name is required" })}
                                                                            id="name"
                                                                            autoComplete="given-name"
                                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                        />
                                                                    </div>
                                                                    {errors.name && <p className="text-pink-600 text-sm mt-1">{errors.name.message}</p>}
                                                                </div>

                                                                <div className="sm:col-span-3">
                                                                    <label
                                                                        htmlFor="phone"
                                                                        className="block text-sm font-medium leading-6 text-gray-900"
                                                                    >
                                                                        Phone
                                                                    </label>
                                                                    <div className="mt-2">
                                                                        <input
                                                                            type="tel"
                                                                            {...register('phone', {
                                                                                required: 'Phone number is required',
                                                                                pattern: {
                                                                                    value: /^[0-9]{10}$/,
                                                                                    message: 'Phone number must be 10 digits and contain only numbers',
                                                                                },
                                                                            })}

                                                                            id="phone-number"
                                                                            autoComplete="phone-number"
                                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                        />
                                                                    </div>
                                                                    {errors.phone && <p className="text-pink-600 text-sm mt-1">{errors.phone.message}</p>}
                                                                </div>

                                                                <div className="col-span-full">
                                                                    <label
                                                                        htmlFor="street-address"
                                                                        className="block text-sm font-medium leading-6 text-gray-900"
                                                                    >
                                                                        Street address
                                                                    </label>
                                                                    <div className="mt-2">
                                                                        <input
                                                                            type="text"
                                                                            {...register('street', { required: "street is required" })}
                                                                            id="street-address"
                                                                            autoComplete="street-address"
                                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                        />
                                                                    </div>
                                                                    {errors.street && <p className="text-pink-600 text-sm mt-1">{errors.street.message}</p>}
                                                                </div>

                                                                <div className="sm:col-span-2 sm:col-start-1">
                                                                    <label
                                                                        htmlFor="city"
                                                                        className="block text-sm font-medium leading-6 text-gray-900"
                                                                    >
                                                                        City
                                                                    </label>
                                                                    <div className="mt-2">
                                                                        <input
                                                                            type="text"
                                                                            {...register('city', { required: "city is required" })}
                                                                            id="city"
                                                                            autoComplete="address-level2"
                                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                        />
                                                                    </div>
                                                                    {errors.city && <p className="text-pink-600 text-sm mt-1">{errors.city.message}</p>}
                                                                </div>

                                                                <div className="sm:col-span-2">
                                                                    <label
                                                                        htmlFor="region"
                                                                        className="block text-sm font-medium leading-6 text-gray-900"
                                                                    >
                                                                        State / Province
                                                                    </label>
                                                                    <div className="mt-2">
                                                                        <input
                                                                            type="text"
                                                                            {...register('region', { required: "region is required" })}
                                                                            id="region"
                                                                            autoComplete="address-level1"
                                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                        />
                                                                    </div>
                                                                    {errors.region && <p className="text-pink-600 text-sm mt-1">{errors.region.message}</p>}
                                                                </div>

                                                                <div className="sm:col-span-2">
                                                                    <label
                                                                        htmlFor="postal-code"
                                                                        className="block text-sm font-medium leading-6 text-gray-900"
                                                                    >
                                                                        ZIP / Pin code
                                                                    </label>
                                                                    <div className="mt-2">
                                                                        <input
                                                                            type="text"
                                                                            {...register('pinCode', { required: "pinCode is required" })}
                                                                            id="pinCode"
                                                                            autoComplete="pinCode"
                                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                        />
                                                                    </div>
                                                                    {errors.pinCode && <p className="text-pink-600 text-sm mt-1">{errors.pinCode.message}</p>}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="mt-6 flex items-center justify-end gap-x-6">
                                                            <button
                                                                onClick={() => { setSelectedEditIndex(-1); reset(); }}
                                                                type="button"
                                                                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                type="submit"
                                                                disabled={isUpdatingAddress}
                                                                className={`rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${isUpdatingAddress ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                            >
                                                                {isUpdatingAddress ? 'Saving Address...' : 'Save Address'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </form>}
                                        </div>
                                    )
                                }) : (
                                    <div className="flex flex-col items-center justify-center py-8">
                                        <div className="text-base text-gray-400 font-medium">No addresses found</div>
                                    </div>
                                )}

                        </div>
                    </div>
                </div>
            </div>
            <Toaster />
        </div>
    )
}

export default Profile
