import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BlogCard from "../components/BlogCard";
import BlogService from "../services/blogService";
import LoadMore from "../components/LoadMore";
import useStateContext from "../context/useStateContext";

const BLOGS_PER_PAGE = 6;

const getBlogImageUrl = (image) => {
  if (!image) return "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=800&fit=crop";
  if (image.startsWith("http") || image.startsWith("blob:") || image.startsWith("data:")) {
    return image;
  }

  return `${import.meta.env.VITE_APP_API_BASE_URL}/storage/${image}`;
};

const formatCategory = (value = "") =>
  value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");

export default function Category() {
  const navigate = useNavigate();
  const { slug = "" } = useParams();
  const { token } = useStateContext();
  const [blogs, setBlogs] = useState([]);
  const [visibleCount, setVisibleCount] = useState(BLOGS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
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

  const selectedCategory = decodeURIComponent(slug).trim();
  const normalizedCategory = selectedCategory.toLowerCase();
  const pageTitle = selectedCategory ? formatCategory(selectedCategory) : "Category";

  useEffect(() => {
    let isMounted = true;

    const loadBlogs = async () => {
      try {
        setError("");
        setIsLoading(true);
        const data = await BlogService.getBlogs();
        const list = Array.isArray(data?.blogs) ? data.blogs : [];
        if (isMounted) {
          setBlogs(list);
          setVisibleCount(BLOGS_PER_PAGE);
        }
      } catch (err) {
        const message =
          err?.response?.data?.message || err?.message || "Failed to load blogs";
        if (isMounted) {
          setError(message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadBlogs();
    return () => {
      isMounted = false;
    };
  }, [selectedCategory]);

  useEffect(() => {
    localStorage.setItem("HOME_BLOG_LIKES", JSON.stringify(likedBlogs));
  }, [likedBlogs]);

  useEffect(() => {
    localStorage.setItem("HOME_BLOG_BOOKMARKS", JSON.stringify(bookmarkedBlogs));
  }, [bookmarkedBlogs]);

  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date
      .toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
      .toUpperCase();
  };

  const filteredBlogs = useMemo(() => {
    if (!normalizedCategory) {
      return blogs;
    }

    return blogs.filter((blog) => (blog.category || "").toLowerCase() === normalizedCategory);
  }, [blogs, normalizedCategory]);

  const visibleBlogs = filteredBlogs.slice(0, visibleCount);
  const canLoadMore = visibleCount < filteredBlogs.length;

  const toggleLike = (blogId) => {
    if (!token) {
      navigate("/login");
      return;
    }

    setLikedBlogs((current) => ({
      ...current,
      [blogId]: !current[blogId],
    }));
  };

  const toggleBookmark = (blogId) => {
    if (!token) {
      navigate("/login");
      return;
    }

    setBookmarkedBlogs((current) => ({
      ...current,
      [blogId]: !current[blogId],
    }));
  };

  return (
    <section className="bg-gray-50 min-h-screen">
      <div className="relative w-full h-40 md:h-48">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1600&h=600&fit=crop')] bg-cover bg-center opacity-50" />
        <div className="relative max-w-7xl mx-auto h-full px-4 flex items-center">
          <div className="text-black">
            <p className="text-xs tracking-[0.35em] uppercase text-black/80">Category</p>
            <h1 className="text-3xl md:text-4xl font-bold">{pageTitle} Blogs</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-gray-500">Browsing</p>
            <h2 className="text-2xl font-semibold text-gray-900">{pageTitle}</h2>
          </div>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center justify-center rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-gray-800 transition"
          >
            Back to Home
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-20">
            <div className="relative">
              <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin sm:h-16 sm:w-16"></div>
            </div>
            <p className="mt-4 text-sm text-gray-500">Loading amazing content...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">No blogs found</h3>
            <p className="mt-2 text-sm text-gray-500">
              No posts are available for the {pageTitle} category yet.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              {visibleBlogs.map((blog) => (
                <div key={blog.id} className="w-full">
                  <BlogCard
                    image={getBlogImageUrl(blog.image)}
                    category={(blog.category || "").toUpperCase()}
                    title={blog.title}
                    date={formatDate(blog.created_at)}
                    authorName={blog.user?.name || "Author"}
                    authorImage={blog.user?.profile?.profile_pic ? getBlogImageUrl(blog.user.profile.profile_pic) : undefined}
                    onClick={() => navigate(`/blog/${blog.slug || blog.id}`)}
                    showActions
                    isLiked={Boolean(likedBlogs[blog.id])}
                    isBookmarked={Boolean(bookmarkedBlogs[blog.id])}
                    onToggleLike={() => toggleLike(blog.id)}
                    onToggleBookmark={() => toggleBookmark(blog.id)}
                  />
                </div>
              ))}
            </div>

            {canLoadMore && (
              <div className="text-center mt-12 sm:mt-16">
                <LoadMore onClick={() => setVisibleCount((count) => count + BLOGS_PER_PAGE)}>
                  Load More Articles
                </LoadMore>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
