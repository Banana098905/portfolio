import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CategoryCard } from '@/components/CategoryCard';
import { getCategoryCounts } from '@/lib/articles';
import { categories } from '@/lib/categories';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'カテゴリー一覧',
  description: 'AI、画像・デザイン、動画・音声、作業効率化など、分野別に無料でできることを探せます。',
  path: '/categories',
});

export default function CategoriesPage() {
  const counts = getCategoryCounts();
  return (
    <div className="container-page py-10 sm:py-14">
      <Breadcrumbs items={[{ label: 'カテゴリー' }]} />
      <header className="mt-6 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">カテゴリー</h1>
        <p className="mt-3 text-lg text-slate-600">分野から、無料でできることを探せます。</p>
      </header>
      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((c) => (
          <li key={c.slug}>
            <CategoryCard category={c} count={counts[c.slug] ?? 0} />
          </li>
        ))}
      </ul>
    </div>
  );
}
