"use server";

import { db } from "@/modules/shared/db";
import { attendance, routineFees, sessions } from "@/modules/shared/schema";
import { revalidatePath } from "next/cache";
import { and, eq, isNull } from "drizzle-orm";

export type StudentAttendanceData = {
  studentId: string;
  classId: string;
  status: "present" | "permission" | "sick" | "absent";
  feeStatus?: "paid" | "unpaid";
  monthsToPay?: number;
};

export async function saveAttendance(studentsData: StudentAttendanceData[]) {
  try {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    // 1. Grouping siswa yang memiliki classId yang sama
    const studentsByClass: Record<string, StudentAttendanceData[]> = {};
    for (const student of studentsData) {
      if (!studentsByClass[student.classId]) {
        studentsByClass[student.classId] = [];
      }
      studentsByClass[student.classId].push(student);
    }

    // 2. Membuat session untuk setiap classId yang ada
    for (const classId of Object.keys(studentsByClass)) {
      const [newSession] = await db
        .insert(sessions)
        .values({
          classId,
        })
        .returning({ id: sessions.id });

      const sessionId = newSession.id;
      const classStudents = studentsByClass[classId];

      for (const student of classStudents) {
        // 3. Memasukan data absensi
        await db.insert(attendance).values({
          sessionId,
          studentId: student.studentId,
          status: student.status,
        });

        // 4. Memasukan data biaya harian
        if (student.status === "present") {
          const feeStatus = student.feeStatus || "unpaid";
          await db.insert(routineFees).values({
            studentId: student.studentId,
            sessionId,
            amount: "5000",
            dueDate: new Date().toISOString().split("T")[0],
            status: feeStatus,
            paymentMethod: feeStatus === "paid" ? "cash" : null,
            paidAt: feeStatus === "paid" ? new Date() : null,
          });
        }

        // 5. Handle Biaya Bulanan (SPP)
        // Pastikan tagihan bulan ini sudah di-generate
        const existingMonthlyFee = await db.query.routineFees.findFirst({
          where: and(
            eq(routineFees.studentId, student.studentId),
            eq(routineFees.periodMonth, currentMonth),
            eq(routineFees.periodYear, currentYear),
            isNull(routineFees.sessionId),
          ),
        });

        if (!existingMonthlyFee) {
          await db.insert(routineFees).values({
            studentId: student.studentId,
            amount: "25000",
            periodMonth: currentMonth,
            periodYear: currentYear,
            dueDate: new Date(currentYear, currentMonth - 1, 10).toISOString().split("T")[0],
            status: "unpaid",
          });
        }

        // Proses pelunasan bertahap (bayar tunggakan terlama lebih dulu)
        const payCount = student.monthsToPay || 0;
        if (payCount > 0) {
          const unpaidFees = await db.query.routineFees.findMany({
            where: and(
              eq(routineFees.studentId, student.studentId),
              eq(routineFees.status, "unpaid"),
              isNull(routineFees.sessionId),
            ),
            orderBy: (fields, { asc }) => [asc(fields.periodYear), asc(fields.periodMonth)],
            limit: payCount,
          });

          for (const fee of unpaidFees) {
            await db
              .update(routineFees)
              .set({
                status: "paid",
                paymentMethod: "cash",
                paidAt: new Date(),
              })
              .where(eq(routineFees.id, fee.id));
          }
        }
      }
    }

    revalidatePath("/coach");
    return { success: true };
  } catch (error: any) {
    console.error("Gagal menyimpan absensi:", error);
    return {
      success: false,
      error: "Terjadi kesalahan saat menyimpan data absensi",
    };
  }
}
