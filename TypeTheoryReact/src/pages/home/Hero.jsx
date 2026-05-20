import React from "react";
import { Link } from "react-router-dom";
import blog1 from "../../assets/blog1.jpg";
import autherimg from "../../assets/useravatar/prabesh2.jpg";

const Hero = ({ oldestBlogs = [] }) => {
  const sidePosts = oldestBlogs.map((blog, index) => ({
    id: blog.id,
    slug: blog.slug,
    num: String(index + 1).padStart(2, "0"),
    category: blog.category || "General",
    title: blog.title || "Untitled",
  }));

  const handleReadLatest = (event) => {
    event.preventDefault();
    const target = document.getElementById("latest-articles");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="bg-[#f7f4ef] py-16 px-6 min-h-145 flex items-center justify-center font-sans">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        {/* Left — Content */}
        <div>
          {/* Label */}
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-px bg-amber-700 block" />
            <span className="text-[11px] font-medium tracking-[0.18em] uppercase text-amber-700">
              Featured Story
            </span>
          </div>

          {/* Title */}
          <h1 className="font-serif text-4xl font-bold leading-tight text-gray-900 mb-4">
            What Your Music Preference Says About You and Your Personality
          </h1>

          {/* Excerpt */}
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            Researchers have found surprising links between the music we love and who we are —
            from openness to experience, to how we connect with others.
          </p>

          {/* CTA */}
          <a
            href="#latest-articles"
            onClick={handleReadLatest}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 border border-gray-900 px-5 py-2.5 rounded-sm hover:bg-gray-900 hover:text-[#f7f4ef] transition-colors mb-6"
          >
            Read article →
          </a>

          {/* Author */}
          <div className="flex items-center gap-3 mb-8">
            <img
              src={autherimg}
              alt="Prabesh Acharya"
              className="w-9 h-9 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">Prabesh Acharya</p>
              <p className="text-xs text-gray-500">May 02, 2026 · 6 min read</p>
            </div>
          </div>

          {/* Side posts */}
          <div className="border-t border-[#d9d3c9]">
            {sidePosts.length === 0 && (
              <div className="py-4 text-sm text-gray-500">No articles yet.</div>
            )}
            {sidePosts.map((post) => (
              <Link
                key={`${post.num}-${post.id}`}
                to={`/blog/${post.slug || post.id}`}
                className="flex items-center gap-4 py-3.5 border-b border-[#d9d3c9] cursor-pointer group"
              >
                <span className="font-serif text-2xl font-bold text-[#d9d3c9] leading-none min-w-7">
                  {post.num}
                </span>
                <div>
                  <p className="text-[10px] font-medium tracking-[0.14em] uppercase text-amber-700 mb-1">
                    {post.category}
                  </p>
                  <p className="text-sm font-medium text-gray-900 leading-snug group-hover:underline">
                    {post.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right — Featured Image */}
        <div className="relative rounded-sm overflow-hidden aspect-4/5">
          <img
            src={blog1}
            alt="Featured Blog"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4">
            <span className="bg-[#f7f4ef] text-gray-900 text-[11px] font-medium tracking-widest uppercase px-3 py-1.5 rounded-sm">
              Music
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;