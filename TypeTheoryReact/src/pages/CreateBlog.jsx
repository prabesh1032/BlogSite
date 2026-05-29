import { useForm } from "react-hook-form";
import { useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { X } from "lucide-react";
import BlogService from "../services/blogService";
import { showErrorToast, showSuccessToast } from "../components/ShowToast";
import HeroBanner from "../components/HeroBanner";
import { categories } from "../constants/categories";
import CategoryDropdown from "../components/CategoryDropdown";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export default function CreateBlog() {
  const navigate = useNavigate();
  const [preview, setPreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [serverError, setServerError] = useState("");

  const parseError = (error) => {
    return error?.response?.data?.message || 'Server error';
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    clearErrors,
    setError,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      category: categories[0],
      title: "",
      description: "",
      image: null,
    },
  });
  const category = useWatch({ control, name: "category" });
  const imageRegister = register("image");
  const [selectedFileName, setSelectedFileName] = useState("");

  const onSubmit = async (data) => {
    try {
      setServerError("");
      if (!data.description || data.description === "<p><br></p>") {
        setError("description", { type: "manual", message: "Description is required" });
        return;
      }
      const payload = new FormData();
      payload.append("title", data.title);
      payload.append("category", data.category);
      payload.append("description", data.description);

      const imageFile = data.image instanceof File ? data.image : data.image?.[0] || selectedFile;
      if (!imageFile) {
        setError("image", { type: "manual", message: "Image is required" });
        return;
      }
      payload.append("image", imageFile);

      await BlogService.createBlog(payload);
      showSuccessToast("Blog created successfully");
      navigate("/mycontains");
    } catch (error) {
      const message = parseError(error);
      showErrorToast(message);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setSelectedFile(file);
      setValue("image", file, { shouldValidate: true, shouldDirty: true });
      clearErrors("image");
    }
  };

  return (
    <>
      <HeroBanner title="Create Blog" />
      <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm px-4 py-10 overflow-y-auto sm:items-center">
        <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-gray-500">My Contains</p>
              <h2 className="text-2xl font-bold text-gray-900">Create Blog</h2>
            </div>
            <button
              type="button"
              onClick={() => navigate("/mycontains")}
              className="text-sm font-semibold text-gray-500 hover:text-gray-900 cursor-pointer"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-red-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-6 py-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <CategoryDropdown
                  label="Category"
                  value={category}
                  options={categories}
                  onChange={(category) => {
                    setValue("category", category, { shouldValidate: true, shouldDirty: true });
                    clearErrors("category");
                  }}
                  error={errors.category?.message}
                />
                <input type="hidden" {...register("category", { required: "Category is required" })} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  {...register("title", { required: "Title is required" })}
                  placeholder="Enter blog title"
                  className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <ReactQuill
                theme="snow"
                placeholder="Write your blog description..."
                onChange={(value) => {
                  setValue("description", value, { shouldValidate: true });
                }}
                className="mt-2 create-blog-quill"
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Cover Image</label>
              <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex items-center gap-3">
                  <input
                    id="create-image-input"
                    type="file"
                    accept="image/*"
                    {...imageRegister}
                    onChange={async (e) => {
                      if (imageRegister.onChange) imageRegister.onChange(e);
                      handleImageChange(e);
                      const f = e.target.files && e.target.files[0];
                      setSelectedFileName(f ? f.name : "");
                      await trigger("image");
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="create-image-input"
                    className="inline-flex items-center gap-2 rounded-md border border-dashed border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 12v9m0-9l3 3m-3-3-3 3M7 8h.01M12 8h.01M17 8h.01M12 3v3" />
                    </svg>
                    Upload image
                  </label>

                  {preview ? (
                    <div className="relative">
                      <img src={preview} alt="Preview" className="h-28 w-40 rounded-md object-cover border" />
                      <button
                        type="button"
                        onClick={() => {
                          setPreview("");
                          setSelectedFile(null);
                          setValue("image", null, { shouldDirty: true, shouldValidate: true });
                          setSelectedFileName("");
                        }}
                        className="absolute -top-2 -right-2 rounded-full bg-white p-1 shadow-md"
                        aria-label="Remove image"
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex h-24 w-36 items-center justify-center rounded-lg border border-dashed border-gray-300 text-xs text-gray-500">
                      {selectedFileName || "Preview"}
                    </div>
                  )}
                </div>
              </div>
              {errors.image && (
                <p className="mt-1 text-xs text-red-500">{errors.image.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate("/mycontains")}
                className="rounded-full border border-gray-200 px-6 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 cursor-pointer disabled:bg-indigo-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Publishing..." : "Publish Blog"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
