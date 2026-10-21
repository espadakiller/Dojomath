"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { BadgeCheck, CalendarDays, ShieldCheck, Video } from "lucide-react";

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
] as const;

const facts = [
  { icon: BadgeCheck, text: "Enseignant certifié" },
  { icon: Video, text: "Cours individuel en visio" },
  { icon: ShieldCheck, text: "Sans engagement dès 30 €/h" },
];

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
    <div
      aria-hidden="true"
      className={`hero-ticker hero-ticker-${direction} ${className}`}
    >
      <div className="hero-ticker-track">
        {images.map((src, index) => (
          <div className="hero-ticker-tile" key={`${direction}-${index}`}>
            <Image
              src={src}
              alt=""
              width={180}
              height={128}
              quality={65}
              sizes="156px"
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative z-10 overflow-hidden px-6 pb-20 pt-28 sm:pb-24 sm:pt-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="mx-auto flex w-full max-w-[38rem] flex-col items-start lg:mx-0">
          <motion.p
            className="inline-flex min-h-11 items-center rounded-full border border-[#b88a3b]/35 bg-[#fffaf3]/90 px-5 text-sm font-semibold uppercase tracking-[0.14em] text-[#6f1022] shadow-sm"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
          >
            Mathématiques · Collège · Lycée · Supérieur
          </motion.p>

          <motion.h1
            className="mt-6 max-w-[38rem] text-4xl font-semibold leading-[1.08] text-[#171313] sm:text-5xl lg:text-6xl"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
          >
            Cours particuliers de maths en ligne
          </motion.h1>

          <motion.p
            className="mt-6 max-w-2xl text-lg leading-8 text-[#554c47]"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
          >
            Un enseignant certifié pour comprendre, retrouver une méthode et
            préparer les contrôles. Première séance : 30 € pour une heure,
            sans engagement.
          </motion.p>

          <motion.ul
            className="mt-7 grid gap-3 text-sm font-semibold text-[#4a3c36] sm:grid-cols-2"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
          >
            {facts.map((fact) => (
              <li key={fact.text} className="flex items-center gap-2">
                <fact.icon className="text-[#6f1022]" size={18} />
                {fact.text}
              </li>
            ))}
          </motion.ul>

          <motion.div
            className="mt-9 flex w-full max-w-[34rem] flex-col gap-4 sm:flex-row"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
          >
            <Link
              href="/reservation"
              className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#6f1022] px-7 py-4 text-center text-sm font-semibold text-[#fffaf3] shadow-lg shadow-[#6f1022]/15 transition hover:scale-[1.02] hover:bg-[#8a1730]"
            >
              <CalendarDays size={18} />
              Voir les créneaux
            </Link>
            <Link
              href="/contact"
              className="flex min-h-14 items-center justify-center rounded-full border border-[#b88a3b]/45 bg-[#fffaf3] px-7 py-4 text-center text-sm font-semibold text-[#171313] transition hover:border-[#6f1022] hover:text-[#6f1022]"
            >
              Poser une question
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="relative mx-auto min-h-[560px] w-full max-w-[42rem] sm:min-h-[610px]"
          initial={false}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.24, duration: 0.65 }}
        >
          <div className="absolute inset-x-[-1.5rem] bottom-0 top-0 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
            <ImageTicker direction="right" className="top-3 sm:top-6" />
            <ImageTicker direction="left" className="bottom-3 sm:bottom-7" />
          </div>

          <div className="absolute inset-0 z-10 flex items-center">
            <div className="relative w-full overflow-hidden rounded-[2rem] bg-[#fffaf3] p-3 shadow-2xl shadow-[#6f1022]/12 ring-1 ring-[#b88a3b]/30">
              <Image
                src="/hero.jpg"
                alt="Élève travaillant les mathématiques dans un espace calme"
                width={900}
                height={650}
                priority
                quality={72}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="h-[430px] w-full rounded-[1.45rem] object-cover sm:h-[520px]"
              />

              <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-[#b88a3b]/30 bg-[#fffaf3]/95 p-5 shadow-xl backdrop-blur sm:left-auto sm:w-[20rem]">
                <p className="text-sm font-semibold text-[#6f1022]">
                  Une séance concrète
                </p>
                <p className="mt-2 text-sm leading-6 text-[#554c47]">
                  Diagnostic du blocage, explication guidée, exercices puis
                  points à retravailler : le déroulé est annoncé avant de payer.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
