import { Fragment } from 'react';
import { site } from '../data/site';

export function Footer() {
  return (
    <footer>
      <div className="inner">
        <span className="font-size--small">
          {site.disclaimer.map((line, index) => (
            <Fragment key={line}>
              {index > 0 && <br />}
              {line}
            </Fragment>
          ))}
        </span>
        <br />
        <span className="font-size--small">{site.copyright}</span>
        <a title="デザインテンプレート" href={site.designTemplatePath}>
          .
        </a>
      </div>
    </footer>
  );
}
