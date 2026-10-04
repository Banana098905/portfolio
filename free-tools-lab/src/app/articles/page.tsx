import type { Metadata } from 'next';
import { ArticleExplorer } from '@/components/ArticleExplorer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { getAllArticles, toSearchable } from '@/lib/articles';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: '記事一覧',
  description:
    '無料ツール・無料サービスの活用方法と検証記事の一覧。カテゴリーやキーワードで絞り込めます。',
  path: '/articles',
});

export default function ArticlesPage() {
  const articles = getAllArticles().map(toSearchable);

  return (
    <div className="container-page py-10 sm:py-14">
      <Breadcrumbs items={[{ label: '記事一覧' }]} />
      <header className="mt-6 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">記事一覧</h1>
        <p className="mt-3 text-lg text-slate-600">
          キーワードやカテゴリーで、読みたい記事を絞り込めます。
        </p>
      </header>
      <div className="mt-8">
        <ArticleExplorer articles={articles} />
      </div>
    </div>
  );
}
