import { getBlogs } from "@/app/actions/blog";
import { Blog } from "@prisma/client";
import { buttonVariants } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Plus, Edit } from "lucide-react";
import { format } from "date-fns";
import { DeleteBlogButton } from "@/components/admin/DeleteBlogButton";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Blogs | Admin",
};

export default async function AdminBlogsPage() {
  const { blogs } = await getBlogs({ onlyPublished: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Manage Blogs</h1>
        <Link href="/admin/blogs/new" className={buttonVariants({ variant: "default" })}>
          <Plus className="mr-2 h-4 w-4" /> New Blog
        </Link>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  No blogs found. Create your first one!
                </TableCell>
              </TableRow>
            ) : (
              blogs.map((blog: Blog) => (
                <TableRow key={blog.id}>
                  <TableCell className="font-medium">{blog.title}</TableCell>
                  <TableCell>
                    {blog.isPublished ? (
                      <Badge variant="default">Published</Badge>
                    ) : (
                      <Badge variant="secondary">Draft</Badge>
                    )}
                  </TableCell>
                  <TableCell>{blog.viewCount}</TableCell>
                  <TableCell>{format(new Date(blog.createdAt), "MMM d, yyyy")}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link href={`/admin/blogs/${blog.id}`} className={buttonVariants({ variant: "ghost", size: "icon" })}>
                      <Edit className="h-4 w-4" />
                    </Link>
                    <DeleteBlogButton id={blog.id} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
