/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useStateContext from "../../context/useStateContext";
import AuthService from "../../services/authService";
import { categories } from "../../constants/categories";

export default function Navlinks({ isMobile = false, onNavigate }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const { token, setUser, setToken, user } = useStateContext();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const links = [
    { name: "Categories", href: "/category" },
    ...(token ? [{ name: "My Content", href: "/mycontains" }] : []),
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const slugifyCategory = (value) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await AuthService.logout();
    } catch (err) {
      // Ignore logout errors
    } finally {
      setToken(null);
      setUser({});
      setLoggingOut(false);
      navigate("/");
      if (onNavigate) onNavigate();
    }
  };

  const isActive = (href) => location.pathname === href;

  const linkClasses = (href) => `
    inline-flex items-center transition-all duration-300 text-base sm:text-lg px-2 py-1
    ${isActive(href)
      ? "text-gray-900 font-semibold"
      : "text-gray-600 hover:text-gray-900"
    }
  `;

  const listClass = isMobile
    ? "flex flex-col gap-4 text-gray-700"
    : "flex items-center space-x-6 text-gray-700";

  const dropdownClass = isMobile
    ? "mt-2 ml-4 w-[calc(100%-1rem)] rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden"
    : "absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[280px] z-50 animate-fadeIn";

  return (
    <ul className={listClass}>
      {links.map((link) => {
        const isCategories = link.name === "Categories";
        
        return (
          <li key={link.name} className="relative">
            {!isCategories && (
              <Link
                to={link.href}
                onClick={onNavigate}
                className={linkClasses(link.href)}
              >
                <span>{link.name}</span>
              </Link>
            )}

            {isCategories && (
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={`inline-flex items-center gap-2 transition-all duration-300 ${
                    showDropdown ? "text-gray-900" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <span className="text-base sm:text-lg cursor-pointer">Categories</span>
                  <span
                    className={`text-xs transition-transform duration-300 ${
                      showDropdown ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  >
                    ▼
                  </span>
                </button>

                {showDropdown && (
                  <div className={dropdownClass}>
                    <div className="max-h-96 overflow-y-auto scroll-smooth py-1">
                      {categories.map((category) => (
                        <Link
                          key={category}
                          to={`/category/${slugifyCategory(category)}`}
                          onClick={() => {
                            setShowDropdown(false);
                            if (onNavigate) onNavigate();
                          }}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-linear-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200"
                        >
                          {category}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </li>
        );
      })}

      {/* Auth Button */}
      {isMobile && (
        <li className="mt-2 pt-2 border-t border-gray-100">
          {token ? (
            <div className="relative group">
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="inline-flex items-center px-5 py-2.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-300 disabled:opacity-60 text-base"
              >
                <span className="font-medium">
                  {loggingOut ? "Logging out..." : "Logout"}
                </span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={onNavigate}
              className="inline-flex items-center px-5 py-2.5 rounded-lg bg-linear-to-r from-gray-900 to-gray-800 text-white hover:from-gray-800 hover:to-gray-700 transition-all duration-300 shadow-md hover:shadow-lg text-base"
            >
              <span className="font-medium">Login</span>
            </Link>
          )}
        </li>
      )}
    </ul>
  );
}