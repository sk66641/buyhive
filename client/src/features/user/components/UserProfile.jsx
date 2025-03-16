import React from 'react'
import { useSelector } from 'react-redux'
import { selectLoggedInUser } from '../../auth/authSlice'

const UserProfile = () => {
    const user = useSelector(selectLoggedInUser);
    return (
        <div className="lg:col-span-2">
            <div className="mx-auto mt-12 bg-white max-w-7xl px-0 sm:px-0 lg:px-0">
                <div className="flex h-full flex-col bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                        <div className="flex items-start justify-between">
                            <div className="text-lg font-medium text-gray-900">Name: user.name</div>
                        </div>
                        <div>Email Address: {user.email}</div>
                    </div>

                    <div className="border-t border-gray-200 px-4 py-6 space-y-1 sm:px-6">
                        <p className="mt-0.5 text-sm text-gray-500">My Addresses:</p>
                        <ul role='list'>
                            {user.addresses.map((address, index) => {
                                return (
                                    <li
                                        key={index}
                                        className="flex justify-between gap-x-6 px-5 py-5 border-solid border-2 border-gray-200"
                                    >
                                        <div className="flex gap-x-4">

                                            <div className="min-w-0 flex-auto">
                                                <p className="text-sm font-semibold leading-6 text-gray-900">
                                                    {address.name}
                                                </p>
                                                <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                                                    {address.street}
                                                </p>
                                                <p className="mt-1 truncate text-xs leading-5 text-gray-500">
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
                                    </li>
                                )
                            })}

                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfile
