import type { AnimationEvent, CSSProperties } from 'react';
import { animationHosts, productHosts, type Product } from './products';
import { animationDurationMs, reducedMotionDurationMs, completionDestination } from './redirect';
function finish(event: AnimationEvent<HTMLDivElement>) {
  const target = completionDestination(event.animationName, event.target === event.currentTarget);
  if (target) window.location.assign(target);
}
export function Merger({ selected }: { selected: Product | null }) {
  const centre = (animationHosts.length - 1) / 2;
  const selectedHost = selected ? productHosts[selected] : null;
  const selectedIndex = selectedHost ? animationHosts.indexOf(selectedHost) : centre;
  const timing = {
    '--duration': `${animationDurationMs}ms`,
    '--reduced-duration': `${reducedMotionDurationMs}ms`,
    '--origin-slot': selectedIndex - centre,
    '--source-count': animationHosts.length,
  } as CSSProperties;
  return <div className="merger" style={timing} onAnimationEnd={finish} aria-hidden="true">
    <div className="origin-product"><span>{selected ? productHosts[selected] : 'UN Daily'}</span></div>
    <div className="product-list">{animationHosts.map((host, index) =>
      <div key={host} className={`source-product ${host === selectedHost ? 'selected' : ''}`} style={{
        '--slot': index - centre,
        '--distance': Math.abs(index - selectedIndex),
        '--side': index % 2 ? 1 : -1,
      } as CSSProperties}>
        <span>{host}</span>
      </div>)}</div>
    <div className="convergence-halo" />
    <div className="merged-brand">
      <div className="brand-name"><strong>UN</strong><span>Daily</span></div>
      <p className="slogan"><span>{animationHosts.length} mandates.</span><span>1 integrated website.</span></p>
    </div>
  </div>;
}
