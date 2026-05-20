import React, { useState, useEffect } from "react";
import Navlinks from "./navlinks";
import { FaSearch } from "react-icons/fa";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo/typetheory.png";
import avatar from "../../assets/useravatar/useravatar.avif";
import useStateContext from "../../context/useStateContext";
import AuthService from "../../services/authService";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { token, user, setUser, setToken } = useStateContext();

  const profileLinks = [
    { name: "Profile", href: "/profile" },
    { name: "Bookmarked", href: "/bookmarked" },
    { name: "Liked", href: "/liked" },
  ];

  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch {
      // ignore logout errors and clear local state anyway
    } finally {
      setUser({});
      setToken(null);
      localStorage.removeItem("HOME_BLOG_LIKES");
      localStorage.removeItem("HOME_BLOG_BOOKMARKS");
      navigate("/");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`w-full px-4 sm:px-6 lg:px-8 py-1 sm:py-2 transition-all duration-300 sticky top-0 z-50 ${
      scrolled 
        ? "bg-white/95 backdrop-blur-md shadow-lg" 
        : "bg-white shadow-sm"
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="group flex items-center">
            <div className="bg-black rounded-full p-1">
              <img 
                src={logo} 
                alt="TypeTheory Logo" 
                className="h-16 sm:h-20 w-auto object-contain hover:opacity-80 transition-opacity duration-300" 
              />
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-10 lg:space-x-12">
            <Navlinks />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Search Button */}
            <button className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-all duration-300">
              <span className="hidden sm:inline text-base font-medium text-gray-600 group-hover:text-gray-900">
                Search
              </span>
              <FaSearch className="text-gray-500 group-hover:text-gray-900 transition-colors w-4 h-4" />
            </button>

            {token ? (
              <div className="relative hidden md:block group">
                <button
                  type="button"
                  className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-white shadow-sm transition-transform duration-300 group-hover:scale-105"
                  aria-label="Open profile menu"
                >
                  <img
                    src={user?.profile_picture || avatar}
                    alt={user?.name || "User avatar"}
                    className="h-full w-full object-cover"
                  />
                </button>

                <div className="absolute right-0 top-full mt-3 w-44 overflow-hidden rounded-2xl border border-gray-100 bg-white py-2 shadow-xl opacity-0 invisible translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 z-50">
                  {profileLinks.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
                    >
                      {item.name}
                    </Link>
                  ))}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full px-4 py-3 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:inline-flex items-center justify-center h-12 rounded-full bg-gray-900 px-5 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-300"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <X size={22} className="text-gray-700" />
              ) : (
                <Menu size={22} className="text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            menuOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-gray-100 pt-4 pb-2">
            <Navlinks isMobile onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      </div>
    </nav>
  );
}