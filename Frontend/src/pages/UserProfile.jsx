import { useNavigate } from "react-router-dom";
import useStateContext from "../context/useStateContext";
import defaultAvatar from "../assets/useravatar/useravatar.avif";
import HeroBanner from "../components/HeroBanner";
import { X } from "lucide-react";

export default function UserProfile() {
  const navigate = useNavigate();
  const { user } = useStateContext();

  const profileImage = user?.profile_picture || defaultAvatar;
  const userName = user?.name ;
  const userEmail = user?.email ;
  const userPhone = user?.phone || "Not provided";
  const userBio = user?.bio || "No bio added yet";

  return (
    <>
      <HeroBanner title="Profile" />
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-6 sm:py-10 overflow-y-auto">
        <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl my-6 sm:my-10 max-h-[calc(100vh-6rem)] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-gray-500">My Account</p>
              <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
            </div>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-sm font-semibold text-gray-500 hover:text-gray-900"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-red-500" />
            </button>
          </div>

          {/* Profile Content */}
          <div className="px-6 py-8 sm:px-8 space-y-8">
            {/* Profile Picture */}
            <div className="flex flex-col items-center">
              <div className="relative mb-6">
                <img
                  src={profileImage}
                  alt={userName}
                  className="h-24 w-24 sm:h-32 sm:w-32 rounded-full object-cover border-4 border-blue-100 shadow-lg"
                />
              </div>
            </div>

            {/* User Information */}
            <div className="space-y-6">
              {/* Bio */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                <p className="text-gray-600 text-base leading-relaxed bg-gray-50 rounded-lg px-4 py-3">
                  {userBio}
                </p>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <p className="text-gray-900 text-base bg-gray-50 rounded-lg px-4 py-3">
                  {userName}
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <p className="text-gray-900 text-base bg-gray-50 rounded-lg px-4 py-3 break-all">
                  {userEmail}
                </p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <p className="text-gray-900 text-base bg-gray-50 rounded-lg px-4 py-3">
                  {userPhone}
                </p>
              </div>
            </div>

            {/* Edit Profile Button */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors duration-300"
              >
                <X className="h-4 w-4 text-red-500" />
                Close
              </button>
              <button
                type="button"
                onClick={() => navigate("/profile/edit")}
                className="flex-1 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-300"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
