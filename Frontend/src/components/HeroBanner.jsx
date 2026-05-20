import React from "react";
import banner from "../assets/banner/banner.png";

export default function HeroBanner({
  title = "My Blog",
}) {
  return (
    <section className="relative border-b border-gray-200">
      <div className="relative w-full h-64 md:h-72 overflow-hidden">

        {/* Banner Image */}
        <img
          src={banner}
          alt={title}
          className="w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="chalk-text text-white text-3xl md:text-4xl lg:text-5xl font-semibold text-center px-16">
            {title}
          </h1>
        </div>

      </div>
    </section>
  );
}