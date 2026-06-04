"use server";

import { db } from "@/modules/shared/db";
import { students, coaches } from "@/modules/shared/schema";
import { sql } from "drizzle-orm";

export async function getDashboardStats() {
  try {
    const studentResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(students);
      
    const coachResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(coaches);

    return {
      siswa: Number(studentResult[0]?.count || 0),
      pelatih: Number(coachResult[0]?.count || 0),
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return { siswa: 0, pelatih: 0 };
  }
}
