"use server";

import { db } from "../db";
import { routineFees, students } from "../schema";
import { and, eq, isNull, lt } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Generate monthly bills for all active students with "monthly" payment type.
 * This can be called by a cron job or manually by admin at the start of the month.
 */
export async function generateMonthlyBills(month: number, year: number, amount: number = 300000) {
  try {
    const monthlyStudents = await db.query.students.findMany({
      where: eq(students.isActive, true),
    });

    const dueDate = new Date(year, month - 1, 10).toISOString().split('T')[0]; // 10th of the month

    await db.transaction(async (tx) => {
      for (const student of monthlyStudents) {
        // Check if bill already exists
        const existingBill = await tx.query.routineFees.findFirst({
          where: and(
            eq(routineFees.studentId, student.id),
            eq(routineFees.periodMonth, month),
            eq(routineFees.periodYear, year),
            isNull(routineFees.sessionId)
          ),
        });

        if (!existingBill) {
          await tx.insert(routineFees).values({
            studentId: student.id,
            amount: amount.toString(),
            periodMonth: month,
            periodYear: year,
            dueDate: dueDate,
            status: "unpaid",
          });
        }
      }
    });

    revalidatePath("/dashboard/finance");
    return { success: true, count: monthlyStudents.length };
  } catch (error: any) {
    console.error("Error generating monthly bills:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Check and flag overdue bills.
 * Useful for the dashboard indicator.
 * Actually, "overdue" is a derived state (status == 'unpaid' && dueDate < now).
 * But we can provide a helper function to fetch overdue students.
 */
export async function getOverdueStudents() {
  try {
    const nowStr = new Date().toISOString().split('T')[0];
    
    // We fetch fees that are unpaid and due date has passed
    const overdueFees = await db.query.routineFees.findMany({
      where: and(
        eq(routineFees.status, "unpaid"),
        lt(routineFees.dueDate, nowStr)
      ),
      with: {
        student: true,
      }
    });

    return { success: true, data: overdueFees };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
