import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BlogCard from "../components/BlogCard";
import BlogService from "../services/blogService";
import LoadMore from "../components/LoadMore";
import HeroBanner from "../components/HeroBanner";
import EmptyState from "../components/EmptyState";
import { Edit3 } from 'lucide-react';

const BLOGS_PER_PAGE = 6;

const getBlogImageUrl = (image) => {
  if (!image) return "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=800&fit=crop";
  if (image.startsWith("http") || image.startsWith("blob:") || image.startsWith("data:")) {
    return image;
  }

  return `${import.meta.env.VITE_APP_API_BASE_URL}/storage/${image}`;
};

export default function MyContain() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [visibleCount, setVisibleCount] = useState(BLOGS_PER_PAGE);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadBlogs = async () => {
      try {
        setError("");
        setIsLoading(true);
        const data = await BlogService.getMyBlogs({ limit: BLOGS_PER_PAGE, offset: 0 });
        const list = Array.isArray(data?.blogs) ? data.blogs : [];
        if (isMounted) {
          setBlogs(list);
          setVisibleCount(BLOGS_PER_PAGE);
          setOffset(list.length);
          setHasMore(list.length === BLOGS_PER_PAGE);
        }
      } catch (err) {
        const message =
          err?.response?.data?.message || err?.message || "Failed to load blogs";
        if (isMounted) {
          setError(message);
          setHasMore(false);
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

  const visibleBlogs = blogs.slice(0, visibleCount);
  const canLoadMore = hasMore || visibleCount < blogs.length;

  const handleLoadMore = async () => {
    if (isLoadingMore) return;
    const nextVisible = visibleCount + BLOGS_PER_PAGE;
    const needsMore = blogs.length < nextVisible && hasMore;

    if (needsMore) {
      try {
        setIsLoadingMore(true);
        const data = await BlogService.getMyBlogs({ limit: BLOGS_PER_PAGE, offset });
        const list = Array.isArray(data?.blogs) ? data.blogs : [];
        setBlogs((current) => [...current, ...list]);
        setOffset((current) => current + list.length);
        setHasMore(list.length === BLOGS_PER_PAGE);
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load more blogs";
        setError(message);
        setHasMore(false);
      } finally {
        setIsLoadingMore(false);
      }
    }

    setVisibleCount(nextVisible);
  };

  return (
    <section className=" min-h-screen">
      <HeroBanner title="My Articles" />

      <div className="max-w-7xl mx-auto px-4 py-12">
       <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between mb-12">
  
  {/* Left Content */}
  <div className="space-y-1">
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

  {/* Create Button */}
  <button
    type="button"
    onClick={() => navigate("/mycontains/createblog")}
    className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-indigo-700 hover:scale-105 active:scale-95 cursor-pointer"
  >
    <span className="text-lg leading-none">+</span>
    Create Blog
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
        ) : blogs.length === 0 ? (
          <EmptyState
            icon={Edit3}
            title="No blogs yet"
            description="You haven't published any articles yet. Create your first post now."
          />
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
                  />
                </div>
              ))}
            </div>

            {canLoadMore && (
              <div className="text-center mt-12 sm:mt-16">
                <LoadMore onClick={handleLoadMore} loading={isLoadingMore}>
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