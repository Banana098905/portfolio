/**
 * 依存を増やさないための最小限の frontmatter パーサ。
 * 対応: `key: 値` / `key: true|false` / `key: [a, b]` / 次行以降の `  - 項目`
 * 注意: インライン配列の項目に半角カンマは使えません（全角「、」を使ってください）。
 */
export type FrontmatterValue = string | boolean | string[];
export type Frontmatter = Record<string, FrontmatterValue>;

function unquote(value: string): string {
  const v = value.trim();
  if (
    v.length >= 2 &&
    ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))
  ) {
    return v.slice(1, -1);
  }
  return v;
}

function parseScalar(value: string): FrontmatterValue {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value.startsWith('[') && value.endsWith(']')) {
    return value
      .slice(1, -1)
      .split(',')
      .map((item) => unquote(item))
      .filter(Boolean);
  }
  return unquote(value);
}

export function parseFrontmatter(raw: string): { data: Frontmatter; body: string } {
  const text = raw.replace(/^﻿/, '').replace(/\r\n/g, '\n');
  const match = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: text };

  const data: Frontmatter = {};
  let currentKey: string | null = null;

  for (const line of match[1].split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue;

    const listItem = line.match(/^\s+-\s+(.*)$/);
    if (listItem && currentKey) {
      const existing = data[currentKey];
      const next = Array.isArray(existing) ? existing : [];
      next.push(unquote(listItem[1]));
      data[currentKey] = next;
      continue;
    }

    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!kv) continue;

    const [, key, rawValue] = kv;
    currentKey = key;
    const value = rawValue.trim();
    data[key] = value === '' ? [] : parseScalar(value);
  }

  return { data, body: match[2] };
}
