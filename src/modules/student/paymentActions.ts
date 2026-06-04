"use server";

import { db } from "@/modules/shared/db";
import { routineFees, students } from "@/modules/shared/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { sendTelegramPhoto } from "@/lib/telegram";
import dayjs from "dayjs";
import "dayjs/locale/id";

dayjs.locale("id");

export async function submitPaymentEvidence(feeId: string, path: string) {
  try {
    if (!feeId || !path) {
      return { success: false, error: "ID Iuran atau File tidak valid." };
    }

    await db
      .update(routineFees)
      .set({ evidenceUrl: path })
      .where(eq(routineFees.id, feeId));

    // Get details for telegram notification
    const feeDetails = await db
      .select({
        amount: routineFees.amount,
        periodMonth: routineFees.periodMonth,
        periodYear: routineFees.periodYear,
        sessionId: routineFees.sessionId,
        studentName: students.fullName,
      })
      .from(routineFees)
      .innerJoin(students, eq(routineFees.studentId, students.id))
      .where(eq(routineFees.id, feeId))
      .limit(1);

    if (feeDetails.length > 0) {
      const data = feeDetails[0];
      const publicUrl = `${process.env.NEXT_PUBLIC_BASE_CDN_URL || process.env.NEXT_PUBLIC_SUPABASE_URL + "/storage/v1/object/public"}/${path}`;

      let label = "Sesi Latihan";
      if (data.periodMonth) {
        label = `Bulanan (${dayjs()
          .month(data.periodMonth - 1)
          .format("MMMM")} ${data.periodYear})`;
      }

      const caption = `🚨 *BUKTI TRANSFER BARU* \n\n*Nama:* ${data.studentName}\n*Iuran:* ${label}\n*Nominal:* Rp ${Number(data.amount).toLocaleString("id-ID")}\n\nSilakan periksa dan verifikasi di Dashboard Admin!`;

      // Kirim Notifikasi via Telegram secara asynchronous tanpa memblokir
      sendTelegramPhoto(publicUrl, caption).catch((err) =>
        console.error("Telegram error:", err),
      );
    }

    // Revalidate paths that might show payment data
    revalidatePath("/student/payments");
    revalidatePath("/student");

    return { success: true };
  } catch (error: any) {
    console.error("Failed to submit payment evidence:", error);
    return { success: false, error: "Terjadi kesalahan server." };
  }
}
