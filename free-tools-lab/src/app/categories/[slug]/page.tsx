import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleExplorer } from '@/components/ArticleExplorer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CategoryIcon } from '@/components/CategoryIcon';
import { getArticlesByCategory, toSearchable } from '@/lib/articles';
import { categories, findCategory } from '@/lib/categories';
import { buildMetadata } from '@/lib/seo';

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const c = findCategory(params.slug);
  if (!c) return {};
  return buildMetadata({
    title: `${c.name}の記事一覧`,
    description: c.description,
    path: `/categories/${c.slug}`,
  });
}

export default function CategoryPage({ params }: Props) {
  const category = findCategory(params.slug);
  if (!category) notFound();

  const articles = getArticlesByCategory(category.slug).map(toSearchable);

  return (
    <div className="container-page py-10 sm:py-14">
      <Breadcrumbs items={[{ label: 'カテゴリー', href: '/categories' }, { label: category.name }]} />
      <header className="mt-6 flex max-w-3xl items-start gap-4">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-mist text-navy-700">
          <CategoryIcon slug={category.slug} className="h-7 w-7" />
        </span>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
            {category.name}
          </h1>
          <p className="mt-2 text-lg text-slate-600">{category.description}</p>
        </div>
      </header>
      <div className="mt-10">
        <ArticleExplorer
          articles={articles}
          showCategoryFilter={false}
          emptyMessage="このカテゴリーにはまだ記事がありません。"
        />
      </div>
    </div>
  );
}
