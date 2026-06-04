"use client";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function MapSection() {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          className="mb-6"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-brand-maroon dark:text-brand-gold mb-4">
            Lokasi Latihan
          </h2>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 items-center bg-card rounded-3xl p-6 lg:p-10 shadow-xl border border-border dark:border-muted-foreground/40">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/3 space-y-6"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-brand-gold/10 rounded-xl">
                <MapPin className="w-8 h-8 text-brand-gold" />
              </div>
              <div>
                <p className="text-muted-foreground leading-relaxed">
                  Lapangan Mundinglaya, <br />
                  Sukasari Kidul, Kec. Argapura, <br />
                  Kabupaten Majalengka, Jawa Barat
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-2/3 h-[400px] rounded-2xl overflow-hidden shadow-inner border border-border bg-muted relative"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4759.412456317301!2d108.31475605419166!3d-6.912316646720096!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6f3b48ad63259b%3A0xebabd21824c8188e!2slapangan%20munding%20laya!5e0!3m2!1sid!2sid!4v1779697110490!5m2!1sid!2sid"
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps Lapangan Mundinglaya"
            ></iframe>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
