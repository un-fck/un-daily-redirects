import { productNames, type Product } from './products';
export function headline(product: Product | null): string {
  return product ? `${productNames[product]} is now part of UN Daily.` : 'UN Daily';
}
