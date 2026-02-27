import React from "react";
import bg1 from "../../assets/bg1.jpg";
import blog1 from "../../assets/blog1.jpg";

const Hero = () => {
  return (
    <section className="relative bg-gray-100 py-20 overflow-hidden">
      <div className="relative max-w-6xl mx-auto">

        {/* Back Image (Layer 1) */}
        <div className="absolute -left-20 top-10 w-[85%] h-125 hidden md:block">
          <img
            src={bg1}
            alt="Background"
            className="w-full h-full object-cover opacity-30"
          />
        </div>

        {/* Main Image Card (Layer 2) */}
        <div className="relative h-150 w-full shadow-2xl">
          
          <img
            src={blog1}
            alt="Featured Blog"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60"></div>

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-6">
            
            {/* Category */}
            <p className="uppercase tracking-[0.4em] text-sm mb-6 text-gray-300">
              Music
            </p>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-serif leading-tight mb-8 max-w-4xl">
              What Your Music Preference Says About You
              and Your Personality.
            </h1>

            {/* Author */}
            <div className="flex items-center gap-4 text-gray-300">
              <img
                src="/author.jpg"
                alt="Author"
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="text-sm">
                Jonathan Smith • June 02, 2026
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;