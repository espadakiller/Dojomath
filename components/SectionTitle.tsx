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
    <div className="mx-auto mb-16 max-w-4xl text-center">
      <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-[#6f1022]">
        {label}
      </p>

      <h2 className="text-5xl font-semibold leading-[1.02] tracking-[-0.055em] text-[#171313] md:text-7xl">
        {title}
      </h2>

      {description && (
        <p className="mx-auto mt-6 max-w-2xl text-xl leading-8 text-[#645c58]">
          {description}
        </p>
      )}
    </div>
  );
}
