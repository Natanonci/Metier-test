import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CommentWithBlog } from "@/types";
import { CommentActionButtons } from "./CommentActionButtons";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Comments | Admin",
};

export default async function AdminCommentsPage() {
  const comments = (await prisma.comment.findMany({
    include: {
      blog: {
        select: { title: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })) as CommentWithBlog[];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Manage Comments</h1>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sender</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Blog</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  No comments yet.
                </TableCell>
              </TableRow>
            ) : (
              comments.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell className="font-medium">{comment.senderName}</TableCell>
                  <TableCell className="max-w-xs truncate">{comment.message}</TableCell>
                  <TableCell className="max-w-[150px] truncate">{comment.blog.title}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        comment.status === "APPROVED"
                          ? "default"
                          : comment.status === "REJECTED"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {comment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(comment.createdAt), "MMM d, HH:mm")}</TableCell>
                  <TableCell className="text-right">
                    <CommentActionButtons commentId={comment.id} status={comment.status} />
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
