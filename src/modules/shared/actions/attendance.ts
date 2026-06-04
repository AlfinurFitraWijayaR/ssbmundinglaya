"use server";

import { db } from "../db";
import { attendance, routineFees } from "../schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type AttendanceInput = {
  studentId: string;
  status: "present" | "permission" | "sick" | "absent";
  feeStatus?: "paid" | "unpaid";
  feeAmount?: number;
};

export async function recordAttendanceAndPayment(
  sessionId: string,
  attendanceData: AttendanceInput[],
) {
  try {
    await db.transaction(async (tx) => {
      for (const data of attendanceData) {
        const existingAttendance = await tx.query.attendance.findFirst({
          where: and(
            eq(attendance.sessionId, sessionId),
            eq(attendance.studentId, data.studentId),
          ),
        });

        if (existingAttendance) {
          await tx
            .update(attendance)
            .set({ status: data.status })
            .where(eq(attendance.id, existingAttendance.id));
        } else {
          await tx.insert(attendance).values({
            sessionId,
            studentId: data.studentId,
            status: data.status,
          });
        }

        // 2. Daily payment logic for all students
        // Check if a fee record exists for this session
        const existingFee = await tx.query.routineFees.findFirst({
          where: and(
            eq(routineFees.studentId, data.studentId),
            eq(routineFees.sessionId, sessionId),
          ),
        });

        if (data.status === "present") {
          const feeStatus = data.feeStatus || "unpaid";
          const amount = data.feeAmount || 5000;

          if (existingFee) {
            await tx
              .update(routineFees)
              .set({
                status: feeStatus,
                paymentMethod: feeStatus === "paid" ? "cash" : null,
                paidAt: feeStatus === "paid" ? new Date() : null,
                amount: amount.toString(),
              })
              .where(eq(routineFees.id, existingFee.id));
          } else {
            await tx.insert(routineFees).values({
              studentId: data.studentId,
              sessionId: sessionId,
              amount: amount.toString(),
              dueDate: new Date().toISOString().split('T')[0],
              status: feeStatus,
              paymentMethod: feeStatus === "paid" ? "cash" : null,
              paidAt: feeStatus === "paid" ? new Date() : null,
            });
          }
        } else {
          // If they are not present, delete the session fee if it exists (they shouldn't be charged)
          if (existingFee) {
            await tx
              .delete(routineFees)
              .where(eq(routineFees.id, existingFee.id));
          }
        }
      }
    });

    revalidatePath("/coach/attendance");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Error in recordAttendanceAndPayment:", error);
    return {
      success: false,
      error: error.message || "Failed to record attendance",
    };
  }
}
