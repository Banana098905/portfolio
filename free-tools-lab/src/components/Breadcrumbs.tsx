import Link from 'next/link';

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ label: 'ホーム', href: '/' }, ...items];
  return (
    <nav aria-label="パンくずリスト">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
        {all.map((c, i) => {
          const last = i === all.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex min-w-0 items-center gap-1.5">
              {i > 0 && (
                <span aria-hidden="true" className="text-slate-300">
                  /
                </span>
              )}
              {c.href && !last ? (
                <Link href={c.href} className="hover:text-navy-700 hover:underline">
                  {c.label}
                </Link>
              ) : (
                <span
                  aria-current={last ? 'page' : undefined}
                  className={`max-w-[60vw] truncate sm:max-w-md ${last ? 'text-slate-700' : ''}`}
                >
                  {c.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
