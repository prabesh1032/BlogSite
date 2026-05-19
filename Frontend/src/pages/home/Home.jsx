import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "./Hero";
import BlogCard from "../../components/BlogCard";
import BlogService from "../../services/blogService";
import LoadMore from "../../components/LoadMore";

const getBlogImageUrl = (image) => {
    if (!image) return "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=800&fit=crop";
    if (image.startsWith("http") || image.startsWith("blob:") || image.startsWith("data:")) {
        return image;
    }

    return `${import.meta.env.VITE_APP_API_BASE_URL}/storage/${image}`;
};

export default function Home() {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

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
                }
            } catch (err) {
                const message =
                    err?.response?.data?.message ||
                    err?.message ||
                    "Failed to load blogs";
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

    return (
        <>
            <Hero />
            
            {/* Blog Cards Section */}
            <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-10 sm:mb-12 md:mb-16">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                            Latest Articles
                        </h2>
                        <div className="w-20 h-1 bg-black mx-auto rounded-full"></div>
                        <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-sm sm:text-base">
                            Discover insights, tutorials, and stories from our community
                        </p>
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
                        <div className="text-center py-12 sm:py-20">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                </svg>
                            </div>
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No articles yet</h3>
                            <p className="text-gray-500">Check back soon for new content!</p>
                        </div>
                    )}
                    
                    {/* Blog Cards Grid */}
                    {!isLoading && blogs.length > 0 && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
                                {blogs.map((blog, index) => (
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
                                            onClick={() => navigate(`/blog/${blog.id}`)}
                                        />
                                    </div>
                                ))}
                            </div>
                            
                            {/* Optional: Load More Button */}
                            <div className="text-center mt-12 sm:mt-16">
                                <LoadMore onClick={() => { /* Implement load more logic */ }}>
                                    Load More Articles
                                </LoadMore>
                            </div>
                        </>
                    )}
                </div>
            </section>
        </>
    )
}