import { navItems } from '../data/nav';

type Props = {
  /** 実行時の都合で表示できない項目のセクションid（例: RSS取得に失敗した 'ss-interests'） */
  hiddenIds?: readonly string[];
};

// クラス名の "in-pgage" は base.css 側の綴りに合わせている（既存の誤記）
export function InPageNav({ hiddenIds = [] }: Props) {
  return (
    <nav className="in-pgage">
      <div className="inner">
        <ul>
          {navItems
            .filter((item) => !hiddenIds.includes(item.id))
            .map((item) => (
              <li key={item.id} hidden={item.hidden}>
                <a href={`#${item.id}`}>{item.label}</a>
              </li>
            ))}
        </ul>
      </div>
    </nav>
  );
}
