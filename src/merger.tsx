import type { AnimationEvent, CSSProperties } from 'react';
import { products, productNames, type Product } from './products';
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
    <div className="origin-product"><span>{selected ? productNames[selected] : 'UN Daily'}</span></div>
    <svg className="joining-threads" viewBox="-400 -200 800 400" preserveAspectRatio="none">
      {products.map((id, index) => {
        const y = (index - 3) * 50;
        const x = index % 2 ? 300 : -300;
        return <path key={id} pathLength="1" d={`M ${x} ${y} C ${x * .55} ${y}, ${x * .35} 0, 0 0`} />;
      })}
    </svg>
    <div className="product-list">{products.map((id, index) =>
      <div key={id} className={`source-product ${id === selected ? 'selected' : ''}`} style={{
        '--slot': index - 3,
        '--distance': Math.abs(index - selectedIndex),
        '--side': index % 2 ? 1 : -1,
      } as CSSProperties}>
        <span>{productNames[id]}</span>
      </div>)}</div>
    <div className="convergence-halo" />
    <div className="merged-brand"><strong>UN</strong><span>Daily</span></div>
  </div>;
}
