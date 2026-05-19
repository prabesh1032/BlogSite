import React from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import AuthService from '../../services/authService';
import useStateContext from '../../context/useStateContext';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { showErrorToast, showSuccessToast } from '../../components/ShowToast';
import HeroBanner from "../../components/HeroBanner";

const formSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(20, "Name must be less than 20 characters"),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Za-z]/, "Must contain at least one letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one symbol"),

    password_confirmation: z
      .string()
      .min(8, "Confirm password is required"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"], // error shows under confirm field
  });
export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
    mode: 'onBlur', // Validate on blur
    reValidateMode: 'onChange', // Re-validate on change after first blur
  });

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const navigate = useNavigate();
  const { setUser, setToken } = useStateContext();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const submitForm = async (data) => {
    try {
      setLoading(true);
      setServerError("");

      const res = await AuthService.signup(data);

      setUser(res.user);
      setToken(res.token);
      showSuccessToast("Account created successfully");
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
        setServerError("Something went wrong");
        showErrorToast("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeroBanner title="Register" />
      <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-indigo-500 to-purple-600">

        <form
          onSubmit={handleSubmit(submitForm)}
          className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
        >
          <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

          {/* Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              {...register('name')}
              placeholder="Enter your name"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            />
            {/* error message */}
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              {...register('email')}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            />
            {/* error message */}
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register('password')}
                placeholder="Enter password"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 cursor-pointer"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {/* error message */}
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register('password_confirmation')}
                placeholder="Confirm password"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none cursor-pointer"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {/* error message */}
            {errors.password_confirmation && <p className="text-red-500 text-sm mt-1">{errors.password_confirmation.message}</p>}
          </div>

          {/* Server Error */}
          {serverError && (
            <p className="text-red-500 text-sm mb-4 text-center">
              {serverError}
            </p>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Registering..." : "Register"}
          </button>


        </form>
      </div>
    </>
  );
}