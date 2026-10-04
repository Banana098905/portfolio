import { formatDate } from '@/lib/format';
import type { ReportMeta, TrustInfo } from '@/lib/types';

type SummaryProps = { report: ReportMeta; trust: TrustInfo };

/**
 * 研究レポート冒頭の概要。
 * 実際に試した検証（tested / unverified）と、公式情報を調べただけの調査（official）で
 * 見出しの言葉と表示バッジを変え、両者を区別します。
 */
export function ReportSummary({ report, trust }: SummaryProps) {
  const official = trust.status === 'official';
  const rows: { label: string; value: React.ReactNode }[] = [];
  if (report.theme) rows.push({ label: official ? '調査テーマ' : '実験テーマ', value: report.theme });
  if (report.goal) rows.push({ label: official ? '調べたいこと' : '検証したいこと', value: report.goal });
  if (trust.checkedAt) {
    rows.push({
      label: official ? '調査日' : '確認日',
      value: <time dateTime={trust.checkedAt}>{formatDate(trust.checkedAt)}</time>,
    });
  }
  if (trust.method) rows.push({ label: '調査方法', value: trust.method });
  if (report.tools.length > 0) {
    rows.push({
      label: official ? '比較対象' : '使用した無料ツール',
      value: (
        <ul className="flex flex-wrap gap-2">
          {report.tools.map((t) => (
            <li key={t} className="rounded-full bg-mist px-3 py-1 text-sm text-navy-800">
              {t}
            </li>
          ))}
        </ul>
      ),
    });
  }
  if (report.environment) {
    rows.push({ label: official ? '確認した範囲' : '検証環境', value: report.environment });
  }
  if (report.duration) rows.push({ label: '所要時間', value: report.duration });

  return (
    <section aria-labelledby="report-summary" className="rounded-2xl border border-iris-line bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-iris-line bg-iris-soft px-5 py-3 sm:px-6">
        <h2 id="report-summary" className="text-sm font-bold tracking-wide text-iris">
          研究レポート概要
        </h2>
        {trust.status === 'tested' ? (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
            検証済み
          </span>
        ) : official ? (
          <span className="rounded-full bg-navy-100 px-3 py-1 text-xs font-semibold text-navy-800">
            公式情報の調査（実際に試した検証ではありません）
          </span>
        ) : (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
            未検証
          </span>
        )}
      </div>
      {trust.status === 'unverified' && (
        <p className="border-b border-line bg-amber-50 px-5 py-3 text-sm leading-relaxed text-amber-950 sm:px-6">
          このレポートは検証前の計画・記入枠です。実際に試した結果ではないため、記載されている結果や数値を事実として扱わないでください。
        </p>
      )}
      <dl className="divide-y divide-line">
        {rows.map((r) => (
          <div key={r.label} className="grid gap-1 px-5 py-4 sm:grid-cols-[9rem_1fr] sm:gap-4 sm:px-6">
            <dt className="text-sm font-semibold text-navy-900">{r.label}</dt>
            <dd className="text-[15px] leading-relaxed text-slate-700">{r.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** 研究レポート末尾の「問題点・無料プランの制限・結論」 */
export function ReportOutcome({ report }: { report: ReportMeta }) {
  const hasAny = report.problems.length > 0 || report.limits.length > 0 || report.conclusion;
  if (!hasAny) return null;

  return (
    <section aria-label="問題点・制限・結論" className="mt-12 space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {report.problems.length > 0 && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
            <h2 className="text-base font-bold text-rose-950">問題点</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-rose-950 marker:text-rose-400">
              {report.problems.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        )}
        {report.limits.length > 0 && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <h2 className="text-base font-bold text-amber-950">無料プランの制限</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-amber-950 marker:text-amber-400">
              {report.limits.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {report.conclusion && (
        <div className="rounded-2xl border border-navy-200 bg-mist p-5 sm:p-6">
          <h2 className="text-base font-bold text-navy-900">結論</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-navy-900">{report.conclusion}</p>
        </div>
      )}
    </section>
  );
}
