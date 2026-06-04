"use server";

import { db } from "@/modules/shared/db";
import { routineFees, cashFlow } from "@/modules/shared/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import dayjs from "dayjs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY! ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // Fallback if service key missing
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function approvePayment(feeId: string) {
  try {
    // 1. Fetch fee details
    const feeRecord = await db.query.routineFees.findFirst({
      where: eq(routineFees.id, feeId),
    });

    if (!feeRecord) {
      return { success: false, error: "Data iuran tidak ditemukan." };
    }

    if (feeRecord.status === "paid") {
      return { success: false, error: "Iuran sudah berstatus lunas." };
    }

    const todayStr = dayjs().format("YYYY-MM-DD");

    // 2. Update status fee
    await db
      .update(routineFees)
      .set({
        status: "paid",
        paymentMethod: "transfer",
        paidAt: new Date(),
      })
      .where(eq(routineFees.id, feeId));

    // 3. Create cash flow record (Uang Masuk)
    let title = "Iuran Sesi Latihan";
    if (feeRecord.periodMonth && feeRecord.periodYear) {
      title = `Iuran Bulanan - Bulan ${feeRecord.periodMonth} ${feeRecord.periodYear}`;
    }

    await db.insert(cashFlow).values({
      type: "in",
      title: title,
      amount: feeRecord.amount,
      transactionDate: todayStr,
      // createdBy biarkan kosong atau isi ID admin jika ada context session
    });

    revalidatePath("/dashboard/payment");
    revalidatePath("/dashboard/finance");
    return { success: true };
  } catch (error: any) {
    console.error("Approve payment error:", error);
    return { success: false, error: "Kesalahan internal server." };
  }
}

export async function rejectPayment(feeId: string) {
  try {
    const feeRecord = await db.query.routineFees.findFirst({
      where: eq(routineFees.id, feeId),
    });

    if (!feeRecord || !feeRecord.evidenceUrl) {
      return {
        success: false,
        error: "Data iuran atau bukti tidak ditemukan.",
      };
    }

    // 1. Delete image from Supabase Storage
    const { error: storageError } = await supabase.storage
      .from("public")
      .remove([feeRecord.evidenceUrl]);

    if (storageError) {
      console.error("Failed to delete image from storage:", storageError);
      // We can still proceed to clear it from DB so user can re-upload
    }

    // 2. Clear evidenceUrl in DB
    await db
      .update(routineFees)
      .set({ evidenceUrl: null })
      .where(eq(routineFees.id, feeId));

    revalidatePath("/dashboard/payment");
    return { success: true };
  } catch (error: any) {
    console.error("Reject payment error:", error);
    return { success: false, error: "Kesalahan internal server." };
  }
}
