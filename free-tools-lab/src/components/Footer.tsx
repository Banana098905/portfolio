import Link from 'next/link';
import { categories } from '@/lib/categories';
import { siteConfig } from '@/lib/site';
import { Logo } from './Logo';

const siteLinks = [
  { href: '/articles', label: '記事一覧' },
  { href: '/categories', label: 'カテゴリー' },
  { href: '/reports', label: '研究レポート' },
  { href: '/about', label: 'サイトについて' },
];

const infoLinks = [
  { href: '/contact', label: 'お問い合わせ' },
  { href: '/privacy', label: 'プライバシーポリシー' },
  { href: '/disclaimer', label: '免責事項' },
];

const linkClass = 'text-sm text-slate-600 transition hover:text-navy-800 hover:underline';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-white">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Link href="/" aria-label="ホームへ">
            <Logo />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-600">{siteConfig.tagline}</p>
        </div>

        <nav aria-label="サイト内リンク">
          <p className="text-sm font-bold text-navy-900">サイト</p>
          <ul className="mt-3 space-y-2">
            {siteLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="サイト情報">
          <p className="text-sm font-bold text-navy-900">情報</p>
          <ul className="mt-3 space-y-2">
            {infoLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="カテゴリー">
          <p className="text-sm font-bold text-navy-900">カテゴリー</p>
          <ul className="mt-3 grid grid-cols-1 gap-2">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/categories/${c.slug}`} className={linkClass}>
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-line">
        <p className="container-page py-5 text-xs text-slate-500">
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
      </div>
    </footer>
  );
}
