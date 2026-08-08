/** 来歴セクションの1イベント（入社・異動・卒業など） */
export type CareerEvent = {
  /** 和暦風の表示用文字列。例: "2024年4月"（ソート用途がないためISO化しない） */
  date: string;
  /** その時点での役割。例: "部署マネージャー、プロジェクトリーダー" */
  roles?: string;
  /** 主な利用技術。`<code>` として1つずつ表示される */
  skills?: readonly string[];
};

/** 来歴セクションの1組織（会社・学校） */
export type CareerEntry = {
  /** 組織名。例: "株式会社ダンクソフト" */
  org: string;
  /** 新しい順に並べる */
  events: readonly CareerEvent[];
};
