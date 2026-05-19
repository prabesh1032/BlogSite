import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BlogCard from "../components/BlogCard";
import BlogService from "../services/blogService";

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadBlogs = async () => {
      try {
        setError("");
        setIsLoading(true);
        const data = await BlogService.getMyBlogs();
        const list = Array.isArray(data?.blogs) ? data.blogs : [];
        if (isMounted) {
          setBlogs(list);
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
    <section className="bg-gray-50 min-h-screen">
      <div className="relative w-full h-40 md:h-48 ">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&h=600&fit=crop')] bg-cover bg-center opacity-20" />
        <div className="relative max-w-7xl mx-auto h-full px-4 flex items-center">
          <div className="text-black">
            <p className="text-xs tracking-[0.35em] uppercase text-black/80">My Space</p>
            <h1 className="text-3xl md:text-4xl font-bold">My Articles</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-4 mb-10">
          <button
            type="button"
            onClick={() => navigate("/mycontains/createblog")}
            className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition"
          >
            + Create Blog
          </button>
        </div>

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
              <div key={blog.id} className="w-full">
                <BlogCard
                  image={getBlogImageUrl(blog.image)}
                  category={(blog.category || "").toUpperCase()}
                  title={blog.title}
                  date={formatDate(blog.created_at)}
                  authorName={blog.user?.name || "Author"}
                  onClick={() => navigate(`/blog/${blog.id}`)}
                />
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => navigate("/mycontains/editblog", { state: { blog } })}
                    className="rounded-full border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 transition hover:border-indigo-300 hover:text-indigo-600"
                  >
                    Edit Blog
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}