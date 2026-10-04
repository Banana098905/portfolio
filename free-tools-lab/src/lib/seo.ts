import type { Metadata } from 'next';
import { siteConfig } from './site';

type Options = {
  title: string;
  description: string;
  /** 例: "/articles/foo"（canonical と og:url に使う） */
  path: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  /** OGP 画像のパス（"/images/xxx.jpg"）。未指定なら共通画像を使います */
  image?: string;
  /** 記事のタグ（og:article:tag） */
  tags?: string[];
  /** true のとき検索エンジンに載せない（noindex） */
  noindex?: boolean;
};

export function buildMetadata({
  title,
  description,
  path,
  type = 'website',
  publishedTime,
  modifiedTime,
  image,
  tags,
  noindex = false,
}: Options): Metadata {
  const fullTitle = `${title}｜${siteConfig.name}`;
  // 記事ごとの画像があればそれを、なければ共通画像を使う
  const images: { url: string; width?: number; height?: number; alt: string }[] = image
    ? [{ url: image, alt: title }]
    : [
        {
          url: siteConfig.ogImage.path,
          width: siteConfig.ogImage.width,
          height: siteConfig.ogImage.height,
          alt: siteConfig.ogImage.alt,
        },
      ];
  const common = {
    title: fullTitle,
    description,
    url: path,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images,
  };

  return {
    title,
    description,
    alternates: { canonical: path },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph:
      type === 'article'
        ? { ...common, type: 'article', publishedTime, modifiedTime, tags }
        : { ...common, type: 'website' },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: images.map((i) => i.url),
    },
  };
}
