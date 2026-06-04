"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getDashboardStats } from "@/modules/landing/actions";
import Link from "next/link";
import { Users, ShieldCheck, ArrowRight } from "lucide-react";

export default function Stats() {
  const [statsData, setStatsData] = useState({ siswa: 0, pelatih: 0 });

  useEffect(() => {
    getDashboardStats().then((data) => {
      setStatsData(data);
    });
  }, []);

  const stats = [
    {
      id: 1,
      label: "Siswa Terdaftar",
      value: `${statsData.siswa}`,
      link: "/students",
      icon: Users,
    },
    {
      id: 2,
      label: "Staff Official",
      value: `${statsData.pelatih}`,
      link: "/coaches",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="px-4 relative z-30">
      <section className="py-10 -mt-16 container mx-auto max-w-5xl">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-200/50">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Link key={stat.id} href={stat.link} className="block w-full h-full">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className="p-8 md:p-12 flex flex-col items-center justify-center text-center group relative overflow-hidden"
                    >
                      {/* Subtle Background Glow on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-brand-gold)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <div className="relative z-10 flex flex-col items-center">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-sm border border-gray-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                          <Icon className="w-7 h-7 text-[var(--color-brand-gold)]" />
                        </div>

                        <h3 className="text-5xl md:text-6xl font-black mb-2 bg-gradient-to-br from-zinc-800 to-zinc-500 bg-clip-text text-transparent tracking-tight">
                          {stat.value}
                        </h3>

                        <div className="flex items-center gap-2 mt-2 text-zinc-500 hover:text-[var(--color-brand-gold)] font-medium text-sm md:text-base uppercase tracking-wider transition-colors">
                          <span>{stat.label}</span>
                          <ArrowRight className="w-4 h-4 transition-all duration-300" />
                        </div>
                      </div>
                    </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
