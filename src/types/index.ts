import { Blog, Comment, CommentStatus } from "@prisma/client";

export type BlogWithComments = Blog & {
  comments: Comment[];
};

export type CommentWithBlog = Comment & {
  blog: { title: string };
};

export type AdminStats = {
  blogCount: number;
  pendingComments: number;
  totalViews: number;
};

export type ActionResponse<T = unknown> = {
  success: boolean;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
  data?: T;
};
