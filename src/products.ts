export const products = ['journal', 'igov', 'webtv', 'transcripts', 'digitallibrary', 'ods', 'bluebook'] as const;
export type Product = typeof products[number];
export const productNames: Record<Product, string> = {
  journal: 'UN Journal', igov: 'iGov', webtv: 'UN Web TV',
  transcripts: 'UN Transcripts', digitallibrary: 'UN Digital Library',
  ods: 'Official Document System', bluebook: 'Blue Book',
};
export const productHosts: Record<Product, string> = {
  journal: 'journal.un.org', igov: 'igov.un.org', webtv: 'webtv.un.org',
  transcripts: 'transcripts.un.org', digitallibrary: 'digitallibrary.un.org',
  ods: 'documents.un.org', bluebook: 'bluebook.e-delegate.un.org',
};
// e-Speakers participates in the animation without adding an incoming shadow host.
export const animationHosts = [...products.map(product => productHosts[product]), 'e-speakers.e-delegate.un.org'];
export function productFromHost(host: string): Product | null {
  return products.find(product => host.toLowerCase() === `${product}.unfck.org`) ?? null;
}
export function resolveProduct(url: URL): Product | null {
  const hostProduct = productFromHost(url.hostname);
  if (hostProduct) return hostProduct;
  if (!['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) return null;
  return products.find(product => product === url.searchParams.get('site')) ?? null;
}
