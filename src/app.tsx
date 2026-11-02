import { headline } from './copy';
import { animationHosts, type Product } from './products';
import { Merger } from './merger';
export function App({ product }: { product: Product | null }) {
  return <main className="showcase" lang="en">
    <h1>{headline(product)}</h1>
    <p className="sr-only">{animationHosts.length} mandates. 1 integrated website.</p>
    <Merger selected={product} />
  </main>;
}
