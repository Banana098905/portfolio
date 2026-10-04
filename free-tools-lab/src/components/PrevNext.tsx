import Link from 'next/link';
import type { ArticleSummary } from '@/lib/types';

type Props = { newer?: ArticleSummary; older?: ArticleSummary };

export function PrevNext({ newer, older }: Props) {
  if (!newer && !older) return null;

  const box =
    'card group block h-full p-4 text-sm transition hover:border-navy-200 focus-visible:outline-none';
  return (
    <nav aria-label="前後の記事" className="mt-12 grid gap-4 sm:grid-cols-2">
      {older ? (
        <Link href={`/articles/${older.slug}`} className={box} rel="prev">
          <span className="text-xs font-semibold text-slate-500">← 前の記事（古い）</span>
          <span className="mt-1 block font-bold leading-snug text-navy-900">{older.title}</span>
        </Link>
      ) : (
        <span aria-hidden="true" className="hidden sm:block" />
      )}
      {newer && (
        <Link href={`/articles/${newer.slug}`} className={`${box} sm:text-right`} rel="next">
          <span className="text-xs font-semibold text-slate-500">次の記事（新しい） →</span>
          <span className="mt-1 block font-bold leading-snug text-navy-900">{newer.title}</span>
        </Link>
      )}
    </nav>
  );
}
