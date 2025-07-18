import { useForm } from 'react-hook-form'
import { createUserAsync, resetAuthErrors, selectErrorCreatingUser, selectIsCreatingUser } from "../authSlice";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";

export default function SignUp({ setAuthMethod }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const isCreatingUser = useSelector(selectIsCreatingUser);
  const ErrorCreatingUser = useSelector(selectErrorCreatingUser);

  useEffect(() => {
    if (ErrorCreatingUser) {
      toast.error(ErrorCreatingUser);
    }
    dispatch(resetAuthErrors());
  }, [ErrorCreatingUser, dispatch]);


  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-4 py-8">
      <div className="bg-white/90 shadow-2xl rounded-3xl p-10 max-w-lg w-full border border-gray-200 backdrop-blur-md">
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <img
              alt="buyhive"
              src="buyhive.png"
              className="h-14 w-14 drop-shadow-xl rounded-full"
            />
            <span className="text-2xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg tracking-wide">buyhive</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mt-2 mb-1 tracking-tight">
            Create a new account
          </h2>
        </div>

        <form noValidate onSubmit={handleSubmit((data) => {
          dispatch(createUserAsync({ name: data.name,  email: data.email, password: data.password, role: 'user' }));
        })} className="space-y-7 mt-4">
          <div className='flex gap-3 md:flex-nowrap '>

            {/* Name Field */}
            <div className='w-2/5'>
              <label htmlFor="name" className="block text-base font-semibold text-indigo-700 mb-1">
                Name
              </label>
              <div className="relative mt-1">
                <input
                  id="name"
                  {...register('name', {
                    required: "name is required",
                  })}
                  type="text"
                  autoComplete="name"
                  className={`block w-full rounded-xl bg-white/80 px-5 py-3 text-base text-gray-900 border ${errors.name ? 'border-pink-400' : 'border-indigo-200'} placeholder:text-gray-400 focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition shadow-sm`}
                  placeholder="e.g. John"
                />
                {errors.name && <p className="text-pink-600 text-xs mt-1">{errors.name.message}</p>}
              </div>
            </div>

            {/* Email Field */}
            <div className='w-3/5'>
              <label htmlFor="email" className="block text-base font-semibold text-indigo-700 mb-1">
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
                  className={`block w-full rounded-xl bg-white/80 px-5 py-3 text-base text-gray-900 border ${errors.email ? 'border-pink-400' : 'border-indigo-200'} placeholder:text-gray-400 focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition shadow-sm`}
                  placeholder="e.g. example@gmail.com"
                />
                {errors.email && <p className="text-pink-600 text-xs mt-1">{errors.email.message}</p>}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-base font-semibold text-indigo-700 mb-1">
                Password
              </label>
            </div>
            <div className="relative mt-1">
              <input
                id="password"
                {...register('password', {
                  required: "password is required", pattern: {
                    value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
                    message: `- at least 8 characters
                                - must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number
                                - Can contain special characters`,
                  }
                })}
                type="password"
                autoComplete="new-password"
                className={`block w-full rounded-xl bg-white/80 px-5 py-3 text-base text-gray-900 border ${errors.password ? 'border-pink-400' : 'border-indigo-200'} placeholder:text-gray-400 focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition shadow-sm`}
                placeholder="Password"
              />
              {errors.password && <p className="text-pink-600 text-xs mt-1 whitespace-pre-line">{errors.password.message}</p>}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-base font-semibold text-indigo-700 mb-1">
                Confirm Password
              </label>
            </div>
            <div className="relative mt-1">
              <input
                id="confirm-password"
                {...register('confirmPassword', {
                  required: "confirm password is required",
                  validate: (value, formValues) => value === formValues.password || "password not matching"
                })}
                type="password"
                autoComplete="off"
                className={`block w-full rounded-xl bg-white/80 px-5 py-3 text-base text-gray-900 border ${errors.confirmPassword ? 'border-pink-400' : 'border-indigo-200'} placeholder:text-gray-400 focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition shadow-sm`}
                placeholder="Confirm Password"
              />
              {errors.confirmPassword && <p className="text-pink-600 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={isCreatingUser}
            className={`flex w-full justify-center rounded-xl bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 px-5 py-3 text-lg font-bold text-white shadow-lg hover:from-indigo-700 hover:to-pink-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-200 ${isCreatingUser ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
          >
            {isCreatingUser ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                Creating Account...
              </span>
            ) : "Create Account"}
          </button>
        </form>

        <p className="mt-8 text-center text-base text-gray-600">
          Already have an account?{' '}
          <button onClick={() => setAuthMethod('login')} className="font-semibold text-indigo-600 hover:text-pink-500 transition underline underline-offset-2">
            Log in
          </button>
        </p>
      </div>
      <Toaster />
    </div>

  )
}
