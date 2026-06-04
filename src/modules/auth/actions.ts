"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/modules/shared/db";
import { profiles } from "@/modules/shared/schema";
import { eq, and } from "drizzle-orm";

export async function login(formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const loginCode = formData.get("loginCode") as string;
  let redirectUrl = "";

  if (!fullName || !loginCode) {
    return { success: false, error: "username dan password wajib diisi" };
  }

  try {
    const profile = await db.query.profiles.findFirst({
      where: and(
        eq(profiles.fullName, fullName),
        eq(profiles.loginCode, loginCode),
      ),
    });

    if (!profile) {
      return {
        success: false,
        error: "username atau password salah",
      };
    } else if (fullName !== profile.fullName) {
      return {
        success: false,
        error: "Username salah",
      };
    } else if (loginCode !== profile.loginCode) {
      return {
        success: false,
        error: "Password salah",
      };
    }

    const cookieStore = await cookies();
    cookieStore.set(
      "ssb_session",
      JSON.stringify({ id: profile.id, role: profile.role }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      },
    );

    let url = "/dashboard";
    if (profile.role === "coach") url = "/coach";
    if (profile.role === "student" || profile.role === "parent")
      url = "/student";

    redirectUrl = url;
  } catch (e) {
    console.error("Login error:", e);
    return { success: false, error: "Terjadi kesalahan saat mencari data" };
  }

  if (redirectUrl) {
    redirect(redirectUrl);
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("ssb_session");
  redirect("/login");
}
