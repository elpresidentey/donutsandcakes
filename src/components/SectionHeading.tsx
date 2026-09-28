import Link from "next/link";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  blurb?: string;
  linkHref?: string;
  linkLabel?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  blurb,
  linkHref,
  linkLabel,
}: SectionHeadingProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
      <div>
        <p className="text-label uppercase text-berry">{eyebrow}</p>
        <h2 className="mt-1.5 font-display text-heading text-berry">{title}</h2>
        {blurb && <p className="mt-2 max-w-xl text-body text-choco/70">{blurb}</p>}
      </div>
      {linkHref && linkLabel && (
        <Link
          href={linkHref}
          className="inline-flex min-h-[44px] shrink-0 items-center rounded-full bg-choco px-5 py-2.5 text-sm font-bold text-cream transition hover:bg-cocoa active:scale-95"
        >
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}
