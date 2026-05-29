import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/axios";
import BlogService from "../services/blogService";
import useStateContext from "../context/useStateContext";
import { showErrorToast, showSuccessToast } from "../components/ShowToast";
import DeleteModal from "../components/DeleteModal";
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

export default function ViewBlog() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, token, setUser } = useStateContext();

  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
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
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
    if (!blog?.id) return;
    try {
      setActionError("");
      setIsDeleting(true);
      await BlogService.deleteBlog(blog.id);
      showSuccessToast("Blog deleted successfully");
      navigate("/mycontains");
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Failed to delete blog";
      setActionError(message);
      showErrorToast(message);
    } finally {
      setIsDeleting(false);
      setIsDeleteOpen(false);
    }
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

  const descriptionHtml = String(blog.description || "");
  const descriptionText = descriptionHtml
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const hasDescription = descriptionText.length > 0;

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
<div className="mb-4">
  <span className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
    {blog.category || "Blog"}
  </span>
</div>

{/* Title + Action Buttons */}
<div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-start lg:justify-between">
  
  {/* Title */}
  <h1 className="font-serif text-3xl sm:text-4xl font-semibold leading-tight tracking-tight text-gray-900 max-w-3xl">
    {blog.title}
  </h1>

  {/* Owner Actions */}
  {isOwner && (
    <div className="flex items-center gap-3 shrink-0">
      <button
        type="button"
        onClick={() => navigate("/mycontains/editblog", { state: { blog } })}
        className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-blue-700 hover:scale-105 cursor-pointer"
      >
        Edit Blog
      </button>

      <button
        type="button"
        onClick={() => setIsDeleteOpen(true)}
        className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-red-700 hover:scale-105 cursor-pointer"
      >
        Delete Blog
      </button>
    </div>
  )}
</div>

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
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-700 shrink-0">
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

          <div className="flex items-center gap-3">
  
  <button
    type="button"
    onClick={toggleLike}
    aria-label="Like"
    className={`flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition-all duration-300 cursor-pointer ${
      isLiked
        ? "border-red-200 bg-red-500 text-white"
        : "border-white/70 bg-white text-gray-700 hover:bg-gray-50"
    }`}
  >
    <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
  </button>

  <button
    type="button"
    onClick={toggleBookmark}
    aria-label="Bookmark"
    className={`flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition-all duration-300 cursor-pointer ${
      isBookmarked
        ? "border-amber-200 bg-amber-500 text-white"
        : "border-white/70 bg-white text-gray-700 hover:bg-gray-50"
    }`}
  >
    <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
  </button>

</div>
        </div>

        {/* Action error */}
        {actionError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {actionError}
          </div>
        )}

        {/* Hero image */}
        <div className="mb-8 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
          <div className="w-full aspect-[16/9] sm:aspect-[2/1]">
            <img
              src={imageUrl}
              alt={blog.title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Body */}
        <div className="blog-content text-gray-600 text-[1.05rem] leading-relaxed">
          {hasDescription ? (
            <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
          ) : (
            <p className="text-gray-400 italic">No description available.</p>
          )}
        </div>
      </article>
      <DeleteModal
        isOpen={isDeleteOpen}
        title="Delete this blog?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
        isLoading={isDeleting}
      />
    </div>
  );
}