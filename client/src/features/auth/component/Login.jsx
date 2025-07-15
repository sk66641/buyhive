import { Link, Navigate } from "react-router-dom"
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { checkUserAsync, selectIsCheckingUser, selectLoggedInUser } from "../authSlice";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const user = useSelector(selectLoggedInUser);
  const isCheckingUser = useSelector(selectIsCheckingUser);

  return (
    <>
      {/* Without replace, the navigation would be added to the history stack, and the user could go back to the previous page. */}
      {user && <Navigate to={'/'} replace={true}></Navigate>}

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#f8fafc] via-[#e0c3fc] to-[#8ec5fc] px-4 py-8 relative overflow-hidden">
        {/* Decorative blurred circles */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-300 opacity-30 rounded-full filter blur-3xl z-0 animate-pulse"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-300 opacity-30 rounded-full filter blur-3xl z-0 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-purple-200 opacity-20 rounded-full filter blur-2xl z-0 animate-spin-slow"></div>

        <div className="relative z-10 bg-white/80 shadow-2xl rounded-3xl p-12 max-w-md w-full border border-gray-200 backdrop-blur-2xl">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <img
                alt="buyhive"
                src="buyhive.png"
                className="h-14 w-14 drop-shadow-xl rounded-full"
              />
              <span className="text-2xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg tracking-wide">buyhive</span>
            </div>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight drop-shadow-sm">
              Welcome Back!
            </h2>
            {/* {error && <p className="text-red-500 text-center mt-2">{error.message}</p>} */}
          </div>

          <form noValidate onSubmit={handleSubmit((data) => {
            dispatch(checkUserAsync({ email: data.email, password: data.password }));
          })} className="space-y-8 mt-8">
            <div>
              <label htmlFor="email" className="block text-base font-semibold text-gray-700 mb-1">
                Email address
              </label>
              <div className="relative mt-1">
                <input
                  id="email"
                  // value={}
                  placeholder="e.g. example@gmail.com"
                  {...register('email', {
                    required: "email is required", pattern: {
                      value: /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi,
                      message: "email not valid",
                    }
                  })}
                  type="email"
                  autoComplete="email"
                  className="block w-full rounded-2xl border border-gray-300 bg-white/90 px-5 py-3 text-base text-gray-900 shadow-lg placeholder:text-gray-400 focus:ring-4 focus:ring-pink-200 focus:border-indigo-500 transition"
                />
                {errors.email && <p className="text-red-500 mt-1">{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-base font-semibold text-gray-700">
                  Password
                </label>
                <div className="text-sm">
                  <Link to={'/forgot-password'} className="font-semibold text-indigo-600 hover:text-pink-500 transition">
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="relative mt-1">
                <input
                  // value={}
                  placeholder="Enter your password"
                  id="password"
                  {...register('password', {
                    required: "password is required",
                  })}
                  type="password"
                  autoComplete="new-password"
                  className="block w-full rounded-2xl border border-gray-300 bg-white/90 px-5 py-3 text-base text-gray-900 shadow-lg placeholder:text-gray-400 focus:ring-4 focus:ring-indigo-200 focus:border-pink-500 transition"
                />
                {errors.password && <p className="text-red-500 mt-1">{errors.password.message}</p>}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isCheckingUser}
                className={`flex w-full justify-center rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4 py-3 text-lg font-bold text-white shadow-xl hover:from-pink-600 hover:to-indigo-600 focus:outline-none focus:ring-4 focus:ring-pink-200 transition-all duration-200 ${isCheckingUser ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
              >
                {isCheckingUser ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Logging in...
                  </span>
                ) : "Log in"}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-base text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent hover:text-pink-500 transition">
              Create
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
