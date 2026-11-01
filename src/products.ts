export const products = ['journal', 'igov', 'webtv', 'transcripts', 'digitallibrary', 'ods', 'bluebook'] as const;
export type Product = typeof products[number];
export const destination = 'https://daily.unfck.org';
export const officialSites: Record<Product, string> = {
  journal: 'https://journal.un.org', igov: 'https://igov.un.org',
  webtv: 'https://webtv.un.org', transcripts: 'https://transcripts.un.org',
  digitallibrary: 'https://digitallibrary.un.org', ods: 'https://documents.un.org',
  bluebook: 'https://www.un.org/dgacm/en/content/protocol/blue-book',
};
export function productFromHost(host: string): Product | null {
  return products.find(product => host.toLowerCase() === `${product}.unfck.org`) ?? null;
}
export function resolveProduct(url: URL): Product | null {
  const hostProduct = productFromHost(url.hostname);
  if (hostProduct) return hostProduct;
  if (!['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) return null;
  const preview = url.searchParams.get('site');
  return products.find(product => product === preview) ?? null;
}
