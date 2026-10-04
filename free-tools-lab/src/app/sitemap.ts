import type { MetadataRoute } from 'next';
import { getAllArticles } from '@/lib/articles';
import { categories } from '@/lib/categories';
import { siteConfig } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  // noindex にしているサンプル記事は sitemap にも載せない
  const articles = getAllArticles().filter((a) => !(a.sample && siteConfig.noindexSampleArticles));
  const latest = articles.reduce((max, a) => (a.updatedAt > max ? a.updatedAt : max), '1970-01-01');
  const latestDate = latest === '1970-01-01' ? undefined : new Date(latest);

  const staticPaths = ['', '/articles', '/categories', '/reports', '/about', '/contact', '/privacy', '/disclaimer'];

  return [
    ...staticPaths.map((p) => ({
      url: `${base}${p}`,
      lastModified: p === '' || p === '/articles' || p === '/reports' ? latestDate : undefined,
    })),
    ...categories.map((c) => ({ url: `${base}/categories/${c.slug}`, lastModified: latestDate })),
    ...articles.map((a) => ({
      url: `${base}/articles/${a.slug}`,
      lastModified: new Date(a.updatedAt),
    })),
  ];
}
