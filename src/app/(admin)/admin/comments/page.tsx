import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CommentActionButtons } from "./CommentActionButtons";
import { Metadata } from "next";
import Link from "next/link";
import { getComments } from "@/app/actions/comment";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export const metadata: Metadata = {
  title: "Manage Comments | Admin",
};

export default async function AdminCommentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const status = params.status || "ALL";

  const { comments, totalPages } = await getComments({ page, status });
  const tabs = ["ALL", "PENDING", "APPROVED", "REJECTED", "DELETED"];
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Manage Comments</h1>

      <div className="flex space-x-2 border-b pb-2">
        {tabs.map((tab) => (
          <Link
            key={tab}
            href={`/admin/comments?status=${tab}`}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              status === tab
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {tab}
          </Link>
        ))}
      </div>

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

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            {page > 1 && (
              <PaginationItem>
                <PaginationPrevious href={`/admin/comments?page=${page - 1}&status=${status}`} />
              </PaginationItem>
            )}
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href={`/admin/comments?page=${i + 1}&status=${status}`}
                  isActive={page === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            {page < totalPages && (
              <PaginationItem>
                <PaginationNext href={`/admin/comments?page=${page + 1}&status=${status}`} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
