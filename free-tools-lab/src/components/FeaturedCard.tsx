import Link from 'next/link';
import { getCategory } from '@/lib/categories';
import { formatDate } from '@/lib/format';
import type { ArticleSummary } from '@/lib/types';
import { Thumbnail } from './Thumbnail';

type Props = { article: ArticleSummary; reverse?: boolean; priority?: boolean };

/** 注目記事用の大きなカード */
export function FeaturedCard({ article, reverse = false, priority = false }: Props) {
  const category = getCategory(article.category);
  return (
    <article className="card group relative grid overflow-hidden md:grid-cols-2">
      <div
        className={`relative aspect-[16/10] overflow-hidden bg-navy-50 md:aspect-auto md:min-h-[320px] ${
          reverse ? 'md:order-2' : ''
        }`}
      >
        <Thumbnail
          article={article}
          sizes="(min-width: 768px) 560px, 100vw"
          priority={priority}
          className="transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-col justify-center gap-4 p-6 sm:p-9">
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/categories/${category.slug}`} className="chip relative z-10">
            {category.name}
          </Link>
          {article.research && <span className="chip-iris">研究レポート</span>}
          {article.sample && <span className="chip-outline">サンプル</span>}
        </div>
        <h3 className="text-2xl font-bold leading-snug tracking-tight text-navy-900 sm:text-[1.7rem]">
          <Link
            href={`/articles/${article.slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {article.title}
          </Link>
        </h3>
        <p className="leading-relaxed text-slate-600">{article.description}</p>
        <div className="flex flex-wrap items-center gap-x-3 text-sm text-slate-500">
          <time dateTime={article.updatedAt}>{formatDate(article.updatedAt)} 更新</time>
          <span aria-hidden="true">・</span>
          <span>読了 約{article.readingTime}分</span>
        </div>
        <span className="text-sm font-semibold text-navy-600 transition group-hover:text-navy-800">
          記事を読む →
        </span>
      </div>
    </article>
  );
}
