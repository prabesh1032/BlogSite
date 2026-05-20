import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useStateContext from "../context/useStateContext";
import AuthService from "../services/authService";
import defaultAvatar from "../assets/useravatar/useravatar.avif";
import { showErrorToast, showSuccessToast } from "../components/ShowToast";
import HeroBanner from "../components/HeroBanner";
import { Camera, X } from "lucide-react";

export default function EditProfile() {
  const navigate = useNavigate();
  const { user, setUser } = useStateContext();
  const [preview, setPreview] = useState(user?.profile_picture || defaultAvatar);
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      bio: user?.bio || "",
      profile_pic: null,
    },
  });

  const handleImageChange = (event) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setValue("profile_pic", file, { shouldValidate: true, shouldDirty: true });
      clearErrors("profile_pic");
    }
  };

  const onSubmit = async (data) => {
    try {
      setServerError("");
      setIsSubmitting(true);

      const payload = new FormData();
      payload.append("name", data.name);
      payload.append("phone", data.phone);
      payload.append("bio", data.bio);

      if (data.profile_pic instanceof File) {
        payload.append("profile_pic", data.profile_pic);
      }

      await AuthService.updateProfile(payload);

      // Refresh current user + profile from server and merge into client user
      try {
        const me = await AuthService.getUserProfile();
        const newUser = me.user || {};
        if (me.profile) {
          // map profile fields to top-level user keys used by the UI
          newUser.phone = me.profile.phone ?? newUser.phone;
          newUser.bio = me.profile.bio ?? newUser.bio;
          newUser.profile_picture = me.profile.profile_pic
            ? `${import.meta.env.VITE_APP_API_BASE_URL}/storage/${me.profile.profile_pic}`
            : newUser.profile_picture;
        }
        setUser(newUser);
      } catch {
        // fallback: if refresh fails, leave existing user
      }

      showSuccessToast("Profile updated successfully");
      // Navigate back to profile page
      navigate("/profile");
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update profile";
      setServerError(message);
      showErrorToast(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <HeroBanner title="Edit Profile" />
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-6 sm:py-10 overflow-y-auto">
        <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl my-6 sm:my-10 max-h-[calc(100vh-6rem)] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-gray-500">My Account</p>
              <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
            </div>
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="text-sm font-semibold text-gray-500 hover:text-gray-900 cursor-pointer"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-red-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-6 py-6 sm:px-8">
            {serverError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {serverError}
              </div>
            )}

            {/* Profile Picture Upload */}
            <div className="flex flex-col items-center space-y-3">
              <div className="relative">
                <img
                  src={preview}
                  alt="Profile preview"
                  className="h-24 w-24 sm:h-32 sm:w-32 rounded-full object-cover border-4 border-blue-100 shadow-lg"
                />
                <input
                  id="profile-image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="profile-image-input"
                  className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md cursor-pointer"
                  aria-label="Change profile picture"
                >
                  <Camera className="h-4 w-4 text-gray-700" />
                </label>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
            </div>

            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                {...register("name", {
                  required: "Name is required",
                  minLength: { value: 2, message: "Name must be at least 2 characters" },
                })}
                placeholder="Enter your full name"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                {...register("phone")}
                placeholder="Enter your phone number"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>

            {/* Bio Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                {...register("bio")}
                placeholder="Tell us about yourself..."
                rows="4"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />
              {errors.bio && (
                <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="flex-1 px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors duration-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-300 disabled:bg-blue-400 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
