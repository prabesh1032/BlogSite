import React from 'react'
import { Link } from 'react-router-dom'
import HeroBanner from "../components/HeroBanner"
import { Eye, Target, Trophy, Linkedin, Github, Facebook, PenLine, Zap, Image, Bookmark } from 'lucide-react'
import prabeshAvatar from '../assets/useravatar/prabesh.jpg'
import introImage from '../assets/blogimg.jpg'

const founder = {
  name: 'Prabesh Acharya',
  role: 'Founder & Developer',
  image: prabeshAvatar,
  bio: `Hi — I'm Prabesh. I build developer tools and write about code, design and product thinking. This project started as a learning playground and became a small space for creators to publish thoughtful technical writing.`,
  socials: {
    facebook: 'https://facebook.com/prabesh1032',
    linkedin: 'https://linkedin.com/in/prabesh-acharya',
    github: 'https://github.com/prabesh1032'
  }
}

const pillars = [
  {
    icon: Eye,
    label: 'Our Vision',
    color: 'text-sky-600',
    bg: 'bg-sky-50',
    border: 'border-sky-100',
    description: 'A lightweight place where practical knowledge is easy to find and share.'
  },
  {
    icon: Target,
    label: 'Our Mission',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    description: 'Make publishing approachable and reward useful, well-structured content.'
  },
  {
    icon: Trophy,
    label: 'Our Goals',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    description: 'Grow a helpful community, publish quality posts, and keep the experience fast.'
  }
]

const offerings = [
  { icon: PenLine, label: 'Markdown Editor', desc: 'Write with a clean, distraction-free editor that supports full markdown.' },
  { icon: Zap, label: 'Fast Publishing', desc: 'Go from draft to live in seconds with a streamlined publishing flow.' },
  { icon: Image, label: 'Cloudinary Uploads', desc: 'Upload and manage images client-side with Cloudinary integration.' },
  { icon: Bookmark, label: 'Bookmarks & Likes', desc: 'Let readers save posts and show appreciation with likes.' }
]

export default function About() {
  return (
    <div className="min-h-screen bg-white text-gray-900" style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap" rel="stylesheet" />

      <HeroBanner title="About Us" />

      <main className="max-w-6xl mx-auto px-6 py-20 space-y-28">

        {/* Intro */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-5">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] text-sky-600 uppercase">Who we are</span>
            <h2
              className="text-4xl md:text-5xl font-semibold leading-tight text-gray-900"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              Welcome to<br />TypeTheory
            </h2>
            <div className="w-12 h-0.5 bg-sky-500 rounded-full" />
            <p className="text-gray-500 leading-relaxed">
              We are a small platform focused on clear, practical technical writing. Our goal is to help creators publish useful content and build better developer habits.
            </p>
            <p className="text-gray-500 leading-relaxed">
              From tutorials and deep dives to short opinion pieces, TypeTheory is a place for thoughtful, well-crafted posts that respect readers' time.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-3 rounded-2xl bg-gradient-to-br from-sky-50 to-slate-100" />
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-md">
              <img
                src={introImage}
                alt="About TypeTheory"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=800&fit=crop' }}
              />
            </div>
          </div>
        </section>

        {/* Vision / Mission / Goals */}
        <section className="space-y-8">
          <div className="space-y-1">
            <span className="text-xs font-semibold tracking-[0.2em] text-sky-600 uppercase">What drives us</span>
            <h3
              className="text-3xl font-semibold text-gray-900"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              Vision, Mission & Goals
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map(({ icon: Icon, label, color, bg, border, description }) => (
              <div
                key={label}
                className={`group p-7 rounded-2xl border ${border} bg-white hover:shadow-md transition-shadow duration-300`}
              >
                <div className={`w-11 h-11 flex items-center justify-center ${bg} rounded-xl mb-5`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{label}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Founder */}
        <section className="space-y-8">
          <div className="space-y-1">
            <span className="text-xs font-semibold tracking-[0.2em] text-sky-600 uppercase">Behind the project</span>
            <h3
              className="text-3xl font-semibold text-gray-900"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              Meet the Founder
            </h3>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
              <img
                src={founder.image}
                alt={founder.name}
                className="w-24 h-24 rounded-2xl object-cover shadow-sm border border-slate-200"
                onError={(e) => { e.target.src = '/useravatar/useravatar.avif' }}
              />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h4 className="text-xl font-semibold text-gray-900">{founder.name}</h4>
                <p className="text-sm text-sky-600 font-medium">{founder.role}</p>
              </div>
              <p className="text-gray-600 leading-relaxed">{founder.bio}</p>
              <div className="flex items-center gap-4 pt-1">
                <a href={founder.socials.facebook} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-sky-600 transition-colors">
                  <Facebook className="w-4 h-4" /> Facebook
                </a>
                <a href={founder.socials.linkedin} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-sky-600 transition-colors">
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </a>
                <a href={founder.socials.github} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  <Github className="w-4 h-4" /> GitHub
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Offerings */}
        <section className="space-y-8">
          <div className="space-y-1">
            <span className="text-xs font-semibold tracking-[0.2em] text-sky-600 uppercase">Features</span>
            <h3
              className="text-3xl font-semibold text-gray-900"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              What we offer
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {offerings.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="p-6 bg-white border border-gray-100 rounded-2xl hover:border-sky-200 hover:shadow-sm transition-all duration-300 space-y-3">
                <div className="w-9 h-9 flex items-center justify-center bg-sky-50 rounded-lg">
                  <Icon className="w-4 h-4 text-sky-600" />
                </div>
                <p className="font-semibold text-sm text-gray-900">{label}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden rounded-3xl bg-gray-950 px-10 py-16 text-center space-y-6">
          <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true"
            style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #38bdf8 0%, transparent 60%), radial-gradient(circle at 75% 30%, #6366f1 0%, transparent 55%)' }} />
          <div className="relative z-10 space-y-3">
            <h3
              className="text-3xl md:text-4xl font-semibold text-white"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              Ready to start writing?
            </h3>
            <p className="text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
              Join TypeTheory and share your ideas with a community that values clarity and craft.
            </p>
          </div>
          <Link to="/mycontains/createblog" className="relative z-10 inline-flex cursor-pointer">
            <button type="button" className="inline-flex items-center gap-2 px-7 py-3 bg-white text-gray-950 rounded-full text-sm font-semibold hover:bg-sky-50 transition-colors duration-200 shadow-sm cursor-pointer">
              <PenLine className="w-4 h-4" />
              Start Writing
            </button>
          </Link>
        </section>

      </main>
    </div>
  )
}