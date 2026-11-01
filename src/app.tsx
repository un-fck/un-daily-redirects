import { useEffect, useState } from 'react';
import { catalogues, languages, resolveLocale, type Locale, type Copy } from './locale';
import { resolveProduct } from './products';
import { useRedirect } from './use-redirect';
import { Merger } from './merger';
import { ServiceList } from './service-list';
import { Controls } from './controls';
const url = new URL(window.location.href);
const selected = resolveProduct(url);
export function App() {
  const [locale, setLocale] = useState<Locale>(() => resolveLocale(url, navigator.languages));
  const [replay, setReplay] = useState(0);
  const { stopped, seconds, stop: stopRedirect } = useRedirect(selected !== null);
  const [animationPaused, setAnimationPaused] = useState(false);
  const stop = () => { stopRedirect(); setAnimationPaused(true); };
  const restart = () => { stopRedirect(); setAnimationPaused(false); setReplay(replay + 1); };
  const copy = catalogues[locale];
  const headline = selected ? copy.headline.replace('{product}', copy.products[selected]) : copy.genericHeadline;
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.title = `${selected ? copy.products[selected] : 'UN Daily'} · UNFCK`;
  }, [locale, copy]);
  return <Page {...{ copy, locale, setLocale, headline, replay, restart, animationPaused, stopped, seconds, stop }} />;
}
type PageProps = { copy: Copy; locale: Locale; setLocale: (value: Locale) => void;
  headline: string; replay: number; restart: () => void; animationPaused: boolean;
  stopped: boolean; seconds: number; stop: () => void };
function Page(p: PageProps) {
  return <>{!p.stopped && <div className="mobile-stop"><span>{p.copy.countdown.replace('{seconds}', new Intl.NumberFormat(p.locale).format(p.seconds))}</span><button onClick={p.stop}>{p.copy.stay}</button></div>}<aside className="disclaimer"><span className="disclaimer-mark" aria-hidden="true">i</span><p>{p.copy.disclaimer}</p></aside>
    <header className="topbar"><span className="project-wordmark">UNFCK<span className="project-dot" /></span>
      <label className="language-switch"><span className="sr-only">{p.copy.language}</span><select value={p.locale} onFocus={p.stop} onChange={event => p.setLocale(event.target.value as Locale)}>{Object.entries(languages).map(([code, name]) => <option lang={code} key={code} value={code}>{name}</option>)}</select></label></header>
    <main><section className="hero"><div className="hero-copy"><p className="concept-label"><span />{p.copy.concept}</p><p className="eyebrow hero-eyebrow">{p.copy.eyebrow}</p><h1>{p.headline}</h1>{selected && ['digitallibrary', 'ods'].includes(selected) && <p className="planned">{p.copy.planned}</p>}
      <p className="slogan"><span>{p.copy.mandates}</span><span>{p.copy.website}</span></p><p className="intro">{p.copy.intro}</p>
      <Controls copy={p.copy} locale={p.locale} stopped={p.stopped} seconds={p.seconds} stop={p.stop} /></div>
      <div className="visual"><Merger copy={p.copy} selected={selected} paused={p.animationPaused} replay={p.replay} />
        <div className="animation-actions"><button onClick={p.stop}>{p.copy.pauseAnimation}</button><button onClick={p.restart}>{p.copy.replay}<span aria-hidden="true"> ↻</span></button></div></div></section>
      <ServiceList copy={p.copy} selected={selected} /></main>
    <footer><span className="project-wordmark">UNFCK</span><p>{p.copy.footer}</p><span dir="ltr">daily.unfck.org</span></footer></>;
}
