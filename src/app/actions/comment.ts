"use server";

import prisma from "@/lib/prisma";
import { commentSchema } from "@/lib/validations/comment";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "@/types";
import { CommentStatus } from "@prisma/client";
import { SITE_CONFIG } from "@/lib/constants";

export async function submitComment(
  prevState: unknown,
  formData: FormData
): Promise<ActionResponse> {
  const validatedFields = commentSchema.safeParse({
    senderName: formData.get("senderName"),
    message: formData.get("message"),
    blogId: formData.get("blogId"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.comment.create({
      data: {
        ...validatedFields.data,
        status: "PENDING",
      },
    });

    return {
      success: true,
      message: "Comment submitted and awaiting approval.",
    };
  } catch (error) {
    console.error("Failed to submit comment:", error);
    return {
      success: false,
      error: "Failed to submit comment. Please try again later.",
    };
  }
}

export async function getComments({
  page = 1,
  status = "ALL",
}: {
  page?: number;
  status?: string;
} = {}) {
  const pageSize = SITE_CONFIG.pagination.pageSize;
  const skip = (page - 1) * pageSize;

  const where = status === "ALL" ? {} : { status: status as CommentStatus };

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where,
      include: { blog: { select: { title: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.comment.count({ where }),
  ]);

  return {
    comments,
    totalPages: Math.ceil(total / pageSize),
    currentPage: page,
    total,
  };
}

export async function updateCommentStatus(
  id: string,
  status: CommentStatus
) {
  try {
    const comment = await prisma.comment.update({
      where: { id },
      data: { status },
      include: { blog: { select: { slug: true } } },
    });

    revalidatePath(`/blog/${comment.blog.slug}`);
    revalidatePath(`/admin/comments`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update comment status:", error);
    return { success: false, error: "Failed to update comment status" };
  }
}

export async function deleteComment(id: string) {
  try {
    const comment = await prisma.comment.update({
      where: { id },
      data: { status: "DELETED" },
      include: { blog: { select: { slug: true } } },
    });

    revalidatePath(`/blog/${comment.blog.slug}`);
    revalidatePath(`/admin/comments`);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete comment:", error);
    return { success: false, error: "Failed to delete comment" };
  }
}

export async function hardDeleteComment(id: string) {
  try {
    const comment = await prisma.comment.delete({
      where: { id },
      include: { blog: { select: { slug: true } } },
    });

    revalidatePath(`/blog/${comment.blog.slug}`);
    revalidatePath(`/admin/comments`);
    return { success: true };
  } catch (error) {
    console.error("Failed to hard delete comment:", error);
    return { success: false, error: "Failed to permanently delete comment" };
  }
}
