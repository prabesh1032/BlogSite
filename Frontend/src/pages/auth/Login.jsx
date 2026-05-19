import React from 'react';
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../../services/authService';
import useStateContext from '../../context/useStateContext';
import { showErrorToast, showSuccessToast } from '../../components/ShowToast';
import logo from "../../assets/logo/typetheory.png";
export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: "onBlur",
  });

  const navigate = useNavigate();
  const { setUser, setToken } = useStateContext();

  const [showPassword, setShowPassword] = React.useState(false);
  const [serverError, setServerError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const submitForm = async (data) => {
    try {
      setLoading(true);
      setServerError("");
      const res = await AuthService.login(data);
      setUser(res.user);
      setToken(res.token);
      showSuccessToast("Logged in successfully");
      navigate("/");
    } catch (err) {
      if (err.response?.data?.errors) {
        const firstError = Object.values(err.response.data.errors)[0][0];
        setServerError(firstError);
        showErrorToast(firstError);
      } else if (err.response?.data?.message) {
        setServerError(err.response.data.message);
        showErrorToast(err.response.data.message);
      } else {
        setServerError("Invalid email or password");
        showErrorToast("Invalid email or password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">

      {/* Card */}
      <div className="flex w-full max-w-4xl min-h-[560px] rounded-2xl overflow-hidden shadow-xl">

        {/* LEFT PANEL */}
        <div className="hidden md:flex flex-col justify-between w-5/12 bg-indigo-400 p-12 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-indigo-300 rounded-full opacity-40" />
          <div className="absolute top-1/3 -right-10 w-40 h-40 bg-indigo-500 rounded-full opacity-30" />

          {/* Brand / tagline */}
          <div className="relative z-10">
            <Link to="/" className="group inline-flex items-center">
      <div className="bg-black backdrop-blur-sm rounded-full ml-20 mb-4 border border-white/10">
        <img
          src={logo}
          alt="TypeTheory Logo"
          className="h-16 sm:h-20 w-auto object-contain hover:opacity-80 transition-opacity duration-300"
        />
      </div>
    </Link>
            <h2 className="text-white font-bold text-4xl leading-snug mb-3">
             Share your ideas <br />
               with the world
            </h2>
            <p className="text-indigo-100 text-base font-semibold">
              Publish blogs, write stories,<br />
              <span className="font-normal text-indigo-200">  and build your own space
      on the internet with a clean modern platform.</span>
            </p>
          </div>

          <p className="relative z-10 text-indigo-200 text-xs">
            typetheory &copy; {new Date().getFullYear()}. All rights reserved.
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 bg-white flex flex-col justify-center px-14 py-14">

          <h3 className="text-gray-800 font-bold text-3xl mb-2">Sign-in</h3>
          <p className="text-gray-400 text-sm mb-10">Welcome back! Please enter your details.</p>

          {/* Server Error */}
          {serverError && (
            <p className="text-red-500 text-sm text-center mb-5 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
              {serverError}
            </p>
          )}

          <form onSubmit={handleSubmit(submitForm)} className="space-y-6">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Email</label>
              <input
                type="email"
                {...register('email', {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address"
                  }
                })}
                placeholder="Enter your email"
                autoComplete="email"
                className={`w-full border-b ${errors.email ? 'border-red-400' : 'border-gray-200'} py-2.5 text-gray-800 text-sm placeholder-gray-300 outline-none transition focus:border-indigo-400 bg-transparent`}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Password(s)</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register('password', {
                    required: "Password is required"
                  })}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  className={`w-full border-b ${errors.password ? 'border-red-400' : 'border-gray-200'} py-2.5 pr-10 text-gray-800 text-sm placeholder-gray-300 outline-none transition focus:border-indigo-400 bg-transparent`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-right -mt-2">
              <p className="text-sm text-gray-400 cursor-pointer hover:text-indigo-500 transition inline">
                Forgot Password?
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-lg text-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Logging in...
                </span>
              ) : "Login"}
            </button>

            {/* Sign up */}
            <p className="text-center text-sm text-gray-400">
              Don't have an account?{" "}
              <Link to="/register" className="text-indigo-500 font-medium hover:underline">
                Signup Here
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}