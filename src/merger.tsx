import type { CSSProperties } from 'react';
import type { Copy } from './locale';
import { products, type Product } from './products';
type Props = { copy: Copy; selected: Product | null; paused: boolean; replay: number };
export function Merger({ copy, selected, paused, replay }: Props) {
  const ordered = selected ? [...products.filter(id => id !== selected), selected] : products;
  return <div className={`merger ${paused ? 'is-paused' : ''}`} key={replay} aria-hidden="true" dir="ltr">
    <div className="orbit-guide" />
    <div className="drum">
      {ordered.map((id, index) => <div key={id} className={`orbit-name ${id === selected ? 'selected' : ''}`}
        style={{ '--i': index } as CSSProperties}><span>{copy.products[id]}</span></div>)}
    </div>
    <div className="merged-brand"><span><strong>UN</strong> Daily</span><span className="brand-line" /></div>
    <div className="stage-caption">{copy.concept}</div>
  </div>;
}
