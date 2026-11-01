# お名前.com レンタルサーバー（RS）と GitHub を SSH で接続する

GitHub Actions からお名前.com RS へ SSH 鍵認証で接続できるようにするための初期設定手順です。
Actions 側の動きは [deploy-02-github-actions.md](./deploy-02-github-actions.md) を参照してください。

## 前提として知っておくこと

- お名前.com RS の SSH は **鍵認証のみ**（パスワードでのログイン不可）。
- **ポート番号は 22 ではない**（2026年時点では `8022`）。ホスト名・ポート・ユーザー名は必ずコントロールパネルで確認する。
- 「**国外アクセス制限**」が ON だと、海外から接続する GitHub のランナーは接続できない。
- 鍵ペアは GitHub ではなく **手元の PC で作成** し、公開鍵だけをサーバーに登録する（秘密鍵がネットワークを通らない）。

## 全体の流れ

| # | どこで | 作業 |
|---|---|---|
| 1 | 手元の PC | デプロイ専用の鍵ペアを作る |
| 2 | お名前.com コントロールパネル | 公開鍵をインポートし、接続情報を確認する |
| 3 | 手元の PC | 接続テスト・公開ディレクトリの確認・サーバー公開鍵の取得 |
| 4 | GitHub | Secrets に秘密鍵と接続情報を登録する |

## 1. 鍵ペアを作る（手元の PC）

Windows 11 は OpenSSH クライアントが標準で入っているので、PowerShell で実行できます。

```powershell
ssh-keygen -t ed25519 -C "github-actions-deploy" -f $HOME\.ssh\onamae_deploy
```

- パスフレーズは **空のまま Enter を2回**。Actions は無人実行でパスフレーズを入力できないため。代わりに「デプロイ専用の鍵」「秘密鍵は GitHub Secrets にだけ置く」で守る。
- `onamae_deploy`（秘密鍵）と `onamae_deploy.pub`（公開鍵）が作られる。
- インポート時に ed25519 が受け付けられない場合は `-t rsa -b 4096` で作り直す。

## 2. お名前.com RS に公開鍵を登録する

1. コントロールパネルにログインし、左メニュー「サーバー」→ 上部メニュー「SSH」を開く。
2. 「+SSH Key を追加」をクリック（Key が1つもない場合は「新規作成する」）。
3. 作成方法で「**インポート**」を選び、「情報入力する」をクリック。
4. 「Key名」（一覧で区別するためのラベル。例: `github-actions-2026`）と、`onamae_deploy.pub` の中身を貼り付けて「確認する」→「完了する」。
5. SSH Key 一覧で以下を確認する。
   - 登録した Key の「**利用設定**」が ON
   - 「**国外アクセス制限**」が OFF
6. Key の「**詳細**」を開き、**ホスト名 / ポート番号 / ユーザー名** を控える。

> 「自動生成」を選ぶとサーバー側で鍵ペアが作られ、秘密鍵は作成時に1回だけダウンロードできます。秘密鍵の扱いを手元で完結させるため、このプロジェクトでは「インポート」を使います。

## 3. 手元で接続を確認する

```powershell
ssh -i $HOME\.ssh\onamae_deploy -p <ポート番号> <ユーザー名>@<ホスト名>
```

初回は接続先の指紋を確認するメッセージが出るので `yes` で進めます。ログインできたら、次の3点を確認します。

```bash
which rsync                         # /usr/bin/rsync が表示されれば rsync が使える
pwd                                 # ホームディレクトリ（/home/<ユーザー名>）
ls ~/public_html                    # ドメインごとのフォルダが並ぶ
ls -la ~/public_html/<ドメイン名>   # index.html や assets/ があればここが公開ディレクトリ
```

- デプロイ先は `/home/<ユーザー名>/public_html/<ドメイン名>` の **絶対パス**。
- `public_html` には契約時に自動で作られる初期ドメイン（`xxxx.onamaeweb.jp`）のフォルダもあるので、取り違えないこと。

続けて、サーバーの公開鍵（ホスト鍵）を取得します。Actions でこれを固定しておくことで、接続先のなりすまし（中間者攻撃）を検知できます。

```powershell
ssh-keyscan -p <ポート番号> <ホスト名>
```

出力された行（`[<ホスト名>]:<ポート番号> ssh-ed25519 AAAA...` のような行）を **すべて** 控えます。

## 4. GitHub Secrets に登録する

リポジトリの Settings → Secrets and variables → Actions → 「New repository secret」で、以下の6つを登録します。

| 名前 | 内容 |
|---|---|
| `SSH_HOST` | コントロールパネルの Key 詳細に表示されるホスト名 |
| `SSH_PORT` | 同じくポート番号（例: `8022`） |
| `SSH_USER` | 同じくユーザー名 |
| `SSH_PRIVATE_KEY` | `onamae_deploy`（秘密鍵）の中身すべて。`-----BEGIN ...-----` と `-----END ...-----` の行も含める |
| `SSH_KNOWN_HOSTS` | 手順3の `ssh-keyscan` の出力すべて |
| `DEPLOY_DIR` | `/home/<ユーザー名>/public_html/<ドメイン名>`（末尾の `/` は不要） |

ビルド用の `VITE_GTM_ID` は Secret ではなく **Variables** に登録します（公開される値のため）。

登録が終わったら、[deploy-02-github-actions.md](./deploy-02-github-actions.md) の「dry-run で確認する」で動作を確認します。

## 秘密鍵の保管について

- 秘密鍵は Secrets に登録した後、GitHub 上で中身を見ることはできません。
- 手元から手動で SSH 接続する予定がなければ、手元の秘密鍵は削除してかまいません。必要になったら [deploy-03-ssh-key-rotation.md](./deploy-03-ssh-key-rotation.md) の手順で新しい鍵を作ればよいので、バックアップは不要です。
- 手元に残す場合は `~/.ssh` 以外（クラウドストレージやリポジトリ内など）に置かないこと。

## うまく接続できないとき

| エラー | 主な原因 |
|---|---|
| `Permission denied (publickey)` | 秘密鍵の貼り付け漏れ（BEGIN/END 行など）、`SSH_USER` の誤り、Key の「利用設定」が OFF |
| `Host key verification failed` | `SSH_KNOWN_HOSTS` の中身、または `SSH_HOST` / `SSH_PORT` が実際の接続先と合っていない |
| `Connection timed out` / `Connection refused` | 「国外アクセス制限」が ON、ポート番号の誤り、メンテナンス中 |
| `Could not resolve hostname` | `SSH_HOST` の誤り、またはホスト名が変更された（[deploy-04-server-hostname-change.md](./deploy-04-server-hostname-change.md)） |
| `unknown KEX algorithm` など | 手元の SSH クライアントが古い。RS は2024年3月に古い鍵交換方式を無効化している |

## 参考

- [あらかじめ作成した公開鍵をサーバーに登録する（お名前.com RS ご利用ガイド）](https://www.onamae-server.com/guide/rs/p/67)
- [SSH接続情報の確認と利用設定の変更について（お名前.com RS ご利用ガイド）](https://www.onamae-server.com/guide/rs/p/69)
- [RSプラン SSH セキュリティ強化メンテナンス（2024/3/25）](https://www.onamae.com/news/article/11041)
