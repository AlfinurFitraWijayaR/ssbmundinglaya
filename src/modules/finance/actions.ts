"use server";

import { db } from "@/modules/shared/db";
import { cashFlow } from "@/modules/shared/schema";
import { revalidatePath } from "next/cache";

export async function addCashFlow(formData: FormData) {
  try {
    const type = formData.get("type") as "in" | "out";
    const title = formData.get("title") as string;
    const amountStr = formData.get("amount") as string;
    const dateStr = formData.get("date") as string;

    if (!title || !amountStr || !dateStr) {
      return { success: false, error: "Harap lengkapi semua data" };
    }

    await db.insert(cashFlow).values({
      type,
      title,
      amount: amountStr,
      transactionDate: dateStr,
    });

    revalidatePath("/dashboard/finance");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to add cash flow:", error);
    return { success: false, error: "Gagal mencatat transaksi" };
  }
}
