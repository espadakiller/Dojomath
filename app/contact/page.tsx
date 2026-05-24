export default function ContactPage() {
  return (
    <main className="min-h-screen px-5 pt-36 pb-24">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-[2rem] border border-[#b88a3b]/25 bg-[#fffaf3] p-10 shadow-xl shadow-[#6f1022]/8 transition duration-300 hover:border-[#b88a3b]/55">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#6f1022]">
            Contact
          </p>

          <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[#171313] md:text-5xl">
            Une question avant de réserver ?
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-[#645c58]">
            Décris ton niveau, tes difficultés ou ton objectif. Je te répondrai
            rapidement avec une solution adaptée.
          </p>

          <form className="mt-10 space-y-6">
            <input
              type="text"
              placeholder="Nom"
              className="w-full rounded-xl border border-[#b88a3b]/25 bg-[#fffaf6] px-5 py-4 text-[#171313] outline-none transition placeholder:text-[#645c58]/60 focus:border-[#6f1022]"
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-xl border border-[#b88a3b]/25 bg-[#fffaf6] px-5 py-4 text-[#171313] outline-none transition placeholder:text-[#645c58]/60 focus:border-[#6f1022]"
            />

            <textarea
              placeholder="Message"
              rows={6}
              className="w-full rounded-xl border border-[#b88a3b]/25 bg-[#fffaf6] px-5 py-4 text-[#171313] outline-none transition placeholder:text-[#645c58]/60 focus:border-[#6f1022]"
            />

            <button
              type="submit"
              className="w-full rounded-full bg-[#6f1022] px-6 py-4 font-semibold text-[#fffaf3] transition hover:scale-[1.02] hover:bg-[#8a1730] hover:shadow-lg hover:shadow-[#6f1022]/20"
            >
              Envoyer le message
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
