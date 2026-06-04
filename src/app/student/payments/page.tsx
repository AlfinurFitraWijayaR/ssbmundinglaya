import { db } from "@/modules/shared/db";
import { profiles } from "@/modules/shared/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ClientPaymentPage from "./ClientPaymentPage";

export default async function StudentPaymentsPage() {
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
          routineFees: true,
        },
      },
    },
  });

  if (!profileData || profileData.students.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <p className="text-gray-500">Data siswa tidak ditemukan.</p>
      </div>
    );
  }

  const student = profileData.students[0];

  // Sort payments by due date (newest first)
  const sortedFees = (student.routineFees || []).sort((a, b) => {
    return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
  });

  // Convert decimal to string to avoid serialization errors from server to client
  const serializedFees = sortedFees.map(f => ({
    ...f,
    amount: String(f.amount),
    paidAt: f.paidAt ? f.paidAt.toISOString() : null,
    dueDate: f.dueDate, // assuming date string from db
    paymentMethod: f.paymentMethod,
  }));

  return <ClientPaymentPage fees={serializedFees as any} studentName={student.fullName} studentClass={student.class.className} />;
}
