import { Fragment } from 'react';
import { careerEntries } from '../../data/career';

export function JobsSection() {
  return (
    <section id="ss-jobs">
      <h2 className="font-size--xxlarge">来歴と主な利用技術</h2>
      <ul>
        {careerEntries.map((entry) => (
          <li key={entry.org}>
            {entry.org}
            <ul>
              {entry.events.map((event) => (
                <li key={event.date}>
                  {event.roles ? `${event.date} ${event.roles}` : event.date}
                  {event.skills && (
                    <>
                      <br />
                      {event.skills.map((skill, index) => (
                        <Fragment key={skill}>
                          {index > 0 && ' '}
                          <code>{skill}</code>
                        </Fragment>
                      ))}
                    </>
                  )}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
