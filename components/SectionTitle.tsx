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
      <p className="mb-5 inline-flex min-h-11 items-center justify-center rounded-full border border-[#b88a3b]/35 bg-[#fffaf3]/82 px-5 pt-[0.65rem] pb-2 text-sm font-semibold uppercase leading-none tracking-[0.24em] text-[#6f1022] shadow-sm shadow-[#6f1022]/8 backdrop-blur-sm">
        {label}
      </p>

      <h2 className="text-5xl font-semibold leading-[1.02] tracking-[-0.035em] text-[#171313] md:text-7xl">
        {title}
      </h2>

      {description && (
        <p className="mx-auto mt-6 max-w-2xl rounded-[1.25rem] border border-[#b88a3b]/18 bg-[#fffaf3]/62 px-5 py-4 text-xl leading-8 text-[#554c47] shadow-sm shadow-[#6f1022]/5 backdrop-blur-[2px]">
          {description}
        </p>
      )}
    </div>
  );
}
