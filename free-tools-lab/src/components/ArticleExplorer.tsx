'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { categories } from '@/lib/categories';
import { normalizeText } from '@/lib/text';
import type { SearchableArticle } from '@/lib/types';
import { ArticleCard } from './ArticleCard';

const PAGE_SIZE = 9;
type Sort = 'new' | 'updated' | 'relevance';
const SORTS: Sort[] = ['new', 'updated', 'relevance'];

type Props = {
  articles: SearchableArticle[];
  /** false のとき（カテゴリーページ・研究レポートページ）はカテゴリー絞り込みを隠す */
  showCategoryFilter?: boolean;
  emptyMessage?: string;
};

/** 検索語に対する関連度。タイトル > タグ > 概要 > 本文 の順に重みを付けます */
function relevance(a: SearchableArticle, terms: string[]): number {
  let score = 0;
  for (const t of terms) {
    if (a.fields.title.includes(t)) score += 6;
    if (a.fields.tags.includes(t)) score += 4;
    if (a.fields.description.includes(t)) score += 2;
    if (a.searchText.includes(t)) score += 1;
  }
  return score;
}

/**
 * キーワード検索（タイトル・概要・タグ・本文）、カテゴリー絞り込み、並び替え、
 * 「もっと見る」による追加表示を行う一覧。
 * 初回表示は全記事をサーバー側で描画し（検索エンジンにも見える）、
 * マウント後に URL の ?q= ?category= ?sort= を読み取って絞り込みます。
 */
export function ArticleExplorer({
  articles,
  showCategoryFilter = true,
  emptyMessage = 'まだ記事がありません。',
}: Props) {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState<Sort>('new');
  const [sortTouched, setSortTouched] = useState(false);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [ready, setReady] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // URL からの初期値
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    setQ(sp.get('q') ?? '');
    const c = sp.get('category');
    if (showCategoryFilter && c && categories.some((x) => x.slug === c)) setCategory(c);
    const s = sp.get('sort');
    if (s && (SORTS as string[]).includes(s)) {
      setSort(s as Sort);
      setSortTouched(true);
    }
    if (window.location.hash === '#article-search') inputRef.current?.focus();
    setReady(true);
  }, [showCategoryFilter]);

  const terms = useMemo(
    () =>
      normalizeText(q)
        .split(/[\s　]+/)
        .filter(Boolean),
    [q],
  );

  // 検索語があり、並び順を自分で選んでいないときは関連度順。検索語がなければ関連度順は使えない
  const effectiveSort: Sort =
    terms.length > 0 && !sortTouched ? 'relevance' : sort === 'relevance' && terms.length === 0 ? 'new' : sort;

  // 入力内容を URL に反映（共有・戻る操作のため）
  useEffect(() => {
    if (!ready) return;
    const t = window.setTimeout(() => {
      const sp = new URLSearchParams();
      if (q.trim()) sp.set('q', q.trim());
      if (showCategoryFilter && category !== 'all') sp.set('category', category);
      if (sortTouched && sort !== 'new') sp.set('sort', sort);
      const qs = sp.toString();
      const url = window.location.pathname + (qs ? `?${qs}` : '') + window.location.hash;
      window.history.replaceState(window.history.state, '', url);
    }, 250);
    return () => window.clearTimeout(t);
  }, [q, category, sort, sortTouched, ready, showCategoryFilter]);

  const filtered = useMemo(() => {
    const list = articles.filter(
      (a) =>
        (category === 'all' || a.category === category) &&
        terms.every((t) => a.searchText.includes(t)),
    );
    if (effectiveSort === 'relevance') {
      const scored = list.map((a) => ({ a, score: relevance(a, terms) }));
      scored.sort(
        (x, y) =>
          y.score - x.score ||
          y.a.publishedAt.localeCompare(x.a.publishedAt) ||
          x.a.slug.localeCompare(y.a.slug),
      );
      return scored.map((x) => x.a);
    }
    const key = effectiveSort === 'updated' ? 'updatedAt' : 'publishedAt';
    return [...list].sort((a, b) => b[key].localeCompare(a[key]) || a.slug.localeCompare(b.slug));
  }, [articles, category, terms, effectiveSort]);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const a of articles) map[a.category] = (map[a.category] ?? 0) + 1;
    return map;
  }, [articles]);

  // 0件のときに案内する、よく使われているタグ
  const popularTags = useMemo(() => {
    const freq = new Map<string, number>();
    for (const a of articles) for (const t of a.tags) freq.set(t, (freq.get(t) ?? 0) + 1);
    return [...freq.entries()]
      .sort((x, y) => y[1] - x[1] || x[0].localeCompare(y[0]))
      .slice(0, 6)
      .map(([t]) => t);
  }, [articles]);

  const visible = filtered.slice(0, limit);
  const remaining = filtered.length - visible.length;
  const filtering = terms.length > 0 || category !== 'all';
  const activeCategory = categories.find((c) => c.slug === category);

  const reset = () => {
    setQ('');
    setCategory('all');
    setLimit(PAGE_SIZE);
  };

  const chipBase =
    'min-h-[40px] rounded-full border px-3.5 py-1.5 text-sm font-medium transition sm:min-h-0';
  const chipOn = 'border-navy-800 bg-navy-800 text-white';
  const chipOff = 'border-line bg-white text-slate-600 hover:border-navy-200 hover:bg-navy-50';

  return (
    <div>
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <label htmlFor="article-search" className="sr-only">
              キーワードで記事を検索
            </label>
            <input
              id="article-search"
              ref={inputRef}
              type="search"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setLimit(PAGE_SIZE);
              }}
              placeholder="キーワードで検索（タイトル・概要・タグ・本文）"
              autoComplete="off"
              className="h-12 w-full rounded-xl border border-line bg-white pl-4 pr-4 text-base outline-none transition placeholder:text-slate-400 focus:border-navy-400 focus:ring-2 focus:ring-navy-200"
            />
          </div>
          <div>
            <label htmlFor="article-sort" className="sr-only">
              並び順
            </label>
            <select
              id="article-sort"
              value={effectiveSort}
              onChange={(e) => {
                setSort(e.target.value as Sort);
                setSortTouched(true);
                setLimit(PAGE_SIZE);
              }}
              className="h-12 w-full rounded-xl border border-line bg-white px-4 text-sm outline-none transition focus:border-navy-400 focus:ring-2 focus:ring-navy-200 sm:w-auto"
            >
              <option value="new">新着順（公開日）</option>
              <option value="updated">更新が新しい順</option>
              <option value="relevance" disabled={terms.length === 0}>
                関連度順（キーワード検索時）
              </option>
            </select>
          </div>
        </div>

        {showCategoryFilter && (
          <div role="group" aria-label="カテゴリーで絞り込み" className="flex flex-wrap gap-2">
            <button
              type="button"
              aria-pressed={category === 'all'}
              onClick={() => {
                setCategory('all');
                setLimit(PAGE_SIZE);
              }}
              className={`${chipBase} ${category === 'all' ? chipOn : chipOff}`}
            >
              すべて（{articles.length}）
            </button>
            {categories.map((c) => {
              const count = counts[c.slug] ?? 0;
              const empty = count === 0 && category !== c.slug;
              return (
                <button
                  key={c.slug}
                  type="button"
                  aria-pressed={category === c.slug}
                  disabled={empty}
                  onClick={() => {
                    setCategory(c.slug);
                    setLimit(PAGE_SIZE);
                  }}
                  className={`${chipBase} ${category === c.slug ? chipOn : chipOff} ${
                    empty ? 'cursor-not-allowed opacity-50 hover:border-line hover:bg-white' : ''
                  }`}
                >
                  {c.name}（{count}）
                </button>
              );
            })}
          </div>
        )}
      </div>

      {filtering && (
        <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-slate-500">検索条件：</span>
          {terms.length > 0 && (
            <button
              type="button"
              onClick={() => setQ('')}
              className="inline-flex items-center gap-1 rounded-full bg-mist px-3 py-1 text-navy-800 transition hover:bg-navy-100"
              aria-label={`キーワード「${q.trim()}」の条件を外す`}
            >
              キーワード「{q.trim()}」<span aria-hidden="true">×</span>
            </button>
          )}
          {showCategoryFilter && activeCategory && (
            <button
              type="button"
              onClick={() => setCategory('all')}
              className="inline-flex items-center gap-1 rounded-full bg-mist px-3 py-1 text-navy-800 transition hover:bg-navy-100"
              aria-label={`カテゴリー「${activeCategory.name}」の条件を外す`}
            >
              カテゴリー「{activeCategory.name}」<span aria-hidden="true">×</span>
            </button>
          )}
          <button
            type="button"
            onClick={reset}
            className="px-2 py-1 text-slate-500 underline underline-offset-2 hover:text-navy-800"
          >
            すべて解除
          </button>
        </div>
      )}

      <p role="status" aria-live="polite" className="mt-4 text-sm text-slate-500">
        {filtered.length}件の記事
        {terms.length > 0 ? `（「${q.trim()}」で検索）` : ''}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-navy-200 bg-white p-8 text-center sm:p-10">
          <p className="font-semibold text-navy-900">
            {articles.length === 0
              ? emptyMessage
              : terms.length > 0
                ? `「${q.trim()}」に一致する記事は見つかりませんでした。`
                : '条件に一致する記事が見つかりませんでした。'}
          </p>
          {articles.length > 0 && (
            <>
              <ul className="mx-auto mt-3 max-w-md list-disc space-y-1 pl-5 text-left text-sm text-slate-600">
                <li>キーワードを短くする、または別の言い方にする</li>
                <li>カテゴリーの絞り込みを解除する</li>
                <li>サービス名・ソフト名・「商用利用」「無料枠」などの語で試す</li>
              </ul>
              {popularTags.length > 0 && (
                <div className="mt-5">
                  <p className="text-sm text-slate-500">よく使われているタグ：</p>
                  <div className="mt-2 flex flex-wrap justify-center gap-2">
                    {popularTags.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          setQ(t);
                          setCategory('all');
                          setLimit(PAGE_SIZE);
                        }}
                        className="chip"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {filtering && (
                <button type="button" onClick={reset} className="btn-secondary mt-6">
                  絞り込みをリセット
                </button>
              )}
            </>
          )}
        </div>
      ) : (
        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((a) => (
            <li key={a.slug}>
              <ArticleCard article={a} />
            </li>
          ))}
        </ul>
      )}

      {remaining > 0 && (
        <div className="mt-10 text-center">
          <button type="button" onClick={() => setLimit((n) => n + PAGE_SIZE)} className="btn-secondary">
            もっと見る（残り{remaining}件）
          </button>
        </div>
      )}
    </div>
  );
}
