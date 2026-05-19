import React from "react";
import bg1 from "../../assets/bg1.jpg";
import blog1 from "../../assets/blog1.jpg";
import autherimg from "../../assets/useravatar/useravatar.avif";

const Hero = () => {
  return (
    <section className="py-12 px-3 bg-gray-100">
      <div className="relative max-w-5xl mx-auto h-150 flex items-center justify-center">
        
        {/* Background Image - Wide Format */}
        <div className="absolute top-24 w-full h-100 overflow-hidden shadow-lg z-0">
          <img
            src={bg1}
            alt="Background"
            className="w-full h-full object-cover opacity-90"
          />
        </div>

        {/* Foreground Image - Tall Format (Overlapping) */}
        <div className="absolute top-5 w-210 h-140 overflow-hidden shadow-2xl z-10">
          <img
            src={blog1}
            alt="Featured Blog"
            className="w-full h-full object-cover"
          />
          
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50 z-0"></div>

          {/* Content */}
          <div className="absolute inset-0 z-11 h-full flex flex-col items-center justify-center text-center text-white p-7">
            
            <p className="text-xs font-bold tracking-[0.4em] mb-4 uppercase hover:text-blue-600">
              Music
            </p>

            <h1 className="text-3xl font-serif leading-tight mb-5 px-16 font-bold">
              What Your Music Preference Says About You and Your Personality.
            </h1>

            <div className="flex items-center gap-3 text-white text-xs">
              <img
                src={autherimg}
                alt="Author"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span>Jonathan Smith • June 02, 2018</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;