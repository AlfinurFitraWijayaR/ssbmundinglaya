import { CoachesCard } from "@/components/coachesCard";
import { Footer } from "@/components/footer";
import { db } from "@/modules/shared/db";
import { coaches, profiles } from "@/modules/shared/schema";
import { eq } from "drizzle-orm";

export const revalidate = 60; // ISR 60 seconds

export default async function CoachesPage() {
  let dataPelatih: any[] = [];
  try {
    const rawCoaches = await db
      .select({
        id: coaches.id,
        slug: coaches.slug,
        nama: profiles.fullName,
        address: coaches.address,
        tanggalLahir: coaches.birthDate,
        foto: coaches.url,
        licence: coaches.license,
        cvFile: coaches.cv,
      })
      .from(coaches)
      .innerJoin(profiles, eq(coaches.profileId, profiles.id));

    dataPelatih = rawCoaches;
  } catch (e) {
    console.error("Database connection error", e);
  }

  return (
    <>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-10">
        <div className="mb-4">
          <h1 className="text-2xl md:text-4xl font-bold text-brand-maroon dark:text-brand-gold mb-4">
            Staff Official
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {dataPelatih.length > 0 ? (
            dataPelatih.map((p) => <CoachesCard key={p.id} coach={p} />)
          ) : (
            <div className="col-span-full text-center py-20 bg-card rounded-2xl border border-border">
              <h3 className="text-xl font-semibold mb-2">
                Belum ada data pelatih
              </h3>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
