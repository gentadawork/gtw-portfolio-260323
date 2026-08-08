import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { InPageNav } from './components/InPageNav';
import { AboutMeSection } from './components/sections/AboutMeSection';
import { InterestsSection } from './components/sections/InterestsSection';
import { JobsSection } from './components/sections/JobsSection';
import { WelcomeSection } from './components/sections/WelcomeSection';
import { useNoteFeed } from './hooks/useNoteFeed';

export function App() {
  const { status, items } = useNoteFeed();
  // RSS取得に失敗したときだけ、興味関心のセクション・区切り線・ナビ項目をまとめて出さない
  const showInterests = status !== 'error';

  return (
    <>
      <Header />
      <InPageNav hiddenIds={showInterests ? [] : ['ss-interests']} />
      <main>
        <WelcomeSection />
        <hr className="xxlarge" />
        <AboutMeSection />
        <hr className="xxlarge" />
        <JobsSection />
        {showInterests && (
          <>
            <hr id="hr-interests" className="xxlarge" />
            <InterestsSection items={items} />
          </>
        )}
        {/* TODO:追加実装、実装するまで非表示 */}
        <hr className="xxlarge" hidden />
        <section id="ss-contact" hidden>
          <h2 className="font-size--xxlarge">お問い合わせ</h2>
        </section>
        <hr className="xxxlarge" />
      </main>
      <Footer />
    </>
  );
}
