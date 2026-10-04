import fs from 'node:fs';
import path from 'node:path';
import { parseFrontmatter, type Frontmatter } from './frontmatter';
import { renderMarkdown, toPlainText } from './markdown';
import { categories, isCategorySlug } from './categories';
import { normalizeText } from './text';
import type {
  Article,
  ArticleSummary,
  ArticleType,
  ReportMeta,
  SearchableArticle,
  SourceLink,
  TrustInfo,
  VerificationStatus,
} from './types';

/** 記事は content/articles/*.md に置きます（先頭が _ のファイルは無視） */
const CONTENT_DIR = path.join(process.cwd(), 'content', 'articles');
/** 日本語の目安読書速度（文字/分） */
const CHARS_PER_MINUTE = 500;

function str(data: Frontmatter, key: string, file: string, required = true): string {
  const v = data[key];
  if (typeof v === 'string' && v.trim()) return v.trim();
  if (required) {
    throw new Error(`[content] ${file}: frontmatter の "${key}" が未設定です`);
  }
  return '';
}

function bool(data: Frontmatter, key: string): boolean {
  return data[key] === true;
}

function list(data: Frontmatter, key: string): string[] {
  const v = data[key];
  if (Array.isArray(v)) return v;
  return typeof v === 'string' && v.trim() ? [v.trim()] : [];
}

function dateField(data: Frontmatter, key: string, file: string, fallback?: string): string {
  const v = str(data, key, file, fallback === undefined);
  const value = v || fallback || '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`[content] ${file}: "${key}" は YYYY-MM-DD 形式で指定してください`);
  }
  return value;
}

const ARTICLE_TYPES: ArticleType[] = ['comparison', 'guide', 'howto', 'experiment'];
const MAX_TAGS = 8;

function optionalDate(data: Frontmatter, key: string, file: string): string | undefined {
  const v = str(data, key, file, false);
  if (!v) return undefined;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) {
    throw new Error(`[content] ${file}: "${key}" は YYYY-MM-DD 形式で指定してください`);
  }
  return v;
}

/** sources: `- ラベル | https://...` の形式。URL は http(s) のみ */
function parseSources(data: Frontmatter, file: string): SourceLink[] {
  return list(data, 'sources').map((item) => {
    const i = item.lastIndexOf('|');
    const label = i >= 0 ? item.slice(0, i).trim() : '';
    const url = (i >= 0 ? item.slice(i + 1) : item).trim();
    if (!/^https?:\/\/\S+$/.test(url)) {
      throw new Error(
        `[content] ${file}: sources の "${item}" は「ラベル | https://...」の形式で書いてください`,
      );
    }
    return { label: label || url, url };
  });
}

/**
 * 情報の確かさを決めます。
 * 「実際に試した（tested）」と表示するのは basis: tested かつ verified: true のときだけです。
 * basis: tested でも verified が true でなければ「未検証」になります（誤表示の防止）。
 */
function buildTrust(
  data: Frontmatter,
  file: string,
  research: boolean,
  report: ReportMeta | undefined,
): TrustInfo {
  const basis = str(data, 'basis', file, false);
  if (basis && basis !== 'official' && basis !== 'tested') {
    throw new Error(`[content] ${file}: basis は official か tested のどちらかです（"${basis}"）`);
  }
  const verified = bool(data, 'verified');

  let status: VerificationStatus = 'none';
  if (basis === 'tested') status = verified ? 'tested' : 'unverified';
  else if (basis === 'official') status = 'official';
  else if (research) status = verified ? 'tested' : 'unverified';

  return {
    status,
    checkedAt: optionalDate(data, 'checkedAt', file),
    method: str(data, 'method', file, false) || undefined,
    environment: str(data, 'verification_env', file, false) || report?.environment || undefined,
    sources: parseSources(data, file),
    unconfirmed: list(data, 'unconfirmed'),
    cautions: list(data, 'cautions'),
  };
}

function buildReport(data: Frontmatter, file: string): ReportMeta {
  return {
    theme: str(data, 'report_theme', file, false),
    goal: str(data, 'report_goal', file, false),
    tools: list(data, 'report_tools'),
    environment: str(data, 'report_environment', file, false),
    duration: str(data, 'report_duration', file, false),
    problems: list(data, 'report_problems'),
    limits: list(data, 'report_limits'),
    conclusion: str(data, 'report_conclusion', file, false),
    verified: bool(data, 'verified'),
  };
}

function loadArticles(): Article[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'));

  const articles = files.map((file): Article => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8');
    const { data, body } = parseFrontmatter(raw);

    const slug = str(data, 'slug', file, false) || file.replace(/\.md$/, '');
    if (!/^[a-z0-9-]+$/.test(slug)) {
      throw new Error(`[content] ${file}: slug は半角英小文字・数字・ハイフンのみ使えます`);
    }

    const category = str(data, 'category', file);
    if (!isCategorySlug(category)) {
      const valid = categories.map((c) => c.slug).join(', ');
      throw new Error(`[content] ${file}: category "${category}" は不明です（使える値: ${valid}）`);
    }

    const publishedAt = dateField(data, 'publishedAt', file);
    const updatedAt = dateField(data, 'updatedAt', file, publishedAt);

    const plain = toPlainText(body);
    const declared = Number(str(data, 'readingTime', file, false));
    const readingTime =
      Number.isFinite(declared) && declared > 0
        ? Math.round(declared)
        : Math.max(1, Math.ceil(plain.length / CHARS_PER_MINUTE));

    const title = str(data, 'title', file);
    const description = str(data, 'description', file);
    const research = bool(data, 'research');
    const { html, headings } = renderMarkdown(body);
    const report = research ? buildReport(data, file) : undefined;
    const trust = buildTrust(data, file, research, report);

    const tags = Array.from(new Set(list(data, 'tags').map((t) => t.trim()).filter(Boolean))).slice(
      0,
      MAX_TAGS,
    );
    const typeRaw = str(data, 'type', file, false);
    if (typeRaw && !ARTICLE_TYPES.includes(typeRaw as ArticleType)) {
      throw new Error(
        `[content] ${file}: type "${typeRaw}" は不明です（使える値: ${ARTICLE_TYPES.join(', ')}）`,
      );
    }

    return {
      id: str(data, 'id', file, false) || slug,
      title,
      slug,
      category,
      description,
      thumbnail: str(data, 'thumbnail', file, false) || undefined,
      publishedAt,
      updatedAt,
      readingTime,
      featured: bool(data, 'featured'),
      research,
      sample: bool(data, 'sample'),
      tags,
      checkedAt: trust.checkedAt,
      status: trust.status,
      body,
      html,
      headings,
      searchText: normalizeText([title, description, tags.join(' '), plain].join(' ')),
      report,
      trust,
      type: (typeRaw || undefined) as ArticleType | undefined,
      related: list(data, 'related'),
    };
  });

  const seen = new Set<string>();
  for (const a of articles) {
    if (seen.has(a.slug)) throw new Error(`[content] slug "${a.slug}" が重複しています`);
    seen.add(a.slug);
  }

  return articles.sort(
    (a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.slug.localeCompare(b.slug),
  );
}

let cache: Article[] | null = null;

/** 公開日の新しい順。本番ビルドではキャッシュし、開発中は毎回読み直します */
export function getAllArticles(): Article[] {
  if (process.env.NODE_ENV === 'production' && cache) return cache;
  const loaded = loadArticles();
  if (process.env.NODE_ENV === 'production') cache = loaded;
  return loaded;
}

export function getArticleBySlug(slug: string): Article | undefined {
  return getAllArticles().find((a) => a.slug === slug);
}

export function getArticlesByCategory(categorySlug: string): Article[] {
  return getAllArticles().filter((a) => a.category === categorySlug);
}

export function getFeaturedArticles(limit = 2): Article[] {
  return getAllArticles()
    .filter((a) => a.featured)
    .slice(0, limit);
}

export function getReportArticles(): Article[] {
  return getAllArticles().filter((a) => a.research);
}

export function getCategoryCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const c of categories) counts[c.slug] = 0;
  for (const a of getAllArticles()) counts[a.category] = (counts[a.category] ?? 0) + 1;
  return counts;
}

/**
 * 関連記事。単純なランダムや新着順ではなく、次の点数で選びます。
 *   運営者が related に指定した記事 +10 / 相手が自分を related に指定 +4
 *   同じカテゴリー +3 / 共通のタグ 1つにつき +3（最大3つ分） / 同じ記事タイプ +1
 *   サンプル記事は（こちらがサンプルでない場合）-2
 * 合計が MIN_RELATED_SCORE 未満の記事は表示しません（無理に埋めない）。
 */
const MIN_RELATED_SCORE = 3;

export function getRelatedArticles(article: Article, limit = 3): Article[] {
  const explicit = new Set(article.related);
  const myTags = new Set(article.tags);

  return getAllArticles()
    .filter((a) => a.slug !== article.slug)
    .map((a) => {
      let score = 0;
      if (explicit.has(a.slug)) score += 10;
      if (a.related.includes(article.slug)) score += 4;
      if (a.category === article.category) score += 3;
      score += Math.min(a.tags.filter((t) => myTags.has(t)).length, 3) * 3;
      if (article.type && a.type === article.type) score += 1;
      if (a.sample && !article.sample) score -= 2;
      return { a, score };
    })
    .filter((x) => x.score >= MIN_RELATED_SCORE)
    .sort((x, y) => y.score - x.score || y.a.publishedAt.localeCompare(x.a.publishedAt))
    .slice(0, limit)
    .map((x) => x.a);
}

/** newer: より新しい記事 / older: より古い記事 */
export function getAdjacentArticles(slug: string): {
  newer: Article | undefined;
  older: Article | undefined;
} {
  const all = getAllArticles();
  const i = all.findIndex((a) => a.slug === slug);
  if (i === -1) return { newer: undefined, older: undefined };
  return { newer: all[i - 1], older: all[i + 1] };
}

export function toSummary(a: Article): ArticleSummary {
  return {
    id: a.id,
    title: a.title,
    slug: a.slug,
    category: a.category,
    description: a.description,
    thumbnail: a.thumbnail,
    publishedAt: a.publishedAt,
    updatedAt: a.updatedAt,
    readingTime: a.readingTime,
    featured: a.featured,
    research: a.research,
    sample: a.sample,
    tags: a.tags,
    checkedAt: a.checkedAt,
    status: a.status,
  };
}

export function toSearchable(a: Article): SearchableArticle {
  return {
    ...toSummary(a),
    searchText: a.searchText,
    fields: {
      title: normalizeText(a.title),
      tags: normalizeText(a.tags.join(' ')),
      description: normalizeText(a.description),
    },
  };
}
