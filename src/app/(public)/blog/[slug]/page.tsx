import { getBlogBySlug } from "@/app/actions/blog";
import { Comment } from "@prisma/client";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Eye, Calendar } from "lucide-react";
import { ViewTracker } from "@/components/blog/ViewTracker";
import { CommentForm } from "@/components/blog/CommentForm";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Blog Not Found",
    };
  }

  return {
    title: `${blog.title} | Metier Blog`,
    description: blog.summary,
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto space-y-10">
      <ViewTracker id={blog.id} />
      
      <header className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          {blog.title}
        </h1>
        <div className="flex items-center gap-6 text-muted-foreground">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            {format(new Date(blog.createdAt), "MMMM d, yyyy")}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Eye className="h-4 w-4" />
            {blog.viewCount} views
          </div>
        </div>
      </header>

      {blog.images.length > 0 && (
        <div className="grid gap-4">
          <div className="aspect-video overflow-hidden rounded-lg border bg-muted">
            <img
              src={blog.images[0]}
              alt={blog.title}
              className="object-cover w-full h-full"
            />
          </div>
          {blog.images.length > 1 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {blog.images.slice(1, 7).map((img: string, i: number) => (
                <div key={i} className="aspect-square overflow-hidden rounded-lg border bg-muted">
                  <img
                    src={img}
                    alt={`${blog.title} - image ${i + 2}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="prose prose-slate max-w-none dark:prose-invert whitespace-pre-wrap">
        {blog.content}
      </div>

      <Separator />

      <section className="space-y-8">
        <h2 className="text-2xl font-bold">Comments</h2>
        
        <div className="space-y-6">
          {blog.comments.length === 0 ? (
            <p className="text-muted-foreground italic">No comments yet.</p>
          ) : (
            blog.comments.map((comment: Comment) => (
              <div key={comment.id} className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold">{comment.senderName}</span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(comment.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
                <p className="text-sm bg-muted p-4 rounded-lg">
                  {comment.message}
                </p>
              </div>
            ))
          )}
        </div>

        <CommentForm blogId={blog.id} />
      </section>
    </article>
  );
}
