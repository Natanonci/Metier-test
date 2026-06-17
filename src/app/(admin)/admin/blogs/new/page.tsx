import { BlogForm } from "@/components/admin/BlogForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create New Blog | Admin",
};

export default function NewBlogPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Create New Blog</h1>
      <BlogForm />
    </div>
  );
}
