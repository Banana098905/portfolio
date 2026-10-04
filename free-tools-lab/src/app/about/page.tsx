import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell } from '@/components/PageShell';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: 'サイトについて',
  description: `${siteConfig.name}の目的、扱う内容、記事に対する姿勢についてご案内します。`,
  path: '/about',
});

export default function AboutPage() {
  return (
    <PageShell
      title="サイトについて"
      lead={siteConfig.tagline}
      breadcrumbs={[{ label: 'サイトについて' }]}
    >
      <h2>このサイトの目的</h2>
      <p>
        {siteConfig.name}
        は、無料のツールやサービスを使って「こんなこともできる」を増やすための情報メディアです。無料でできることの範囲と、どこから先に制限があるのかを、できるだけ具体的に整理します。
      </p>

      <h2>扱う内容</h2>
      <ul>
        <li>無料ツールの使い方と、初心者がつまずきやすいポイント</li>
        <li>無料サービスの比較と、組み合わせ方の紹介</li>
        <li>
          実際に試した結果をまとめた<Link href="/reports">研究レポート</Link>
        </li>
      </ul>

      <h2>想定している読者</h2>
      <p>
        無料ツールを探している方、パソコン初心者の方、学生の方、なるべくお金をかけずに作業したい方、新しいサービスや便利な方法に興味がある方。
      </p>

      <h2>記事に対する姿勢</h2>
      <ul>
        <li>実際に確認していない内容を「検証済み」とは表示しません。</li>
        <li>
          サービスの仕様や無料プランの条件は変更されることがあります。利用前に公式サイトで最新の情報をご確認ください。
        </li>
        <li>
          「サンプル」と表示されている記事は、サイトの見た目や機能を確認するための例です。未確認の内容を含むため、事実として扱わないでください。
        </li>
      </ul>

      <h2>記事の「情報の確かさ」の見方</h2>
      <p>記事の上部に、その記事の情報の確かさを表示することがあります。</p>
      <ul>
        <li>
          <strong>実際に試して確認</strong>：記事の中で実際に操作して確かめた内容です。検証した環境もあわせて記載します。
        </li>
        <li>
          <strong>公式情報を調査</strong>：公式サイトの案内や規約などを調べてまとめた内容です。実際に操作して試した検証ではありません。
        </li>
        <li>
          <strong>未検証</strong>：検証前の内容です。事実として扱わないでください。
        </li>
        <li>
          <strong>情報確認日</strong>：公式情報を最後に確認した日です。それ以降に条件が変わっている場合があります。
        </li>
        <li>
          <strong>確認できなかったこと</strong>：調べても公式情報に明記が見つからなかった点です。「できる」「できない」のどちらとも断定していません。
        </li>
      </ul>

      <h2>運営者情報</h2>
      <p>運営者に関する情報は現在準備中です。公開できる情報が整い次第、このページに掲載します。</p>

      <h2>関連ページ</h2>
      <ul>
        <li>
          <Link href="/contact">お問い合わせ</Link>
        </li>
        <li>
          <Link href="/privacy">プライバシーポリシー</Link>
        </li>
        <li>
          <Link href="/disclaimer">免責事項</Link>
        </li>
      </ul>
    </PageShell>
  );
}
