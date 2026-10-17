# Issue #37: 来歴の更新

## 計画
- [x] 既存の来歴データと表記規則を確認する
- [x] 株式会社コネクティの2026年10月入社・フェロー（コーダー）とスキルを追加する
- [x] TypeScript 型チェックと本番ビルドで確認する
- [x] 変更点と検証結果をレビューに記録する

## レビュー
- `src/data/career.ts` の来歴先頭に「株式会社コネクティ」「2026年10月 入社、フェロー（コーダー）」と指定スキルを追加。
- `npm run typecheck` は成功。
- 通常権限では Vite の realpath 解決で `EPERM` となったが、昇格実行では型チェックと Vite 本番ビルドが成功し、3つのHTMLエントリとアセットを生成。実行環境の権限制限によるものと確認。
- `git diff --check` は成功。
# React + TypeScript への移行

素のHTML/CSS/JavaScriptで作られていたポートフォリオサイトを Vite + React + TypeScript に書き換える。
見た目と挙動は現状維持のまま、コンテンツを型付きデータに、DOM構築をコンポーネントに移す。

## チェックリスト

- [x] Step 1: Vite + React + TS のビルド基盤を導入（package.json / vite.config.ts / tsconfig.json / .gitignore）
- [x] Step 2: ファイル移動と index.html のシェル化（`public/resource/` を廃止し `src/` へ）
- [x] Step 3: データ層の抽出（`src/types/` `src/data/`）
- [x] Step 4: コンポーネント化（Header / InPageNav / Footer / 各Section）
- [x] Step 5: RSS取得を `useNoteFeed` フックに移植
- [x] Step 6: GitHub Actions にビルドステップを追加、`local-dir` を `./dist/` に変更
- [x] Step 7: README 更新
- [x] 検証: 型チェック / ビルド / マークアップの機械比較 / dev・preview の目視確認

## レビュー

### やったこと

- **ビルド基盤**: Vite 7 + React 19 + TypeScript 5。`strict` に加えて `noUncheckedIndexedAccess` / `exactOptionalPropertyTypes` / `verbatimModuleSyntax` を有効にした。
- **CSS はそのまま流用**: 858行の `base.css` / `top.css` は中身を1文字も変えずに `src/styles/` へ移動しただけ。`@layer` の宣言順が優先順位を決めるため、`main.tsx` での import 順（base → top）が仕様上重要。
- **デザインテンプレートページ**: React化はせず素のHTMLのまま、Viteの2つ目のHTMLエントリとして登録した（`rollupOptions.input`）。これで CSS の単一ソースを保ちつつ `/_design_template.html` というURLも維持できる。
- **データ抽出**: 来歴・自己紹介・ナビ・サイトメタ情報を `src/data/` の型付きモジュールへ。今後のコンテンツ更新はここだけで済む。
- **RSS取得**: `useNoteFeed` フック化。`AbortController` で cleanup し、外部APIのレスポンスは型を信用せず実行時に検証（`isNoteItem`）している。

### 移行の正しさをどう確認したか

`react-dom/server` の `renderToStaticMarkup` でAppの出力マークアップを文字列として吐き出し、Git履歴から取り出した移行前の `public/index.html` の `<body>` と機械的に diff した。
結果、差分は HTML シリアライズ形式の違い（`<hr/>` vs `<hr>`、`hidden=""` vs `hidden`、`'` の実体参照化、インラインstyleの空白）だけで、**テキスト・クラス名・id・要素の順序はすべて一致**した。

### 意図的に変えた点（3つだけ）

1. `id="nav-interests"` を削除。旧JSが `display:none` を当てるためのフックで、CSSからは未参照。Reactでは条件付きレンダリングに置き換わったため不要。
2. RSS取得失敗時、ナビの「興味関心」は `<li>` ごと出さないようにした。旧実装は `<a>` だけを `display:none` にしていたため、flexの `gap` の分だけ空白が残るバグがあった。
3. React 19 が `<img>` に対して `<link rel="preload" as="image">` を自動挿入する。プロフィール写真の読み込みが早くなるだけで、副作用はない。

### 今回やらなかったこと

- `_design_template.html` のReact化
- `api.rss2json.com` 依存の解消
- OGP / meta description などのSEO対応
- `img_elm_me.jpg`（200KBを約170px幅で表示）のWebP化
- `Cyboze` → `Cybozu`、`tartiary` → `tertiary` の表記修正
- お問い合わせセクション（`#ss-contact`）の実装
# Issue #40: 更新日を最新化

## 計画
- [x] ページ右上の更新日定義を探し、表記規則を確認する
- [x] 更新日を `2026-10-17` に変更する
- [x] 型チェック・本番ビルド・差分を確認する
- [x] レビュー結果を記録する

## レビュー
- `src/data/site.ts`、UI コンポーネントページ、デザインテンプレートの更新日を `2026-10-17` に統一。
- `npm run typecheck` 成功。
- `npm run build` は通常権限では Vite の `realpath` 解決で `EPERM`。昇格実行では成功し、3つの HTML エントリを生成。
- `git diff --check` 成功。旧日付 `2026-08-06` は対象ソースに残っていない。
