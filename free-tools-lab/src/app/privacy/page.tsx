import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell } from '@/components/PageShell';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: 'プライバシーポリシー',
  description: `${siteConfig.name}における個人情報・アクセス情報の取り扱いについて。`,
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <PageShell
      title="プライバシーポリシー"
      lead="このサイトが読者の情報をどのように扱うかをご案内します。"
      breadcrumbs={[{ label: 'プライバシーポリシー' }]}
    >
      <h2>取得する情報</h2>
      <p>
        現在、このサイトには会員登録・ログイン・コメント・お問い合わせフォームはなく、読者から氏名やメールアドレスなどの個人情報を取得する機能はありません。
      </p>

      <h2>アクセス解析・広告</h2>
      <p>
        現在、アクセス解析ツールおよび広告配信サービスは導入していません。将来導入する場合は、利用するサービスの名称、取得する情報、利用目的、オプトアウトの方法をこのページに追記します。
      </p>

      <h2>Cookie</h2>
      <p>このサイト自体は、現在Cookieを設定していません。</p>

      <h2>検索機能について</h2>
      <p>
        記事の検索は、入力されたキーワードをURL（例：<code>/articles?q=キーワード</code>
        ）に含めて動作します。このため、サイトを配信している事業者のアクセスログに、検索キーワードが記録される場合があります。
      </p>

      <h2>外部サイトへのリンク</h2>
      <p>
        記事内から外部サイトへリンクする場合があります。リンク先での情報の取り扱いは、各サイトのポリシーに従います。
      </p>

      <h2>改定</h2>
      <p>
        内容は必要に応じて見直し、変更する場合はこのページで告知します。最終更新日：2026年10月3日
      </p>
      <p>
        関連：<Link href="/disclaimer">免責事項</Link>
      </p>
    </PageShell>
  );
}
