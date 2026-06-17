export const SITE_CONFIG = {
  name: "Metier Blog",
  description: "A blog system with admin panel",
  pagination: {
    pageSize: 10,
  },
  images: {
    maxPerBlog: 7,
  },
};

export const API_ROUTES = {
  BLOGS: "/api/blogs",
  COMMENTS: "/api/comments",
  AUTH: "/api/auth",
};

export const ADMIN_ROUTES = {
  DASHBOARD: "/admin",
  BLOGS: "/admin/blogs",
  COMMENTS: "/admin/comments",
  LOGIN: "/admin/login",
};

export const THAI_CHAR_REGEX = /^[ก-๙0-9\s]+$/;
