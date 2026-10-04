import Link from 'next/link';
import { getCategory } from '@/lib/categories';
import { formatDate } from '@/lib/format';
import type { ArticleSummary } from '@/lib/types';
import { Thumbnail } from './Thumbnail';

type Props = { article: ArticleSummary; priority?: boolean };

/** 一覧用の記事カード。カード全体がタイトルのリンクで押せます */
export function ArticleCard({ article, priority = false }: Props) {
  const category = getCategory(article.category);
  return (
    <article className="card group relative flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[16/9] overflow-hidden bg-navy-50">
        <Thumbnail
          article={article}
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
          priority={priority}
          className="transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/categories/${category.slug}`} className="chip relative z-10">
            {category.name}
          </Link>
          {article.research && <span className="chip-iris">研究レポート</span>}
          {article.status === 'tested' && (
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
              検証済み
            </span>
          )}
          {article.status === 'unverified' && (
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-900">
              未検証
            </span>
          )}
          {article.sample && <span className="chip-outline">サンプル</span>}
        </div>
        <h3 className="text-[17px] font-bold leading-snug text-navy-900">
          <Link
            href={`/articles/${article.slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {article.title}
          </Link>
        </h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">{article.description}</p>
        <div className="mt-auto flex flex-wrap items-center gap-x-3 pt-2 text-xs text-slate-500">
          <time dateTime={article.updatedAt}>{formatDate(article.updatedAt)} 更新</time>
          <span aria-hidden="true">・</span>
          <span>読了 約{article.readingTime}分</span>
        </div>
      </div>
    </article>
  );
}
