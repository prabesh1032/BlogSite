import React from "react";
import { Mail, Facebook, Twitter, Instagram, Github, Linkedin } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-[#1e246d] text-gray-300 px-8 py-20">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">

                {/* LEFT SIDE */}
                <div>
                    <h2 className="text-sm tracking-[0.4em] text-white uppercase mb-6">
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
                        <a
                            href="https://www.facebook.com/pravesh.ach/"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Facebook"
                            className="hover:text-white"
                        >
                            <Facebook className="cursor-pointer" />
                        </a>
                        <a
                            href="https://x.com/PrabeshAch33319"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="X"
                            className="hover:text-white"
                        >
                            <Twitter className="cursor-pointer" />
                        </a>
                        <a
                            href="https://www.instagram.com/prabesh_ach/"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Instagram"
                            className="hover:text-white"
                        >
                            <Instagram className="cursor-pointer" />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/prabesh-acharya-8547a2321/"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="LinkedIn"
                            className="hover:text-white"
                        >
                            <Linkedin className="cursor-pointer" />
                        </a>
                        <a
                            href="https://github.com/prabesh1032"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="GitHub"
                            className="hover:text-white"
                        >
                            <Github className="cursor-pointer" />
                        </a>
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div>
                    <h2 className="text-sm tracking-[0.4em] text-white uppercase mb-6">
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