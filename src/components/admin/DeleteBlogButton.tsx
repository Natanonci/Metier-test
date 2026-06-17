"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteBlog } from "@/app/actions/admin";
import { useState } from "react";

export function DeleteBlogButton({ id }: { id: string }) {
  const [isPending, setIsPending] = useState(false);

  async function handleDelete() {
    if (confirm("Are you sure you want to delete this blog?")) {
      setIsPending(true);
      try {
        const result = await deleteBlog(id);
        if (!result.success) {
          alert(result.error || "Failed to delete blog.");
        }
      } catch (error) {
        alert("An unexpected error occurred.");
      } finally {
        setIsPending(false);
      }
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="text-destructive" 
      onClick={handleDelete}
      disabled={isPending}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
