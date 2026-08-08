/** note.com の記事1件（rss2json のレスポンスから必要な項目だけを抜き出したもの） */
export type NoteItem = {
  title: string;
  link: string;
  /** rss2json が返す日時文字列。`new Date()` に渡して整形する */
  pubDate: string;
};

/** RSS取得の状態 */
export type NoteFeedStatus = 'loading' | 'success' | 'error';
