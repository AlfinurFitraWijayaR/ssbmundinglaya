"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const faqs = [
  {
    q: "APA ITU SSB MUNDING LAYA?",
    a: "SSB Munding Laya adalah sekolah sepak bola yang berfokus pada pembinaan karakter dan skill usia dini (5-17 tahun) dengan kurikulum berstandar nasional.",
  },
  {
    q: "BERAPA USIA MINIMAL UNTUK BERGABUNG?",
    a: "Kami menerima siswa mulai dari KU 7-17 tahun.",
  },
  {
    q: "DIMANA LOKASI LATIHAN RUTIN?",
    a: "Latihan diadakan di Lapangan Munding Laya, Desa Sukasari Kidul, Kec. Argapura, Kab. Majalengka setiap hari Selasa, Rabu, dan Minggu.",
  },
  {
    q: "APAKAH ADA BIAYA PENDAFTARAN?",
    a: "Ya, terdapat biaya pendaftaran. Hubungi admin untuk detail harga terbaru.",
  },
  {
    q: "BAGAIMANA CARA MENDAFTARNYA?",
    a: "Sangat mudah! Kamu bisa daftar sambil rebahan di rumah dan klik tombol 'Daftar Online' di website ini",
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 text-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          className="text-center mb-6"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-brand-maroon dark:text-brand-gold mb-4">
            Pertanyaan Umum
          </h2>
        </motion.div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="border-b border-gray-200 dark:border-white/10"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between py-6 bg-transparent transition-colors text-left font-semibold text-lg group cursor-pointer"
              >
                <span className="transition-colors">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-brand-gold transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""}`}
                />
              </button>
              <motion.div
                initial={false}
                animate={{
                  height: openIndex === i ? "auto" : 0,
                  opacity: openIndex === i ? 1 : 0,
                }}
                className="overflow-hidden"
              >
                <div className="pb-6 text-muted-foreground leading-relaxed">
                  {faq.a}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
