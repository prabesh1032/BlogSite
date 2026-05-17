import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "./Hero";
import BlogCard from "../../components/BlogCard";
import BlogService from "../../services/blogService";

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

    const fallbackImage =
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop";

    return (
        <>
            <Hero />
            
            {/* Blog Cards Section */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
                        Latest Articles
                    </h2>
                    
                    {error && (
                        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}
                    {isLoading ? (
                        <p className="text-center text-sm text-gray-500">Loading blogs...</p>
                    ) : blogs.length === 0 ? (
                        <p className="text-center text-sm text-gray-500">No blogs found.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                            {blogs.map((blog) => (
                                <BlogCard
                                    key={blog.id}
                                    image={blog.image || fallbackImage}
                                    category={(blog.category || "").toUpperCase()}
                                    title={blog.title}
                                    date={formatDate(blog.created_at)}
                                    onClick={() => navigate(`/blog/${blog.id}`)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}