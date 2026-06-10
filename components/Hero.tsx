"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const railImages = [
  "/hero-rail/rail-01.png",
  "/hero-rail/rail-02.png",
  "/hero-rail/rail-03.png",
  "/hero-rail/rail-04.png",
  "/hero-rail/rail-05.png",
  "/hero-rail/rail-06.png",
  "/hero-rail/rail-07.png",
  "/hero-rail/rail-08.png",
  "/hero-rail/rail-09.png",
  "/hero-rail/rail-10.png",
];

const dailyQuotes = [
  {
    text: "Patience et longueur de temps font plus que force ni que rage.",
    source: "Jean de La Fontaine, Le Lion et le Rat",
  },
  {
    text: "Travaillez, prenez de la peine : c'est le fonds qui manque le moins.",
    source: "Jean de La Fontaine, Le Laboureur et ses enfants",
  },
  {
    text: "Aide-toi, le ciel t'aidera.",
    source: "Jean de La Fontaine, Le Charretier embourbé",
  },
  {
    text: "Vingt fois sur le métier remettez votre ouvrage.",
    source: "Nicolas Boileau, L'Art poétique",
  },
  {
    text: "Hâtez-vous lentement ; et, sans perdre courage.",
    source: "Nicolas Boileau, L'Art poétique",
  },
  {
    text: "Le travail éloigne de nous trois grands maux, l'ennui, le vice et le besoin.",
    source: "Voltaire, Candide",
  },
  {
    text: "Il faut cultiver notre jardin.",
    source: "Voltaire, Candide",
  },
] as const;

function getDailyQuote() {
  const today = new Date();
  const yearStart = new Date(today.getFullYear(), 0, 0);
  const dayOfYear = Math.floor(
    (today.getTime() - yearStart.getTime()) / 86_400_000,
  );

  return dailyQuotes[dayOfYear % dailyQuotes.length];
}

function ImageTicker({
  direction,
  className = "",
}: {
  direction: "left" | "right";
  className?: string;
}) {
  const sequence = direction === "left" ? [...railImages].reverse() : railImages;
  const images = [...sequence, ...sequence];

  return (
    <div className={`hero-ticker hero-ticker-${direction} ${className}`}>
      <div className="hero-ticker-track">
        {images.map((src, index) => (
          <div className="hero-ticker-tile" key={`${direction}-${index}`}>
            <Image
              src={src}
              alt=""
              width={180}
              height={128}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  const dailyQuote = getDailyQuote();

  return (
    <section className="relative z-10 overflow-hidden px-6 pt-32 pb-24">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <motion.div
            className="relative mb-7 flex min-h-14 w-full max-w-[34rem] items-center justify-between gap-3 overflow-hidden rounded-full border border-[#b88a3b]/35 bg-[#fffaf3]/84 px-4 py-3 text-[#6f1022] shadow-lg shadow-[#6f1022]/8 backdrop-blur-sm sm:px-5"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <motion.span
              aria-hidden="true"
              className="absolute inset-y-1 left-0 w-20 rounded-full bg-white/55 blur-lg"
              animate={{ x: ["-140%", "560%"] }}
              transition={{
                duration: 2.8,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 3.2,
              }}
            />
            <span className="relative flex min-w-0 items-center gap-3">
              <span className="relative flex h-2.5 w-2.5 shrink-0 rounded-full bg-[#6f1022]">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#6f1022]/35" />
              </span>
              <span className="relative text-sm font-semibold uppercase leading-none tracking-[0.14em] sm:text-[0.8rem]">
                Cours particuliers de mathématiques en ligne
              </span>
            </span>
            <span className="relative hidden h-4 w-px bg-[#b88a3b]/45 sm:block" />
            <span className="relative hidden text-xs font-semibold uppercase leading-none tracking-[0.12em] text-[#5f514b] sm:block">
              Collège · Lycée · Supérieur
            </span>
          </motion.div>

          <motion.h1
            className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-[-0.035em] text-[#171313] sm:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Un déclic peut tout changer.
          </motion.h1>

          <motion.div
            className="mt-6 flex min-h-14 w-full max-w-[34rem] items-center overflow-hidden rounded-full border border-[#b88a3b]/30 bg-[#fffaf3]/76 text-[#6f1022] shadow-md shadow-[#6f1022]/6 backdrop-blur-sm"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.5, ease: "easeOut" }}
          >
            <span className="flex flex-1 items-center justify-center gap-2 px-3 py-3 text-center text-[0.68rem] font-semibold uppercase leading-tight tracking-[0.1em] sm:px-5 sm:text-xs sm:tracking-[0.14em]">
              <motion.span
                aria-hidden="true"
                className="h-2 w-2 shrink-0 rounded-full bg-[#6f1022]"
                animate={{ scale: [1, 1.55, 1], opacity: [0.78, 1, 0.78] }}
                transition={{
                  duration: 1.9,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
              />
              Enseignant certifié
            </span>
            <span className="h-5 w-px shrink-0 bg-[#b88a3b]/45" />
            <span className="flex flex-1 items-center justify-center gap-2 px-3 py-3 text-center text-[0.68rem] font-semibold uppercase leading-tight tracking-[0.1em] text-[#5f514b] sm:px-5 sm:text-xs sm:tracking-[0.14em]">
              <motion.span
                aria-hidden="true"
                className="h-2 w-2 shrink-0 rounded-full border border-[#b88a3b] bg-[#b88a3b]/35"
                animate={{ rotate: [0, 180, 360], scale: [1, 0.82, 1] }}
                transition={{
                  duration: 3,
                  ease: "linear",
                  repeat: Infinity,
                }}
              />
              5+ ans d&apos;expérience
            </span>
          </motion.div>

          <motion.div
            className="mt-8 flex flex-col gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26 }}
          >
            <Link
              href="/reservation"
              className="rounded-full bg-[#6f1022] px-7 py-4 text-center text-sm font-semibold text-[#fffaf3] shadow-lg shadow-[#6f1022]/15 transition hover:scale-[1.03] hover:bg-[#8a1730]"
            >
              Réserver un cours
            </Link>

            <Link
              href="/tarifs"
              className="rounded-full border border-[#b88a3b]/35 bg-[#fffaf3] px-7 py-4 text-center text-sm font-semibold text-[#171313] transition hover:scale-[1.03] hover:border-[#b88a3b] hover:text-[#6f1022]"
            >
              Voir les tarifs
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="relative min-h-[560px] sm:min-h-[610px]"
          initial={{ opacity: 0, scale: 0.97, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
        >
          <div className="absolute inset-x-[-1.5rem] top-0 bottom-0 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
            <ImageTicker direction="right" className="top-3 sm:top-6" />
            <ImageTicker direction="left" className="bottom-3 sm:bottom-7" />
          </div>

          <div className="absolute inset-0 z-10 flex items-center">
            <div className="relative w-full overflow-hidden rounded-[2rem] bg-[#fffaf3] shadow-2xl shadow-[#6f1022]/12 ring-1 ring-[#b88a3b]/25">
              <Image
                src="/hero.jpg"
                alt="Étudiant concentré dans un environnement calme"
                width={900}
                height={650}
                priority
                className="h-[430px] w-full object-cover sm:h-[500px]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 rounded-3xl border border-[#b88a3b]/25 bg-[#fffaf3]/90 p-5 text-[#171313] backdrop-blur-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6f1022]">
                  Citation du jour
                </p>
                <p className="mt-2 text-lg font-semibold leading-7 sm:text-xl">
                  « {dailyQuote.text} »
                </p>
                <p className="mt-3 text-sm text-[#645c58]">
                  {dailyQuote.source}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
