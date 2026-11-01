import { useEffect, useRef, useState } from 'react';
import { destination } from './products';
import { redirectDelay, secondsRemaining } from './redirect';
export function useRedirect(enabled: boolean) {
  const deadline = useRef(Date.now() + redirectDelay);
  const [stopped, setStopped] = useState(!enabled || document.hidden);
  const [seconds, setSeconds] = useState(8);
  const stop = () => setStopped(true);
  useEffect(() => {
    if (stopped) return;
    const interval = window.setInterval(() => {
      const left = secondsRemaining(deadline.current, Date.now());
      setSeconds(left);
      if (left === 0) { window.clearInterval(interval); window.location.assign(destination); }
    }, 100);
    const onHidden = () => { if (document.hidden) stop(); };
    document.addEventListener('visibilitychange', onHidden);
    return () => { window.clearInterval(interval); document.removeEventListener('visibilitychange', onHidden); };
  }, [stopped]);
  return { stopped, seconds, stop };
}
