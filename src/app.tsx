import { disclaimer, headline } from './copy';
import type { Product } from './products';
import { Merger } from './merger';
export function App({ product }: { product: Product | null }) {
  return <main className="showcase" lang="en">
    <aside className="disclaimer">{disclaimer}</aside>
    <h1>{headline(product)}</h1>
    <Merger selected={product} />
    <p className="slogan"><span>7 mandates.</span><span>1 integrated website.</span></p>
  </main>;
}
