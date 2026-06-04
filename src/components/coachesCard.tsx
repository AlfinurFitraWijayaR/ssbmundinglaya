import Image from "next/image";
import { User, Award } from "lucide-react";
import Link from "next/link";

export interface Coach {
  slug: string;
  nama: string;
  address?: string | null;
  tanggalLahir?: string | Date | null;
  foto?: string | null;
  licence?: string | null;
  cvFile?: string | null;
}

export function CoachesCard({ coach }: { coach: Coach }) {
  const formatTanggal = (dateString?: string | Date | null) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(date);
    } catch {
      return String(dateString);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-300 dark:border-white/10 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 relative group">
      {/* Top Banner */}
      <div className="bg-brand-gold px-4 py-2 flex items-center justify-between">
        <span className="text-[10px] font-bold text-white tracking-widest uppercase">
          SSB Mundinglaya
        </span>
        <span className="text-[10px] font-bold text-brand-maroon tracking-widest uppercase">
          Staff Official
        </span>
      </div>

      {/* Card Body */}
      <div className="p-4 flex gap-4 items-center">
        {/* Photo */}
        <div className="relative w-24 h-32 flex-shrink-0 bg-muted rounded-md overflow-hidden border-2 border-brand-gold/30">
          {coach.foto ? (
            <Image
              src={`/api/file/${coach.foto}`}
              alt={coach.nama}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground bg-gray-100 dark:bg-zinc-800">
              <User className="w-12 h-12" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center space-y-2 w-full overflow-hidden">
          <div>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
              Nama Lengkap
            </p>
            <h3
              className="text-xs font-semibold text-foreground tracking-wider truncate uppercase"
              title={coach.nama}
            >
              {coach.nama}
            </h3>
          </div>

          <div>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
              TTL
            </p>
            <p className="text-xs font-semibold text-foreground truncate uppercase">
              MAJALENGKA, {formatTanggal(coach.tanggalLahir)}
            </p>
          </div>

          <div>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
              Alamat
            </p>
            <p className="text-xs font-semibold text-foreground uppercase">
              {coach?.address}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-2 gap-y-3">
            <div>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                Lisensi
              </p>
              {coach.licence ? (
                <Link
                  href={`/cv_coach/${coach.licence}`}
                  target="_blank"
                  className="flex items-center text-xs font-semibold text-brand-gold truncate hover:underline"
                >
                  <Award className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                  <span className="truncate underline">{coach.licence}</span>
                </Link>
              ) : (
                <p className="text-xs">Belum Mengisi</p>
              )}
            </div>

            <div>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                CV
              </p>
              {coach.cvFile ? (
                <Link
                  href={`/api/file/${coach.cvFile}`}
                  target="_blank"
                  className="text-xs font-semibold text-brand-gold underline truncate block"
                >
                  Lihat disini
                </Link>
              ) : (
                <p className="text-xs">Belum Mengisi</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
