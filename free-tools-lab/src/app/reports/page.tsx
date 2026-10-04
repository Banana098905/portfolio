import type { Metadata } from 'next';
import { ArticleExplorer } from '@/components/ArticleExplorer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { getReportArticles, toSearchable } from '@/lib/articles';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: '研究レポート',
  description:
    '無料ツール・サービスの調査と検証を、調査方法・比較対象・制限事項・未確認事項などとあわせて整理したレポート。公式情報の調査と実際に試した検証を区別して表示します。',
  path: '/reports',
});

const items = [
  '調査・実験テーマ',
  '調査日・情報確認日',
  '調査方法',
  '比較対象・使用ツール',
  '検証環境（試した場合）',
  '調査・検証の結果',
  '比較表',
  '無料で使える範囲',
  '制限事項',
  '公式情報源',
  '未確認事項',
  '最終更新日',
  '結論',
];

export default function ReportsPage() {
  const reports = getReportArticles().map(toSearchable);

  return (
    <div className="container-page py-10 sm:py-14">
      <Breadcrumbs items={[{ label: '研究レポート' }]} />
      <header className="mt-6 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">研究レポート</h1>
        <p className="mt-3 text-lg leading-relaxed text-slate-600">
          使い方の解説とは別に、無料ツールやサービスの調査・検証をまとめるコーナーです。
          「公式情報を調べてまとめたもの」と「実際に試して確かめたもの」を区別して表示し、
          検証していない内容を「検証済み」とは表示しません。
        </p>
      </header>

      <section aria-labelledby="report-format" className="mt-10 rounded-2xl border border-iris-line bg-iris-soft/60 p-6">
        <h2 id="report-format" className="text-base font-bold text-iris">
          レポートに含まれる項目
        </h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {items.map((i) => (
            <li key={i} className="rounded-full bg-white px-3 py-1 text-sm text-navy-800 ring-1 ring-iris-line">
              {i}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-10">
        <ArticleExplorer
          articles={reports}
          showCategoryFilter={false}
          emptyMessage="公開中の研究レポートはまだありません。"
        />
      </div>
    </div>
  );
}
