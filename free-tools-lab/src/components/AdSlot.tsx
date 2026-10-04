import { siteConfig } from '@/lib/site';

export type AdPlacement = 'article-top' | 'article-bottom' | 'sidebar';

/**
 * 将来の広告・アフィリエイト用の差し込み位置。
 *
 * - siteConfig.ads.enabled が false の間は何も描画しません（空白も作りません）。
 * - true にすると、広告が読み込まれてもレイアウトがずれないよう最小の高さを確保した枠を描画します。
 * - 枠の中に入れる中身（広告タグ、アフィリエイトバナーなど）は特定のサービスに依存しません。
 *   導入時はこのコンポーネントの中、または data-ad-placement 属性を目印に差し込んでください。
 */
export function AdSlot({ placement, className = '' }: { placement: AdPlacement; className?: string }) {
  if (!siteConfig.ads.enabled) return null;

  const minHeight = placement === 'sidebar' ? 'min-h-[250px]' : 'min-h-[120px]';
  return (
    <aside
      aria-label="広告"
      data-ad-placement={placement}
      className={`${minHeight} rounded-xl border border-dashed border-line bg-white/60 ${className}`}
    />
  );
}
