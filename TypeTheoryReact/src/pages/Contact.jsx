import React, { useState } from 'react'
import HeroBanner from "../components/HeroBanner";
import { MapPin, Mail as MailIcon, CheckCircle, MessageCircle, PhoneCall, Instagram, Facebook, Twitter, Github, Linkedin } from 'lucide-react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(null) // null | 'loading' | 'success' | 'error'

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required.'
    if (!form.email.trim()) e.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email.'
    if (!form.message.trim()) e.message = 'Message cannot be empty.'
    return e
  }

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors(prev => ({ ...prev, [e.target.name]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const eObj = validate()
    if (Object.keys(eObj).length) { setErrors(eObj); return }

    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error('Network response was not ok')

      setStatus('success')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-900" style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap" rel="stylesheet" />

      <HeroBanner title="Contact" />

      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* Top contact cards */}
       <section className="mb-12 space-y-6">
  <p className=" text-sm text-extrabold text-center max-w-xl mx-auto" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
    Have a question, suggestion, or just want to say hello? We'd love to hear from you! Fill out the form below or reach out through any of our contact channels.
  </p>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {[
      {
        icon: <MailIcon className="w-5 h-5" />,
        label: "Email us",
        value: "noreply.inklight@gmail.com",
        action: "Send email",
        href: "mailto:noreply.inklight@gmail.com",
        bg: "bg-blue-50",
        color: "text-blue-600",
        link: "text-blue-600",
      },
      {
        icon: <PhoneCall className="w-5 h-5" />,
        label: "Call us",
        value: "+977 9812965110",
        action: "Call now",
        href: "tel:+9779812965110",
        bg: "bg-emerald-50",
        color: "text-emerald-600",
        link: "text-emerald-600",
      },
      {
        icon: <MapPin className="w-5 h-5" />,
        label: "Visit us",
        value: "Kathmandu, Nepal",
        action: "View on map",
        href: "https://maps.google.com/?q=Kathmandu,Nepal",
        bg: "bg-orange-50",
        color: "text-orange-600",
        link: "text-orange-600",
      },
    ].map((item) => (
      <div key={item.label} className="bg-white border border-gray-100 rounded-xl p-6 flex flex-col gap-3">
        <div className={`w-11 h-11 rounded-lg ${item.bg} ${item.color} flex items-center justify-center`}>
          {item.icon}
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{item.label}</h4>
          <p className="text-sm text-gray-500 mt-1 break-all">{item.value}</p>
        </div>
        <a
          href={item.href}
          target="_blank"
          rel="noreferrer"
          className={`mt-auto text-sm ${item.link} flex items-center gap-1 hover:underline`}
        >
          {item.action} →
        </a>
      </div>
    ))}
  </div>
</section>

        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white shadow rounded p-8">
            <div className="space-y-1 mb-6">
              <span className="text-xs font-semibold tracking-[0.2em] text-sky-600 uppercase">
                Your Library
              </span>
              <h3
                className="text-3xl font-semibold text-gray-900"
                style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
              >
                Personal Writing Collection
              </h3>
            </div>

            {status === 'success' && (
              <div className="mb-4 p-3 rounded bg-green-50 text-green-800 border border-green-100">Thanks — your message was sent.</div>
            )}
            {status === 'error' && (
              <div className="mb-4 p-3 rounded bg-red-50 text-red-800 border border-red-100">Something went wrong. Please try again later.</div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Name</label>
                  <input name="name" value={form.name} onChange={handleChange}
                    className={`w-full border rounded px-3 py-2 text-gray-800 text-sm placeholder-gray-400 outline-none transition ${errors.name ? 'border-red-400' : 'border-gray-200'}`} />
                  {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Email</label>
                  <input name="email" value={form.email} onChange={handleChange} type="email"
                    className={`w-full border rounded px-3 py-2 text-gray-800 text-sm placeholder-gray-400 outline-none transition ${errors.email ? 'border-red-400' : 'border-gray-200'}`} />
                  {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Subject</label>
                <input name="subject" value={form.subject} onChange={handleChange}
                  className="w-full border rounded px-3 py-2 text-gray-800 text-sm placeholder-gray-400 outline-none transition border-gray-200" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Message</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={6}
                  className={`w-full border rounded px-3 py-2 text-gray-800 text-sm placeholder-gray-400 outline-none transition ${errors.message ? 'border-red-400' : 'border-gray-200'} resize-none`} />
                {errors.message && <p className="text-xs text-red-400 mt-1">{errors.message}</p>}
              </div>

              <div className="mt-2">
                <button type="submit" disabled={status === 'loading'}
                  className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-semibold py-3 rounded-lg text-sm transition disabled:opacity-60">
                  {status === 'loading' ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>

          {/* Right column: Why Contact, Connect */}
          <aside className="space-y-6">
            <div className="bg-white shadow rounded p-6">
              <div className="space-y-1 mb-4">
                <span className="text-xs font-semibold tracking-[0.2em] text-sky-600 uppercase">
                  Why reach out
                </span>
                <h3
                  className="text-3xl font-semibold text-gray-900"
                  style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                >
                  Why Contact Us?
                </h3>
              </div>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-sky-600 mt-1" />
                  <div>
                    <div className="font-medium">Quick Response</div>
                    <div className="text-gray-500">We typically respond within 24 hours.</div>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-sky-600 mt-1" />
                  <div>
                    <div className="font-medium">Expert Support</div>
                    <div className="text-gray-500">Our team is here to help with any questions.</div>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-sky-400 mt-1" />
                  <div>
                    <div className="font-medium">Community Focused</div>
                    <div className="text-gray-500">We value your feedback and suggestions.</div>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-sky-300 mt-1" />
                  <div>
                    <div className="font-medium">Privacy Protected</div>
                    <div className="text-gray-500">Your information is safe and secure with us.</div>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-white shadow rounded p-4">
              <div className="space-y-2 mb-3">
                <span className="inline-block text-xs font-semibold tracking-[0.2em] text-sky-600 uppercase">Connect</span>
                <h4
                  className="text-xl font-semibold text-gray-900"
                  style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                >
                  Connect With Us
                </h4>
                <div className="w-10 h-0.5 bg-sky-500 rounded-full" />
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.facebook.com/pravesh.ach/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="facebook"
                  className="p-2 rounded bg-gray-100 hover:bg-gray-200"
                >
                  <Facebook className="w-5 h-5 text-gray-700" />
                </a>
                <a
                  href="https://x.com/PrabeshAch33319"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="twitter"
                  className="p-2 rounded bg-gray-100 hover:bg-gray-200"
                >
                  <Twitter className="w-5 h-5 text-gray-700" />
                </a>
                <a
                  href="https://www.instagram.com/prabesh_ach/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="instagram"
                  className="p-2 rounded bg-gray-100 hover:bg-gray-200"
                >
                  <Instagram className="w-5 h-5 text-gray-700" />
                </a>
                <a
                  href="https://www.linkedin.com/in/prabesh-acharya-8547a2321/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="linkedin"
                  className="p-2 rounded bg-gray-100 hover:bg-gray-200"
                >
                  <Linkedin className="w-5 h-5 text-gray-700" />
                </a>
                <a
                  href="https://github.com/prabesh1032"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="github"
                  className="p-2 rounded bg-gray-100 hover:bg-gray-200"
                >
                  <Github className="w-5 h-5 text-gray-700" />
                </a>
              </div>
            </div>
          </aside>
        </div>

        {/* FAQ Section */}
        <section className="mt-16">
          <div className="text-center space-y-1 mb-8">
            <span className="text-xs font-semibold tracking-[0.2em] text-sky-600 uppercase">FAQs</span>
            <h3
              className="text-3xl font-semibold text-gray-900"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              Frequently Asked Questions
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-white border border-gray-100 rounded-2xl hover:border-sky-200 hover:shadow-sm transition-all duration-300 space-y-4">
              <div className="w-11 h-11 flex items-center justify-center bg-sky-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-sky-600" />
              </div>
              <p className="font-semibold text-base text-gray-900">How do I create an account?</p>
              <p className="text-sm text-gray-500 leading-relaxed">Click the "Sign up" button in the navigation bar and fill in your details. You'll receive a verification email to activate your account.</p>
            </div>

            <div className="p-8 bg-white border border-gray-100 rounded-2xl hover:border-sky-200 hover:shadow-sm transition-all duration-300 space-y-4">
              <div className="w-11 h-11 flex items-center justify-center bg-sky-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-sky-600" />
              </div>
              <p className="font-semibold text-base text-gray-900">Can I publish my blog for free?</p>
              <p className="text-sm text-gray-500 leading-relaxed">Yes! Our platform is completely free to use. Create and publish as many blogs as you want without any charges.</p>
            </div>

            <div className="p-8 bg-white border border-gray-100 rounded-2xl hover:border-sky-200 hover:shadow-sm transition-all duration-300 space-y-4">
              <div className="w-11 h-11 flex items-center justify-center bg-sky-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-sky-600" />
              </div>
              <p className="font-semibold text-base text-gray-900">How long does it take to get a response?</p>
              <p className="text-sm text-gray-500 leading-relaxed">We aim to respond to all inquiries within 24 hours during business days. Urgent matters are prioritized.</p>
            </div>

            <div className="p-8 bg-white border border-gray-100 rounded-2xl hover:border-sky-200 hover:shadow-sm transition-all duration-300 space-y-4">
              <div className="w-11 h-11 flex items-center justify-center bg-sky-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-sky-600" />
              </div>
              <p className="font-semibold text-base text-gray-900">Do you offer technical support?</p>
              <p className="text-sm text-gray-500 leading-relaxed">Yes! Our support team is available to help with any technical issues you may have about using the platform.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

