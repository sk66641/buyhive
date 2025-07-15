import { Link } from "react-router-dom"
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { resetPasswordAsync, resetPasswordRequestAsync, selectError } from "../authSlice";

export default function ResetPassword() {

    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const error = useSelector(selectError);
    // get query from url token and email
    const query = new URLSearchParams(window.location.search);
    const token = query.get('token');
    const email = query.get('email');


    return (
        <>

            {/* {user && <Navigate to={'/'} replace={true}></Navigate>} */}
            {/* Without replace, the navigation would be added to the history stack, and the user could go back to the previous page. */}
            <div className=" flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        alt="Your Company"
                        src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                        className="mx-auto h-10 w-auto"
                    />
                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                        Enter email to reset password
                    </h2>
                    {error && <p className="text-red-500 text-center">{error.message}</p>}
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form noValidate onSubmit={handleSubmit((data) => {
                        // dispatch(resetPasswordRequestAsync(data.email));
                        dispatch(resetPasswordAsync({ token, email, password: data.password }));
                        // console.log(data)
                    })} className="space-y-6">

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="new-password" className="block text-sm/6 font-medium text-gray-900">
                                    New Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    value={"User@12345"}
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
                                    // required
                                    autoComplete="new-password"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                                {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="confirm-new-password" className="block text-sm/6 font-medium text-gray-900">
                                    Confirm New Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    value={"User@12345"}
                                    id="confirm-new-password"
                                    {...register('confirmPassword', {
                                        required: "confirm password is required",
                                        validate: (value, formValues) => value === formValues.password || "password not matching"
                                    })}
                                    type="password"
                                    // required
                                    autoComplete="off"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                                {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Reset Password
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm/6 text-gray-500">
                        Back to {' '}
                        <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
                            Login {' '}
                        </Link>
                        Page
                    </p>
                </div>
            </div>
        </>
    )
}
