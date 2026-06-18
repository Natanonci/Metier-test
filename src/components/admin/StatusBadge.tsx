import { Badge } from "@/components/ui/badge";
import { CommentStatus } from "@prisma/client";

export function BlogStatusBadge({ isDeleted, isPublished }: { isDeleted: boolean; isPublished: boolean }) {
  if (isDeleted) {
    return <Badge variant="destructive">Deleted</Badge>;
  }
  if (isPublished) {
    return <Badge variant="default">Published</Badge>;
  }
  return <Badge variant="secondary">Draft</Badge>;
}

export function CommentStatusBadge({ status }: { status: string }) {
  const variant =
    status === CommentStatus.APPROVED
      ? "default"
      : status === CommentStatus.REJECTED
      ? "destructive"
      : "secondary";

  return <Badge variant={variant}>{status}</Badge>;
}
