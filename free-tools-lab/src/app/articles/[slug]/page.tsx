import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AdSlot } from '@/components/AdSlot';
import { ArticleCard } from '@/components/ArticleCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { NextActions } from '@/components/NextActions';
import { PrevNext } from '@/components/PrevNext';
import { ReportOutcome, ReportSummary } from '@/components/ReportSummary';
import { SampleNotice } from '@/components/SampleNotice';
import { Thumbnail } from '@/components/Thumbnail';
import { Toc, TocList } from '@/components/Toc';
import { TrustPanel } from '@/components/TrustPanel';
import {
  getAdjacentArticles,
  getAllArticles,
  getArticleBySlug,
  getRelatedArticles,
  toSummary,
} from '@/lib/articles';
import { getCategory } from '@/lib/categories';
import { formatDate } from '@/lib/format';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const a = getArticleBySlug(params.slug);
  if (!a) return {};
  return buildMetadata({
    title: a.title,
    description: a.description,
    path: `/articles/${a.slug}`,
    type: 'article',
    publishedTime: a.publishedAt,
    modifiedTime: a.updatedAt,
    image: a.thumbnail?.startsWith('/') ? a.thumbnail : undefined,
    tags: a.tags,
    // サンプル記事（公開前の確認が必要な内容）は検索結果に載せない
    noindex: a.sample && siteConfig.noindexSampleArticles,
  });
}

export default function ArticlePage({ params }: Props) {
  const a = getArticleBySlug(params.slug);
  if (!a) notFound();

  const category = getCategory(a.category);
  const related = getRelatedArticles(a, 3);
  const { newer, older } = getAdjacentArticles(a.slug);
  const url = `${siteConfig.url}/articles/${a.slug}`;
  const imagePath = a.thumbnail?.startsWith('/') ? a.thumbnail : siteConfig.ogImage.path;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: a.title,
        description: a.description,
        datePublished: a.publishedAt,
        dateModified: a.updatedAt,
        inLanguage: 'ja',
        mainEntityOfPage: url,
        image: `${siteConfig.url}${imagePath}`,
        ...(a.tags.length > 0 ? { keywords: a.tags.join(', ') } : {}),
        publisher: { '@type': 'Organization', name: siteConfig.name, url: siteConfig.url },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'ホーム', item: siteConfig.url },
          { '@type': 'ListItem', position: 2, name: '記事一覧', item: `${siteConfig.url}/articles` },
          {
            '@type': 'ListItem',
            position: 3,
            name: category.name,
            item: `${siteConfig.url}/categories/${category.slug}`,
          },
          { '@type': 'ListItem', position: 4, name: a.title, item: url },
        ],
      },
    ],
  };

  return (
    <div className="container-page py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      <Breadcrumbs
        items={[
          { label: '記事一覧', href: '/articles' },
          { label: category.name, href: `/categories/${category.slug}` },
          { label: a.title },
        ]}
      />

      <article className="mt-6">
        <header className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/categories/${category.slug}`} className="chip">
              {category.name}
            </Link>
            {a.research && <span className="chip-iris">研究レポート</span>}
            {a.sample && <span className="chip-outline">サンプル</span>}
          </div>
          <h1 className="mt-4 text-3xl font-bold leading-snug tracking-tight text-navy-900 sm:text-4xl">
            {a.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">{a.description}</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
            <span>
              公開日：<time dateTime={a.publishedAt}>{formatDate(a.publishedAt)}</time>
            </span>
            <span>
              更新日：<time dateTime={a.updatedAt}>{formatDate(a.updatedAt)}</time>
            </span>
            <span>読了 約{a.readingTime}分</span>
          </div>
        </header>

        {a.sample && <SampleNotice />}

        <div className="relative mt-8 aspect-[16/9] max-w-4xl overflow-hidden rounded-2xl border border-line bg-navy-50">
          <Thumbnail
            article={a}
            alt={a.title}
            priority
            sizes="(min-width: 1024px) 896px, 100vw"
          />
        </div>

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_17rem]">
          <div className="min-w-0 max-w-3xl">
            {a.headings.length > 0 && (
              <details className="card mb-8 p-4 lg:hidden">
                <summary className="cursor-pointer font-semibold text-navy-900">目次</summary>
                <div className="mt-3">
                  <TocList headings={a.headings} />
                </div>
              </details>
            )}

            {a.report && (
              <div className="mb-8">
                <ReportSummary report={a.report} trust={a.trust} />
              </div>
            )}

            <TrustPanel
              trust={a.trust}
              updatedAt={a.updatedAt}
              headings={a.headings}
              inReport={Boolean(a.report)}
            />

            <AdSlot placement="article-top" className="mb-8" />

            <div className="prose-jp" dangerouslySetInnerHTML={{ __html: a.html }} />

            {a.report && <ReportOutcome report={a.report} />}

            <NextActions article={a} headings={a.headings} />

            <AdSlot placement="article-bottom" className="mt-12" />

            <PrevNext newer={newer && toSummary(newer)} older={older && toSummary(older)} />
          </div>

          <aside aria-label="サイドバー" className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <Toc headings={a.headings} />
              <AdSlot placement="sidebar" />
            </div>
          </aside>
        </div>
      </article>

      {related.length > 0 && (
        <section className="mt-20" aria-labelledby="related-heading">
          <h2 id="related-heading" className="text-2xl font-bold tracking-tight text-navy-900">
            関連記事
          </h2>
          <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <li key={r.slug}>
                <ArticleCard article={toSummary(r)} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
