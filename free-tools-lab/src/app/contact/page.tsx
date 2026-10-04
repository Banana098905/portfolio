import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell } from '@/components/PageShell';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: 'お問い合わせ',
  description: `${siteConfig.name}へのお問い合わせについてのご案内です。`,
  path: '/contact',
});

export default function ContactPage() {
  const email = siteConfig.contactEmail;
  return (
    <PageShell title="お問い合わせ" breadcrumbs={[{ label: 'お問い合わせ' }]}>
      {email ? (
        <>
          <p>ご意見・ご指摘・掲載内容に関するご連絡は、次のメールアドレスまでお願いします。</p>
          <p>
            <a href={`mailto:${email}`}>{email}</a>
          </p>
        </>
      ) : (
        <>
          <p>
            お問い合わせ窓口は現在準備中です。窓口が整い次第、このページでご案内します。
          </p>
          <p>
            記事の内容について確認したいことがある場合は、お手数ですが、各サービスの公式サイトで最新の情報をご確認ください。
          </p>
        </>
      )}
      <p>
        サイトの方針については <Link href="/about">サイトについて</Link> をご覧ください。
      </p>
    </PageShell>
  );
}
