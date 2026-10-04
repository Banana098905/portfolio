import type { Metadata } from 'next';
import Link from 'next/link';
import { ArticleCard } from '@/components/ArticleCard';
import { CategoryCard } from '@/components/CategoryCard';
import { FeaturedCard } from '@/components/FeaturedCard';
import { SearchForm } from '@/components/SearchForm';
import { SectionHeading } from '@/components/SectionHeading';
import {
  getAllArticles,
  getCategoryCounts,
  getFeaturedArticles,
  getReportArticles,
  toSummary,
} from '@/lib/articles';
import { categories } from '@/lib/categories';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function HomePage() {
  const all = getAllArticles();
  const counts = getCategoryCounts();
  const featured = getFeaturedArticles(2);
  const latest = all.slice(0, 6);
  const reports = getReportArticles().slice(0, 3);

  // 記事のあるカテゴリーを優先して、ヒーロー下の導線に5件表示
  const heroCategories = [...categories]
    .sort((a, b) => (counts[b.slug] > 0 ? 1 : 0) - (counts[a.slug] > 0 ? 1 : 0))
    .slice(0, 5);

  // サイト自体の基本情報だけを構造化データにする（実在する情報のみ）
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: 'ja',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      {/* ヒーロー */}
      <section className="bg-lab-grid border-b border-line">
        <div className="container-page grid gap-10 py-14 sm:py-20 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-iris">FREE TOOLS LAB</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight text-navy-900 sm:text-5xl">
              {siteConfig.tagline}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
              {siteConfig.description}
            </p>
            <SearchForm id="hero-search" size="lg" className="mt-8 max-w-xl" />

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="text-sm text-slate-500">カテゴリーから探す：</span>
              {heroCategories.map((c) => (
                <Link key={c.slug} href={`/categories/${c.slug}`} className="chip">
                  {c.name}
                </Link>
              ))}
            </div>
            {featured[0] && (
              <p className="mt-4 text-sm text-slate-600">
                注目：
                <Link
                  href={`/articles/${featured[0].slug}`}
                  className="font-semibold text-navy-600 underline decoration-navy-200 underline-offset-2 hover:text-navy-800"
                >
                  {featured[0].title}
                </Link>
              </p>
            )}
          </div>

          <aside
            aria-label="サイトの掲載状況"
            className="rounded-2xl border border-line bg-white/90 p-6 shadow-card"
          >
            <p className="text-sm font-bold text-navy-900">研究所のいま</p>
            <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-mist p-3">
                <dt className="text-xs text-slate-600">記事</dt>
                <dd className="mt-1 text-2xl font-bold text-navy-800">{all.length}</dd>
              </div>
              <div className="rounded-xl bg-iris-soft p-3">
                <dt className="text-xs text-slate-600">研究レポート</dt>
                <dd className="mt-1 text-2xl font-bold text-iris">{getReportArticles().length}</dd>
              </div>
              <div className="rounded-xl bg-mist p-3">
                <dt className="text-xs text-slate-600">カテゴリー</dt>
                <dd className="mt-1 text-2xl font-bold text-navy-800">{categories.length}</dd>
              </div>
            </dl>
            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              数字は現在このサイトに登録されている内容です。サンプル記事は公開前に確認が必要な内容を含みます。
            </p>
          </aside>
        </div>
      </section>

      {/* 注目記事 */}
      {featured.length > 0 && (
        <section className="container-page mt-16" aria-labelledby="featured-heading">
          <div id="featured-heading">
            <SectionHeading eyebrow="FEATURED" title="注目の記事" />
          </div>
          <div className="mt-8 space-y-6">
            {featured.map((a, i) => (
              <FeaturedCard key={a.slug} article={toSummary(a)} reverse={i % 2 === 1} priority={i === 0} />
            ))}
          </div>
        </section>
      )}

      {/* 最新の記事 */}
      <section className="container-page mt-20" aria-labelledby="latest-heading">
        <div id="latest-heading">
          <SectionHeading
            eyebrow="LATEST"
            title="最新の記事"
            action={{ href: '/articles', label: 'すべての記事を見る' }}
          />
        </div>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((a) => (
            <li key={a.slug}>
              <ArticleCard article={toSummary(a)} />
            </li>
          ))}
        </ul>
      </section>

      {/* カテゴリー */}
      <section className="container-page mt-20" aria-labelledby="category-heading">
        <div id="category-heading">
          <SectionHeading
            eyebrow="CATEGORIES"
            title="カテゴリーから探す"
            description="気になる分野から、無料でできることを見つけられます。"
            action={{ href: '/categories', label: 'カテゴリー一覧' }}
          />
        </div>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <li key={c.slug}>
              <CategoryCard category={c} count={counts[c.slug] ?? 0} />
            </li>
          ))}
        </ul>
      </section>

      {/* 研究レポート */}
      <section className="mt-20 border-y border-iris-line bg-iris-soft/60" aria-labelledby="report-heading">
        <div className="container-page py-16">
          <div id="report-heading">
            <SectionHeading
              eyebrow="RESEARCH REPORTS"
              title="研究レポート"
              description="使い方の解説とは別に、調べた内容や試した結果を「テーマ・比較対象・調査方法・制限事項・未確認事項」の形で整理するコーナーです。公式情報を調べただけのものと、実際に試したものを区別して表示します。"
              action={{ href: '/reports', label: 'レポート一覧' }}
            />
          </div>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reports.map((a) => (
              <li key={a.slug}>
                <ArticleCard article={toSummary(a)} />
              </li>
            ))}
          </ul>
          {reports.length === 0 && (
            <p className="mt-8 text-slate-600">公開中の研究レポートはまだありません。</p>
          )}
        </div>
      </section>

      {/* 姿勢 */}
      <section className="container-page mt-20" aria-labelledby="policy-heading">
        <h2 id="policy-heading" className="text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
          この研究所の約束
        </h2>
        <ul className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            {
              title: '試していないことは「検証済み」と書かない',
              body: '実際に確認した内容と、未確認の内容を区別して表示します。',
            },
            {
              title: '仕様や料金は変わる前提で書く',
              body: '無料プランの条件は変更されることがあるため、利用前に公式情報を確認するよう案内します。',
            },
            {
              title: '初心者にもわかる言葉で',
              body: '専門用語を避け、手順と注意点をセットで解説します。',
            },
          ].map((p) => (
            <li key={p.title} className="rounded-2xl border border-line bg-white p-6">
              <p className="font-bold text-navy-900">{p.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm">
          <Link href="/about" className="font-semibold text-navy-600 hover:text-navy-800">
            サイトについて詳しく見る →
          </Link>
        </p>
      </section>
    </>
  );
}
