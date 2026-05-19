import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/axios";
import BlogService from "../services/blogService";
import useStateContext from "../context/useStateContext";

const fallbackImage =
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&h=900&fit=crop";

const getBlogImageUrl = (image) => {
  if (!image) return fallbackImage;
  if (image.startsWith("http") || image.startsWith("blob:") || image.startsWith("data:")) {
    return image;
  }

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

  const blogOwnerId = blog?.user?.id;
  const currentUserId = user?.id;
  const isOwner = Boolean(token && blogOwnerId && currentUserId && Number(blogOwnerId) === Number(currentUserId));

  const imageUrl = useMemo(() => getBlogImageUrl(blog?.image), [blog?.image]);

  useEffect(() => {
    let isMounted = true;

    const loadBlog = async () => {
      try {
        setError("");
        setActionError("");
        setIsLoading(true);

        const data = await BlogService.getBlog(slug);
        if (isMounted) {
          setBlog(data?.blog || null);
        }

        if (!user?.id && token) {
          const meResponse = await api.get("/user");
          if (isMounted) {
            setUser(meResponse.data);
          }
        }
      } catch (err) {
        const message = err?.response?.data?.message || err?.message || "Failed to load blog";
        if (isMounted) {
          setError(message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadBlog();

    return () => {
      isMounted = false;
    };
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
      navigate("/mycontains");
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Failed to delete blog";
      setActionError(message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="flex flex-col items-center justify-center py-12 sm:py-20">
          <div className="relative">
            <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin sm:h-16 sm:w-16"></div>
          </div>
          <p className="mt-4 text-sm text-gray-500">Loading amazing content...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-lg rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Blog not found</h1>
          <p className="mt-3 text-sm text-gray-600">{error || "The blog could not be loaded."}</p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-6 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const descriptionLines = String(blog.description || "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      <article className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">
            {blog.category || "Blog"}
          </p>

          {isOwner && (
            <div className="flex flex-wrap gap-3 sm:justify-end">
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
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="mb-4 text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
              {blog.title}
            </h1>
            <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-gray-500">
              <span>{formatDate(blog.created_at)}</span>
              <span>·</span>
              <span>{blog.user?.name || "Author"}</span>
            </div>
          </div>

        </div>

        {actionError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {actionError}
          </div>
        )}

        <div className="mb-10 overflow-hidden rounded-2xl shadow-sm">
          <img src={imageUrl} alt={blog.title} className="h-72 w-full object-cover md:h-96" />
        </div>

        <div className="space-y-6 text-lg leading-8 text-gray-700">
          {descriptionLines.length > 0 ? (
            descriptionLines.map((line, index) => <p key={index}>{line}</p>)
          ) : (
            <p>No description available.</p>
          )}
        </div>
      </article>
    </div>
  );
}