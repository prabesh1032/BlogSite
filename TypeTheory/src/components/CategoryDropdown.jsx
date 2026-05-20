import { useEffect, useRef, useState } from "react";

export default function CategoryDropdown({
  label,
  value,
  onChange,
  options = [],
  error,
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedValue = value || options[0] || "";

  return (
    <div ref={dropdownRef} className="relative">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="mt-2 flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2 text-left focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        <span className={selectedValue ? "text-gray-900" : "text-gray-400"}>
          {selectedValue || "Choose a category"}
        </span>
        <span className={`ml-3 text-xs transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-xl">
          <div className="max-h-56 overflow-y-auto py-1">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className={`block w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-gray-100 ${
                  option === selectedValue ? "bg-indigo-50 text-indigo-700" : "text-gray-700"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}