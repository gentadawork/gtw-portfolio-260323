/** ページ内ナビゲーションの1項目 */
export type NavItem = {
  /** リンク先のセクションid（`#` は含めない） */
  id: string;
  label: string;
  /** trueの間は非表示。実装が終わったら削除する */
  hidden?: boolean;
};

export const navItems: readonly NavItem[] = [
  { id: 'ss-aboutme', label: '自己紹介' },
  { id: 'ss-jobs', label: '来歴' },
  { id: 'ss-interests', label: '興味関心' },
  // TODO: お問い合わせセクションを実装したら hidden を外す
  { id: 'ss-contact', label: 'お問い合わせ', hidden: true }
];
