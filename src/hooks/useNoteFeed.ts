import { useEffect, useState } from 'react';
import type { NoteFeedStatus, NoteItem } from '../types/note';

const RSS_URL = 'https://note.com/llgenll8165/rss';
const PROXY_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;
/** 表示する件数 */
const FETCH_NUMBER = 5;

export type NoteFeed = {
  status: NoteFeedStatus;
  items: readonly NoteItem[];
};

/**
 * note.com の RSS を rss2json 経由で取得する。
 * 外部サービスなのでレスポンスは型を信用せず実行時に検証する。
 * 失敗時は status: 'error' を返し、呼び出し側が興味関心セクションごと非表示にする。
 */
export function useNoteFeed(): NoteFeed {
  const [feed, setFeed] = useState<NoteFeed>({ status: 'loading', items: [] });

  useEffect(() => {
    const controller = new AbortController();

    fetch(PROXY_URL, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          // HTTPエラーが発生した場合は例外をスローする
          throw new Error('Network response was not ok');
        }
        return res.json() as Promise<unknown>;
      })
      .then((data) => {
        setFeed({ status: 'success', items: toNoteItems(data).slice(0, FETCH_NUMBER) });
      })
      .catch((error: unknown) => {
        // StrictMode の再マウントによる中断は失敗として扱わない
        if (controller.signal.aborted) return;
        // ネットワーク失敗、JSONパース失敗などのエラーが発生した場合にコンソールにエラーメッセージを表示する
        console.error('Error fetching RSS feed:', error);
        setFeed({ status: 'error', items: [] });
      });

    return () => controller.abort();
  }, []);

  return feed;
}

function toNoteItems(data: unknown): NoteItem[] {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Invalid data format: response is not an object');
  }
  const { items } = data as { items?: unknown };
  if (!Array.isArray(items)) {
    // itemsプロパティが存在しない、または配列でない場合は例外をスローする
    throw new Error('Invalid data format: items array is missing');
  }
  return items.filter(isNoteItem);
}

function isNoteItem(value: unknown): value is NoteItem {
  if (typeof value !== 'object' || value === null) return false;
  const item = value as Record<string, unknown>;
  return typeof item['title'] === 'string' && typeof item['link'] === 'string' && typeof item['pubDate'] === 'string';
}
