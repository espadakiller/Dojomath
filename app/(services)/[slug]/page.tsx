import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, ClipboardCheck, Video } from "lucide-react";

import { getService, services } from "@/lib/services";
import { absoluteUrl } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = getService((await params).slug);
  if (!service) return {};

  return {
    title: service.title,
    description: service.description,
    alternates: { canonical: `/${service.slug}` },
    openGraph: { title: service.title, description: service.description, url: `/${service.slug}` },
  };
}

export default async function ServicePage({ params }: Props) {
  const service = getService((await params).slug);
  if (!service) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: service.title,
        description: service.description,
        url: absoluteUrl(`/${service.slug}`),
        provider: { "@id": absoluteUrl("/#organization") },
        areaServed: "France",
        serviceType: "Cours particulier de mathématiques en ligne",
      },
      {
        "@type": "FAQPage",
        mainEntity: service.faqs.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };

  return (
    <main className="px-5 pb-24 pt-36">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="mx-auto max-w-6xl">
        <header className="mx-auto max-w-4xl text-center">
          <p className="eyebrow text-[#6f1022]">{service.eyebrow}</p>
          <h1 className="mt-5 text-5xl font-semibold leading-[1.02] tracking-[-0.05em] text-[#171313] md:text-7xl">
            {service.title}
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-xl leading-8 text-[#554c47]">{service.description}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/reservation" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#6f1022] px-7 font-semibold text-[#fffaf3]">
              Voir les créneaux <ArrowRight size={18} />
            </Link>
            <Link href="/tarifs" className="inline-flex min-h-14 items-center justify-center rounded-full border border-[#b88a3b]/40 bg-[#fffaf3] px-7 font-semibold text-[#171313]">
              Consulter les tarifs
            </Link>
          </div>
        </header>

        <section className="mt-16 grid gap-6 lg:grid-cols-2">
          <article className="rounded-[2rem] border border-[#b88a3b]/25 bg-[#fffaf3] p-7 shadow-xl shadow-[#6f1022]/7 md:p-9">
            <Video className="text-[#6f1022]" size={28} />
            <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em]">Pour qui ?</h2>
            <p className="mt-4 text-lg leading-8 text-[#645c58]">{service.audience}</p>
          </article>
          <article className="rounded-[2rem] border border-[#b88a3b]/25 bg-[#fffaf3] p-7 shadow-xl shadow-[#6f1022]/7 md:p-9">
            <ClipboardCheck className="text-[#6f1022]" size={28} />
            <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em]">Objectifs</h2>
            <ul className="mt-5 space-y-3">
              {service.goals.map((goal) => <li key={goal} className="flex gap-3 leading-7 text-[#554c47]"><CheckCircle2 className="mt-1 shrink-0 text-[#6f1022]" size={18} />{goal}</li>)}
            </ul>
          </article>
        </section>

        <section className="mt-10 rounded-[2rem] border border-[#b88a3b]/25 bg-[#fffaf3] p-7 md:p-10">
          <p className="eyebrow text-[#6f1022]">Déroulement</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em]">Une séance structurée en quatre temps</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {service.program.map((item, index) => (
              <div key={item} className="rounded-2xl border border-[#b88a3b]/25 bg-[#fffaf6] p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6f1022] text-sm font-semibold text-white">{index + 1}</span>
                <p className="mt-4 leading-7 text-[#554c47]">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-4">
          <h2 className="text-4xl font-semibold tracking-[-0.05em]">Questions fréquentes</h2>
          {service.faqs.map((item) => (
            <article key={item.question} className="rounded-2xl border border-[#b88a3b]/25 bg-[#fffaf3] p-6">
              <h3 className="text-xl font-semibold">{item.question}</h3>
              <p className="mt-3 leading-7 text-[#645c58]">{item.answer}</p>
            </article>
          ))}
        </section>

        <section className="mt-12 rounded-[2rem] bg-[#6f1022] p-8 text-center text-[#fffaf3] md:p-12">
          <h2 className="text-4xl font-semibold tracking-[-0.05em]">Commencer avec un besoin précis</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#fffaf3]/80">Choisissez un créneau, indiquez le niveau et le chapitre : la séance sera préparée autour de l’objectif réel de l’élève.</p>
          <Link href="/reservation" className="mt-7 inline-flex min-h-14 items-center justify-center rounded-full bg-[#fffaf3] px-7 font-semibold text-[#6f1022]">Réserver une séance</Link>
        </section>
      </div>
    </main>
  );
}
