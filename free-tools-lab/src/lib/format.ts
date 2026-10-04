/** "2026-09-20" → "2026年9月20日"（タイムゾーンの影響を受けない単純変換） */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${y}年${m}月${d}日`;
}
