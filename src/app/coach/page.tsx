import { db } from "@/modules/shared/db";
import { profiles } from "@/modules/shared/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ClipboardList, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ListSupport from "@/components/listSupport";

export default async function CoachDashboardPage() {
  const supportItems = [
    {
      icon: <ClipboardList className="w-5 h-5 text-blue-600" />,
      label: "Absensi Latihan",
      href: "/coach/attendance",
    },
    {
      icon: (
        <TrendingUp className="w-5 h-5 text-[var(--color-brand-emerald)]" />
      ),
      label: "Buat Lapor Siswa",
      href: "/coach/report",
    },
  ];

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("ssb_session");
  if (!sessionCookie) {
    redirect("/login");
  }

  let session;
  try {
    session = JSON.parse(sessionCookie.value);
  } catch {
    redirect("/login");
  }

  const profileData = await db.query.profiles.findFirst({
    where: eq(profiles.id, session.id),
    with: {
      coach: true,
    },
  });

  if (!profileData) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 aurora-bg text-zinc-900 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-white/80 p-6 rounded-3xl border border-gray-200 glass shadow-sm">
          <Avatar className="w-24 h-24 border-2 border-[var(--color-brand-gold)] shadow-lg">
            <AvatarImage
              src={`${process.env.NEXT_PUBLIC_BASE_CDN_URL}/${profileData.coach?.url}?width=150&height=150`}
              alt={profileData.fullName}
              className="object-cover"
            />
            <AvatarFallback className="bg-[var(--color-brand-gold)] text-white text-3xl font-bold">
              {profileData.fullName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left space-y-1 flex-1">
            <h1 className="text-lg md:text-xl font-bold text-zinc-800 capitalize">
              Welcome kuch {profileData.fullName}
            </h1>
            <p className="text-zinc-500 text-xs max-w-md">
              Selamat datang di portal pelatih. Anda dapat mengelola absensi
              latihan dan membuat laporan evaluasi siswa di sini.
            </p>
          </div>
        </div>

        <div className="mt-6 -mx-4 md:mx-0">
          <div className="mb-3">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 px-1">
              Menu Utama
            </h3>

            {/* List Support */}
            <div className="space-y-3 px-3 mt-3">
              <ListSupport items={supportItems} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
