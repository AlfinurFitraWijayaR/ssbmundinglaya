"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "../ui/button";

export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero-bg.png')" }}
      ></div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-gray-950 via-gray-900/50 to-transparent"></div>
      <div className="relative z-20 container mx-auto px-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-white/90 text-xl md:text-2xl font-medium tracking-[0.2em] uppercase">
            SSB Munding Laya
          </h2>
          <h1 className="text-white font-oswald text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tight mb-6 drop-shadow-xl text-shadow-lg">
            Mencetak{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-100">
              Generasi
            </span>{" "}
            <span className="text-brand-gold shadow-gold-glow">Juara</span>
          </h1>
          <p className="text-zinc-200 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light">
            Membangun karakter, disiplin, dan talenta muda melalui pendidikan
            sepak bola profesional berstandar tinggi.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/enroll"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-brand-gold text-white hover:bg-brand-gold/80 font-semibold text-sm rounded-lg transition-transform shadow-[0_0_20px_rgba(212,172,84,0.4)]"
            >
              Daftar Online
            </Link>
            <Link
              href="/login"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4  text-white hover:bg-brand-gold/20 font-semibold text-sm rounded-lg transition-transform shadow-[0_0_20px_rgba(212,172,84,0.4)]"
            >
              Masuk ke Sistem
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
