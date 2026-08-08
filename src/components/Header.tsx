import { site } from '../data/site';

export function Header() {
  return (
    <header>
      <div className="inner">
        <div className="big-logo">
          <h1 className="big-logo__text">{site.title}</h1>
        </div>
      </div>
      <div className="updated">updated: {site.updated}</div>
    </header>
  );
}
