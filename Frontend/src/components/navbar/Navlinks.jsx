import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function NavbarLinks() {
  const [showDropdown, setShowDropdown] = useState(false);

  const links = [
    { name: "Home", href: "/" },
    { name: "Categories", href: "#" },
    { name: "Blog", href: "/blog" },
    { name: "Styles", href: "/styles" },
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
                <div className="absolute top-8 left-0 bg-white shadow-lg rounded-md py-3 w-40">
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
    </ul>
  );
};