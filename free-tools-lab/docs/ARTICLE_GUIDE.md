# 記事の追加・更新ガイド

「無料でできること研究所」の記事は、`content/articles/` に Markdown ファイルを置くだけで追加できます。データベースや管理画面は使いません。

## 1. 記事を追加する手順

1. `content/articles/_template.md`（研究レポートなら `_template-report.md`）をコピーして、同じフォルダに新しいファイルを作る。
   ファイル名は「半角英小文字・数字・ハイフン」＋ `.md`（例：`free-pdf-tools.md`）。
2. 先頭の `---` で囲まれた部分（frontmatter）を書き換える。
3. 本文を書く。
4. ローカルで確認する（下の「確認コマンド」）。
5. 公開前チェックリストを確認し、Git に commit して push する（Vercel が自動でデプロイ）。

`_` で始まるファイルは読み込まれないので、下書きやメモは `_draft-xxx.md` の名前で置けます。

## 2. frontmatter の項目

### 必須

| 項目 | 説明 |
| --- | --- |
| `title` | 記事のタイトル |
| `description` | 概要。一覧・検索結果・SNS共有に表示される |
| `category` | `ai` / `design` / `media` / `productivity` / `software` / `web-services` / `learning` / `experiments` |
| `publishedAt` | 公開日 `YYYY-MM-DD` |

### よく使う任意項目

| 項目 | 説明 |
| --- | --- |
| `slug` | URL。省略するとファイル名。**公開後は変えない**（URLが変わるため） |
| `id` | 管理用の番号。省略すると slug |
| `updatedAt` | 最終更新日。省略すると公開日 |
| `tags` | `[PDF, 商用利用]` 形式、最大8個。検索と関連記事に使われる。表記ゆれを避けるため、既存記事のタグを再利用する |
| `type` | `comparison` / `guide` / `howto` / `experiment`。関連記事の精度向上に使う |
| `related` | `[slug1, slug2]`。関連記事として優先したい記事 |
| `featured` | `true` でトップの「注目の記事」に出る（新しい順に最大2件） |
| `thumbnail` | `/images/xxx.jpg`。省略すると自動生成のアートワーク。SNS共有（OGP）にも使われる |
| `sample` | `true` で「サンプル」表示。本番記事では外す |

### 情報の確かさ（信頼性）— 入力した項目だけ表示される

| 項目 | 説明 |
| --- | --- |
| `basis` | `official`＝公式情報を調べてまとめた / `tested`＝実際に試した |
| `verified` | `true` / `false`。**`basis: tested` かつ `verified: true` のときだけ「実際に試して確認」と表示される** |
| `checkedAt` | 情報確認日。**公式情報を実際に見直した日**を入れる（記事を直した日ではない） |
| `method` | 調査方法を1行で |
| `verification_env` | 実際に試した場合の環境（OS・ブラウザ・バージョンなど） |
| `sources` | `- ラベル | https://...`（インデント付き）。公式情報へのリンク |
| `unconfirmed` | 確認できなかったこと |
| `cautions` | 利用前の注意事項 |

#### 守ること

- 実際に操作していないことを `basis: tested` / `verified: true` にしない。公式情報を読んだだけなら `basis: official`。
- 公式情報で確認できなかった点は、「できる」「できない」のどちらとも書かず、「確認できなかったこと」に書く。
- 料金・無料枠の数字は、公式ページで確認した値だけを書く。第三者のブログだけを根拠にしない。

### 研究レポート（`research: true`）

`report_theme` / `report_goal` / `report_tools` / `report_environment` / `report_duration` / `report_problems` / `report_limits` / `report_conclusion` を使う。`/reports` に掲載され、記事の先頭に概要が出る。
`basis: official` なら「公式情報の調査」、`basis: tested` で `verified: false` なら「未検証」、`verified: true` なら「検証済み」と表示される。

### 書き方の注意

- `[A, B]` 形式の配列では、半角カンマ `,` を項目の中に使えない（全角「、」を使う）。
- 値の先頭を `[` や `"` にしない。
- 日付は必ず `YYYY-MM-DD`。形式が違うと、ビルドがエラーで止まる（ファイル名とどの項目か表示される）。

## 3. 画像の置き方

1. 画像を `public/images/` に置く（例：`public/images/pdf-tools.jpg`）。
   推奨：横長 16:9、幅 1200px 以上、JPEG または WebP、1枚 300KB 以下。
2. サムネイルにするなら frontmatter に `thumbnail: /images/pdf-tools.jpg`。OGP画像にも使われる。
3. 本文中の画像は `![画像の説明](/images/pdf-tools-step1.png)`。**説明文（alt）は必ず書く**（読み上げと、画像が表示されないときのため）。
4. 画面のスクリーンショットを載せる前に、個人情報（氏名・メール・アカウントID・APIキー・通知）が映っていないか確認する。

## 4. 本文の書き方（よく使うもの）

- 見出しは `##`（大）と `###`（小）。目次に自動で入る。
- 表は Markdown の表。列が4つ以上でもスマートフォンで横スクロールできる。**1列目は行の見出し**になるので、サービス名などを入れる。
- 注意は `:::warning 見出し` … `:::`、補足は `:::note`、手順は `:::steps`（番号付きリストを囲む）。
- 公式サイトのURLは、そのまま書いてもリンクになる。`[公式ページ](https://...)` の形でもよい。外部リンクは別タブで開く。
- 記事の最後に「確認できなかったこと」と「確認に使った公式情報源（確認日つき）」の見出しを置くと、記事上部のパネルからその節へジャンプできる。

## 5. 公開前チェックリスト

- [ ] `title` と `description` が、記事の内容を正しく表している
- [ ] `slug` が英小文字・数字・ハイフンのみで、他の記事と重複していない
- [ ] `category` と `tags` を設定した（既存のタグを再利用した）
- [ ] `sample: true` を外した（サンプルのまま公開しない）
- [ ] 料金・無料枠・上限・商用利用の記述を、**公式ページで確認した**（確認日を `checkedAt` に入れた）
- [ ] 確認できなかった点を「できる」「できない」と断定していない
- [ ] 実際に試していないのに「検証済み」と書いていない（`basis` / `verified` が事実と合っている）
- [ ] 公式情報源のURLを記事に載せ、リンクが開く
- [ ] 画像に alt を付け、個人情報が映っていない
- [ ] 他人の著作物（画像・文章・ロゴ）を無断で使っていない
- [ ] スマートフォン幅で、表・目次が読めることを確認した
- [ ] 他の記事へのリンク（`/articles/slug`）が正しい

## 6. 更新時のルール

| 場面 | すること |
| --- | --- |
| 誤字・表現の修正 | `updatedAt` は変えなくてよい |
| 内容を加筆・修正した | `updatedAt` を更新 |
| 公式情報を見直した | `checkedAt` を更新（内容が変わらなくても、見直した日を入れる）。変更があれば `updatedAt` も更新 |
| 無料プランの条件が変わっていた | 本文を直し、`checkedAt` と `updatedAt` を更新。古い数字を残さない |
| サービスが終了・有料化した | 記事の冒頭に `:::warning` で明記するか、記事を整理する。URLは変えない |
| 実際に試せた | `basis: tested`、`verification_env`、`verified: true` を設定し、結果を本文に書く |
| 記事を非公開にしたい | ファイル名の先頭に `_` を付ける（URLは404になる） |

目安：**3か月に1回**、料金・商用利用に関わる記事の `checkedAt` を見直す。

## 7. 確認コマンド（ローカル）

```bash
npm install          # 初回のみ
npm run typecheck    # 型チェック
npm run build        # 本番ビルド（frontmatter の書き間違いはここでエラーになる）
npm run dev          # http://localhost:3000 で確認
```

`npm run build` が `[content] ファイル名: ...` というエラーで止まったら、そのファイルの frontmatter を直してください。
