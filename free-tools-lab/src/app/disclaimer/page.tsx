import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell } from '@/components/PageShell';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: '免責事項',
  description: `${siteConfig.name}に掲載する情報の利用にあたっての注意事項。`,
  path: '/disclaimer',
});

export default function DisclaimerPage() {
  return (
    <PageShell
      title="免責事項"
      lead="掲載情報をご利用いただく前にお読みください。"
      breadcrumbs={[{ label: '免責事項' }]}
    >
      <h2>掲載情報について</h2>
      <p>
        掲載内容には正確性を心がけていますが、情報の完全性・最新性・特定の目的への適合性を保証するものではありません。
      </p>

      <h2>サービスの仕様・料金の変更</h2>
      <p>
        無料ツールやサービスの機能、無料プランの条件、利用規約、料金は、提供元によって予告なく変更されることがあります。ご利用の前に、必ず提供元の公式サイトで最新の情報をご確認ください。
      </p>

      <h2>サンプル記事・検証前のレポート</h2>
      <p>
        「サンプル」と表示された記事、「未検証」と表示された研究レポートは、実際の検証結果ではなく、未確認の内容を含みます。事実として扱わないでください。
      </p>

      <h2>ご利用は自己責任でお願いします</h2>
      <p>
        掲載内容を参考にした作業や、紹介したツール・サービスの利用によって生じた損害（データの消失、機密情報の漏えい、機器の不具合などを含む）について、当サイトは責任を負いかねます。大切なファイルは、作業の前にコピーを取っておくことをおすすめします。
      </p>

      <h2>外部サイトについて</h2>
      <p>外部サイトの内容や、そのサイトで提供されるサービスについて、当サイトは責任を負いません。</p>

      <p>
        関連：<Link href="/privacy">プライバシーポリシー</Link>　最終更新日：2026年10月3日
      </p>
    </PageShell>
  );
}
