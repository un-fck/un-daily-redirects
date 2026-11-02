import type { AnimationEvent, CSSProperties } from 'react';
import { products, productNames, type Product } from './products';
import { animationDurationMs, reducedMotionDurationMs, completionDestination } from './redirect';
function finish(event: AnimationEvent<HTMLDivElement>) {
  const target = completionDestination(event.animationName, event.target === event.currentTarget);
  if (target) window.location.assign(target);
}
export function Merger({ selected }: { selected: Product | null }) {
  const ordered = selected ? [...products.filter(id => id !== selected), selected] : products;
  const timing = { '--duration': `${animationDurationMs}ms`, '--reduced-duration': `${reducedMotionDurationMs}ms` } as CSSProperties;
  return <div className="merger" style={timing} onAnimationEnd={finish} aria-hidden="true">
    <div className="drum">{ordered.map((id, index) =>
      <div key={id} className={`orbit-name ${id === selected ? 'selected' : ''}`} style={{ '--i': index } as CSSProperties}>
        <span>{productNames[id]}</span>
      </div>)}</div>
    <div className="merged-brand"><strong>UN</strong><span>Daily</span></div>
  </div>;
}
