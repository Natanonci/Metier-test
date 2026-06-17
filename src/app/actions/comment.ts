"use server";

import prisma from "@/lib/prisma";
import { commentSchema } from "@/lib/validations/comment";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "@/types";

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

export async function getPendingComments() {
  return await prisma.comment.findMany({
    where: { status: "PENDING" },
    include: { blog: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateCommentStatus(
  id: string,
  status: "APPROVED" | "REJECTED"
) {
  try {
    const comment = await prisma.comment.update({
      where: { id },
      data: { status },
      include: { blog: { select: { slug: true } } },
    });

    revalidatePath(`/blog/${comment.blog.slug}`);
    revalidatePath(`/admin/comments`);
  } catch (error) {
    console.error("Failed to update comment status:", error);
  }
}

export async function deleteComment(id: string) {
  try {
    const comment = await prisma.comment.delete({
      where: { id },
      include: { blog: { select: { slug: true } } },
    });

    revalidatePath(`/blog/${comment.blog.slug}`);
    revalidatePath(`/admin/comments`);
  } catch (error) {
    console.error("Failed to delete comment:", error);
  }
}
