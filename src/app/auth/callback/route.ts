import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/modules/shared/db";
import { profiles } from "@/modules/shared/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=AuthCallbackFailed`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user || !data.user.email) {
    return NextResponse.redirect(`${origin}/login?error=OAuthFailed`);
  }

  const userEmail = data.user.email;

  // Whitelist check against Drizzle DB
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.email, userEmail),
  });

  // If email not found or role is not admin/coach
  if (!profile || !["admin", "coach"].includes(profile.role)) {
    // Logout from Supabase immediately to prevent dangling session
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}/login?error=unauthorized_email`);
  }

  // Set our custom unified session cookie
  const cookieStore = await cookies();
  cookieStore.set(
    "ssb_session",
    JSON.stringify({ id: profile.id, role: profile.role }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    },
  );

  // We don't necessarily need Supabase session anymore because we rely on ssb_session
  // But we leave it signed in just in case we want to use Supabase Storage later.

  // Redirect based on role
  let redirectUrl = "/dashboard";
  if (profile.role === "coach") {
    redirectUrl = "/coach";
  }

  return NextResponse.redirect(`${origin}${redirectUrl}`);
}
