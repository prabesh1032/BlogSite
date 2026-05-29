import {
  getBlogsAPI,
  getMyBlogsAPI,
  getBlogAPI,
  searchBlogsAPI,
  createBlogAPI,
  updateBlogAPI,
  deleteBlogAPI,
} from '../api/blog.api';

const BlogService = {
  // Get all blogs
  async getBlogs(options) {
    const response = await getBlogsAPI(options);
    return response;
  },

  // Get blogs for logged-in user
  async getMyBlogs(options) {
    const response = await getMyBlogsAPI(options);
    return response;
  },

  // Get single blog
  async getBlog(id) {
    const response = await getBlogAPI(id);
    return response;
  },

  // Search blogs
  async searchBlogs(query, options) {
    const response = await searchBlogsAPI(query, options);
    return response;
  },

  // Create blog
  async createBlog(data) {
    const response = await createBlogAPI(data);
    console.log(response);
    return response;
  },

  // Update blog
  async updateBlog(id, data) {
    const response = await updateBlogAPI(id, data);
    return response;
  },

  // Delete blog
  async deleteBlog(id) {
    const response = await deleteBlogAPI(id);
    return response;
  },
};

export default BlogService;
