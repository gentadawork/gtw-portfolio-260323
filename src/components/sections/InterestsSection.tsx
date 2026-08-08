import type { NoteItem } from '../../types/note';

type Props = {
  /** 取得済みのnote.com記事。読み込み中は空配列（見出しだけ先に表示される） */
  items: readonly NoteItem[];
};

export function InterestsSection({ items }: Props) {
  return (
    <section id="ss-interests">
      <h2 className="font-size--xxlarge">興味関心</h2>
      <ul className="note-list">
        {items.map((item) => (
          <li key={item.link}>
            <a href={item.link} target="_blank" rel="noopener noreferrer">
              {item.title}
            </a>
            {` - ${new Date(item.pubDate).toLocaleDateString()}`}
          </li>
        ))}
      </ul>
    </section>
  );
}
