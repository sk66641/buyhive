import { Link } from "react-router-dom"
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { resetAuthErrors, resetPasswordRequestAsync, selectErrorSendingResetPasswordRequest, selectIsSendingResetPasswordRequest } from "../authSlice";
import toast, { Toaster } from 'react-hot-toast';
import { useEffect } from "react";

export default function ForgotPassword() {

    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const isSendingResetPasswordRequest = useSelector(selectIsSendingResetPasswordRequest);
    const ErrorSendingResetPasswordRequest = useSelector(selectErrorSendingResetPasswordRequest);

    useEffect(() => {
        if (ErrorSendingResetPasswordRequest) {
            toast.error(ErrorSendingResetPasswordRequest);
        }
        dispatch(resetAuthErrors());
    }, [ErrorSendingResetPasswordRequest, dispatch]);

    return (
        <>
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-4 py-12">
                <div className="w-full max-w-md rounded-3xl bg-white/90 shadow-2xl ring-1 ring-indigo-100 p-8 sm:p-10">
                    <div className="flex flex-col items-center">
                        <div className="bg-indigo-100 rounded-full p-3 shadow-lg mb-4">
                            <img
                                alt="Your Company"
                                src="buyhive.png"
                                className="h-12 w-12"
                            />
                        </div>
                        <h2 className="text-3xl font-extrabold text-indigo-700 text-center tracking-tight mb-2">
                            Forgot your password?
                        </h2>
                        <p className="text-gray-500 text-center mb-6">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>

                    <form noValidate onSubmit={handleSubmit((data) => {
                        dispatch(resetPasswordRequestAsync(data.email));
                    })} className="space-y-7">
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-indigo-700 mb-1">
                                Email address
                            </label>
                            <div className="relative mt-1">
                                <input
                                    id="email"
                                    {...register('email', {
                                        required: "email is required", pattern: {
                                            value: /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi,
                                            message: "email not valid",
                                        }
                                    })}
                                    type="email"
                                    autoComplete="email"
                                    className={`block w-full rounded-xl border-2 px-4 py-2 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-200 ${errors.email ? 'border-pink-400 ring-pink-200' : 'border-gray-200'
                                        }`}
                                    placeholder="you@example.com"
                                />
                                {errors.email && <p className="text-pink-600 text-xs mt-2">{errors.email.message}</p>}
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isSendingResetPasswordRequest}
                                className={`flex w-full justify-center rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-2 text-lg font-bold text-white shadow-lg hover:from-indigo-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-200 ${isSendingResetPasswordRequest ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
                            >
                                {isSendingResetPasswordRequest ? "Sending..." : "Send Reset Link"}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 flex flex-col items-center">
                        <div className="w-full border-t border-gray-200 mb-4"></div>
                        <p className="text-center text-sm text-gray-500">
                            Back to{' '}
                            <Link to="/auth" className="font-semibold text-indigo-600 hover:text-pink-500 transition-colors">
                                Login
                            </Link>
                            {' '}Page
                        </p>
                    </div>
                </div>
                <Toaster />
            </div>
        </>
    )
}
