import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import logo from "../assets/logo/typetheory.png";

export default function Authlayouts() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">

      <div className="flex w-full max-w-4xl min-h-140 rounded-2xl overflow-hidden shadow-xl">

        {/* LEFT: child content (form) */}
        <div className="w-7/12 bg-white flex flex-col justify-center px-6 py-10 sm:px-10 md:px-14 md:py-14">
          <Outlet />
        </div>

        {/* RIGHT: branding / decorative panel */}
        <div className="hidden md:flex flex-col justify-between w-5/12 bg-indigo-400 p-12 relative overflow-hidden">
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-indigo-300 rounded-full opacity-40" />
          <div className="absolute top-1/3 -right-10 w-40 h-40 bg-indigo-500 rounded-full opacity-30" />

          <div className="relative z-10">
            <Link to="/" className="group inline-flex items-center">
              <div className="bg-black backdrop-blur-sm rounded-full ml-20 mb-4 border border-white/10">
                <img
                  src={logo}
                  alt="TypeTheory Logo"
                  className="h-16 sm:h-20 w-auto object-contain hover:opacity-80 transition-opacity duration-300"
                />
              </div>
            </Link>
            <h2 className="text-white font-bold text-4xl leading-snug mb-3">
              Share your ideas <br />
              with the world
            </h2>
            <p className="text-indigo-100 text-base font-semibold">
              Publish blogs, write stories,<br />
              <span className="font-normal text-indigo-200">  and build your own space
                on the internet with a clean modern platform.</span>
            </p>
          </div>

          <p className="relative z-10 text-indigo-200 text-xs">
            typetheory &copy; {new Date().getFullYear()}. All rights reserved.
          </p>
        </div>

      </div>
    </div>
  );
}
