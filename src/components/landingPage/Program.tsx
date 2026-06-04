"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import Link from "next/link";

const programs = [
  {
    title: "Usia Pemula",
    subtitle: "Kelompok Usia 5 – 6 Tahun",
    description:
      "Pada usia ini, anak-anak akan kami kenalkan dengan sepak bola. Tujuannya tidak lain agar mereka merasa gembira dan merasakan pengalaman bermain secara tim yang menyenangkan.",
    image: "/hero-bg.png",
  },
  {
    title: "Usia Dasar",
    subtitle: "Kelompok Usia 6 – 9 Tahun",
    description:
      "Pada usia ini, anak-anak mulai masuk pada pengenalan. Fokus utama tetap pada suasana gembira dan menyenangkan namun perlahan mulai diperkenalkan juga pada prestasi.",
    image: "/hero-bg.png",
    whatsappGroups: [
      {
        year: "7-8",
        link: "https://chat.whatsapp.com/IGSv7RPLJWj7Ff0ZSBBgSt",
      },
      {
        year: "9",
        link: "https://chat.whatsapp.com/F6bW4EUVncN5baiqw0EhDy",
      },
    ],
  },
  {
    title: "Usia Menengah",
    subtitle: "Kelompok Usia 10 – 13 Tahun",
    description:
      "Pada usia ini, anak-anak mulai masuk pada fase pengembangan skill. Mereka akan dikenalkan pada pola permainan individu dan tim.",
    image: "/hero-bg.png",
    whatsappGroups: [
      {
        year: "10",
        link: "https://chat.whatsapp.com/ISKXDv2VIq2JTjcawIt9mF",
      },
      {
        year: "11",
        link: "https://chat.whatsapp.com/ChwU7cu8LkkBQwUq2h6tAh",
      },
      {
        year: "12",
        link: "https://chat.whatsapp.com/FeY99DojdMM3nWQlUGqHtY",
      },
      {
        year: "13",
        link: "https://chat.whatsapp.com/D34ddVyWJ5ZHOWpz4jVGkE",
      },
    ],
  },
  {
    title: "Usia Mahir",
    subtitle: "Kelompok Usia 14+",
    description:
      "Pada usia ini, fokus utamanya adalah kemampuan permainan secara kolektif dan individu demi prestasi. Dalam program, kami juga akan terus mengajarkan mengenai nilai-nilai profesionalitas, disiplin dan kemanusiaan seperti toleransi terhadap lawan dan teman.",
    image: "/hero-bg.png",
    whatsappGroups: [
      { year: "14", link: "https://chat.whatsapp.com/CTUcgbJFXFUKVNicUNH2BB" },
      { year: "15", link: "https://chat.whatsapp.com/CGiCSMeWSlY7PQcEMbiNch" },
    ],
  },
];

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export function Program() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % programs.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? programs.length - 1 : prev - 1));
  };

  // Optional: Auto slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 bg-background" id="programs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-brand-maroon dark:text-brand-gold mb-4">
            Program Latihan
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Kurikulum kami disusun berjenjang sesuai usia untuk memastikan
            perkembangan optimal setiap pemain.
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative h-[450px] md:h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl group border border-border">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -swipeConfidenceThreshold) {
                  nextSlide();
                } else if (swipe > swipeConfidenceThreshold) {
                  prevSlide();
                }
              }}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center scale-105"
                style={{
                  backgroundImage: `url(${programs[currentIndex].image})`,
                }}
              />
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/65" />

              {/* Text Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-12 md:px-24">
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl md:text-6xl font-bold text-white mb-2 drop-shadow-md"
                >
                  {programs[currentIndex].title}
                </motion.h2>

                {programs[currentIndex].subtitle && (
                  <motion.h4
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg md:text-xl font-bold text-brand-gold mb-2 drop-shadow-sm"
                  >
                    {programs[currentIndex].subtitle}
                  </motion.h4>
                )}

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm md:text-lg text-zinc-200 leading-relaxed max-w-3xl drop-shadow-sm"
                >
                  {programs[currentIndex].description}
                </motion.p>

                {programs[currentIndex].whatsappGroups &&
                  programs[currentIndex].whatsappGroups.length > 0 && (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="mt-6 flex flex-wrap gap-3 justify-center lg:justify-start"
                    >
                      {programs[currentIndex].whatsappGroups.map(
                        (group, idx) => (
                          <Link
                            key={idx}
                            href={group.link}
                            target="_blank"
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#25D366] hover:bg-[#1ebd5a] text-white text-xs font-semibold rounded-full shadow-lg transition-all duration-300 hover:scale-105"
                          >
                            <MessageCircle className="w-3 h-3" />
                            KU {group.year} Tahun
                          </Link>
                        ),
                      )}
                    </motion.div>
                  )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Left Arrow */}
          <button
            onClick={prevSlide}
            className="cursor-pointer absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full text-white transition-all backdrop-blur-md z-10 opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={nextSlide}
            className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full text-white transition-all backdrop-blur-md z-10 opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {programs.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-brand-gold w-8" : "bg-white/50 hover:bg-white/80"}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
