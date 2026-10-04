/**
 * 依存ライブラリなしの小さな Markdown レンダラ。
 *
 * 対応記法:
 *   ## / ### 見出し（目次に自動登録）、#### 小見出し
 *   段落、- 箇条書き、1. 番号付きリスト、> 引用、![alt](/path) 画像、
 *   | 表 |、``` コードブロック、---（区切り線）
 *   **太字**、`コード`、[リンク](URL)
 *   コンテナ:
 *     :::note タイトル / :::warning タイトル（注意事項）
 *     :::success タイトル / :::failure タイトル（成功・失敗の検証結果）
 *     :::steps タイトル（番号付きリストを手順表示にする）
 *   各コンテナは単独の `:::` 行で閉じます（入れ子は不可）。
 *
 * 本文は運営者が書くものを想定していますが、HTML は必ずエスケープします。
 */
import type { Heading } from './types';

type State = { headings: Heading[]; counter: number };

const CALLOUT_TITLES: Record<string, string> = {
  note: 'ポイント',
  warning: '注意',
  success: '成功',
  failure: 'うまくいかなかった点',
};

const RE = {
  container: /^:::(note|warning|success|failure|steps)\s*(.*)$/,
  fence: /^```(\w*)\s*$/,
  heading: /^(#{2,4})\s+(.+?)\s*$/,
  ul: /^\s*[-*+]\s+(.*)$/,
  ol: /^\s*\d+[.)]\s+(.*)$/,
  quote: /^>\s?(.*)$/,
  image: /^!\[([^\]]*)\]\(([^)\s]+)\)\s*$/,
  hr: /^\s*([-*_])(\s*\1){2,}\s*$/,
  tableSep: /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/,
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function safeHref(href: string): string | null {
  return /^(https?:\/\/|\/|#|mailto:)/.test(href) ? href : null;
}

function renderInline(text: string): string {
  const stash: string[] = [];
  const keep = (html: string): string => {
    stash.push(html);
    return `\u0000${stash.length - 1}\u0000`;
  };

  let s = text.replace(/\u0000/g, '').replace(/`([^`]+)`/g, (_m, code: string) =>
    keep(`<code>${escapeHtml(code)}</code>`),
  );

  s = escapeHtml(s);
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // [ラベル](URL)。外部リンクは別タブで開き、スクリーンリーダー向けの注記を付ける
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label: string, href: string) => {
    const safe = safeHref(href.replace(/&amp;/g, '&'));
    if (!safe) return label;
    return keep(anchor(escapeHtml(safe), label, /^https?:\/\//.test(safe)));
  });

  // 文中のURL（https://...）も自動でリンクにする（公式情報源の一覧などを押せるようにする）
  s = s.replace(/https?:\/\/[A-Za-z0-9\-._~:/?#[\]@!$&'()*+,;=%]+/g, (url: string) => {
    const trimmed = url.replace(/[.,;:!?)]+$/, '');
    const rest = url.slice(trimmed.length);
    return keep(anchor(trimmed, trimmed, true)) + rest;
  });

  // 入れ子（リンクのラベルの中のコードなど）も戻すため、残りがなくなるまで繰り返す
  for (let guard = 0; guard < 5 && /\u0000\d+\u0000/.test(s); guard++) {
    s = s.replace(/\u0000(\d+)\u0000/g, (_m, i: string) => stash[Number(i)]);
  }
  return s;
}

function anchor(escapedHref: string, labelHtml: string, external: boolean): string {
  if (!external) return `<a href="${escapedHref}">${labelHtml}</a>`;
  return `<a href="${escapedHref}" target="_blank" rel="noopener noreferrer">${labelHtml}<span class="sr-only">（新しいタブで開きます）</span></a>`;
}

function splitRow(line: string): string[] {
  let t = line.trim();
  if (t.startsWith('|')) t = t.slice(1);
  if (t.endsWith('|')) t = t.slice(0, -1);
  return t.split('|').map((c) => c.trim());
}

function isTableStart(line: string, next: string | undefined): boolean {
  return line.includes('|') && !!next && next.includes('|') && RE.tableSep.test(next);
}

function startsBlock(line: string, next: string | undefined): boolean {
  return (
    RE.container.test(line) ||
    RE.fence.test(line) ||
    RE.heading.test(line) ||
    RE.ul.test(line) ||
    RE.ol.test(line) ||
    RE.quote.test(line) ||
    RE.image.test(line) ||
    RE.hr.test(line) ||
    isTableStart(line, next)
  );
}

function parseBlocks(lines: string[], state: State): string {
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }

    let m: RegExpMatchArray | null;

    // コードブロック
    if ((m = line.match(RE.fence))) {
      const lang = m[1];
      const code: string[] = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) {
        code.push(lines[i]);
        i++;
      }
      i++;
      out.push(
        `<pre><code${lang ? ` class="language-${escapeHtml(lang)}"` : ''}>${escapeHtml(code.join('\n'))}</code></pre>`,
      );
      continue;
    }

    // コンテナ（注意・成功/失敗・手順）
    if ((m = line.match(RE.container))) {
      const kind = m[1];
      const title = m[2].trim();
      const inner: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim() !== ':::') {
        inner.push(lines[i]);
        i++;
      }
      i++;
      const innerHtml = parseBlocks(inner, state);
      if (kind === 'steps') {
        const heading = title ? `<p class="steps-title">${renderInline(title)}</p>` : '';
        out.push(`<div class="steps">${heading}${innerHtml}</div>`);
      } else {
        out.push(
          `<aside class="callout callout-${kind}"><p class="callout-title">${renderInline(
            title || CALLOUT_TITLES[kind],
          )}</p><div class="callout-body">${innerHtml}</div></aside>`,
        );
      }
      continue;
    }

    // 見出し
    if ((m = line.match(RE.heading))) {
      const level = m[1].length;
      const raw = m[2];
      if (level <= 3) {
        state.counter += 1;
        const id = `section-${state.counter}`;
        state.headings.push({ id, text: raw.replace(/[`*]/g, ''), level: level as 2 | 3 });
        out.push(`<h${level} id="${id}">${renderInline(raw)}</h${level}>`);
      } else {
        out.push(`<h4>${renderInline(raw)}</h4>`);
      }
      i++;
      continue;
    }

    // 区切り線
    if (RE.hr.test(line)) {
      out.push('<hr />');
      i++;
      continue;
    }

    // 画像
    if ((m = line.match(RE.image))) {
      const alt = m[1];
      const src = safeHref(m[2]);
      if (src && !src.startsWith('#') && !src.startsWith('mailto:')) {
        out.push(
          `<figure><img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async" />${
            alt ? `<figcaption>${escapeHtml(alt)}</figcaption>` : ''
          }</figure>`,
        );
      }
      i++;
      continue;
    }

    // 引用
    if (RE.quote.test(line)) {
      const quoted: string[] = [];
      while (i < lines.length && (m = lines[i].match(RE.quote))) {
        quoted.push(m[1]);
        i++;
      }
      out.push(`<blockquote>${parseBlocks(quoted, state)}</blockquote>`);
      continue;
    }

    // 表（比較表など）
    if (isTableStart(line, lines[i + 1])) {
      const head = splitRow(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim() && lines[i].includes('|')) {
        rows.push(splitRow(lines[i]));
        i++;
      }
      const thead = head.map((c) => `<th scope="col">${renderInline(c)}</th>`).join('');
      const tbody = rows
        .map(
          (r) =>
            `<tr>${r
              .map((c, idx) =>
                idx === 0
                  ? `<th scope="row">${renderInline(c)}</th>`
                  : `<td>${renderInline(c)}</td>`,
              )
              .join('')}</tr>`,
        )
        .join('');
      // 4列以上の表はスマートフォンで横スクロールさせる（列数に応じた最小幅）
      const cols = head.length;
      const minWidth = cols >= 4 ? Math.round(cols * 8.5) : 32;
      const hint =
        cols >= 3
          ? '<p class="table-hint" aria-hidden="true">表は横にスクロールできます →</p>'
          : '';
      out.push(
        `${hint}<div class="table-wrap" tabindex="0" role="region" aria-label="比較表（横にスクロールできます）"><table style="min-width:${minWidth}rem"><thead><tr>${thead}</tr></thead><tbody>${tbody}</tbody></table></div>`,
      );
      continue;
    }

    // リスト
    const listType = RE.ul.test(line) ? 'ul' : RE.ol.test(line) ? 'ol' : null;
    if (listType) {
      const re = listType === 'ul' ? RE.ul : RE.ol;
      const items: string[] = [];
      while (i < lines.length) {
        const cur = lines[i];
        const im = cur.match(re);
        if (im) {
          items.push(im[1]);
          i++;
          continue;
        }
        if (!cur.trim()) {
          let j = i + 1;
          while (j < lines.length && !lines[j].trim()) j++;
          if (j < lines.length && re.test(lines[j])) {
            i = j;
            continue;
          }
          break;
        }
        if (/^\s{2,}\S/.test(cur) && items.length > 0) {
          items[items.length - 1] += ` ${cur.trim()}`;
          i++;
          continue;
        }
        break;
      }
      out.push(
        `<${listType}>${items.map((it) => `<li>${renderInline(it)}</li>`).join('')}</${listType}>`,
      );
      continue;
    }

    // 段落
    const para: string[] = [line.trim()];
    i++;
    while (i < lines.length && lines[i].trim() && !startsBlock(lines[i], lines[i + 1])) {
      para.push(lines[i].trim());
      i++;
    }
    out.push(`<p>${renderInline(para.join(' '))}</p>`);
  }

  return out.join('\n');
}

export function renderMarkdown(src: string): { html: string; headings: Heading[] } {
  const state: State = { headings: [], counter: 0 };
  const html = parseBlocks(src.replace(/\r\n/g, '\n').split('\n'), state);
  return { html, headings: state.headings };
}

/** 検索・読了時間の計算用に、Markdown 記号を除いたプレーンテキストを作る */
export function toPlainText(src: string): string {
  return src
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/^:::.*$/gm, ' ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^[\s|:-]*-{3,}[\s|:-]*$/gm, ' ')
    .replace(/[`*#>|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
