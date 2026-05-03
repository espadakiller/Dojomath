type SectionTitleProps = {
  label: string;
  title: string;
  description?: string;
};

export default function SectionTitle({
  label,
  title,
  description,
}: SectionTitleProps) {
  return (
    <div className="mx-auto mb-14 max-w-3xl text-center">
      <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-sky-400">
        {label}
      </p>

      <h2 className="text-4xl font-black md:text-5xl">{title}</h2>

      {description && (
        <p className="mt-5 text-lg leading-8 text-slate-300">{description}</p>
      )}
    </div>
  );
}