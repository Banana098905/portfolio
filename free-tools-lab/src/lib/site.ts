/**
 * サイト全体の設定。
 * 運営者情報・連絡先は実在するものだけを設定してください（未設定なら画面にも出ません）。
 */

/**
 * 公開URL。次の順で決まります。
 *   1. NEXT_PUBLIC_SITE_URL（独自ドメインにしたときはここを設定）
 *   2. Vercel が自動で渡す本番URL（VERCEL_PROJECT_PRODUCTION_URL）
 *   3. ローカル開発用の http://localhost:3000
 * canonical・OGP・sitemap・構造化データのURLにこの値が使われます。
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, '');
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, '').replace(/\/$/, '')}`;
  return 'http://localhost:3000';
}

export const siteConfig = {
  name: '無料でできること研究所',
  tagline: 'お金をかけずに、できることを増やそう。',
  description:
    '無料ツールやサービスを実際に試して、便利な使い方や新しい可能性を発見する研究メディア。',
  url: resolveSiteUrl(),
  locale: 'ja_JP',
  /** お問い合わせ用メールアドレス。未設定(null)のときは「準備中」案内を表示します */
  contactEmail: null as string | null,
  /**
   * SNS共有（OGP）で使う共通画像。public/og-default.png（1200×630）。
   * 記事に thumbnail（"/images/..."）があれば、その記事ではそちらを使います。
   */
  ogImage: {
    path: '/og-default.png',
    width: 1200,
    height: 630,
    alt: '無料でできること研究所｜お金をかけずに、できることを増やそう。',
  },
  /**
   * true のとき、sample: true の記事（公開前の確認が必要な内容）を
   * noindex にし、sitemap にも載せません。公開前の確認が済んだら sample を外してください。
   */
  noindexSampleArticles: true,
  /**
   * 将来の収益化用スイッチ。
   * 広告枠(AdSlot)は enabled が false の間は何も描画しません。
   * 特定の広告サービスには依存していません。
   */
  ads: { enabled: false },
};
