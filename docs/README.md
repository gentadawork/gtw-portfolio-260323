# ドキュメント

このサイトの保守・運用に関するドキュメントです。

## デプロイ（お名前.com レンタルサーバー × GitHub Actions）

`master` へのマージをきっかけに、GitHub Actions がビルドしたサイトを SSH 鍵認証（rsync over SSH）でお名前.com RS に反映しています。

| ドキュメント | 使う場面 |
|---|---|
| [deploy-01-ssh-setup.md](./deploy-01-ssh-setup.md) | お名前.com RS と GitHub を SSH で接続する初期設定（鍵の作成・登録、Secrets） |
| [deploy-02-github-actions.md](./deploy-02-github-actions.md) | マージからサーバー反映までの仕組み、dry-run での確認、ワークフローの変更 |
| [deploy-03-ssh-key-rotation.md](./deploy-03-ssh-key-rotation.md) | デプロイ用 SSH 鍵の定期的な入れ替え、漏えい時の対応 |
| [deploy-04-server-hostname-change.md](./deploy-04-server-hostname-change.md) | サーバーのホスト名・ホスト鍵が変わったとき（収容替えメンテナンスなど） |

## Secrets / Variables 一覧

| 種類 | 名前 | 内容 | 変更するとき |
|---|---|---|---|
| Secret | `SSH_HOST` | 接続先ホスト名 | ホスト名の変更 |
| Secret | `SSH_PORT` | SSH のポート番号 | ポートの変更 |
| Secret | `SSH_USER` | SSH のユーザー名 | — |
| Secret | `SSH_PRIVATE_KEY` | デプロイ専用の秘密鍵 | 鍵の入れ替え |
| Secret | `SSH_KNOWN_HOSTS` | サーバーのホスト鍵（`ssh-keyscan` の出力） | ホスト名・ホスト鍵の変更 |
| Secret | `DEPLOY_DIR` | デプロイ先の絶対パス（`/home/<ユーザー名>/public_html/<ドメイン名>`） | 公開ディレクトリの変更 |
| Variable | `VITE_GTM_ID` | Google Tag Manager の ID（公開される値） | GTM コンテナの変更 |
