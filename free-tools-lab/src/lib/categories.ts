export type Category = {
  slug: string;
  name: string;
  description: string;
};

export const categories: Category[] = [
  { slug: 'ai', name: 'AI・人工知能', description: '無料で使えるAIツールの活用法と、無料枠との付き合い方。' },
  { slug: 'design', name: '画像・デザイン', description: '画像編集やデザイン制作を無料ツールで行う方法。' },
  { slug: 'media', name: '動画・音声', description: '動画編集・音声編集・録画などを無料で進めるコツ。' },
  { slug: 'productivity', name: '仕事・作業効率化', description: '標準機能や無料ツールで作業時間を減らす工夫。' },
  { slug: 'software', name: 'パソコン・ソフト', description: 'PDFやファイル操作など、パソコン作業の定番を無料で。' },
  { slug: 'web-services', name: 'Webサービス', description: 'ブラウザだけで使える無料サービスの紹介と比較。' },
  { slug: 'learning', name: '学習・勉強', description: '学びを支える無料の教材・ツール・使い方。' },
  { slug: 'experiments', name: '実験・検証', description: '実際に試した結果をまとめる検証記事。' },
];

export function isCategorySlug(slug: string): boolean {
  return categories.some((c) => c.slug === slug);
}

export function findCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

/** 記事読み込み時にカテゴリーの存在を検証しているため、通常は必ず見つかります */
export function getCategory(slug: string): Category {
  const found = findCategory(slug);
  if (!found) throw new Error(`Unknown category slug: ${slug}`);
  return found;
}
