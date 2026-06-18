import { CommentStatus } from "@prisma/client";

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

export const BLOG_STATUS_TABS = [
  { label: "All", value: "ALL" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Draft", value: "DRAFT" },
  { label: "Deleted", value: "DELETED" },
];

export const COMMENT_STATUS_TABS = [
  "ALL",
  CommentStatus.PENDING,
  CommentStatus.APPROVED,
  CommentStatus.REJECTED,
  CommentStatus.DELETED,
];
