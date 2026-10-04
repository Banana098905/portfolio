import type { Heading } from '@/lib/types';

/** 見出しから自動生成した目次のリスト部分 */
export function TocList({ headings }: { headings: Heading[] }) {
  return (
    <ol className="space-y-0.5 text-sm">
      {headings.map((h) => (
        <li key={h.id} className={h.level === 3 ? 'pl-4' : ''}>
          <a
            href={`#${h.id}`}
            className={`block rounded px-2 py-1.5 leading-snug transition hover:bg-mist hover:text-navy-800 ${
              h.level === 3 ? 'text-[13px] text-slate-500' : 'font-medium text-slate-700'
            }`}
          >
            {h.text}
          </a>
        </li>
      ))}
    </ol>
  );
}

/** サイドバー用の目次 */
export function Toc({ headings }: { headings: Heading[] }) {
  if (headings.length === 0) return null;
  return (
    <nav
      aria-label="目次"
      className="max-h-[calc(100vh-9rem)] overflow-y-auto overscroll-contain rounded-2xl border border-line bg-white p-4"
    >
      <p className="mb-2 px-2 text-sm font-bold text-navy-900">目次</p>
      <TocList headings={headings} />
    </nav>
  );
}
