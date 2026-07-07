import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { db } from "@/modules/shared/db";
import { students, classes, routineFees } from "@/modules/shared/schema";
import { eq, and, sql } from "drizzle-orm";
import dayjs from "dayjs";
import { notFound } from "next/navigation";
import { AvatarUploaderAdmin } from "./AvatarUploaderAdmin";
import { EditStudentModal } from "./EditStudentModal";

export default async function StudentProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch real student data
  const studentData = await db
    .select({
      id: students.id,
      name: students.fullName,
      nickname: students.nickname,
      ku: classes.className,
      classId: students.classId,
      position: students.position,
      address: students.address,
      birthDate: students.birthDate,
      birthPlace: students.birthPlace,
      avatar: students.avatarUrl,
      slug: students.slug,
      isActive: students.isActive,
    })
    .from(students)
    .innerJoin(classes, eq(students.classId, classes.id))
    .where(eq(students.slug, slug))
    .limit(1);

  if (studentData.length === 0) {
    notFound();
  }

  const student = studentData[0];

  // Fetch classes for edit form
  const rawClasses = await db.select().from(classes).orderBy(classes.className);
  const allClasses = Array.from(
    new Map(rawClasses.map((c) => [c.className, c])).values(),
  );

  // Check if they are overdue
  const todayStr = dayjs().format("YYYY-MM-DD");
  const overdueFees = await db
    .select({ count: sql<number>`count(*)` })
    .from(routineFees)
    .where(
      and(
        eq(routineFees.studentId, student.id),
        eq(routineFees.status, "unpaid"),
        sql`${routineFees.dueDate} < ${todayStr}`,
      ),
    );

  const isOverdue = overdueFees[0].count > 0;

  // Mocked skills for now until we have a schema
  const skills = [
    { label: "Dribbling", value: 80, color: "bg-blue-500" },
    { label: "Passing", value: 90, color: "bg-[var(--color-brand-emerald)]" },
    { label: "Shooting", value: 75, color: "bg-[var(--color-brand-gold)]" },
    { label: "Stamina", value: 85, color: "bg-red-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/student">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-gray-200"
          >
            <ArrowLeft className="w-5 h-5 text-zinc-600" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-zinc-800">
          Profil & Rapor Atlet
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Sidebar */}
        <Card className="glass border-gray-200 shadow-sm md:col-span-1">
          <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
            <AvatarUploaderAdmin student={student} />
            <div>
              <h2 className="text-xl font-bold text-zinc-900">
                {student.name}
              </h2>
              <p className="text-zinc-500 text-sm mt-1">
                {student.ku} • Posisi: {student.position || "-"}
              </p>
            </div>
            <div className="w-full pt-4 border-t border-gray-200 flex justify-between px-2 text-sm">
              <span className="text-zinc-500 font-medium">Status Iuran</span>
              {isOverdue ? (
                <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none font-bold">
                  OVERDUE
                </Badge>
              ) : (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none font-bold">
                  LUNAS
                </Badge>
              )}
            </div>
            <EditStudentModal student={student} classes={allClasses} />
          </CardContent>
        </Card>

        {/* Competency & History */}
        <div className="space-y-6 md:col-span-2">
          {/* Competency Radar/Bars (Mocked) */}
          <Card className="glass border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-zinc-800">
                Kompetensi Teknik (Simulasi)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {skills.map((skill, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-700 font-medium">
                      {skill.label}
                    </span>
                    <span className="text-zinc-500">{skill.value}/100</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${skill.color}`}
                      style={{ width: `${skill.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Payment & Attendance Grid */}
          <Card className="glass border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-zinc-800">
                Riwayat Iuran (2026)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-6 gap-2 sm:gap-4">
                {["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"].map(
                  (month, idx) => (
                    <div key={idx} className="text-center space-y-2">
                      <div className="text-xs font-medium text-zinc-500">
                        {month}
                      </div>
                      {/* Simulated data: Red if it's the current month and overdue */}
                      <div
                        className={`h-10 rounded-lg ${idx === 4 && isOverdue ? "bg-red-100 border border-red-200" : "bg-green-100 border border-green-200"} flex items-center justify-center`}
                        title="Status"
                      >
                        {idx === 4 && isOverdue ? "❌" : "💰"}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
