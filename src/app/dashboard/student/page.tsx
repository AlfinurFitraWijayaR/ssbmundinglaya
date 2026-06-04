import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { db } from "@/modules/shared/db";
import { students, classes, routineFees } from "@/modules/shared/schema";
import { eq, lt, and, sql, ilike } from "drizzle-orm";
import dayjs from "dayjs";
import { AddStudentDialog } from "./AddStudentDialog";
import { StudentFilters } from "./StudentFilters";

export default async function StudentListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; year?: string }>;
}) {
  const params = await searchParams;
  const q = params.q || "";
  const year = params.year || "";
  const todayStr = dayjs().format("YYYY-MM-DD");

  // Fetch all classes for the Add Student form
  const rawClasses = await db.select().from(classes).orderBy(classes.className);
  // Deduplicate in case of duplicate seeds
  const allClasses = Array.from(
    new Map(rawClasses.map((c) => [c.className, c])).values(),
  );

  // Build conditions for fetching students
  const filters = [];
  if (q) {
    filters.push(ilike(students.fullName, `%${q}%`));
  }
  if (year && year !== "all") {
    filters.push(
      sql`EXTRACT(YEAR FROM ${students.birthDate}) = ${Number(year)}`,
    );
  }

  // Fetch all students with their class (with filters applied)
  const studentsListQuery = db
    .select({
      id: students.id,
      slug: students.slug,
      name: students.fullName,
      ku: classes.className,
      avatar: students.avatarUrl,
      adress: students.address,
      isActive: students.isActive,
    })
    .from(students)
    .innerJoin(classes, eq(students.classId, classes.id))
    .orderBy(students.fullName);

  if (filters.length > 0) {
    studentsListQuery.where(and(...filters));
  }

  const studentsList = await studentsListQuery;

  // Fetch overdue statuses
  const overdueFees = await db
    .select({
      studentId: routineFees.studentId,
      count: sql<number>`count(*)`,
    })
    .from(routineFees)
    .where(
      and(eq(routineFees.status, "unpaid"), lt(routineFees.dueDate, todayStr)),
    )
    .groupBy(routineFees.studentId);

  const overdueMap = new Map<string, boolean>();
  overdueFees.forEach((fee) => {
    overdueMap.set(fee.studentId as string, fee.count > 0);
  });

  const studentsWithStatus = studentsList.map((student) => {
    const isOverdue = overdueMap.get(student.id) || false;

    return {
      ...student,
      isOverdue,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-800">
            Manajemen Siswa
          </h1>
        </div>
        <AddStudentDialog classes={allClasses} />
      </div>

      <StudentFilters />

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50 border-b border-gray-200">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-zinc-600 font-semibold">
                Profil
              </TableHead>
              <TableHead className="text-zinc-600 font-semibold">
                Kelahiran
              </TableHead>
              <TableHead className="text-zinc-600 font-semibold">
                Alamat
              </TableHead>
              <TableHead className="text-right text-zinc-600 font-semibold">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {studentsWithStatus.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-zinc-500 py-8"
                >
                  {q || year
                    ? "Tidak ada siswa yang cocok dengan filter pencarian."
                    : "Belum ada siswa yang terdaftar."}
                </TableCell>
              </TableRow>
            ) : (
              studentsWithStatus.map((student) => (
                <TableRow
                  key={student.id}
                  className={`border-gray-100 hover:bg-gray-50 transition-colors ${student.isOverdue ? "bg-red-50/30" : ""}`}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/dashboard/student/${student.slug}`}
                        className="hover:text-[var(--color-brand-emerald)] transition-colors"
                      >
                        <span className="text-zinc-900 block font-bold">
                          {student.name}
                        </span>
                        {!student.isActive && (
                          <span className="text-xs text-red-500 font-normal">
                            Tidak Aktif
                          </span>
                        )}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-600">{student.ku}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="text-zinc-600 capitalize"
                    >
                      {student.adress}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/dashboard/student/${student.slug}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-zinc-900"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
