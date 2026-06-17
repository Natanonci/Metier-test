import { getBlogs } from "@/app/actions/blog";
import { Blog } from "@prisma/client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { Search } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogs | Metier Blog",
  description: "Read the latest stories and news from Metier Blog.",
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search || "";

  const { blogs, totalPages, total } = await getBlogs({ page, search });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recent Blogs</h1>
          <p className="text-muted-foreground">
            Stay updated with our latest stories and news.
          </p>
        </div>
        <form className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            name="search"
            placeholder="Search blogs..."
            className="pl-8"
            defaultValue={search}
          />
          <button type="submit" className="hidden" />
        </form>
      </div>

      {blogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-medium text-muted-foreground">No blogs found.</p>
          <Link href="/" className={buttonVariants({ variant: "link" })}>
            Clear search
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog: Blog) => (
              <Link key={blog.id} href={`/blog/${blog.slug}`} className="block h-full group outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-xl">
                <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                {blog.images[0] ? (
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={blog.images[0]}
                      alt={blog.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">No image</span>
                  </div>
                )}
                <CardHeader>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(blog.createdAt), "MMMM d, yyyy")}
                  </div>
                  <CardTitle className="line-clamp-2 group-hover:underline">
                    {blog.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {blog.summary}
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <span className={buttonVariants({ variant: "ghost", size: "sm" }) + " px-0 text-primary"}>
                    Read more →
                  </span>
                </CardFooter>
                </Card>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                {page > 1 && (
                  <PaginationItem>
                    <PaginationPrevious href={`/?page=${page - 1}${search ? `&search=${search}` : ""}`} />
                  </PaginationItem>
                )}
                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href={`/?page=${i + 1}${search ? `&search=${search}` : ""}`}
                      isActive={page === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                {page < totalPages && (
                  <PaginationItem>
                    <PaginationNext href={`/?page=${page + 1}${search ? `&search=${search}` : ""}`} />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}
