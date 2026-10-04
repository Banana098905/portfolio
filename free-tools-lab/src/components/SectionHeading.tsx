import Link from 'next/link';

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: { href: string; label: string };
};

export function SectionHeading({ eyebrow, title, description, action }: Props) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="text-xs font-semibold tracking-[0.18em] text-iris">{eyebrow}</p>
        )}
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">{title}</h2>
        {description && <p className="mt-2 text-slate-600">{description}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="text-sm font-semibold text-navy-600 transition hover:text-navy-800"
        >
          {action.label} →
        </Link>
      )}
    </div>
  );
}
