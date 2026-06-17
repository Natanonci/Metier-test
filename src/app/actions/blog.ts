"use server";

import prisma from "@/lib/prisma";
import { SITE_CONFIG } from "@/lib/constants";
import { Blog } from "@prisma/client";
import { BlogWithComments } from "@/types";

export async function getBlogs({
  page = 1,
  search = "",
  onlyPublished = true,
}: {
  page?: number;
  search?: string;
  onlyPublished?: boolean;
} = {}): Promise<{
  blogs: Blog[];
  totalPages: number;
  currentPage: number;
  total: number;
}> {
  const pageSize = SITE_CONFIG.pagination.pageSize;
  const skip = (page - 1) * pageSize;

  const where = {
    AND: [
      onlyPublished ? { isPublished: true } : {},
      search
        ? {
            title: {
              contains: search,
              mode: "insensitive" as const,
            },
          }
        : {},
    ],
  };

  const [blogs, total] = await Promise.all([
    prisma.blog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.blog.count({ where }),
  ]);

  return {
    blogs,
    totalPages: Math.ceil(total / pageSize),
    currentPage: page,
    total,
  };
}

export async function getBlogBySlug(slug: string): Promise<BlogWithComments | null> {
  return await prisma.blog.findUnique({
    where: { slug },
    include: {
      comments: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function incrementViewCount(id: string) {
  try {
    await prisma.blog.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
  } catch (error) {
    console.error("Failed to increment view count:", error);
  }
}
