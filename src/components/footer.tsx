import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="text-brand-white border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2">
              <Image
                src="logossb.svg"
                alt="SSB Mundinglaya"
                width={38}
                height={38}
              />
              <h3 className="text-xl font-bold text-brand-gold">
                SSB Mundinglaya
              </h3>
            </div>
            <p className="text-zinc-500 max-w-sm mt-2 text-sm">
              Membangun karakter, disiplin, dan talenta muda melalui pendidikan
              sepak bola profesional berstandar tinggi..
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-brand-gold mb-4">
              Sosmed Kami
            </h3>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/ssbmundinglaya/"
                target="_blank"
                className="text-zinc-500 hover:text-brand-gold transition-colors"
              >
                <Image src="ig.svg" alt="IG" width={30} height={30} />
              </a>
              <a
                href="https://www.tiktok.com/@ssbmundinglaya2026"
                target="_blank"
                className="text-zinc-500 hover:text-brand-gold transition-colors"
              >
                <Image src="tt.svg" alt="TikTok" width={30} height={30} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 text-center text-zinc-500 text-sm">
          &copy; {new Date().getFullYear()} SSB Mundinglaya. All rights
          reserved. <br />
          Develop by{" "}
          <Link
            href="https://instagram.com/alfinurfitrawijaya"
            target="_blank"
            className="underline font-semibold"
          >
            Alfinur Fitra Wijaya.R
          </Link>
        </div>
      </div>
    </footer>
  );
}
