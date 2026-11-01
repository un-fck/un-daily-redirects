import type { Copy, Locale } from './locale';
import { destination } from './products';
type Props = { copy: Copy; locale: Locale; stopped: boolean; seconds: number; stop: () => void };
export function Controls({ copy, locale, stopped, seconds, stop }: Props) {
  return <div className="controls">
    <div className="action-row"><a className="primary-action" href={destination}>{copy.continue}<span aria-hidden="true">↗</span></a>
      <button className="secondary-action" onClick={stop} disabled={stopped}>{copy.stay}<span aria-hidden="true">Ⅱ</span></button></div>
    <p className="redirect-status" role={stopped ? 'status' : 'timer'} aria-live={stopped ? 'polite' : 'off'}>{stopped ? copy.paused : copy.countdown.replace('{seconds}', new Intl.NumberFormat(locale).format(seconds))}</p>
    <div className="progress-track" aria-hidden="true"><div className={`progress ${stopped ? 'progress-stopped' : ''}`} /></div>
  </div>;
}
