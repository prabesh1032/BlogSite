import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BlogCard from "../components/BlogCard";
import BlogService from "../services/blogService";
import LoadMore from "../components/LoadMore";

const BLOGS_PER_PAGE = 6;

const getBlogImageUrl = (image) => {
  if (!image) {
    return "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=800&fit=crop";
  }

  if (image.startsWith("http") || image.startsWith("blob:") || image.startsWith("data:")) {
    return image;
  }

  return `${import.meta.env.VITE_APP_API_BASE_URL}/storage/${image}`;
};

export default function BookmarkedBlogs() {
  const navigate = useNavigate();
  const [allBlogs, setAllBlogs] = useState([]);
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

  useEffect(() => {
    let isMounted = true;

    const loadBlogs = async () => {
      try {
        setError("");
        setIsLoading(true);
        const data = await BlogService.getBlogs();
        const list = Array.isArray(data?.blogs) ? data.blogs : [];

        if (isMounted) {
          setAllBlogs(list);
          setVisibleCount(BLOGS_PER_PAGE);
        }
      } catch (err) {
        const message =
          err?.response?.data?.message || err?.message || "Failed to load bookmarked blogs";
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
  }, []);

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

  const toggleLike = (blogId) => {
    setLikedBlogs((current) => {
      const next = {
        ...current,
        [blogId]: !current[blogId],
      };

      return next;
    });
  };

  const toggleBookmark = (blogId) => {
    setBookmarkedBlogs((current) => ({
      ...current,
      [blogId]: !current[blogId],
    }));
  };

  const visibleBlogs = allBlogs.filter((blog) => Boolean(bookmarkedBlogs[blog.id]));
  const pagedBlogs = visibleBlogs.slice(0, visibleCount);
  const canLoadMore = visibleCount < visibleBlogs.length;

  return (
    <section className="bg-gray-50 min-h-screen">
      <div className="relative w-full h-40 md:h-48">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&h=600&fit=crop')] bg-cover bg-center opacity-20" />
        <div className="relative max-w-7xl mx-auto h-full px-4 flex items-center justify-between gap-4">
          <div className="text-black">
            <p className="text-xs tracking-[0.35em] uppercase text-black/80">My Space</p>
            <h1 className="text-3xl md:text-4xl font-bold">Bookmarked Articles</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
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
        ) : visibleBlogs.length === 0 ? (
          <div className="text-center py-12 sm:py-20">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              No bookmarked articles yet
            </h3>
            <p className="text-gray-500">Bookmark posts on the home page to see them here.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
              {pagedBlogs.map((blog, index) => (
                <div
                  key={blog.id}
                  className="transform transition-all duration-300 hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
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
