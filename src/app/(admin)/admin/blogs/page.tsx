import { getBlogs } from "@/app/actions/blog";
import { Blog } from "@prisma/client";
import { buttonVariants } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Plus, Edit, Eye, Search } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { BlogActionButtons } from "@/components/admin/BlogActionButtons";
import { TogglePublishButton } from "@/components/admin/TogglePublishButton";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Blogs | Admin",
};

export default async function AdminBlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search || "";
  const status = params.status || "ALL";
  const { blogs, totalPages } = await getBlogs({ page, search, status });

  const tabs = [
    { label: "All (รวม)", value: "ALL" },
    { label: "Published", value: "PUBLISHED" },
    { label: "Draft", value: "DRAFT" },
    { label: "Deleted", value: "DELETED" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Manage Blogs</h1>
        <div className="flex items-center gap-2">
          <form className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              name="search"
              placeholder="Search by title..."
              className="pl-8"
              defaultValue={search}
            />
            {/* Using a hidden submit button ensures Enter key submits the form natively */}
            <button type="submit" className="hidden" />
          </form>
          <Link href="/admin/blogs/new" className={buttonVariants({ variant: "default" })}>
            <Plus className="mr-2 h-4 w-4" /> New Blog
          </Link>
        </div>
      </div>

      <div className="flex space-x-2 border-b mb-6">
        {tabs.map((tab) => (
          <Link
            key={tab.value}
            href={`/admin/blogs?status=${tab.value}${search ? `&search=${search}` : ""}`}
            className={`px-4 py-2 border-b-2 text-sm font-medium transition-colors ${
              status === tab.value
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Publish</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  No blogs found. Create your first one!
                </TableCell>
              </TableRow>
            ) : (
              blogs.map((blog: Blog) => (
                <TableRow key={blog.id}>
                  <TableCell className="font-medium">{blog.title}</TableCell>
                  <TableCell>
                    {blog.isDeleted ? (
                      <Badge variant="destructive">Deleted</Badge>
                    ) : blog.isPublished ? (
                      <Badge variant="default">Published</Badge>
                    ) : (
                      <Badge variant="secondary">Draft</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {!blog.isDeleted && <TogglePublishButton id={blog.id} isPublished={blog.isPublished} />}
                  </TableCell>
                  <TableCell>{blog.viewCount}</TableCell>
                  <TableCell>{format(new Date(blog.createdAt), "MMM d, yyyy")}</TableCell>
                  <TableCell className="text-right">
                    <BlogActionButtons id={blog.id} slug={blog.slug} isDeleted={blog.isDeleted} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            {page > 1 && (
              <PaginationItem>
                <PaginationPrevious href={`/admin/blogs?page=${page - 1}${search ? `&search=${search}` : ""}&status=${status}`} />
              </PaginationItem>
            )}
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href={`/admin/blogs?page=${i + 1}${search ? `&search=${search}` : ""}&status=${status}`}
                  isActive={page === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            {page < totalPages && (
              <PaginationItem>
                <PaginationNext href={`/admin/blogs?page=${page + 1}${search ? `&search=${search}` : ""}&status=${status}`} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
