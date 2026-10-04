import Link from 'next/link';
import type { Article, Heading } from '@/lib/types';
import { getCategory } from '@/lib/categories';

type Props = { article: Article; headings: Heading[] };

type Action = { href: string; title: string; body: string; external?: boolean };

/**
 * 記事の最後に置く「次にやること」。
 * 記事に実際にある情報（公式情報源の節・カテゴリー・タグ）から作るので、存在しないリンクは出しません。
 */
export function NextActions({ article, headings }: Props) {
  const category = getCategory(article.category);
  const actions: Action[] = [];

  const firstSource = article.trust.sources[0];
  const sourcesHeading = headings.find((h) => /情報源/.test(h.text));
  if (firstSource) {
    actions.push({
      href: firstSource.url,
      external: true,
      title: '公式サイトで最新の条件を確認する',
      body: `${firstSource.label}など、記事で使った公式情報を開きます。`,
    });
  } else if (sourcesHeading) {
    actions.push({
      href: `#${sourcesHeading.id}`,
      title: '公式サイトで最新の条件を確認する',
      body: '記事で使った公式情報の一覧に移動します。利用の前に、無料の範囲と規約を見直しましょう。',
    });
  }

  const tag = article.tags[0];
  if (tag) {
    actions.push({
      href: `/articles?q=${encodeURIComponent(tag)}`,
      title: `「${tag}」の記事をほかにも探す`,
      body: '同じタグ・同じ話題の記事を、記事一覧の検索で開きます。',
    });
  }

  actions.push({
    href: `/categories/${category.slug}`,
    title: `${category.name}の記事を読む`,
    body: `同じカテゴリーの記事をまとめて見られます。`,
  });

  actions.push(
    article.research
      ? { href: '/reports', title: '研究レポートの一覧を見る', body: '調査・検証の結果をまとめた記事の一覧です。' }
      : { href: '/articles', title: '記事一覧から探す', body: 'キーワードやカテゴリーで絞り込めます。' },
  );

  return (
    <section aria-labelledby="next-actions-heading" className="mt-14">
      <h2 id="next-actions-heading" className="text-xl font-bold tracking-tight text-navy-900">
        次にやること
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {actions.slice(0, 4).map((a) => (
          <li key={a.title}>
            {a.external ? (
              <a
                href={a.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full rounded-xl border border-line bg-white p-4 transition hover:border-navy-200 hover:bg-navy-50"
              >
                <span className="block text-sm font-bold text-navy-900">
                  {a.title}
                  <span aria-hidden="true"> ↗</span>
                  <span className="sr-only">（新しいタブで開きます）</span>
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-slate-600">{a.body}</span>
              </a>
            ) : a.href.startsWith('#') ? (
              <a
                href={a.href}
                className="block h-full rounded-xl border border-line bg-white p-4 transition hover:border-navy-200 hover:bg-navy-50"
              >
                <span className="block text-sm font-bold text-navy-900">{a.title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-slate-600">{a.body}</span>
              </a>
            ) : (
              <Link
                href={a.href}
                className="block h-full rounded-xl border border-line bg-white p-4 transition hover:border-navy-200 hover:bg-navy-50"
              >
                <span className="block text-sm font-bold text-navy-900">{a.title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-slate-600">{a.body}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
