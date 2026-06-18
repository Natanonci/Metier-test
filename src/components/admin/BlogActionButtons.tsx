"use client";

import { useTransition } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Trash2, Edit, Eye, RefreshCw } from "lucide-react";
import { deleteBlog, restoreBlog, hardDeleteBlog } from "@/app/actions/admin";
import Link from "next/link";

export function BlogActionButtons({ id, slug, isDeleted }: { id: string, slug: string, isDeleted: boolean }) {
  const [isPending, startTransition] = useTransition();

  const handleSoftDelete = () => {
    if (confirm("Are you sure you want to delete this blog?")) {
      startTransition(async () => {
        const result = await deleteBlog(id);
        if (!result.success) alert(result.error);
      });
    }
  };

  const handleRestore = () => {
    startTransition(async () => {
      const result = await restoreBlog(id);
      if (!result.success) alert(result.error);
    });
  };

  const handleHardDelete = () => {
    if (confirm("Are you sure you want to PERMANENTLY delete this blog? This cannot be undone.")) {
      startTransition(async () => {
        const result = await hardDeleteBlog(id);
        if (!result.success) alert(result.error);
      });
    }
  };

  if (isDeleted) {
    return (
      <div className="flex items-center justify-end space-x-2">
        <Button variant="outline" size="sm" onClick={handleRestore} disabled={isPending} className="h-8 text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100">
          <RefreshCw className="h-4 w-4 mr-2" /> Restore
        </Button>
        <Button variant="outline" size="sm" onClick={handleHardDelete} disabled={isPending} className="h-8 text-destructive border-red-200 bg-red-50 hover:bg-red-100">
          <Trash2 className="h-4 w-4 mr-2" /> Permanently Delete
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end space-x-2">
      <Link href={`/blog/${slug}`} target="_blank" className={buttonVariants({ variant: "ghost", size: "icon" })}>
        <Eye className="h-4 w-4" />
      </Link>
      <Link href={`/admin/blogs/${id}`} className={buttonVariants({ variant: "ghost", size: "icon" })}>
        <Edit className="h-4 w-4" />
      </Link>
      <Button variant="ghost" size="icon" onClick={handleSoftDelete} disabled={isPending} className="text-destructive">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
