"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
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
            Les maths deviennent claires.
          </motion.h1>

          <motion.p
            className="mt-7 max-w-xl text-xl leading-8 text-neutral-600"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Un accompagnement simple, humain et structuré pour progresser avec confiance.
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
          className="relative"
          initial={{ opacity: 0, scale: 0.97, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
        >
          <div className="relative overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-black/10">
            <Image
              src="/hero.jpg"
              alt="Étudiant concentré dans un environnement calme"
              width={900}
              height={650}
              priority
              className="h-[500px] w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 rounded-3xl bg-white/85 p-5 text-[#1d1d1f] backdrop-blur-xl">
              <p className="text-sm text-neutral-500">Aujourd’hui</p>
              <p className="mt-1 text-xl font-semibold">
                Un cours clair. Un vrai déclic.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}