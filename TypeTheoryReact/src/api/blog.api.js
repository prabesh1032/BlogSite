import { api } from "./axios";

// Get all blogs
export async function getBlogsAPI({ limit, offset } = {}) {
  const params = {};
  if (typeof limit === "number" && limit > 0) params.limit = limit;
  if (typeof offset === "number" && offset >= 0) params.offset = offset;
  const res = await api.get("/blogs", { params });
  return res.data;
}

// Get blogs for logged-in user
export async function getMyBlogsAPI({ limit, offset } = {}) {
  const params = {};
  if (typeof limit === "number" && limit > 0) params.limit = limit;
  if (typeof offset === "number" && offset >= 0) params.offset = offset;
  const res = await api.get("/my-blogs", { params });
  return res.data;
}

// Get single blog by id
export async function getBlogAPI(id) {
  const res = await api.get(`/blogs/${id}`);
  return res.data;
}

// Search blogs by query
export async function searchBlogsAPI(query, { limit, offset } = {}) {
  const params = { q: query };
  if (typeof limit === "number" && limit > 0) params.limit = limit;
  if (typeof offset === "number" && offset >= 0) params.offset = offset;
  const res = await api.get("/blogs/search", { params });
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