/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useStateContext from "../../context/useStateContext";
import AuthService from "../../services/authService";

export default function Navlinks() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const { token, setUser, setToken } = useStateContext();
  const navigate = useNavigate();

  const links = [
    { name: "Home", href: "/" },
    { name: "Categories", href: "/category" },
    { name: "Blog", href: "/blog" },
    ...(token ? [{ name: "My Contain", href: "/mycontain" }] : []),
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const categories = [
    "Technology",
    "Travel",
    "Lifestyle",
    "Business",
    "Food",
  ];

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await AuthService.logout();
    } catch (err) {
      // Ignore logout errors;
    } finally {
      setToken(null);
      setUser({});
      setLoggingOut(false);
      navigate("/");
    }
  };

  return (
    <ul className="flex space-x-8 text-gray-700 font-medium relative">
      {links.map((link) => (
        <li key={link.name} className="relative">
          
          {/* Normal Links */}
          {link.name !== "Categories" && (
            <a
              href={link.href}
              className="hover:text-black cursor-pointer"
            >
              {link.name}
            </a>
          )}

          {/* Categories with Dropdown */}
          {link.name === "Categories" && (
            <>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center hover:text-black"
              >
                {link.name}
                <ChevronDown size={16} className="ml-1" />
              </button>

              {showDropdown && (
                <div className="absolute top-8 left-0 z-12 bg-white shadow-lg rounded-md py-3 w-40">
                  {categories.map((category) => (
                    <div
                      key={category}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {category}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </li>
      ))}

      {token ? (
        <li className="relative">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="hover:text-black disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </li>
      ) : (
        <li className="relative">
          <Link to="/login" className="hover:text-black cursor-pointer">
            Login
          </Link>
        </li>
      )}
    </ul>
  );
};