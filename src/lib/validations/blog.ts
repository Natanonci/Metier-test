import { z } from "zod";

export const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Invalid slug format"),
  summary: z.string().min(1, "Summary is required"),
  content: z.string().min(1, "Content is required"),
  images: z.array(z.string()).max(7, "Maximum 7 images allowed"),
  isPublished: z.boolean().default(false),
});

export type BlogInput = z.infer<typeof blogSchema>;
