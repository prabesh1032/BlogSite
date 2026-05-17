import {
  getBlogsAPI,
  getMyBlogsAPI,
  getBlogAPI,
  createBlogAPI,
  updateBlogAPI,
  deleteBlogAPI,
} from '../api/blog.api';

const BlogService = {
  // Get all blogs
  async getBlogs() {
    const response = await getBlogsAPI();
    return response;
  },

  // Get blogs for logged-in user
  async getMyBlogs() {
    const response = await getMyBlogsAPI();
    return response;
  },

  // Get single blog
  async getBlog(id) {
    const response = await getBlogAPI(id);
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
