"use server";

import prisma from "@/lib/prisma";
import { SITE_CONFIG } from "@/lib/constants";
import { Blog } from "@prisma/client";
import { BlogWithComments } from "@/types";

export async function getBlogs({
  page = 1,
  search = "",
  status = "PUBLISHED",
}: {
  page?: number;
  search?: string;
  status?: "ALL" | "PUBLISHED" | "DRAFT" | "DELETED" | string;
} = {}): Promise<{
  blogs: Blog[];
  totalPages: number;
  currentPage: number;
  total: number;
}> {
  const pageSize = SITE_CONFIG.pagination.pageSize;
  const skip = (page - 1) * pageSize;

  let statusFilter = {};
  if (status === "PUBLISHED") {
    statusFilter = { isPublished: true, isDeleted: false };
  } else if (status === "DRAFT") {
    statusFilter = { isPublished: false, isDeleted: false };
  } else if (status === "DELETED") {
    statusFilter = { isDeleted: true };
  } else if (status === "ALL") {
    statusFilter = { isDeleted: false };
  }

  const where = {
    AND: [
      statusFilter,
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
