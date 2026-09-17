import { Footer } from '../Footer';

function UiPageHeader() {
  return (
    <header className="ui-page-header">
      <div className="inner">
        <div className="logo">
          <a href="/" className="logo__text">
            llgenll's
          </a>
        </div>
      </div>
      <div className="updated">updated: 2026-08-06</div>
    </header>
  );
}

type ShowCaseSectionProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

function ShowcaseSection({ title, description, children }: ShowCaseSectionProps) {
  return (
    <section className="ui-showcase-section">
      <div className="ui-showcase-header">
        <p className="ui-eyebrow">Component</p>
        <h2 className="font-size--xxlarge">{title}</h2>
      </div>
      <p className="ui-showcase-description">{description}</p>
      <div className="ui-showcase-grid">{children}</div>
    </section>
  );
}

function ButtonSample({ label, variant = 'primary' }: { label: string; variant?: 'primary' | 'secondary' | 'ghost' }) {
  return <button className={`ui-button ui-button--${variant}`}>{label}</button>;
}

function RippleButtonSample({ label, variant = 'primary' }: { label: string; variant?: 'primary' | 'secondary' | 'ghost' }) {
  return <button className={`ui-button ui-button--ripple ui-button--${variant}`}>{label}</button>;
}

function BadgeSample({ label, tone = 'info' }: { label: string; tone?: 'info' | 'ok' | 'warning' }) {
  return <span className={`ui-badge ui-badge--${tone}`}>{label}</span>;
}

function CardSample({ title, body, accent }: { title: string; body: string; accent?: string }) {
  return (
    <article className="ui-card">
      {accent && <span className="ui-card__accent">{accent}</span>}
      <h3>{title}</h3>
      <p>{body}</p>
    </article>
  );
}

function TypographySample() {
  return (
    <div className="ui-typography-sample">
      <h1 className="font-size--xxxlarge">ページ見出し</h1>
      <h2 className="font-size--xxlarge">セクション見出し</h2>
      <h3 className="font-size--xlarge">小見出し</h3>
      <p>
        これは本文テキストのサンプルです。<a href="/">リンクの見え方</a>と、<strong>強調</strong>、<em>イタリック</em>、
        <mark>ハイライト</mark>のバランスも確認できます。
      </p>
    </div>
  );
}

function ListSample() {
  return (
    <div className="ui-list-sample">
      <ul>
        <li>項目1: コンテンツを整理して見せる</li>
        <li>項目2: 余白と行間を揃える</li>
        <li>項目3: 色と強調を適度に使う</li>
      </ul>
      <ol>
        <li>良い見せ方を考える</li>
        <li>構成を簡潔にする</li>
        <li>必要な情報だけ残す</li>
      </ol>
    </div>
  );
}

function FormSample() {
  return (
    <form className="ui-form-sample" onSubmit={(event) => event.preventDefault()}>
      <label>
        名前
        <input type="text" defaultValue="llgenll" />
      </label>
      <label>
        専門分野
        <select defaultValue="front-end">
          <option value="front-end">フロントエンド</option>
          <option value="design">デザイン</option>
        </select>
      </label>
      <label className="ui-checkbox-row">
        <input type="checkbox" defaultChecked />
        <span>学習アウトプットとして公開する</span>
      </label>
      <div className="ui-form-actions">
        <button type="submit" className="ui-button ui-button--primary">保存</button>
        <button type="button" className="ui-button ui-button--secondary">キャンセル</button>
      </div>
    </form>
  );
}

export function UiComponentsPage() {
  return (
    <div className="ui-components-page">
      <UiPageHeader />
      <main className="ui-components-main">
        <div className="ui-components-intro">
          <p className="ui-eyebrow">Portfolio</p>
          <h1 className="font-size--xxxlarge">UI Components</h1>
          <p>
            自分が学んだUIの部品を、見本としてまとめたページです。見た目の統一感、余白、強調、フォームの使いやすさを意識して作成しています。
          </p>
        </div>

        <ShowcaseSection
          title="Typography"
          description="文章の階層と読みやすさを保つために、見出しと本文は一貫したサイズと行間で表現します。"
        >
          <TypographySample />
        </ShowcaseSection>

        <ShowcaseSection
          title="Buttons"
          description="主要なアクションは目立たせ、補助操作は控えめにまとめます。"
        >
          <div className="ui-button-list">
            <ButtonSample label="Primary (Opacity)" variant="primary" />
            <ButtonSample label="Secondary" variant="secondary" />
            <ButtonSample label="Ghost" variant="ghost" />
          </div>
          <div className="ui-button-list">
            <RippleButtonSample label="Primary (Ripple)" variant="primary" />
            <RippleButtonSample label="Secondary" variant="secondary" />
            <RippleButtonSample label="Ghost" variant="ghost" />
          </div>
        </ShowcaseSection>

        <ShowcaseSection
          title="Cards"
          description="短い説明をまとめて、記事やプロジェクトの要点が伝わるように構成します。"
        >
          <CardSample title="Design System" body="色、余白、タイポグラフィを揃えて、視認性の高い情報設計を目指します。" accent="System" />
          <CardSample title="Frontend Practice" body="UIの繰り返しを減らし、再利用しやすい部品に整理していきます。" accent="Practice" />
          <CardSample title="Learning Log" body="実装と手順を残して、あとから見返しやすい記録を作ります。" accent="Log" />
        </ShowcaseSection>

        <ShowcaseSection
          title="Badges"
          description="状態やカテゴリを簡潔に伝えるために、色と短いラベルで表現します。"
        >
          <div className="ui-badge-list">
            <BadgeSample label="Info" tone="info" />
            <BadgeSample label="OK" tone="ok" />
            <BadgeSample label="Warning" tone="warning" />
          </div>
        </ShowcaseSection>

        <ShowcaseSection
          title="Lists & highlights"
          description="箇条書きは情報量を抑えつつ、重要ポイントを視覚的に追いやすくします。"
        >
          <ListSample />
        </ShowcaseSection>

        <ShowcaseSection
          title="Forms"
          description="フォームは入力をしやすくしつつ、伝える情報量を最小限にして誤操作を抑えます。"
        >
          <FormSample />
        </ShowcaseSection>
      </main>
      <Footer />
    </div>
  );
}
