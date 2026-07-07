import { db } from "@/modules/shared/db";
import { students } from "@/modules/shared/schema";
import { ilike, asc, and, sql, eq } from "drizzle-orm";
import { StudentsCard } from "@/components/studentsCard";
import SearchBar from "./SearchBar";
import { Footer } from "@/components/footer";

export const revalidate = 60;

export default async function SiswaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; year?: string }>;
}) {
  const params = await searchParams;
  const q = params.q || "";
  const year = params.year || "all";

  let dataSiswa: any[] = [];
  let availableYears: string[] = [];

  try {
    // Ambil semua tahun lahir unik dari database
    const allSiswa = await db
      .select({ tgl: students.birthDate })
      .from(students);
    const yearsSet = new Set(
      allSiswa
        .map((s) => (s.tgl ? new Date(s.tgl).getFullYear().toString() : null))
        .filter(Boolean),
    );
    availableYears = Array.from(yearsSet).sort(
      (a, b) => Number(b) - Number(a),
    ) as string[];

    const conditions = [];
    if (q) {
      conditions.push(ilike(students.fullName, `%${q}%`));
    }
    if (year !== "all") {
      conditions.push(
        sql`EXTRACT(YEAR FROM ${students.birthDate})::text = ${year}`,
      );
    }
    conditions.push(eq(students.isActive, true));

    const rawStudents = await db
      .select({
        id: students.id,
        slug: students.slug,
        nama: students.fullName,
        foto: students.avatarUrl,
        tempatLahir: students.birthPlace,
        tanggalLahir: students.birthDate,
        createdAt: students.createdAt,
      })
      .from(students)
      .where(and(...conditions))
      .orderBy(asc(students.fullName));

    dataSiswa = rawStudents.map((s) => ({
      id: s.id,
      slug: s.slug,
      nama: s.nama,
      foto: s.foto,
      posisi: "-", // Schema baru belum memiliki field posisi khusus
      tahunMasuk: s.createdAt
        ? new Date(s.createdAt).getFullYear().toString()
        : null,
      tempatLahir: s.tempatLahir,
      tanggalLahir: s.tanggalLahir,
    }));
  } catch (e) {
    console.error("Database not connected yet", e);
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-10 pb-12">
      <h1 className="text-2xl md:text-4xl font-bold text-brand-maroon dark:text-brand-gold mb-4">
        Daftar Siswa
      </h1>
      <SearchBar
        currentQ={q}
        currentYear={year}
        availableYears={availableYears}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        {dataSiswa.length > 0 ? (
          dataSiswa.map((s) => (
            <StudentsCard
              key={s.id}
              student={{
                slug: s.slug,
                nama: s.nama,
                foto: s.foto,
                posisi: s.posisi,
                tahunMasuk: s.tahunMasuk,
                tempatLahir: s.tempatLahir,
                tanggalLahir: s.tanggalLahir,
              }}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-card rounded-2xl border border-border">
            <h3 className="text-xl font-semibold">Siswa tidak ditemukan</h3>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
