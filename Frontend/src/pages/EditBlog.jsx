import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import BlogService from "../services/blogService";

const categories = [
  "Design",
  "Technology",
  "Travel",
  "Food",
  "Lifestyle",
  "Business",
];

export default function EditBlog() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedBlog = location.state?.blog;

  const fallbackBlog = {
    id: null,
    category: "Technology",
    title: "The Future of Web Development in 2026.",
    description: "This is a static edit page. Replace this with real content later.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop",
  };

  const blog = selectedBlog ?? fallbackBlog;
  const [uploadedPreview, setUploadedPreview] = useState("");
  const [serverError, setServerError] = useState("");

  const existingPreview =
    typeof blog.image === "string" && blog.image
      ? blog.image.startsWith("http") || blog.image.startsWith("blob:") || blog.image.startsWith("data:")
        ? blog.image
        : `${import.meta.env.VITE_APP_API_BASE_URL}/storage/${blog.image}`
      : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop";

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category: blog.category,
      title: blog.title,
      description: blog.description,
      image: null,
    },
  });

  useEffect(() => {
    reset({
      category: blog.category,
      title: blog.title,
      description: blog.description,
      image: null,
    });
  }, [blog, reset]);

  const onSubmit = async (data) => {
    try {
      setServerError("");

      const payload = new FormData();
      payload.append("title", data.title);
      payload.append("category", data.category);
      payload.append("description", data.description);

      if (data.image instanceof File) {
        payload.append("image", data.image);
      }

      if (blog?.id) {
        await BlogService.updateBlog(blog.id, payload);
      }

      navigate("/mycontains");
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || "Failed to update blog";
      setServerError(message);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedPreview(url);
      setValue("image", file, { shouldValidate: true, shouldDirty: true });
      clearErrors("image");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-10">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-gray-500">My Contains</p>
            <h2 className="text-2xl font-bold text-gray-900">Edit Blog</h2>
          </div>
          <button
            type="button"
            onClick={() => navigate("/mycontains")}
            className="text-sm font-semibold text-gray-500 hover:text-gray-900"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-6 py-6">
          {serverError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {serverError}
            </div>
          )}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                {...register("category", { required: "Category is required" })}
                className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                {...register("title", { required: "Title is required" })}
                placeholder="Enter blog title"
                className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              {errors.title && (
                <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              {...register("description", { required: "Description is required" })}
              rows={6}
              placeholder="Write your blog description..."
              className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cover Image</label>
            <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-center">
              <input
                type="file"
                accept="image/*"
                {...register("image")}
                onChange={handleImageChange}
                className="w-full rounded-lg border border-gray-200 px-4 py-2"
              />
              {uploadedPreview || existingPreview ? (
                <img
                  src={uploadedPreview || existingPreview}
                  alt="Preview"
                  className="h-24 w-36 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-24 w-36 items-center justify-center rounded-lg border border-dashed border-gray-300 text-xs text-gray-500">
                  Preview
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/mycontains")}
              className="rounded-full border border-gray-200 px-6 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
