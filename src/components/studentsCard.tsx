import Image from "next/image";
import { User } from "lucide-react";

interface Student {
  slug: string;
  nama: string;
  posisi: string | null;
  foto: string | null;
  tahunMasuk: string | null;
  tempatLahir?: string | null;
  tanggalLahir?: string | null;
}

export function StudentsCard({ student }: { student: Student }) {
  // Format tanggal lahir
  const formatTanggal = (dateString?: string | null) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(date);
    } catch {
      return dateString;
    }
  };

  // Singkat nama kota agar tidak terlalu panjang
  const formatTempatLahir = (tempat?: string | null) => {
    if (!tempat) return "";
    const t = tempat.trim().toLowerCase();
    if (t === "majalengka") return "MJLK";
    if (t === "cirebon") return "CRBN";
    if (t === "sumedang") return "SMD";
    if (t === "bandung") return "BDG";
    return tempat;
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-300 dark:border-white/10 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 relative group">
      {/* Top Banner */}
      <div className="bg-brand-gold px-4 py-2 flex items-center justify-between">
        <span className="text-[10px] font-bold text-white tracking-widest uppercase">
          SSB Mundinglaya
        </span>
        <span className="text-[10px] font-bold text-brand-maroon tracking-widest uppercase">
          Player ID
        </span>
      </div>

      {/* Card Body */}
      <div className="p-4 flex gap-4">
        {/* Photo */}
        <div className="relative w-24 h-32 flex-shrink-0 bg-muted rounded-md overflow-hidden border-2 border-brand-gold/30">
          {student.foto ? (
            <Image
              src={`/api/file/${student.foto}`}
              alt={student.nama}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground bg-gray-100 dark:bg-zinc-800">
              <User className="w-12 h-12" />
            </div>
          )}
        </div>

        {/* Biodata */}
        <div className="flex flex-col justify-center space-y-3 w-full overflow-hidden">
          <div>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
              Nama Lengkap
            </p>
            <h3
              className="text-sm font-bold text-zinc-700 truncate uppercase"
              title={student.nama}
            >
              {student.nama}
            </h3>
          </div>

          <div>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
              Tanggal lahir
            </p>
            <p className="text-xs font-bold text-zinc-700 truncate uppercase">
              {formatTempatLahir(student.tempatLahir)},{" "}
              {formatTanggal(student.tanggalLahir)}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-3">
            <div>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                Posisi
              </p>
              <p className="text-xs font-semibold text-brand-gold truncate capitalize">
                {student.posisi || "-"}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                Tahun Masuk
              </p>
              <p className="text-xs font-semibold text-foreground">
                {student.tahunMasuk || "-"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
