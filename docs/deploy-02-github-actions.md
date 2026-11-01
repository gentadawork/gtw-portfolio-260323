# master へのマージとサーバー反映の連携（GitHub Actions）

`master` にマージ（push）すると、GitHub Actions がサイトをビルドし、成果物（`./dist/`）を rsync over SSH でお名前.com RS に同期します。
ワークフローの定義は [.github/workflows/main.yml](../.github/workflows/main.yml) です。SSH 接続の初期設定は [deploy-01-ssh-setup.md](./deploy-01-ssh-setup.md) を参照してください。

## いつ動くか

| きっかけ | 動き |
|---|---|
| `master` への push（PR のマージを含む） | **本番反映**（実際に転送・削除する） |
| Actions タブからの手動実行（`workflow_dispatch`） | 既定で **dry-run**（転送・削除の予定をログに出すだけ）。チェックを外すと本番反映 |

- 同時に複数のデプロイが走らないよう `concurrency` で直列化しています（後から来た実行は、先の実行が終わるまで待つ。待っている間にさらに実行が来た場合は、最新の1件だけが残る）。
- 作業ブランチへの push や PR の作成だけではデプロイは動きません。

## 処理の流れ

```
checkout → Node.js 22 セットアップ → npm ci → npm run build（./dist/ を生成）
  → Setup SSH（秘密鍵と known_hosts を配置）
  → Sync files（rsync で ./dist/ をサーバーと同期）
  → Cleanup SSH key（成否に関わらず秘密鍵を削除）
```

| ステップ | 内容 |
|---|---|
| Build | `VITE_GTM_ID`（Variables）が未設定なら失敗させる。型チェックと Vite のビルドを行う |
| Setup SSH | `SSH_PRIVATE_KEY` を `~/.ssh/deploy_key`（権限 600）に、`SSH_KNOWN_HOSTS` を `~/.ssh/known_hosts` に書き出す |
| Sync files | `DEPLOY_DIR` が未設定なら失敗させる（誤った場所への同期を防ぐ）。続けて rsync を実行する |
| Cleanup SSH key | `if: always()` で、途中で失敗してもランナー上の秘密鍵を削除する |

外部の Deploy 用 Action は使わず、ランナー（`ubuntu-latest`）に標準で入っている `ssh` / `rsync` だけで構成しています。依存を減らし、サプライチェーン上のリスクを抑えるためです。

## rsync の設定

```bash
rsync -rlptvz --delete --chmod=D755,F644 \
  --exclude='.htaccess' --exclude='.well-known/' \
  ${DRY_RUN} \
  -e "ssh -i ${HOME}/.ssh/deploy_key -p ${SSH_PORT} -o BatchMode=yes -o StrictHostKeyChecking=yes" \
  ./dist/ "${SSH_USER}@${SSH_HOST}:${DEPLOY_DIR}/"
```

| オプション | 意味 |
|---|---|
| `-r -l -p -t` | ディレクトリを再帰的に・シンボリックリンクを保持・パーミッションと更新日時を反映 |
| `-v -z` | 転送したファイルをログに出す・通信を圧縮する |
| `--delete` | `dist/` にないファイルはサーバーから **削除** する（古いビルドのハッシュ付きファイルが溜まらない） |
| `--chmod=D755,F644` | サーバー上の権限をディレクトリ 755 / ファイル 644 に揃える |
| `--exclude` | `.htaccess` と `.well-known/`（SSL 証明書の検証などで使われる）は同期・削除の対象外 |
| `-o BatchMode=yes` | パスワード入力などの対話を求めず、認証できなければすぐ失敗する |
| `-o StrictHostKeyChecking=yes` | `known_hosts` に登録したホスト鍵と一致しない接続先には接続しない |

### 注意: `--delete` について

- `DEPLOY_DIR` を誤って `public_html` の直下などにすると、他のドメインのファイルまで削除されます。`DEPLOY_DIR` を変更したときは必ず dry-run で確認してください。
- 将来 `.htaccess` をリポジトリ（`public/`）で管理する場合は、`--exclude='.htaccess'` を外さないとサーバーに反映されません。
- サーバーにだけ置きたいファイルが増えた場合は、`--exclude` を追加します。

## dry-run で確認する

ワークフローを変更したとき、Secrets を変更したとき（鍵の入れ替え・ホスト名の変更など）は、本番反映の前に dry-run で確認します。

1. Actions タブの左の一覧からこのワークフローを選ぶ。
2. 右上の「Run workflow」をクリックし、「Use workflow from」でブランチを選ぶ。
   - ワークフローを変更した作業ブランチで試す場合は、そのブランチを選ぶ。
3. 「rsync を --dry-run で実行する」が **ON** になっていることを確認して実行する。
4. ログの「Sync files」で以下を確認する。
   - 最後の行が `(DRY RUN)` で終わっている（実際には転送していない）
   - 転送対象が `dist/` の内容と合っている
   - `deleting ...` に、消えては困るファイルが含まれていない

### ワークフローを変更するときの注意

- Actions タブの一覧に表示されるワークフロー名は、**`master` にあるファイルの `name:`** です。作業ブランチで `name:` を変えても、マージするまで一覧の表示は変わりません。
- 「Run workflow」で作業ブランチを選ぶと、**そのブランチのファイルの内容** で実行されます。ブランチを選んだ後に入力欄（dry-run のチェックボックスなど）が変更後の内容になっていることを確認してから実行してください。
- `workflow_dispatch` 自体を新しく追加する場合は、一度 `master` に入るまで「Run workflow」ボタンが表示されません。

## ログの読み方

- **初回や鍵・ホスト変更直後に全ファイルが転送対象になる**: rsync は「サイズ + 更新日時」で差分を判断します。前回と異なる方法でアップロードされたファイルは更新日時が異なるため、すべてが対象になります。2回目以降は変更があったファイルだけになります。
- **`perl: warning: Setting locale failed.`**: ランナーが送る `LANG=C.UTF-8` がサーバー側に入っていないために出る警告です。同期には影響しません。
- **`sent ... received ...` / `total size is ...`**: 転送量と、サーバー上の対象ファイルの合計サイズです。

## 失敗したとき

接続まわりのエラーは [deploy-01-ssh-setup.md の「うまく接続できないとき」](./deploy-01-ssh-setup.md#うまく接続できないとき) を参照してください。

| 症状 | 確認すること |
|---|---|
| Build で `VITE_GTM_ID is not set.` | Settings → Secrets and variables → Actions → **Variables** に `VITE_GTM_ID` があるか |
| `npm ci` が失敗する | `package-lock.json` がコミットされているか、`package.json` と食い違っていないか |
| Sync files で `DEPLOY_DIR is not set.` | Secrets に `DEPLOY_DIR` があるか |
| お名前.com のメンテナンス中 | メンテナンス告知の時間帯は FTP / SSH が使えない。終了後に手動実行し直す |
