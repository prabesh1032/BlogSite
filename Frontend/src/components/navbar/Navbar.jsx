import React from "react";
import Navlinks from "./navlinks";
import { FaSearch } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="w-full px-8 py-4 flex items-center justify-between shadow-sm">
      {/* Logo */}
      <div className="text-2xl font-bold text-black">TypeTheory</div>

      {/* Links */}
      <div className="hidden md:flex items-center space-x-8">
        <Navlinks />
      </div>

      {/* Search Icon */}
      <div className="flex items-center cursor-pointer text-gray-700 hover:text-black">
        <span className="mr-1 font-medium">Search</span>
        <FaSearch />
      </div>
    </nav>
  );
};