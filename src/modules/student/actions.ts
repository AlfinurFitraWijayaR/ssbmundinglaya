"use server";

import { db } from "@/modules/shared/db";
import { profiles, students, classes } from "@/modules/shared/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateStudentProfile(formData: FormData) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("ssb_session");
    if (!sessionCookie) {
      return { success: false, error: "Not authenticated" };
    }

    const session = JSON.parse(sessionCookie.value);

    //  verify the user
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.id, session.id),
      with: { students: true },
    });

    if (!profile || profile.students.length === 0) {
      return { success: false, error: "Profile siswa tidak ditemukan" };
    }

    const studentId = profile.students[0].id;
    const phoneNumber = formData.get("phoneNumber") as string;
    const address = formData.get("address") as string;
    const position = formData.get("position") as string;

    // Update the profile table for phone number
    if (phoneNumber !== profile.phoneNumber) {
      await db
        .update(profiles)
        .set({ phoneNumber })
        .where(eq(profiles.id, session.id));
    }

    // Update the students table
    await db
      .update(students)
      .set({
        address: address || null,
        position: position || null,
      })
      .where(eq(students.id, studentId));

    revalidatePath("/student");
    revalidatePath("/student/profile");

    return { success: true };
  } catch (error: any) {
    console.error("Gagal update profile:", error);
    return {
      success: false,
      error: error.message || "Gagal update profile",
    };
  }
}

export async function addStudent(formData: FormData) {
  try {
    const fullName = formData.get("fullName") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const classId = formData.get("classId") as string;
    const birthDate = formData.get("birthDate") as string;
    const address = formData.get("address") as string;
    const position = formData.get("position") as string;

    if (!fullName || !classId) {
      return { success: false, error: "Nama lengkap dan Kelas wajib diisi" };
    }

    // Generate login code (6 random alphanumeric characters)
    const loginCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Create slug from full name
    const slug =
      fullName.toLowerCase().replace(/[^a-z0-9]+/g, "-") +
      "-" +
      Math.random().toString(36).substring(2, 6);

    let avatarUrl: string | null = null;
    const avatarFile = formData.get("avatarFile") as File | null;

    if (avatarFile && avatarFile.size > 0) {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      const fileName = `students/${slug}.webp`;

      const { error: uploadError } = await supabase.storage
        .from("public")
        .upload(fileName, avatarFile, {
          contentType: "image/webp",
          upsert: true,
        });

      if (uploadError) {
        console.error("Gagal upload avatar:", uploadError);
      } else {
        const { data: publicUrlData } = supabase.storage
          .from("public")
          .getPublicUrl(fileName);
        avatarUrl = publicUrlData.publicUrl;
      }
    }

    // 1. Insert Profile
    const [newProfile] = await db
      .insert(profiles)
      .values({
        fullName,
        phoneNumber: phoneNumber || null,
        loginCode,
        role: "student",
      })
      .returning({ id: profiles.id });

    // 2. Insert Student
    await db.insert(students).values({
      profileId: newProfile.id,
      classId,
      fullName,
      slug,
      birthDate: birthDate || null,
      address: address || null,
      position: position || null,
      avatarUrl,
    });

    revalidatePath("/dashboard/student");
    return { success: true };
  } catch (error: any) {
    console.error("Gagal menambahkan siswa:", error);
    return {
      success: false,
      error: "Terjadi kesalahan saat menyimpan data siswa",
    };
  }
}

export async function updateStudentAvatarAdmin(formData: FormData) {
  try {
    const studentId = formData.get("studentId") as string;
    const slug = formData.get("slug") as string;
    const avatarFile = formData.get("avatarFile") as File | null;

    if (!studentId || !slug || !avatarFile || avatarFile.size === 0) {
      return { success: false, error: "Data tidak lengkap atau file kosong" };
    }

    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    // We add timestamp to avoid browser caching issues when updating
    const fileName = `students/${slug}.webp`;

    const { error: uploadError } = await supabase.storage
      .from("public")
      .upload(fileName, avatarFile, {
        contentType: "image/webp",
        upsert: true,
      });

    if (uploadError) {
      console.error("Gagal upload avatar:", uploadError);
      return { success: false, error: "Gagal upload avatar" };
    }

    const { data: publicUrlData } = supabase.storage
      .from("public")
      .getPublicUrl(fileName);
    const avatarUrl = publicUrlData.publicUrl;

    await db
      .update(students)
      .set({ avatarUrl })
      .where(eq(students.id, studentId));

    revalidatePath(`/dashboard/student/${slug}`);
    revalidatePath("/dashboard/student");
    return { success: true };
  } catch (error: any) {
    console.error("Gagal update avatar:", error);
    return {
      success: false,
      error: "Terjadi kesalahan saat mengupdate avatar",
    };
  }
}

export async function enrollStudentOnline(formData: FormData) {
  try {
    const fullName = formData.get("fullName") as string;
    const nickname = formData.get("nickname") as string;
    const birthDate = formData.get("birthDate") as string;
    const address = formData.get("address") as string;
    const position = formData.get("position") as string;

    if (!fullName || !birthDate) {
      return {
        success: false,
        error: "Nama lengkap dan tanggal lahir wajib diisi",
      };
    }

    // Inference classId from birthYear
    const birthYear = birthDate.split("-")[0];
    let classId = null;

    const dbClass = await db.query.classes.findFirst({
      where: eq(classes.className, birthYear),
    });

    if (dbClass) {
      classId = dbClass.id;
    } else {
      const fallback = await db.query.classes.findFirst();
      if (!fallback) throw new Error("Tidak ada data kelas di database!");
      classId = fallback.id;
    }

    // Generate login code (6 random alphanumeric characters)
    const loginCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Create slug from full name
    const slug =
      fullName.toLowerCase().replace(/[^a-z0-9]+/g, "-") +
      "-" +
      Math.random().toString(36).substring(2, 6);

    let avatarUrl: string | null = null;
    const avatarFile = formData.get("avatarFile") as File | null;

    if (avatarFile && avatarFile.size > 0) {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      const fileName = `students/${slug}.webp`;

      const { error: uploadError } = await supabase.storage
        .from("public")
        .upload(fileName, avatarFile, {
          contentType: "image/webp",
          upsert: true,
        });

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage
          .from("public")
          .getPublicUrl(fileName);
        avatarUrl = publicUrlData.publicUrl;
      }
    }

    // 1. Insert Profile
    const [newProfile] = await db
      .insert(profiles)
      .values({
        fullName,
        phoneNumber: null,
        loginCode,
        role: "student",
      })
      .returning({ id: profiles.id });

    // 2. Insert Student
    await db.insert(students).values({
      profileId: newProfile.id,
      classId,
      fullName,
      nickname: nickname || null,
      slug,
      birthDate: birthDate,
      address: address || null,
      position: position || null,
      avatarUrl,
    });

    // 3. Send Telegram Notification
    const { sendTelegramNotification } = await import("@/lib/telegram");
    const msg =
      `🚨 WEEEY ADMIN, ADA PENDAFTARAN ONLINE BARU 🚨\n\n` +
      `Nama Lengkap: ${fullName}\n` +
      `Nama Panggilan: ${nickname || "-"}\n` +
      `Tanggal Lahir: ${birthDate}\n` +
      `Posisi: ${position || "-"}\n` +
      `Alamat: ${address || "-"}\n` +
      `Kelas Kelahiran: ${birthYear}\n\n` +
      `Silakan cek di Dashboard Admin!`;

    await sendTelegramNotification(msg);

    revalidatePath("/dashboard/student");
    return { success: true };
  } catch (error: any) {
    console.error("Gagal mendaftar online:", error);
    return {
      success: false,
      error: error.message || "Terjadi kesalahan saat mendaftar online",
    };
  }
}

export async function updateStudentAdmin(formData: FormData) {
  try {
    const studentId = formData.get("studentId") as string;
    const fullName = formData.get("fullName") as string;
    const nickname = formData.get("nickname") as string;
    const classId = formData.get("classId") as string;
    const birthDate = formData.get("birthDate") as string;
    const birthPlace = formData.get("birthPlace") as string;
    const address = formData.get("address") as string;
    const position = formData.get("position") as string;
    const isActiveStr = formData.get("isActive") as string;
    const isActive = isActiveStr === "true";

    if (!studentId || !fullName || !classId) {
      return { success: false, error: "ID Siswa, Nama lengkap dan Kelas wajib diisi" };
    }

    // Get current student to see if we need to update profile
    const currentStudent = await db.query.students.findFirst({
      where: eq(students.id, studentId),
    });

    if (!currentStudent) {
      return { success: false, error: "Siswa tidak ditemukan" };
    }

    // Update students table
    await db
      .update(students)
      .set({
        fullName,
        nickname: nickname || null,
        classId,
        birthDate: birthDate || null,
        birthPlace: birthPlace || null,
        address: address || null,
        position: position || null,
        isActive,
      })
      .where(eq(students.id, studentId));

    // Update profiles table if profileId exists
    if (currentStudent.profileId && currentStudent.fullName !== fullName) {
      await db
        .update(profiles)
        .set({ fullName })
        .where(eq(profiles.id, currentStudent.profileId));
    }

    revalidatePath("/dashboard/student");
    revalidatePath(`/dashboard/student/${currentStudent.slug}`);

    return { success: true };
  } catch (error: any) {
    console.error("Gagal update siswa (admin):", error);
    return {
      success: false,
      error: "Terjadi kesalahan saat mengupdate data siswa",
    };
  }
}

