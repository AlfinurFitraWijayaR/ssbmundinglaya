import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="glass fixed top-0 w-full z-50 border-b border-gray-200">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="">
          <Image
            src="/logossb.svg"
            alt="SSB Mundinglaya"
            width={30}
            height={30}
            className="w-10 h-10"
            priority
          />
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link
            href="#tentang"
            className="hover:text-[var(--color-brand-gold)] transition-colors"
          >
            Tentang Kami
          </Link>
          <Link
            href="#jadwal"
            className="hover:text-[var(--color-brand-gold)] transition-colors"
          >
            Jadwal
          </Link>
          <Link
            href="#program"
            className="hover:text-[var(--color-brand-gold)] transition-colors"
          >
            Program
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button className="bg-[var(--color-brand-gold)] cursor-pointer hover:bg-[var(--color-brand-gold)]/90">
              Masuk ke Sistem
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
