import { db } from "@/modules/shared/db";
import { profiles } from "@/modules/shared/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrendingUp, Wallet, Lightbulb } from "lucide-react";
import ListSupport from "@/components/listSupport";
import Link from "next/link";
import Image from "next/image";
import { quotes } from "@/lib/quotes";

export default async function StudentDashboardPage() {
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
      students: {
        with: {
          class: true,
          attendances: true,
          routineFees: true,
        },
      },
    },
  });

  if (!profileData || profileData.students.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <p className="text-gray-500">Data siswa tidak ditemukan.</p>
      </div>
    );
  }

  const student = profileData.students[0];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  const supportItems = [
    {
      icon: <Wallet className="w-5 h-5 text-blue-600" />,
      label: "Pembayaran Iuran",
      href: "/student/payments",
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-(--color-brand-emerald)" />,
      label: "Raport Kemajuan",
      href: "/student/report",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-gray-900 pb-24">
      {/* Header Profile - Warna Brand Gold */}
      <div className="bg-[var(--color-brand-gold)] rounded-b-[40px] px-6 pt-4 pb-16 text-white shadow-lg relative z-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            {/* say hello */}
            <div className="flex items-center gap-2">
              <Image
                src={"/say.svg"}
                alt="Say"
                width={20}
                height={20}
                className="inline-block"
              />
              <h1 className="text-lg font-semibold capitalize">
                Hai {student.nickname || student.fullName}!
              </h1>
            </div>

            {/* profile */}
            <Link href="/student/profile">
              <Avatar className="w-10 h-10 border-2 border-white/30 shadow-lg">
                <AvatarImage
                  src={`/api/file/${student.avatarUrl}`}
                  className="object-cover"
                />
                <AvatarFallback className="bg-[var(--color-brand-emerald)] text-white font-bold">
                  {student.fullName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        {/* Quote Card (Floating) */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 -mt-12 relative z-10 flex gap-4">
          <div className="flex-shrink-0">
            <Lightbulb className="w-6 h-6 text-yellow-500" />
          </div>
          <p className="text-[13px] text-zinc-500 font-medium italic leading-relaxed">
            {randomQuote}
          </p>
        </div>

        {/* Menu Utama */}
        <div className="space-y-3 mt-8">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-1">
            Menu Utama
          </h3>
          <ListSupport items={supportItems} />
        </div>
      </div>
    </div>
  );
}
