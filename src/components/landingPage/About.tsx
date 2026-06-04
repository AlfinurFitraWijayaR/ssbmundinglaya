"use client";
import { motion } from "framer-motion";
import { Target } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export function About() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          className="mb-4"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-brand-maroon dark:text-brand-gold">
            Tentang Kami
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 max-w-4xl"
        >
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            SSB Munding Laya berdedikasi untuk mengembangkan potensi muda
            melalui kurikulum sepak bola modern yang terintegrasi dengan
            pembangunan karakter.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-sm md:text-base text-muted-foreground leading-relaxed"
          >
            <div className="flex items-start gap-4">
              <Target className="w-8 h-8 text-brand-gold flex-shrink-0" />
              <div>
                <h3 className="font-bold text-foreground text-xl mb-3">
                  Visi & Misi
                </h3>
                <ul className="space-y-1 list-disc list-outside ml-4">
                  <li>
                    Menjadi sekolah sepak bola modern dan profesional yang
                    menghasilkan atlet sepak bola berkarakter, unggul,
                    berkualitas, dan bertanggung jawab serta religius.
                  </li>
                  <li>
                    Membina dan mengembangkan bibit-bibit sepak bola potensial
                    dan berbakat untuk mencapai prestasi maksimal di tingkat
                    kota/kabupaten, provinsi, nasional dan internasional.
                  </li>
                  <li>
                    Meningkatkan kualitas sepak bola di wilayah Argapura / Kab.
                    Majalengka.
                  </li>
                  <li>Membentuk generasi sehat dan berprestasi.</li>
                  <li>
                    Menerapkan sistem latihan yang terprogram dengan baik.
                  </li>
                  <li>Menerapkan manajemen yang baik.</li>
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-sm md:text-base text-muted-foreground leading-relaxed"
          >
            <div className="flex items-start gap-4">
              <Target className="w-8 h-8 text-brand-gold flex-shrink-0" />
              <div>
                <h3 className="font-bold text-foreground text-xl mb-3">
                  Sasaran
                </h3>
                <ul className="space-y-1 list-disc list-outside ml-4">
                  <li>
                    Memberikan pendidikan dasar sampai mahir untuk siswa lewat
                    pendekatan latihan modern dan ilmiah.
                  </li>
                  <li>
                    Memberikan fasilitas penunjang latihan berupa peralatan dan
                    lapangan yang baik.
                  </li>
                  <li>
                    Membentuk kualitas dan karakter individu siswa agar siap
                    menghadapi tuntutan profesionalitas di dunia sepakbola
                    modern.
                  </li>
                  <li>
                    Membentuk sinergi yang sehat antara orang tua, pelatih,
                    siswa dan pengurus SSB demi kemajuan prestasi.
                  </li>
                  <li>
                    Merencanakan program latihan dan kompetisi yang terstruktur
                    sesuai dengan periodisasi dan perkembangan siswa.
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
