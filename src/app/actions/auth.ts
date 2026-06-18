"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { encrypt } from "@/lib/auth";
import { ActionResponse } from "@/types";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export async function login(
  prevState: unknown,
  formData: FormData
): Promise<ActionResponse> {
  const validatedFields = loginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      success: false,
      error: "Invalid fields",
    };
  }

  const { username, password } = validatedFields.data;

  try {
    const user = await prisma.adminUser.findUnique({
      where: { username },
    });

    if (!user) {
      return { success: false, error: "Invalid credentials" };
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      return { success: false, error: "Invalid credentials" };
    }

    // Create session
    const expires = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
    const session = await encrypt({
      userId: user.id,
      username: user.username,
      expires: expires.toISOString(),
    });

    (await cookies()).set("admin_session", session, { expires, httpOnly: true });

    return { success: true };
  } catch (error) {
    console.error("Login failed:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

import { redirect } from "next/navigation";

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin/login");
}
