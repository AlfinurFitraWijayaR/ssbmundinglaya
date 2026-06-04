import { db } from "@/modules/shared/db";
import { profiles } from "@/modules/shared/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ProfileForm } from "./ProfileForm";

export default async function StudentProfilePage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("ssb_session");

  if (!sessionCookie) {
    redirect("/login");
  }

  let session;
  try {
    session = JSON.parse(sessionCookie.value);
  } catch {
    redirect("/login");
  }

  const profileData = await db.query.profiles.findFirst({
    where: eq(profiles.id, session.id),
    with: {
      students: {
        with: {
          class: true,
        }
      }
    },
  });

  if (!profileData || profileData.students.length === 0) {
    redirect("/login");
  }

  const student = profileData.students[0];

  return <ProfileForm student={student} profile={profileData} />;
}
