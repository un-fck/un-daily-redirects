import { headline } from './copy';
import type { Product } from './products';
import { Merger } from './merger';
export function App({ product }: { product: Product | null }) {
  return <main className="showcase" lang="en">
    <h1>{headline(product)}</h1>
    <p className="sr-only">7 mandates. 1 integrated website.</p>
    <Merger selected={product} />
  </main>;
}
