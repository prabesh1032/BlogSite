import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Hero from "./Hero";
import BlogCard from "../../components/BlogCard";
import BlogService from "../../services/blogService";
import LoadMore from "../../components/LoadMore";
import useStateContext from "../../context/useStateContext";
import EmptyState from "../../components/EmptyState";
import { FileText, Tag } from 'lucide-react';

const BLOGS_PER_PAGE = 6;

const getBlogImageUrl = (image) => {
    if (!image) return "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=800&fit=crop";
    if (image.startsWith("http") || image.startsWith("blob:") || image.startsWith("data:")) {
        return image;
    }

    return `${import.meta.env.VITE_APP_API_BASE_URL}/storage/${image}`;
};

const getDateValue = (value) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 0 : date.getTime();
};

export default function Home() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { token } = useStateContext();
    const [blogs, setBlogs] = useState([]);
    const [visibleCount, setVisibleCount] = useState(BLOGS_PER_PAGE);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
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
    const selectedCategory = (searchParams.get("category") || "").trim();

    useEffect(() => {
        localStorage.setItem("HOME_BLOG_LIKES", JSON.stringify(likedBlogs));
    }, [likedBlogs]);

    useEffect(() => {
        localStorage.setItem("HOME_BLOG_BOOKMARKS", JSON.stringify(bookmarkedBlogs));
    }, [bookmarkedBlogs]);

    useEffect(() => {
        setVisibleCount(BLOGS_PER_PAGE);
    }, [selectedCategory]);

    useEffect(() => {
        let isMounted = true;

        const loadBlogs = async () => {
            try {
                setError("");
                setIsLoading(true);
                const data = await BlogService.getBlogs({ limit: BLOGS_PER_PAGE, offset: 0 });
                const list = Array.isArray(data?.blogs) ? data.blogs : [];
                if (isMounted) {
                    setBlogs(list);
                    setOffset(list.length);
                    setHasMore(list.length === BLOGS_PER_PAGE);
                    setVisibleCount(BLOGS_PER_PAGE);
                }
            } catch (err) {
                const message =
                    err?.response?.data?.message ||
                    err?.message ||
                    "Failed to load blogs";
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
    console.log(import.meta.env.VITE_APP_API_BASE_URL);

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

    const handleLoadMore = async () => {
        if (isLoadingMore) return;
        const nextVisible = visibleCount + BLOGS_PER_PAGE;
        const needsMore = filteredBlogs.length < nextVisible && hasMore;

        if (needsMore) {
            try {
                setIsLoadingMore(true);
                const data = await BlogService.getBlogs({ limit: BLOGS_PER_PAGE, offset });
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

    const filteredBlogs = useMemo(() => {
        if (!selectedCategory) {
            return blogs;
        }

        return blogs.filter((blog) => (blog.category || "").toLowerCase() === selectedCategory.toLowerCase());
    }, [blogs, selectedCategory]);

    const visibleBlogs = filteredBlogs.slice(0, visibleCount);
    const canLoadMore = hasMore || visibleCount < filteredBlogs.length;

    const oldestBlogs = useMemo(() => {
        if (!blogs.length) return [];
        return [...blogs]
            .sort((a, b) => getDateValue(a.created_at) - getDateValue(b.created_at))
            .slice(0, 3);
    }, [blogs]);

    return (
        <>
            <Hero oldestBlogs={oldestBlogs} />

            {/* Blog Cards Section */}
            <section
                id="latest-articles"
                className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 "
            >
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-10 sm:mb-12 md:mb-16">
                        <div className="space-y-1">
                            <span className="text-xs font-semibold tracking-[0.2em] text-sky-600 uppercase">
                                {selectedCategory ? "Browsing" : "Latest"}
                            </span>
                            <h3
                                className="text-3xl font-semibold text-gray-900"
                                style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                            >
                                {selectedCategory ? `${selectedCategory[0].toUpperCase()}${selectedCategory.slice(1).toLowerCase()} Articles` : "Recent Posts From Our Community"}
                            </h3>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-8 rounded-xl border border-red-200 bg-linear-to-r from-red-50 to-red-100 px-4 sm:px-6 py-3 sm:py-4 text-sm text-red-700 shadow-sm">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        </div>
                    )}

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center py-12 sm:py-20">
                            <div className="relative">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                            </div>
                            <p className="mt-4 text-sm text-gray-500">Loading amazing content...</p>
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && blogs.length === 0 && !error && (
                        <EmptyState
                            icon={FileText}
                            title="No articles yet"
                            description="Check back soon for new content!"
                        />
                    )}

                    {/* Blog Cards Grid */}
                    {!isLoading && filteredBlogs.length > 0 && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
                                {visibleBlogs.map((blog, index) => (
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
                                    <LoadMore onClick={handleLoadMore} loading={isLoadingMore}>
                                        Load More Articles
                                    </LoadMore>
                                </div>
                            )}
                        </>
                    )}

                    {!isLoading && !error && selectedCategory && filteredBlogs.length === 0 && (
                        <EmptyState
                            icon={Tag}
                            title="No blogs found"
                            description={`No posts are available for the ${selectedCategory} category yet.`}
                        />
                    )}
                </div>
            </section>
        </>
    )
}