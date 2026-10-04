import { formatDate } from '@/lib/format';
import type { Heading, TrustInfo, VerificationStatus } from '@/lib/types';

type Props = {
  trust: TrustInfo;
  updatedAt: string;
  headings: Heading[];
  /**
   * 研究レポートの概要（ReportSummary）が「確認の種類・確認日・調査方法・検証環境」を
   * 表示している場合は true。同じ内容を二重に表示しません。
   */
  inReport?: boolean;
};

const STATUS_LABEL: Record<Exclude<VerificationStatus, 'none'>, { badge: string; text: string; cls: string }> = {
  tested: {
    badge: '実際に試して確認',
    text: '実際に操作して確認した内容です（検証環境は下記のとおり）。',
    cls: 'bg-emerald-100 text-emerald-800',
  },
  official: {
    badge: '公式情報を調査',
    text: '公式サイトなどの情報を調べてまとめた内容です。実際に操作して試した検証ではありません。',
    cls: 'bg-navy-100 text-navy-800',
  },
  unverified: {
    badge: '未検証',
    text: '検証前の内容です。記載を事実として扱わないでください。',
    cls: 'bg-amber-100 text-amber-900',
  },
};

/** 見出しの中から、公式情報源・未確認事項の節を探して目次リンクにする */
function findHeading(headings: Heading[], pattern: RegExp): Heading | undefined {
  return headings.find((h) => pattern.test(h.text));
}

/**
 * 記事の信頼性パネル。frontmatter に入力された項目だけを表示します。
 * 何も入力されていない記事では何も描画しません。
 */
export function TrustPanel({ trust, updatedAt, headings, inReport = false }: Props) {
  const showStatus = !inReport && trust.status !== 'none';
  const sourcesHeading = trust.sources.length === 0 ? findHeading(headings, /情報源/) : undefined;
  const unconfirmedHeading =
    trust.unconfirmed.length === 0 ? findHeading(headings, /確認できなかった|未確認/) : undefined;

  const rows: { label: string; value: React.ReactNode }[] = [];

  if (showStatus && trust.status !== 'none') {
    const s = STATUS_LABEL[trust.status];
    rows.push({
      label: '確認の種類',
      value: (
        <span>
          <span className={`mr-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.cls}`}>
            {s.badge}
          </span>
          {s.text}
        </span>
      ),
    });
  }
  if (!inReport && trust.checkedAt) {
    rows.push({
      label: '情報確認日',
      value: <time dateTime={trust.checkedAt}>{formatDate(trust.checkedAt)}</time>,
    });
  }
  if (!inReport && trust.method) rows.push({ label: '調査方法', value: trust.method });
  if (!inReport && trust.environment) {
    rows.push({ label: '検証環境', value: trust.environment });
  }
  if (trust.sources.length > 0) {
    rows.push({
      label: '公式情報源',
      value: (
        <ul className="space-y-1">
          {trust.sources.map((src) => (
            <li key={src.url}>
              <a
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-navy-600 underline decoration-navy-300 underline-offset-2 hover:text-navy-800"
              >
                {src.label}
                <span aria-hidden="true"> ↗</span>
                <span className="sr-only">（新しいタブで開きます）</span>
              </a>
            </li>
          ))}
        </ul>
      ),
    });
  } else if (sourcesHeading) {
    rows.push({
      label: '公式情報源',
      value: (
        <a
          href={`#${sourcesHeading.id}`}
          className="text-navy-600 underline decoration-navy-300 underline-offset-2 hover:text-navy-800"
        >
          記事末尾の公式情報源の一覧を見る
        </a>
      ),
    });
  }
  if (trust.unconfirmed.length > 0) {
    rows.push({
      label: '未確認事項',
      value: (
        <ul className="list-disc space-y-1 pl-5 marker:text-slate-400">
          {trust.unconfirmed.map((u) => (
            <li key={u}>{u}</li>
          ))}
        </ul>
      ),
    });
  } else if (unconfirmedHeading) {
    rows.push({
      label: '未確認事項',
      value: (
        <a
          href={`#${unconfirmedHeading.id}`}
          className="text-navy-600 underline decoration-navy-300 underline-offset-2 hover:text-navy-800"
        >
          確認できなかったことの一覧を見る
        </a>
      ),
    });
  }
  if (trust.cautions.length > 0) {
    rows.push({
      label: '注意事項',
      value: (
        <ul className="list-disc space-y-1 pl-5 marker:text-amber-400">
          {trust.cautions.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      ),
    });
  }

  // 表示できる項目がなければ、パネル自体を出さない
  if (rows.length === 0) return null;

  // 最終更新日は、情報確認日の次に入れる
  const updatedRow = {
    label: '最終更新日',
    value: <time dateTime={updatedAt}>{formatDate(updatedAt)}</time>,
  };
  const checkedIndex = rows.findIndex((r) => r.label === '情報確認日');
  rows.splice(checkedIndex >= 0 ? checkedIndex + 1 : 0, 0, updatedRow);

  return (
    <section
      aria-labelledby="trust-heading"
      className="mb-8 rounded-2xl border border-line bg-white"
    >
      <h2
        id="trust-heading"
        className="border-b border-line bg-mist px-5 py-3 text-sm font-bold text-navy-800 sm:px-6"
      >
        この記事の情報の確かさ
      </h2>
      <dl className="divide-y divide-line">
        {rows.map((r) => (
          <div key={r.label} className="grid gap-1 px-5 py-3 sm:grid-cols-[8rem_1fr] sm:gap-4 sm:px-6">
            <dt className="text-sm font-semibold text-navy-900">{r.label}</dt>
            <dd className="text-[15px] leading-relaxed text-slate-700">{r.value}</dd>
          </div>
        ))}
      </dl>
      {trust.checkedAt && (
        <p className="border-t border-line px-5 py-3 text-xs leading-relaxed text-slate-500 sm:px-6">
          無料プランの条件や規約は変わることがあります。利用の前に、必ず公式サイトで最新の情報を確認してください。
        </p>
      )}
    </section>
  );
}
