"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { AdminStats } from "@/types";

import { blogSchema, type BlogInput } from "@/lib/validations/blog";

export async function createBlog(data: BlogInput) {
  try {
    const blog = await prisma.blog.create({
      data,
    });
    revalidatePath("/");
    revalidatePath("/admin/blogs");
    return { success: true, data: blog };
  } catch (error) {
    console.error("Failed to create blog:", error);
    return { success: false, error: "Failed to create blog. Ensure the slug is unique." };
  }
}

export async function updateBlog(id: string, data: BlogInput) {
  try {
    const blog = await prisma.blog.update({
      where: { id },
      data,
    });
    revalidatePath("/");
    revalidatePath(`/blog/${blog.slug}`);
    revalidatePath("/admin/blogs");
    return { success: true, data: blog };
  } catch (error) {
    console.error("Failed to update blog:", error);
    return { success: false, error: "Failed to update blog. Ensure the slug is unique." };
  }
}

export async function deleteBlog(id: string) {
  try {
    const blog = await prisma.blog.delete({
      where: { id },
    });
    revalidatePath("/");
    revalidatePath("/admin/blogs");
    return { success: true, data: blog };
  } catch (error) {
    console.error("Failed to delete blog:", error);
    return { success: false, error: "Failed to delete blog." };
  }
}

export async function togglePublish(id: string, isPublished: boolean) {
  try {
    const blog = await prisma.blog.update({
      where: { id },
      data: { isPublished },
    });
    revalidatePath("/");
    revalidatePath(`/blog/${blog.slug}`);
    revalidatePath("/admin/blogs");
    return { success: true, data: blog };
  } catch (error) {
    console.error("Failed to toggle publish status:", error);
    return { success: false, error: "Failed to update publish status." };
  }
}

export async function getAdminStats(): Promise<AdminStats> {
  const [blogCount, commentCount, totalViews] = await Promise.all([
    prisma.blog.count(),
    prisma.comment.count({ where: { status: "PENDING" } }),
    prisma.blog.aggregate({ _sum: { viewCount: true } }),
  ]);

  return {
    blogCount,
    pendingComments: commentCount,
    totalViews: totalViews._sum.viewCount || 0,
  };
}
