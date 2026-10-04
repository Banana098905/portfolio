/**
 * 検索用の正規化。サーバー（記事の読み込み）とブラウザ（検索ボックス）の両方で同じ処理を使います。
 * 全角英数字を半角に、大文字を小文字にそろえます（例：「ＡＩ」「Ai」→「ai」）。
 */
export function normalizeText(s: string): string {
  return s.normalize('NFKC').toLowerCase();
}
