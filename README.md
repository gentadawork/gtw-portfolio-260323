# gtw-portfolio-260323

自分のポートフォリオサイトを開発するためのリポジトリです。

## 技術構成

Vite + React 19 + TypeScript。スタイルは素のCSS（`@layer` / ネスト / スクロール駆動アニメーション / `prefers-color-scheme` によるダークモード）で、CSS-in-JSやCSSフレームワークは使っていません。設計思想は [spec.md](./spec.md) を参照してください。

Google Tag Manager を導入しています。
開発時に計測しないよう、開発時は初期化しません。GTM IDは本番用環境変数 `VITE_GTM_ID` を記載した `.env.production` に記載します。

## 開発の手順

```sh
npm install     # 初回のみ
npm run dev     # 開発サーバー（http://localhost:5173/）
npm run build   # 型チェック + 本番ビルド（./dist/ に出力）
npm run preview # ビルド結果の確認
npm run format  # Prettier で整形
```

## ディレクトリ構成

```
index.html               トップページのシェル（中身はReactが描画する）
_design_template.html    デザインテンプレート（素のHTML。Viteの2つ目のエントリ）
public/images/           そのまま /images/... で配信される画像
src/
├── main.tsx             エントリポイント。CSSはここで base → top の順に読み込む
├── App.tsx              ページ全体の組み立て
├── styles/              base.css（全体） / top.css（トップページ専用）
├── scripts/tmp001.js    デザインテンプレートページ専用のスクリプト
├── types/               データの型定義
├── data/                サイトのコンテンツ（来歴・自己紹介・ナビ・メタ情報）
├── hooks/               useNoteFeed（note.comのRSS取得）
└── components/          Header / InPageNav / Footer / sections/
```

コンテンツの更新は基本的に `src/data/` 配下のファイルだけで完結します。更新したら [src/data/site.ts](./src/data/site.ts) の `updated` も忘れずに直してください。

## デプロイ

`master` への push で GitHub Actions が走り、`npm run build` の成果物（`./dist/`）を SSH 鍵認証（rsync over SSH）でサーバーに同期します。ビルド前提になっているため、`package-lock.json` は必ずコミットしてください（`npm ci` が失敗します）。

- 必要な Secrets: `SSH_HOST` / `SSH_PORT` / `SSH_USER` / `SSH_PRIVATE_KEY` / `SSH_KNOWN_HOSTS` / `DEPLOY_DIR`（いずれもお名前.com RS コントロールパネルの「サーバー」→「SSH」→ Key の「詳細」で確認）
- 同期は `--delete` 付きのため、サーバー側にしかないファイルは削除されます（`.htaccess` と `.well-known/` は除外）。
- Actions タブから手動実行すると既定で dry-run になり、転送・削除の予定だけをログに出します。
- お名前.com RS の「国外アクセス制限」が ON だと GitHub のランナーから接続できません。
- 初期設定・鍵の入れ替え・ホスト名変更時の手順は [docs/](./docs/README.md) を参照してください。

## 興味関心のコンテンツに関する注意事項

興味関心のコンテンツ表示は外部サービスである「note.com」に依存しており、あわせてRSS取得のためのプロキシとして `api.rss2json.com` にも依存しています。これらのサービスでレート制限/停止/仕様変更/利用条件変更が発生した場合、TOP表示が不安定になる可能性があります。

## Issueの書き方

件名の基本原則

- 一目見て分かる（具体的）: 「エラーが出た」「修正」といった抽象的な言葉は避け、何が、どうなっているか（またはどうしたいか）を明確にします。
- 短くまとめる（簡潔）: 重要なキーワードを前方に配置し、50字〜70字程度（ツール上で全文見える範囲）に収めます。
- カテゴリーをプレフィックス（接頭辞）にする: [Bug], [Feature], [Docs] などを活用して、タスクの性質を明確にします。

件名の書き方テンプレート

以下のテンプレートを活用すると、構造化された分かりやすい件名になります。
- [種別] ＋ 動作・場所 ＋ どのような状態か
- [種別] ＋ 対象機能 ＋ 要望・追加内容

種別

- `[Bug]`: バグ報告
- `[Refactor]`: 修正・改善
- `[Feature]`: 機能追加
- `[Question]`: 調査・相談
