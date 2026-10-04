import Image from 'next/image';
import type { ArticleSummary } from '@/lib/types';
import { ThumbArt } from './ThumbArt';

type Props = {
  article: Pick<ArticleSummary, 'thumbnail' | 'category' | 'slug'>;
  sizes: string;
  priority?: boolean;
  alt?: string;
  className?: string;
};

/**
 * 親要素に `relative` と縦横比（aspect-*）が必要です。
 * thumbnail が "/images/xxx.jpg" のような public 配下のパスなら next/image で最適化して表示し、
 * 未設定なら記事ごとの抽象アートワークを表示します。
 */
export function Thumbnail({ article, sizes, priority = false, alt = '', className = '' }: Props) {
  if (article.thumbnail && article.thumbnail.startsWith('/')) {
    return (
      <Image
        src={article.thumbnail}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${className}`}
      />
    );
  }
  return (
    <ThumbArt
      category={article.category}
      seed={article.slug}
      className={`absolute inset-0 h-full w-full ${className}`}
    />
  );
}
