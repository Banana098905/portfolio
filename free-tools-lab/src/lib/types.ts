export type Heading = {
  id: string;
  text: string;
  level: 2 | 3;
};

/** 研究レポート専用の追加情報（frontmatter の report_* から作られる） */
export type ReportMeta = {
  theme: string;
  goal: string;
  tools: string[];
  environment: string;
  duration: string;
  problems: string[];
  limits: string[];
  conclusion: string;
  /** 実際に検証済みかどうか。false の間は「未検証」と表示される */
  verified: boolean;
};

/**
 * 情報の確かさの区分。
 * - tested: 実際に試して確認した（frontmatter で basis: tested かつ verified: true のときだけ）
 * - official: 公式情報を調べてまとめた（実際に操作して試した検証ではない）
 * - unverified: 検証前・未検証
 * - none: 区分の記載なし（何も表示しない）
 */
export type VerificationStatus = 'tested' | 'official' | 'unverified' | 'none';

export type SourceLink = { label: string; url: string };

/** 記事の信頼性に関する情報。記事ごとに入力された項目だけが表示されます */
export type TrustInfo = {
  status: VerificationStatus;
  /** 情報確認日（YYYY-MM-DD）。公式情報を最後に確認した日 */
  checkedAt?: string;
  /** 調査方法 */
  method?: string;
  /** 検証時の環境（実際に試した場合） */
  environment?: string;
  /** 公式情報へのリンク（frontmatter の sources） */
  sources: SourceLink[];
  /** 確認できなかったこと */
  unconfirmed: string[];
  /** 利用前の注意事項 */
  cautions: string[];
};

export type ArticleType = 'comparison' | 'guide' | 'howto' | 'experiment';

/** 一覧表示に必要な軽量データ（クライアントにも渡せる） */
export type ArticleSummary = {
  id: string;
  title: string;
  slug: string;
  /** カテゴリーの slug */
  category: string;
  description: string;
  thumbnail?: string;
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
  featured: boolean;
  research: boolean;
  sample: boolean;
  tags: string[];
  /** 情報確認日（未設定なら undefined） */
  checkedAt?: string;
  status: VerificationStatus;
};

/** 検索用テキストを含む一覧データ（すべて normalizeText 済み） */
export type SearchableArticle = ArticleSummary & {
  /** タイトル・概要・タグ・本文をまとめた検索対象 */
  searchText: string;
  /** 関連度の重み付け用 */
  fields: { title: string; tags: string; description: string };
};

export type Article = ArticleSummary & {
  body: string;
  html: string;
  headings: Heading[];
  searchText: string;
  report?: ReportMeta;
  trust: TrustInfo;
  type?: ArticleType;
  /** 関連記事として優先したい記事の slug（任意） */
  related: string[];
};
