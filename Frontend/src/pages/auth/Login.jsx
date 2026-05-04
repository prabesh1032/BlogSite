import React from 'react';
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../../services/authService';
import useStateContext from '../../context/useStateContext';

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
      navigate("/");
    } catch (err) {
      if (err.response?.data?.errors) {
        const firstError = Object.values(err.response.data.errors)[0][0];
        setServerError(firstError);
      } else if (err.response?.data?.message) {
        setServerError(err.response.data.message);
      } else {
        setServerError("Invalid email or password");
      }
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-teal-500">

      <form
        onSubmit={handleSubmit(submitForm)}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {/* Server Error */}
        {serverError && (
          <p className="text-red-500 text-sm text-center mb-4">
            {serverError}
          </p>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
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
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Password</label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register('password', {
                required: "Password is required"
              })}
              placeholder="Enter password"
              autoComplete="current-password"
              className="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Forgot Password */}
        <div className="text-right mb-4">
          <p className="text-sm text-gray-500 cursor-pointer hover:text-blue-600">
            Forgot Password?
          </p>
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Signup Link */}
        <p className="text-sm text-center mt-4 text-gray-600">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 font-medium hover:underline">
            Sign up
          </Link>
        </p>

      </form>
    </div>
  );
}