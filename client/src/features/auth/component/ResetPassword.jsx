import { Link } from "react-router-dom"
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { resetAuthErrors, resetPasswordAsync, selectErrorResettingPassword, selectIsResettingPassword } from "../authSlice";
import { useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';

export default function ResetPassword() {

    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm();

    const query = new URLSearchParams(window.location.search);
    const token = query.get('token');
    const email = query.get('email');

    const isResettingPassword = useSelector(selectIsResettingPassword);
    const ErrorResettingPassword = useSelector(selectErrorResettingPassword);

    useEffect(() => {
        if (ErrorResettingPassword) {
            toast.error(ErrorResettingPassword);
        }
        dispatch(resetAuthErrors());
    }, [ErrorResettingPassword, dispatch]);

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-4 py-12">
                <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 sm:p-12 max-w-md w-full border border-indigo-100">
                    <div className="flex flex-col items-center">
                        <div className="bg-gradient-to-tr from-indigo-100 to-pink-100 rounded-full p-2 shadow-lg mb-4">
                            <img
                                alt="Your Company"
                                src="buyhive.png"
                                className="h-14 w-14 object-contain rounded-full"
                            />
                        </div>
                        <h2 className="text-3xl font-extrabold text-indigo-700 text-center mb-2 drop-shadow">
                            Reset Your Password
                        </h2>
                        <p className="text-md text-gray-600 text-center mb-6">
                            Enter your new password below to regain access to your account.
                        </p>
                    </div>

                    <form noValidate onSubmit={handleSubmit((data) => {
                        dispatch(resetPasswordAsync({ token, email, password: data.password }));
                    })} className="space-y-7">

                        <div>
                            <label htmlFor="new-password" className="block text-base font-semibold text-gray-800 mb-1">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    // value={}
                                    id="new-password"
                                    {...register('password', {
                                        required: "password is required", pattern: {
                                            value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
                                            message: `- at least 8 characters
                                - must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number
                                - Can contain special characters`,
                                        }
                                    })}
                                    type="password"
                                    placeholder="Enter your new password"
                                    autoComplete="new-password"
                                    className="block w-full rounded-xl border border-indigo-200 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-pink-400 focus:outline-none shadow-sm transition"
                                />
                            </div>
                            {errors.password && <p className="text-pink-600 text-sm mt-1">{errors.password.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="confirm-new-password" className="block text-base font-semibold text-gray-800 mb-1">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    // value={}
                                    id="confirm-new-password"
                                    {...register('confirmPassword', {
                                        required: "confirm password is required",
                                        validate: (value, formValues) => value === formValues.password || "password not matching"
                                    })}
                                    type="password"
                                    placeholder="Re-enter your password"
                                    autoComplete="off"
                                    className="block w-full rounded-xl border border-indigo-200 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-pink-400 focus:outline-none shadow-sm transition"
                                />
                            </div>
                            {errors.confirmPassword && <p className="text-pink-600 text-sm mt-1">{errors.confirmPassword.message}</p>}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isResettingPassword}
                                className={`flex w-full justify-center rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-3 text-lg font-bold text-white shadow-lg hover:scale-105 hover:from-pink-500 hover:to-indigo-500 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-pink-300 ${isResettingPassword ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
                            >
                                {isResettingPassword ? "Resetting..." : "Reset Password"}
                            </button>
                        </div>
                    </form>
                </div>
                <Toaster />
            </div>
        </>
    )
}
