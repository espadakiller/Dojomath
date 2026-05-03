"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative z-10 min-h-screen overflow-hidden px-5 pt-36">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,#0ea5e944,transparent_35%),radial-gradient(circle_at_bottom_right,#8b5cf644,transparent_35%)]" />

      <div className="mx-auto grid max-w-7xl items-center gap-16 md:grid-cols-2">
        <div>
          <motion.p
            className="mb-4 inline-block rounded-full border border-sky-400/40 px-4 py-2 text-sm text-sky-300"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Cours de mathématiques en ligne
          </motion.p>

          <motion.h1
            className="text-5xl font-black leading-tight md:text-7xl"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Progresse en maths avec méthode.
          </motion.h1>

          <motion.p
            className="mt-6 max-w-xl text-lg leading-8 text-slate-300"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            DojoMath t’aide à réserver facilement un cours en ligne, choisir ton
            niveau et progresser avec un accompagnement clair.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link
              href="/reservation"
              className="rounded-full bg-sky-400 px-7 py-4 text-center font-bold text-slate-950 transition hover:scale-105 hover:bg-sky-300"
            >
              Réserver un cours
            </Link>

            <Link
              href="/tarifs"
              className="rounded-full border border-white/20 px-7 py-4 text-center font-bold text-white transition hover:scale-105 hover:border-sky-400"
            >
              Voir les tarifs
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="glass rounded-[2rem] p-6 shadow-2xl"
          initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="rounded-[1.5rem] bg-slate-900 p-6">
            <div className="mb-6 flex gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
            </div>

            <div className="space-y-4">
              <div className="rounded-xl bg-slate-800 p-4">
                <p className="text-sm text-slate-400">Aujourd’hui</p>
                <p className="text-xl font-bold">
                  Cours : Équations du second degré
                </p>
              </div>

              <div className="rounded-xl bg-sky-400 p-4 text-slate-950">
                <p className="font-bold">Progression</p>
                <div className="mt-3 h-3 rounded-full bg-sky-900/30">
                  <div className="h-3 w-3/4 rounded-full bg-slate-950" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-slate-800 p-4">
                  <p className="text-3xl font-black">+42%</p>
                  <p className="text-sm text-slate-400">confiance</p>
                </div>
                <div className="rounded-xl bg-slate-800 p-4">
                  <p className="text-3xl font-black">1h</p>
                  <p className="text-sm text-slate-400">par séance</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}