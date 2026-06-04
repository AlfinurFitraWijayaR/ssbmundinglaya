import { db } from "@/modules/shared/db";
import { classes, students, routineFees, sessions } from "@/modules/shared/schema";
import { eq, asc } from "drizzle-orm";
import PaymentMonitorClient from "./PaymentMonitorClient";

export default async function PaymentMonitorPage() {
  // Fetch all classes
  const classList = await db
    .select({
      id: classes.id,
      className: classes.className,
    })
    .from(classes)
    .orderBy(asc(classes.className));

  // Fetch all active students with their class name
  const studentList = await db
    .select({
      id: students.id,
      fullName: students.fullName,
      classId: students.classId,
      className: classes.className,
    })
    .from(students)
    .innerJoin(classes, eq(students.classId, classes.id))
    .where(eq(students.isActive, true))
    .orderBy(asc(students.fullName));

  // Fetch all routine fees (monthly + session)
  const feeList = await db
    .select({
      studentId: routineFees.studentId,
      periodMonth: routineFees.periodMonth,
      periodYear: routineFees.periodYear,
      status: routineFees.status,
      sessionId: routineFees.sessionId,
      sessionDate: sessions.sessionDate,
    })
    .from(routineFees)
    .leftJoin(sessions, eq(routineFees.sessionId, sessions.id));

  // Fetch Pending Verifications
  const pendingFeesRaw = await db
    .select({
      id: routineFees.id,
      amount: routineFees.amount,
      periodMonth: routineFees.periodMonth,
      periodYear: routineFees.periodYear,
      sessionId: routineFees.sessionId,
      evidenceUrl: routineFees.evidenceUrl,
      studentId: routineFees.studentId,
      studentName: students.fullName,
      className: classes.className,
    })
    .from(routineFees)
    .innerJoin(students, eq(routineFees.studentId, students.id))
    .innerJoin(classes, eq(students.classId, classes.id))
    .where(eq(routineFees.status, "unpaid")); // will filter by evidenceUrl in JS to avoid Drizzle type issues if not pushed properly yet, or just filter in JS

  const pendingVerifications = pendingFeesRaw
    .filter(f => f.evidenceUrl !== null && f.evidenceUrl !== "")
    .map(f => ({
      ...f,
      amount: String(f.amount),
    }));

  // Serialize for client
  const serializedFees = feeList
    .map((f) => {
      let month = f.periodMonth;
      let year = f.periodYear;

      if (f.sessionId && f.sessionDate) {
        const date = new Date(f.sessionDate);
        month = date.getMonth() + 1;
        year = date.getFullYear();
      }

      return {
        studentId: f.studentId,
        periodMonth: month as number,
        periodYear: year as number,
        status: f.status,
        sessionId: f.sessionId,
        sessionDate: f.sessionDate,
      };
    })
    .filter((f) => f.periodMonth !== null && f.periodYear !== null);

  return (
    <PaymentMonitorClient
      classList={classList}
      studentList={studentList}
      feeList={serializedFees}
      pendingVerifications={pendingVerifications}
    />
  );
}
