import { api } from "./axios";

// Get all blogs
export async function getBlogsAPI() {
  const res = await api.get("/blogs");
  return res.data;
}

// Get blogs for logged-in user
export async function getMyBlogsAPI() {
  const res = await api.get("/my-blogs");
  return res.data;
}

// Get single blog by id
export async function getBlogAPI(id) {
  const res = await api.get(`/blogs/${id}`);
  return res.data;
}

// Search blogs by query
export async function searchBlogsAPI(query) {
  const res = await api.get("/blogs/search", {
    params: { q: query },
  });
  return res.data;
}

// Create blog
export async function createBlogAPI(payload) {
  const res = await api.post("/blogs", payload);
  return res.data;
}

// Update blog
export async function updateBlogAPI(id, payload) {
  const res = await api.put(`/blogs/${id}`, payload);
  return res.data;
}

// Delete blog
export async function deleteBlogAPI(id) {
  const res = await api.delete(`/blogs/${id}`);
  return res.data;
}