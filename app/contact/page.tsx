export default function ContactPage() {
  return (
    <main className="px-5 pt-36 pb-24">
      <div className="mx-auto max-w-3xl">
        <div className="glass rounded-[2rem] p-8">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-sky-400">
            Contact
          </p>

          <h1 className="text-4xl font-black md:text-5xl">
            Une question avant de réserver ?
          </h1>

          <p className="mt-5 text-slate-300">
            Décris ton niveau, tes difficultés ou ton objectif. Tu recevras une
            réponse rapidement.
          </p>

          <form className="mt-8 space-y-5">
            <input
              type="text"
              placeholder="Nom"
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-5 py-4 outline-none focus:border-sky-400"
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-5 py-4 outline-none focus:border-sky-400"
            />

            <textarea
              placeholder="Message"
              rows={6}
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-5 py-4 outline-none focus:border-sky-400"
            />

            <button
              type="submit"
              className="w-full rounded-full bg-sky-400 px-6 py-4 font-bold text-slate-950 transition hover:scale-105 hover:bg-sky-300"
            >
              Envoyer le message
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}