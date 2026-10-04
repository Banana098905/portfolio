'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Logo } from './Logo';
import { SearchForm } from './SearchForm';

const nav = [
  { href: '/', label: 'ホーム' },
  { href: '/articles', label: '記事一覧' },
  { href: '/categories', label: 'カテゴリー' },
  { href: '/reports', label: '研究レポート' },
  { href: '/about', label: 'サイトについて' },
];

function isActive(pathname: string, href: string): boolean {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // ページ移動したらメニューを閉じる
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Esc キーで閉じる
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/85 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="無料でできること研究所 ホームへ" className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="メインナビゲーション" className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active ? 'bg-mist text-navy-800' : 'text-slate-600 hover:bg-navy-50 hover:text-navy-800'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <SearchForm id="header-search" className="hidden w-56 xl:block" placeholder="記事を検索" />
          <Link
            href="/articles#article-search"
            aria-label="記事を検索する"
            className="hidden h-10 w-10 place-items-center rounded-full text-slate-600 transition hover:bg-navy-50 hover:text-navy-800 lg:grid xl:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'メニューを閉じる' : 'メニューを開く'}
            className="grid h-10 w-10 place-items-center rounded-lg text-navy-800 transition hover:bg-navy-50 lg:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-6 w-6"
              aria-hidden="true"
            >
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="animate-fade-in border-t border-line bg-white lg:hidden">
          <div className="container-page space-y-4 py-4">
            <SearchForm id="mobile-search" />
            <nav aria-label="モバイルナビゲーション">
              <ul className="space-y-1">
                {nav.map((item) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? 'page' : undefined}
                        className={`block rounded-lg px-3 py-3 text-base font-medium ${
                          active ? 'bg-mist text-navy-800' : 'text-slate-700 hover:bg-navy-50'
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
