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
    <section className="relative z-10 overflow-hidden bg-[#f5f5f7] px-6 pt-32 pb-24">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <motion.p
            className="mb-6 text-sm font-medium text-[#6f1d1b]"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Cours de mathématiques en ligne
          </motion.p>

          <motion.h1
            className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-[-0.055em] text-[#1d1d1f] sm:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Un déclic peut tout changer.
          </motion.h1>

          <motion.p
            className="mt-7 max-w-xl text-xl leading-8 text-neutral-600"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Des cours en ligne dispensés par un enseignant certifié, avec une
            méthode claire pour comprendre, progresser et préparer chaque
            échéance sereinement.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-col gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link
              href="/reservation"
              className="rounded-full bg-[#1d1d1f] px-7 py-4 text-center text-sm font-semibold text-white transition hover:scale-[1.03] hover:bg-[#6f1d1b]"
            >
              Réserver un cours
            </Link>

            <Link
              href="/tarifs"
              className="rounded-full border border-black/10 bg-white px-7 py-4 text-center text-sm font-semibold text-[#1d1d1f] transition hover:scale-[1.03] hover:border-[#6f1d1b]/30 hover:text-[#6f1d1b]"
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
            <div className="relative w-full overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-black/10 ring-1 ring-black/5">
              <Image
                src="/hero.jpg"
                alt="Étudiant concentré dans un environnement calme"
                width={900}
                height={650}
                priority
                className="h-[430px] w-full object-cover sm:h-[500px]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 rounded-3xl bg-white/88 p-5 text-[#1d1d1f] backdrop-blur-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6f1d1b]">
                  Citation du jour
                </p>
                <p className="mt-2 text-lg font-semibold leading-7 sm:text-xl">
                  « {dailyQuote.text} »
                </p>
                <p className="mt-3 text-sm text-neutral-500">
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
