import React from "react";

export default function LoadMore({ onClick, loading = false, children = "Load More", className = "" }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-full hover:from-gray-800 hover:to-gray-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base font-medium ${className}`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
