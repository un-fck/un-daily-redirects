import type { Copy } from './locale';
import { officialSites, products, type Product } from './products';
export function ServiceList({ copy, selected }: { copy: Copy; selected: Product | null }) {
  return <section className="services" aria-labelledby="services-title">
    <div className="section-heading"><p className="eyebrow">{copy.contribution}</p><h2 id="services-title">{copy.sources}</h2></div>
    <div className="service-grid">{products.map((id, index) => <article className={`service ${id === selected ? 'current-service' : ''}`} key={id}>
      <span className="service-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
      <div><h3>{copy.products[id]}</h3><p>{copy.descriptions[id]}</p>
        {['digitallibrary', 'ods'].includes(id) && <span className="planned">{copy.planned}</span>}
        <a href={officialSites[id]} className="original-link">{copy.official}<span aria-hidden="true"> ↗</span><span className="sr-only">: {copy.products[id]}</span></a>
      </div></article>)}</div>
  </section>;
}
