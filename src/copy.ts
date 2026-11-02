import { productNames, type Product } from './products';
export const disclaimer = 'An independent project by UNFCK, the United Nations Framework for Collaboration and Kindness. Not an official United Nations website.';
export function headline(product: Product | null): string {
  return product ? `${productNames[product]} is now part of UN Daily.` : 'UN Daily';
}
