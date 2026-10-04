---
id: a008
title: 無料でWebサイトを公開できるサービス比較｜学生向けに、商用利用・上限・停止条件を公式情報で整理
slug: free-website-hosting-comparison
category: web-services
tags: [ホスティング, Webサイト公開, 商用利用, 学生向け]
type: comparison
description: Netlify、Cloudflare Pages、Firebase、Render、GitHub Pages、Vercelの無料プランを比較。「技術的に公開できる」と「規約上その用途で使ってよい」は別、という点を中心に、上限到達後の挙動まで整理します。
publishedAt: 2026-10-04
updatedAt: 2026-10-04
featured: true
research: true
sample: false
basis: official
checkedAt: 2026-10-04
method: 公式サイト・料金ページ・利用規約・ヘルプなどの公式情報を確認
report_theme: 無料でWebサイトを公開できる6サービスの商用利用・上限・停止条件の比較
report_goal: 技術的に公開できることと、規約上その用途で使ってよいことを分けて判断できるようにする
report_tools: [Netlify, Cloudflare Pages, Firebase, Render, GitHub Pages, Vercel]
report_environment: 公式サイト・料金ページ・規約・ヘルプの確認のみ（実際の操作による検証は行っていません）
report_limits:
  - GitHub PagesとVercel Hobbyは規約上の用途制限があり、商用サイトの公開先には向かない
  - Cloudflare PagesのFreeでの商用利用可否は、確認した範囲では明記が見つからなかった
  - 上限に達したときの挙動はサービスごとに違う
report_conclusion: 将来の商用利用も視野に入れるなら、Freeプランから商用公開できると案内されているNetlify Freeが判断しやすい候補です。
---

作ったサイトを無料で公開したいとき、候補は意外と多くあります。ただ、**無料で公開できること**と、**その用途で使ってよいこと**は同じではありません。この記事では、日本の学生が「支払いや無料トライアルなし」で始められる6つのサービスを、公式情報をもとに比べます。

:::warning この記事の情報について
料金、無料枠、規約、商用利用の条件は変更されることがあります。内容は2026年10月4日時点の公式情報に基づいています。公開や収益化の前に、必ず各サービスの公式ページを確認してください。「未確認」と書いた項目は、確認できた範囲では公式に明記されていなかったもので、可能・不可能のどちらとも断定していません。
:::

## 結論：先に押さえること

- **将来の商用利用も視野に入れるなら**、Netlify Freeが判断しやすい候補です。公式ブログで、Freeプランから商用プロジェクトを公開できること、クレジットカードが不要なことが案内されています。
- **静的サイトが中心なら**、Cloudflare Pagesも有力です。静的ファイルのリクエストと帯域幅が無料・無制限と案内されています。ただし、Freeの商用利用可否は、確認した範囲では明記が見つかりませんでした。
- **GitHub PagesとVercel Hobbyは、商用サイトの公開先には向きません。** 非商用のポートフォリオや学習用なら使えますが、規約上の用途制限があります。

## 比較表：無料枠・商用利用・上限

| サービス | 無料の種類 | 主な上限 | 商用利用 | クレジットカード |
| --- | --- | --- | --- | --- |
| Netlify Free | 継続無料プラン | 月300クレジット、同時ビルド1件 | 公式ブログでFreeから商用プロジェクトの公開が可能と案内 | 公式ブログでは不要と案内（登録画面は要確認） |
| Cloudflare Pages Free | 継続無料プラン | 月500ビルド、1サイト20,000ファイル、1ファイル25MiB | 未確認（利用規約の確認が必要） | 未確認 |
| Firebase Spark | 継続無料プラン＋製品別の無料枠 | 製品ごとに異なる | 利用者の種類は広く案内。広告・決済などは個別に確認 | 開始時は支払い情報不要と案内 |
| Render（静的サイト） | 静的サイトは無料でデプロイ可能 | 帯域・パイプライン時間など | 未確認（利用規約の確認が必要） | 静的サイトについては未確認 |
| GitHub Pages | 継続無料プランの機能 | 公開サイト1GB以下、デプロイ10分でタイムアウトなど | 商取引を主な目的とするサイト（オンライン事業、EC、SaaS）は不可 | 未確認 |
| Vercel Hobby | 継続無料プラン | 機能別の月間上限 | 個人・非商用に限定 | 未確認 |

:::note 「未確認」について
Cloudflare PagesやRenderは、商用利用を禁止していると分かったわけではありません。確認した公式ページに明記がなかった、ということです。広告・販売・決済などを入れる前に、各社の利用規約で確認してください。
:::

## 上限に達したらどうなるか

「無料」を選ぶときに、上限に達したあとの挙動はとても大切です。

| サービス | 上限に達したとき |
| --- | --- |
| Netlify Free | 月のクレジットを使い切ると、プロジェクトは次の暦月まで停止する |
| Cloudflare Pages Free | 上限の種類によって、デプロイできない、またはFunctionsに制限がかかる |
| Firebase Spark | 無料枠を超えると、その月の残りの期間、アプリが停止する場合がある。Blazeに移すと請求アカウントが必要になる |
| Render | 無料のWebサービスは月750インスタンス時間。支払い方法を登録していない場合は月末まで停止、登録している場合は追加請求の可能性がある |
| GitHub Pages | 制限を超えるとデプロイ失敗や公開不可になる可能性がある |
| Vercel Hobby | 上限を超えると、多くの場合30日が経過するまで該当機能を再利用できない |

クレジットカードを登録したくない場合は、**静的サイトだけで使い、上限に近づいたら気づける**サービスを選ぶのが安全です。

## 各サービスの特徴

### Netlify Free

Git連携やファイルのアップロードで公開できます。独自ドメインとSSL、デプロイ前のプレビュー、Functionsなどが使えると案内されています。月300クレジット制のため、重いFunctionsや頻繁な本番デプロイを増やしすぎないことが大切です。管理画面全体の日本語対応は未確認ですが、日本語のサイトは公開できます。

### Cloudflare Pages Free

静的サイトに強く、静的ファイルのリクエストと帯域幅が無料・無制限と案内されています。一方で、動的な処理（Functions）を使うと、Workers Freeのリクエスト上限が関係します。「静的は無制限」と「動的も無制限」を混同しないでください。

### Firebase Hosting（Sparkプラン）

Googleアカウントで始められ、日本語のドキュメントとコンソールがあります。あとから認証やデータベースを足しやすいのが特徴です。ただし、無料枠・請求の条件が製品ごとに分かれています。最初の公開はHostingだけにして、機能を足す前に無料枠と請求の要件を確認しましょう。

### Render（静的サイト）

静的サイトは無料でデプロイでき、独自ドメインとTLSにも対応しています。将来、PythonやNode.jsの動的アプリを試したい人に向きます。動的なWebサービスの無料枠は月750時間などの条件があるため、クレカ不要を優先するなら、静的サイト中心で使うのが安全です。

### GitHub Pages

ポートフォリオ、技術ブログ、ドキュメント、OSSの紹介に向いています。日本語のUIとドキュメントもあります。ただし公式ドキュメントでは、オンライン事業、ECサイト、SaaSなど、主に商取引を促進するサイトの無料ホスティングは意図されておらず、許可されないとされています。

### Vercel Hobby

非商用の学習や個人の実験に向いています。公式規約では、金銭的な利益を目的とする利用にはProまたはEnterpriseが必要とされています。商用利用の例として、決済の処理、商品やサービスの販売広告、サイト制作・更新・ホスティングの対価の受領、アフィリエイトが主目的のサイト、広告を表示するサイトが挙げられています。

## 用途別の選び方

| 目的 | 候補 | 理由 | 先に確認すること |
| --- | --- | --- | --- |
| 非商用のポートフォリオ | GitHub Pages、Vercel Hobby、Netlify Free、Cloudflare Pages | 学習・作品紹介に使える | 商用化・広告・販売を入れる前に別のサービスへ移れるか |
| 商用も視野に入れた紹介サイト | Netlify Free | Freeで商用プロジェクトの公開が可と案内されている | 月300クレジット、利用規約、広告・決済の条件 |
| 静的サイトを長く無料で | Cloudflare Pages、Netlify Free | 静的サイトに強い | ビルド回数、クレジット、動的機能の上限、商用の規約 |
| あとで認証やDBを足したい | Firebase Spark | Firebaseの他機能とつなげやすい | 無料枠、Blazeに移るときの請求条件 |
| 動的アプリも試したい | Render | 静的から動的へ広げやすい | 750時間などの上限、停止条件 |

## 静的サイトと動的アプリは分けて考える

見た目が同じWebサイトでも、アクセスのたびにサーバー側で処理する作りに変えると、無料の条件は大きく変わります。

- **静的サイト**（HTML、CSS、JavaScript、画像）：ポートフォリオ、ブログ、説明ページ向き。無料で始めやすい。
- **フォーム、Functions、ログイン、データベース、API、決済**：無料枠・実行回数・保存領域・セキュリティの確認が別に必要。

最初は静的サイトから始め、必要になったときだけ動的な機能を足しましょう。

## Netlifyで最小のサイトを公開する流れ

:::steps 最短手順
1. パソコンにフォルダを作り、`index.html` を作ります。サイト名、自己紹介、作品へのリンクなどを最低限書きます。
2. `style.css` を追加して、文字サイズ、余白、配色を整えます。
3. ソースコードをGitHubなどにバックアップします。公開リポジトリに、APIキー、住所、電話番号、学校情報などを入れないでください。
4. Netlifyのアカウントを作り、公式の案内に従ってリポジトリを接続します。
5. 発行された公開URLを、パソコンとスマホの両方で開いて確認します。
6. Usage（使用量）の画面で、クレジットの残りとリセット日を確認し、記録します。
:::

:::note 画面は変わることがあります
管理画面の構成や名称は変更されることがあります。開始するときは、公式の最新の案内を見ながら進めてください。
:::

## 無料枠を使いすぎないための工夫

- 最初はHTML、CSS、JavaScriptだけの静的構成で作る。
- 重い動画を、ホスティングに直接置かない。
- 大きな画像は圧縮し、表示サイズに合ったものを使う。
- 本番に公開する前に、パソコン上で確認する。
- Functionsやデータベースは、必要になるまで入れない。
- 公開後も、使用量の画面を月に1回確認する。

## 学生が安全に公開するためのチェックリスト

- [ ] ソースコードにAPIキー、トークン、パスワード、住所、電話番号、学校情報が入っていない
- [ ] 公開リポジトリは「誰でも見られる」前提で中身を確認した
- [ ] 画像、ロゴ、フォント、音楽、文章、コードのライセンスを確認した
- [ ] アカウントに強いパスワードと二段階認証を設定した（提供状況は各サービスの公式ヘルプで確認）
- [ ] ソースをGitとパソコンの両方に保存した
- [ ] アカウント作成の最低年齢、18歳未満の保護者同意の有無を確認した
- [ ] 収益を受け取る可能性がある場合は、保護者に相談した

:::warning 有料になりやすい場面
独自ドメインの取得費用は、ホスティングが独自ドメインの接続を無料で提供していても、別にかかるのが通常です。そのほかにも、無料枠を超えるアクセスやビルド、ログイン・決済・予約などの動的機能、広告・アフィリエイト・販売で商用非対応のプランになる場合は、有料プランや別のサービスが必要になることがあります。
:::

## 確認できなかったこと

この記事を書くにあたり、次の点は公式情報で確認できていません。実際に始めるときに確かめてください。

- Cloudflare PagesとRenderの無料プランの、商用利用の可否
- Cloudflare Pages、Render、GitHub Pages、Vercel Hobbyで、無料の開始時にクレジットカード入力を求められるか
- Netlify、Cloudflare Pages、Render、Vercelの、管理画面全体の日本語対応
- 各サービスのアカウント作成の年齢条件と、保護者の同意
- 広告や透かしが実際の公開画面に出るか（公式ページでは強制表示は確認できませんでした）

関連：[無料で作れるポートフォリオサイト](/articles/free-portfolio-site-for-students)、[無料クラウドストレージの選び方](/articles/free-cloud-storage-types)

## 確認に使った公式情報源

確認日：2026年10月4日

- [Netlify Pricing](https://www.netlify.com/pricing/)
- [Introducing Netlify's Free plan（Netlify）](https://www.netlify.com/blog/introducing-netlify-free-plan/)
- [Netlify Pro vs Free](https://www.netlify.com/pricing/pro-vs-free/)
- [Cloudflare Pages](https://pages.cloudflare.com/)
- [Cloudflare Pages Limits](https://developers.cloudflare.com/pages/platform/limits/)
- [Cloudflare Pages Functions Pricing](https://developers.cloudflare.com/pages/functions/pricing/)
- [Firebase Pricing](https://firebase.google.com/pricing)
- [Firebase Pricing Plans](https://firebase.google.com/docs/projects/billing/firebase-pricing-plans)
- [Firebase FAQ](https://firebase.google.com/support/faq)
- [Render Pricing](https://render.com/pricing)
- [Render Free Deploy](https://render.com/docs/free)
- [Render Static Sites](https://render.com/docs/static-sites)
- [What is GitHub Pages?（GitHub）](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [GitHub Pages Limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
- [About GitHub Pages（GitHub）](https://docs.github.com/en/enterprise-cloud@latest/pages/getting-started-with-github-pages/about-github-pages)
- [Vercel Pricing](https://vercel.com/pricing)
- [Vercel Hobby Plan](https://vercel.com/docs/plans/hobby)
- [Vercel Fair Use Guidelines](https://vercel.com/docs/limits/fair-use-guidelines)
- [Vercel Terms of Service](https://vercel.com/legal/terms)
