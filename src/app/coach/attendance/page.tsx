import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { db } from "@/modules/shared/db";
import { routineFees, students } from "@/modules/shared/schema";
import { eq, and, sql, isNull } from "drizzle-orm";
import { AttendanceForm } from "./AttendanceForm";

export default async function CoachAttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string }>;
}) {
  const params = await searchParams;
  const year = params.year;

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  // Subquery untuk menghitung jumlah iuran bulanan yang belum dibayar
  const unpaidCountsSubquery = db
    .select({
      studentId: routineFees.studentId,
      count: sql<number>`count(*)`.as("unpaid_count"),
    })
    .from(routineFees)
    .where(and(eq(routineFees.status, "unpaid"), isNull(routineFees.sessionId)))
    .groupBy(routineFees.studentId)
    .as("unpaid_counts");

  const filters = [eq(students.isActive, true)];

  if (year && year !== "all") {
    filters.push(sql`EXTRACT(YEAR FROM ${students.birthDate}) = ${Number(year)}`);
  }

  // Query untuk mengambil data siswa dan status iuran bulanan
  const classStudentsData = await db
    .select({
      id: students.id,
      name: students.fullName,
      classId: students.classId,
      monthlyFeeStatus: routineFees.status,
      unpaidMonthsCount: sql<number>`COALESCE(${unpaidCountsSubquery.count}, 0)`,
    })
    .from(students)
    .leftJoin(
      routineFees,
      and(
        eq(routineFees.studentId, students.id),
        eq(routineFees.periodMonth, currentMonth),
        eq(routineFees.periodYear, currentYear),
        isNull(routineFees.sessionId),
      ),
    )
    .leftJoin(
      unpaidCountsSubquery,
      eq(students.id, unpaidCountsSubquery.studentId),
    )
    .where(and(...filters))
    .orderBy(students.fullName);

  // Membersihkan format data
  const classStudents = classStudentsData.map((s) => {
    let owed = Number(s.unpaidMonthsCount);
    // Jika tagihan bulan ini belum dibuat, berarti dia juga menunggak bulan ini
    if (s.monthlyFeeStatus === null) {
      owed += 1;
    }

    return {
      id: s.id,
      name: s.name,
      classId: s.classId,
      totalOwedMonths: owed,
    };
  });

  // Mengambil tahun kelahiran siswa
  const distinctYearsData = await db
    .select({
      year: sql<number>`EXTRACT(YEAR FROM ${students.birthDate})`,
    })
    .from(students)
    .where(
      and(eq(students.isActive, true), sql`${students.birthDate} IS NOT NULL`),
    )
    .groupBy(sql`EXTRACT(YEAR FROM ${students.birthDate})`)
    .orderBy(sql`EXTRACT(YEAR FROM ${students.birthDate}) DESC`);

  const availableYears = distinctYearsData.map((d) => Number(d.year));

  return (
    <div className="min-h-screen bg-gray-50 aurora-bg text-gray-900 pb-24">
      {/* Mobile Header */}
      <header className="sticky top-0 z-10 glass border-b border-gray-200 px-2 py-3 flex items-center gap-2 shadow-sm">
        <Link href="/coach">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Button>
        </Link>
        <div>
          <h1 className="font-semibold text-zinc-800">Absensi Latihan</h1>
        </div>
      </header>

      <AttendanceForm
        initialYear={year || "all"}
        initialStudents={classStudents}
        availableYears={availableYears}
      />
    </div>
  );
}
