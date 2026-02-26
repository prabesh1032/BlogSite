import React from "react";
import { Mail, Facebook, Twitter, Instagram, Youtube, Pin } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-[#1e246d] text-gray-300 px-8 py-20">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">

                {/* LEFT SIDE */}
                <div>
                    <h2 className="text-sm tracking-[0.3em] text-white uppercase mb-6">
                        About TypeTheory
                    </h2>

                    <div className="w-12 h-px bg-gray-500 mb-6"></div>

                    <p className="leading-8 text-gray-400">
                        TypeTheory is a space where ideas turn into stories. We share insights on
                        technology, lifestyle, creativity, and personal growth to inspire curious
                        minds. Our goal is to deliver thoughtful content that informs, motivates,
                        and adds value to everyday life.
                    </p>

                    {/* Social Icons */}
                    <div className="flex gap-6 mt-10">
                        <Facebook className="cursor-pointer hover:text-white" />
                        <Twitter className="cursor-pointer hover:text-white" />
                        <Instagram className="cursor-pointer hover:text-white" />
                        <Youtube className="cursor-pointer hover:text-white" />
                        <Pin className="cursor-pointer hover:text-white" />
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div>
                    <h2 className="text-sm tracking-[0.3em] text-white uppercase mb-6">
                        Our Newsletter
                    </h2>

                    <div className="w-12 h-px bg-gray-500 mb-6"></div>

                    <p className="leading-8 text-gray-400 mb-8">
                        Subscribe to our newsletter and get the latest articles, insights, and
                        updates delivered straight to your inbox. No spam — just quality content.
                    </p>

                    {/* Newsletter Input */}
                    <div className="flex">
                        <div className="flex items-center bg-[#141a57] px-4 w-full">
                            <Mail className="text-gray-400 mr-3" size={18} />
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="bg-transparent w-full py-4 outline-none text-white placeholder-gray-400"
                            />
                        </div>

                        <button className="bg-black text-white px-8 tracking-[0.3em] text-sm">
                            SEND
                        </button>
                    </div>

                    <p className="mt-10 text-gray-400">
                        © {new Date().getFullYear()} TypeTheory. All rights reserved.
                        Built with ❤️ by Prabesh Acharya.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;