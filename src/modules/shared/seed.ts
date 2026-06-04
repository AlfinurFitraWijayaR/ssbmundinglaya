import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { sql } from "drizzle-orm";
import dotenv from "dotenv";
dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL tidak ditemukan di environment variable!");
}

const client = postgres(connectionString, { max: 1 });
const db = drizzle(client, { schema });

// Fungsi helper untuk mengubah format tanggal Indonesia ke format database (YYYY-MM-DD)
function parseDateIndo(rawBirthPlaceAndDate: string): string | null {
  try {
    const parts = rawBirthPlaceAndDate.split(",");
    if (parts.length < 2) return null;

    const dateStr = parts[1].trim().toLowerCase(); // contoh: "9 juni 2011"
    const dateParts = dateStr.split(" ");
    if (dateParts.length !== 3) return null;

    const day = dateParts[0].padStart(2, "0");
    const monthStr = dateParts[1];
    const year = dateParts[2];

    const months: Record<string, string> = {
      januari: "01",
      februari: "02",
      maret: "03",
      april: "04",
      mei: "05",
      juni: "06",
      juli: "07",
      agustus: "08",
      september: "09",
      oktober: "10",
      november: "11",
      desember: "12",
    };

    const month = months[monthStr];
    if (!month) return null;

    return `${year}-${month}-${day}`;
  } catch (e) {
    return null;
  }
}

async function main() {
  const classesToInsert = [];
  for (let year = 2007; year <= 2018; year++) {
    classesToInsert.push({
      className: year.toString(),
      description: `kelompok umur kelahiran tahun ${year}`,
    });
  }

  const insertedClasses = await db
    .insert(schema.classes)
    .values(classesToInsert)
    .returning();

  // ==========================================
  // 10. DATA CAMPURAN / SUSULAN (BERBAGAI KU)
  // ==========================================
  console.log("✨ Memproses data campuran/susulan...");

  // Fungsi helper tambahan untuk handle format tanggal campuran (teks indo & format angka DD-MM-YYYY)
  function parseCampuranDate(rawDate: string): string | null {
    try {
      const cleanDate = rawDate.trim().toLowerCase();

      // Handle format angka seperti "5-11-2017" atau "05-11-2017"
      if (cleanDate.includes("-")) {
        const parts = cleanDate.split("-");
        if (parts.length === 3) {
          const day = parts[0].padStart(2, "0");
          const month = parts[1].padStart(2, "0");
          const year = parts[2];
          return `${year}-${month}-${day}`;
        }
      }

      // Handle format teks seperti "12 juni 2015" atau "januari 2015"
      const dateParts = cleanDate.split(" ");
      const months: Record<string, string> = {
        januari: "01",
        februari: "02",
        maret: "03",
        april: "04",
        mei: "05",
        juni: "06",
        juli: "07",
        agustus: "08",
        september: "09",
        oktober: "10",
        november: "11",
        desember: "12",
      };

      if (dateParts.length === 3) {
        const day = dateParts[0].padStart(2, "0");
        const monthStr = dateParts[1];
        const year = dateParts[2];
        const month = months[monthStr];
        return month ? `${year}-${month}-${day}` : null;
      }

      // Handle jika hanya tertulis bulan dan tahun saja seperti "januari 2015" (set tanggal default ke 01)
      if (dateParts.length === 2) {
        const monthStr = dateParts[0];
        const year = dateParts[1];
        const month = months[monthStr];
        return month ? `${year}-${month}-01` : null;
      }

      return null;
    } catch (e) {
      return null;
    }
  }

  const rawMixedStudentsData = [
    {
      fullName: "ELZIO YURISTAN ALFATH",
      birth: "12 JUNI 2015",
      address: "MEKARSARI, DOMAS",
      phone: "",
      nickname: "elzio",
    },
    {
      fullName: "ADAM RADITYA CAHYA",
      birth: "22 NOVEMBER 2015",
      address: "BLOK CALINGCING, SUKASARI KIDUL",
      phone: "",
      nickname: "adam",
    },
    {
      fullName: "SAIF IQBAL KARIM",
      birth: "10 JULI 2015",
      address: "BLOK SENIN, SUKASARI KALER",
      phone: "",
      nickname: "saif",
    },
    {
      fullName: "NAZIQ BAYHAQQI",
      birth: "JANUARI 2015",
      address: "BLOK SUKAMANDI, PASANGGRAHAN",
      phone: "",
      nickname: "naziq",
    },
    {
      fullName: "ADITYA IBNU FAJAR",
      birth: "6 DESEMBER 2014",
      address: "BLOK SENEN, SUKASARI KALER",
      phone: "",
      nickname: "aditya",
    },
    {
      fullName: "AZFAR RAHMAN SOLEHUDIN",
      birth: "22 MARET 2014",
      address: "BLON SENEN, SUKASARI KALER",
      phone: "",
      nickname: "azfar",
    },
    {
      fullName: "GALIH RAMADANI",
      birth: "31 JULI 2013",
      address: "BLOK MEKARSARI, SUKASARI KIDUL",
      phone: "",
      nickname: "galih",
    },
    {
      fullName: "ANDRA DESTA RAIN",
      birth: "6 DESEMBER 2012",
      address: "BLOK DESA, DESA SUKADANA",
      phone: "",
      nickname: "andra",
    },
    {
      fullName: "PABIANSYAH",
      birth: "23 OKTOBER 2013",
      address: "BLOK DESA, DESA SUKADANA",
      phone: "",
      nickname: "pabiansyah",
    },
    {
      fullName: "MUHAMMAD AL ZAKI PRADISTIRA",
      birth: "25 MEI 2013",
      address: "BLOK DESA, DESA SUKADANA",
      phone: "",
      nickname: "zaki",
    },
    {
      fullName: "ADIT",
      birth: "29 JANUARI 2016",
      address: "BLOK SENIN, SUKASARI KALER",
      phone: "",
      nickname: "adit",
    },
    {
      fullName: "MUHAMMAD BILLAL MUZAKI",
      birth: "5-11-2017",
      address: "DESA SAGARA",
      phone: "",
      nickname: "billal",
    },
  ];

  console.log(
    "✨ Memasukkan data siswa campuran ke kelas masing-masing secara dinamis...",
  );

  for (let i = 0; i < rawMixedStudentsData.length; i++) {
    const item = rawMixedStudentsData[i];

    const cleanFullName = item.fullName.toLowerCase();
    const cleanNickname = item.nickname.toLowerCase();
    const cleanAddress = item.address.toLowerCase();
    const cleanSlug = cleanFullName
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Konversi tanggal campuran ke format YYYY-MM-DD
    const dbBirthDate = parseCampuranDate(item.birth);

    // Deteksi tahun lahir dari tanggal hasil konversi. Jika gagal, default ke 2015
    const birthYear = dbBirthDate ? dbBirthDate.split("-")[0] : "2015";

    // 1. CARI KELAS YANG COCOK BERDASARKAN TAHUN LAHIR SECARA DINAMIS
    const targetClassName = `${birthYear}`;
    const matchedClass = insertedClasses.find(
      (c) => c.className === targetClassName,
    );

    // Jika kelas tidak ditemukan (misal di luar range 2007-2018), lewati atau default ke ku-2015
    const finalClassId = matchedClass
      ? matchedClass.id
      : insertedClasses.find((c) => c.className === "2015")?.id;

    if (!finalClassId)
      throw new Error(`Gagal memetakan kelas untuk tahun ${birthYear}`);

    // 2. HITUNG NOMOR URUT DATA CAMPURAN BERDASARKAN INDEKS SCRIPT
    // Agar kode login tetap unik terstruktur: ml + tahun lahir + nomor urut campuran
    const nomorUrut = String(i + 1).padStart(2, "0");
    const customLoginCode = `ml${birthYear}${nomorUrut}`;

    // A. Masukkan ke tabel profiles
    const [profile] = await db
      .insert(schema.profiles)
      .values({
        fullName: cleanFullName,
        role: "student",
        phoneNumber: item.phone || null,
        loginCode: null,
      })
      .returning();

    // B. Masukkan ke tabel students dengan classId hasil pemetaan dinamis di atas
    await db.insert(schema.students).values({
      profileId: profile.id,
      classId: finalClassId, // Terisi otomatis sesuai KU tahun lahir masing-masing anak
      fullName: cleanFullName,
      nickname: cleanNickname,
      slug: cleanSlug,
      address: cleanAddress,
      birthPlace: "majalengka", // Default jika tidak dicantumkan di teks campuran
      birthDate: dbBirthDate,
      isActive: true,
    });
  }

  console.log("🚀 sukses dibuat, & data siswa telah masuk");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Proses seeding gagal:", err);
  process.exit(1);
});
