import React, { useState, useEffect } from "react";
import Navlinks from "./navlinks";
import { FaSearch } from "react-icons/fa";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo/typetheory.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

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