import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/axios";
import BlogService from "../services/blogService";
import useStateContext from "../context/useStateContext";
import { showErrorToast, showSuccessToast } from "../components/ShowToast";
import { ArrowLeft, Bookmark, Clock, Edit3, Heart, Link, Trash2 } from "lucide-react";

const fallbackImage =
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&h=900&fit=crop";

const getBlogImageUrl = (image) => {
  if (!image) return fallbackImage;
  if (
    image.startsWith("http") ||
    image.startsWith("blob:") ||
    image.startsWith("data:")
  )
    return image;
  return `${import.meta.env.VITE_APP_API_BASE_URL}/storage/${image}`;
};

const estimateReadTime = (text = "") => {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
};

export default function ViewBlog() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, token, setUser } = useStateContext();

  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [copied, setCopied] = useState(false);
  const [likedBlogs, setLikedBlogs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("HOME_BLOG_LIKES") || "{}");
    } catch {
      return {};
    }
  });
  const [bookmarkedBlogs, setBookmarkedBlogs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("HOME_BLOG_BOOKMARKS") || "{}");
    } catch {
      return {};
    }
  });

  const blogOwnerId = blog?.user?.id;
  const currentUserId = user?.id;
  const isOwner = Boolean(
    token &&
      blogOwnerId &&
      currentUserId &&
      Number(blogOwnerId) === Number(currentUserId)
  );

  const imageUrl = useMemo(() => getBlogImageUrl(blog?.image), [blog?.image]);

  useEffect(() => {
    localStorage.setItem("HOME_BLOG_LIKES", JSON.stringify(likedBlogs));
  }, [likedBlogs]);

  useEffect(() => {
    localStorage.setItem("HOME_BLOG_BOOKMARKS", JSON.stringify(bookmarkedBlogs));
  }, [bookmarkedBlogs]);

  useEffect(() => {
    let isMounted = true;
    const loadBlog = async () => {
      try {
        setError("");
        setActionError("");
        setIsLoading(true);
        const data = await BlogService.getBlog(slug);
        if (isMounted) setBlog(data?.blog || null);
        if (!user?.id && token) {
          const meResponse = await api.get("/user");
          if (isMounted) setUser(meResponse.data);
        }
      } catch (err) {
        const message =
          err?.response?.data?.message || err?.message || "Failed to load blog";
        if (isMounted) setError(message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadBlog();
    return () => { isMounted = false; };
  }, [slug, token, user?.id, setUser]);

  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this blog?");
    if (!confirmed || !blog?.id) return;
    try {
      setActionError("");
      await BlogService.deleteBlog(blog.id);
      showSuccessToast("Blog deleted successfully");
      navigate("/mycontains");
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Failed to delete blog";
      setActionError(message);
      showErrorToast(message);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleLike = () => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (!blog?.id) return;
    setLikedBlogs((current) => ({
      ...current,
      [blog.id]: !current[blog.id],
    }));
  };

  const toggleBookmark = () => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (!blog?.id) return;
    setBookmarkedBlogs((current) => ({
      ...current,
      [blog.id]: !current[blog.id],
    }));
  };

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-4 border-gray-200 border-t-gray-800 animate-spin" />
          <p className="text-sm text-gray-400">Loading article...</p>
        </div>
      </div>
    );
  }

  /* ── Error / not found ── */
  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center bg-white border border-red-100 rounded-2xl p-10 shadow-sm">
          <Trash2 className="w-8 h-8 text-red-400 mx-auto mb-4" />
          <h1 className="font-serif text-2xl font-bold text-gray-900 mb-2">
            Article not found
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            {error || "This article could not be loaded."}
          </p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="bg-gray-900 text-white rounded-full px-6 py-2.5 text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer"
          >
            Go home
          </button>
        </div>
      </div>
    );
  }

  const descriptionLines = String(blog.description || "")
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);

  const readTime = estimateReadTime(blog.description || "");

  /* ── Author initials ── */
  const initials = (blog.user?.name || "A")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const isLiked = Boolean(blog?.id && likedBlogs[blog.id]);
  const isBookmarked = Boolean(blog?.id && bookmarkedBlogs[blog.id]);

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap" rel="stylesheet" />
      {/* ── Article ── */}
      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Meta row */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <span className="text-xs font-medium tracking-widest uppercase bg-sky-50 text-sky-600 px-3 py-1 rounded-full">
            {blog.category || "Blog"}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <Clock className="w-3.5 h-3.5" />
            {readTime} min read
          </span>
        </div>

        {/* Title */}
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold leading-tight tracking-tight text-gray-900 mb-6">
          {blog.title}
        </h1>
        {isOwner && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate("/mycontains/editblog", { state: { blog } })}
              className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer"
            >
              Edit Blog
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 cursor-pointer"
            >
              Delete Blog
            </button>
          </div>
        )}

        {/* Author + share row */}
        <div className="flex items-center justify-between gap-4 py-4 border-t border-b border-gray-200 mb-8 flex-wrap">
          <div className="flex items-center gap-3">
            {blog.user?.profile?.profile_pic ? (
              <img
                src={getBlogImageUrl(blog.user.profile.profile_pic)}
                alt={blog.user?.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-700 flex-shrink-0">
                {initials}
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-900">
                {blog.user?.name || "Author"}
              </p>
              <p className="text-xs text-gray-400">{formatDate(blog.created_at)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleLike}
              aria-label="Like"
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer bg-white ${
                isLiked
                  ? "border-rose-200 text-rose-600 bg-rose-50"
                  : "border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-400"
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={toggleBookmark}
              aria-label="Bookmark"
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer bg-white ${
                isBookmarked
                  ? "border-sky-200 text-sky-600 bg-sky-50"
                  : "border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-400"
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleCopyLink}
              aria-label="Copy link"
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-400 transition-all cursor-pointer bg-white"
            >
              <Link className="w-3.5 h-3.5" />
            </button>
            {copied && (
              <span className="text-xs text-green-600 font-medium">Copied!</span>
            )}
          </div>
        </div>

        {/* Action error */}
        {actionError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {actionError}
          </div>
        )}

        {/* Hero image */}
        <div className="mb-8 rounded-2xl overflow-hidden border border-gray-100 bg-white">
          <img
            src={imageUrl}
            alt={blog.title}
            className="w-full h-auto max-h-[32rem] object-contain bg-gray-50"
          />
        </div>

        {/* Body */}
        <div className="space-y-6">
          {descriptionLines.length > 0 ? (
            descriptionLines.map((line, i) => (
              <p
                key={i}
                className={`leading-relaxed text-gray-600 font-light text-[1.05rem] ${
                  i === 0
                    ? "first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:leading-[0.85] first-letter:mr-2.5 first-letter:mt-1 first-letter:text-gray-900"
                    : ""
                }`}
              >
                {line}
              </p>
            ))
          ) : (
            <p className="text-gray-400 italic">No description available.</p>
          )}
        </div>

        {/* Footer tags */}
        {blog.category && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">
              Tagged in
            </p>
            <div className="flex flex-wrap gap-2">
              {[blog.category, "Writing", "Type Theory"].map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-500 bg-white"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}