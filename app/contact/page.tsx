export default function ContactPage() {
  return (
    <main className="px-5 pt-36 pb-24 bg-[#f5f5f7] min-h-screen">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-[2rem] border border-black/10 bg-white p-10 shadow-xl">
          
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#6f1d1b]">
            Contact
          </p>

          <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[#1d1d1f] md:text-5xl">
            Une question avant de réserver ?
          </h1>

          <p className="mt-5 text-neutral-600 text-lg leading-relaxed">
            Décris ton niveau, tes difficultés ou ton objectif.  
            Je te répondrai rapidement avec une solution adaptée.
          </p>

          <form className="mt-10 space-y-6">
            
            <input
              type="text"
              placeholder="Nom"
              className="w-full rounded-xl border border-black/10 bg-white px-5 py-4 text-[#1d1d1f] outline-none transition focus:border-[#6f1d1b]"
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-xl border border-black/10 bg-white px-5 py-4 text-[#1d1d1f] outline-none transition focus:border-[#6f1d1b]"
            />

            <textarea
              placeholder="Message"
              rows={6}
              className="w-full rounded-xl border border-black/10 bg-white px-5 py-4 text-[#1d1d1f] outline-none transition focus:border-[#6f1d1b]"
            />

            <button
              type="submit"
              className="w-full rounded-full bg-[#1d1d1f] px-6 py-4 font-semibold text-white transition hover:scale-[1.02] hover:bg-[#6f1d1b]"
            >
              Envoyer le message
            </button>

          </form>
        </div>
      </div>
    </main>
  );
}