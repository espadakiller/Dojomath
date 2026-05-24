import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <main className="min-h-screen px-5 pt-36 pb-24">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-[2rem] border border-[#b88a3b]/25 bg-[#fffaf3] p-10 shadow-xl shadow-[#6f1022]/8 transition duration-300 hover:border-[#b88a3b]/55">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#6f1022]">
            Contact
          </p>

          <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[#171313] md:text-5xl">
            Nous contacter
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-[#645c58]">
            Pour une question sur les cours, les disponibilités ou la formule la
            plus adaptée, vous pouvez envoyer un message directement depuis ce
            formulaire. Une réponse vous sera apportée dans les meilleurs délais.
          </p>

          <ContactForm />
        </div>
      </div>
    </main>
  );
}
