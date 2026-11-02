import type { AnimationEvent, CSSProperties } from 'react';
import { products, productHosts, type Product } from './products';
import { animationDurationMs, reducedMotionDurationMs, completionDestination } from './redirect';
function finish(event: AnimationEvent<HTMLDivElement>) {
  const target = completionDestination(event.animationName, event.target === event.currentTarget);
  if (target) window.location.assign(target);
}
export function Merger({ selected }: { selected: Product | null }) {
  const selectedIndex = selected ? products.indexOf(selected) : 3;
  const timing = {
    '--duration': `${animationDurationMs}ms`,
    '--reduced-duration': `${reducedMotionDurationMs}ms`,
    '--origin-slot': selectedIndex - 3,
  } as CSSProperties;
  return <div className="merger" style={timing} onAnimationEnd={finish} aria-hidden="true">
    <div className="origin-product"><span>{selected ? productHosts[selected] : 'UN Daily'}</span></div>
    <div className="product-list">{products.map((id, index) =>
      <div key={id} className={`source-product ${id === selected ? 'selected' : ''}`} style={{
        '--slot': index - 3,
        '--distance': Math.abs(index - selectedIndex),
        '--side': index % 2 ? 1 : -1,
      } as CSSProperties}>
        <span>{productHosts[id]}</span>
      </div>)}</div>
    <div className="convergence-halo" />
    <div className="merged-brand">
      <div className="brand-name"><strong>UN</strong><span>Daily</span></div>
      <p className="slogan"><span>7 mandates.</span><span>1 integrated website.</span></p>
    </div>
  </div>;
}
