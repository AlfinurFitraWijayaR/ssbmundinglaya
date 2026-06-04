import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { db } from "@/modules/shared/db";
import { students, classes } from "@/modules/shared/schema";
import { eq } from "drizzle-orm";
import { ReportForm } from "./ReportForm";

export default async function CoachReportPage() {
  const studentsList = await db
    .select({
      id: students.id,
      name: students.fullName,
      ku: classes.className,
    })
    .from(students)
    .innerJoin(classes, eq(students.classId, classes.id))
    .where(eq(students.isActive, true))
    .orderBy(students.fullName);

  return (
    <div className="min-h-screen bg-gray-50 aurora-bg text-gray-900 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 glass border-b border-gray-200 px-4 py-3 flex items-center gap-3 shadow-sm">
        <Link href="/coach">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Button>
        </Link>
        <div>
          <h1 className="font-bold text-gray-900 text-lg">Buat Laporan Evaluasi</h1>
          <p className="text-xs text-[var(--color-brand-emerald)] font-medium">Bulan Ini</p>
        </div>
      </header>

      <ReportForm students={studentsList} />
    </div>
  );
}
