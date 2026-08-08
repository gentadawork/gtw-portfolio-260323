import type { CSSProperties } from 'react';
import { profile } from '../../data/profile';

// clip-path の中心座標はCSS変数でCSS側（.clip--circle）に渡す。
// React の型定義はカスタムプロパティを知らないためキャストが必要。
const photoStyle = {
  '--clip-x': profile.photo.clipX,
  '--clip-y': profile.photo.clipY
} as CSSProperties;

export function AboutMeSection() {
  return (
    <section id="ss-aboutme">
      <h2 className="font-size--xxlarge">自己紹介</h2>
      <img
        src={profile.photo.src}
        alt={profile.photo.alt}
        className="float--i-end elm-width--xlarge clip--circle"
        style={photoStyle}
      />
      {profile.intro.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      <h3 className="font-size--xlarge">{profile.origin.heading}</h3>
      {profile.origin.paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </section>
  );
}
