import { db } from "@/modules/shared/db";
import { students, classes, routineFees } from "@/modules/shared/schema";
import { eq, lt, and, sql } from "drizzle-orm";
import dayjs from "dayjs";
import { AddStudentDialog } from "./AddStudentDialog";
import { StudentListClient, StudentListType } from "./StudentListClient";

export default async function StudentListPage() {
  const todayStr = dayjs().format("YYYY-MM-DD");

  // Fetch all classes for the Add Student form
  const rawClasses = await db.select().from(classes).orderBy(classes.className);
  // Deduplicate in case of duplicate seeds
  const allClasses = Array.from(
    new Map(rawClasses.map((c) => [c.className, c])).values(),
  );

  // Fetch all students with their class (no database filtering)
  const studentsList = await db
    .select({
      id: students.id,
      slug: students.slug,
      name: students.fullName,
      ku: classes.className,
      avatar: students.avatarUrl,
      adress: students.address,
      isActive: students.isActive,
      birthYear: sql<number>`EXTRACT(YEAR FROM ${students.birthDate})`,
    })
    .from(students)
    .innerJoin(classes, eq(students.classId, classes.id))
    .orderBy(students.fullName);

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

  const studentsWithStatus: StudentListType[] = studentsList.map((student) => {
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

      <StudentListClient students={studentsWithStatus} />
    </div>
  );
}
