"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, Trash2 } from "lucide-react";
import { updateCommentStatus, deleteComment } from "@/app/actions/comment";

export function CommentActionButtons({ commentId, status }: { commentId: string; status: string }) {
  const [isPending, startTransition] = useTransition();

  const handleUpdateStatus = (newStatus: "APPROVED" | "REJECTED") => {
    startTransition(async () => {
      await updateCommentStatus(commentId, newStatus);
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      await deleteComment(commentId);
    });
  };

  return (
    <div className="flex items-center justify-end space-x-2">
      {status !== "APPROVED" && (
        <Button
          variant="outline"
          size="icon"
          disabled={isPending}
          onClick={() => handleUpdateStatus("APPROVED")}
          className="h-8 w-8 text-green-600 border-green-200 bg-green-50 hover:bg-green-100"
        >
          <Check className="h-4 w-4" />
        </Button>
      )}
      {status !== "REJECTED" && (
        <Button
          variant="outline"
          size="icon"
          disabled={isPending}
          onClick={() => handleUpdateStatus("REJECTED")}
          className="h-8 w-8 text-destructive border-red-200 bg-red-50 hover:bg-red-100"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      <Button
        variant="outline"
        size="icon"
        disabled={isPending}
        onClick={handleDelete}
        className="h-8 w-8 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
