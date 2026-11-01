import { describe, expect, it } from 'vitest';
import { catalogues, resolveLocale } from './locale';
import { destination, products, productFromHost, resolveProduct } from './products';
import { redirectDelay, secondsRemaining } from './redirect';
describe('host isolation', () => {
  it.each(products)('recognizes only the exact %s shadow host', product => {
    expect(productFromHost(`${product}.unfck.org`)).toBe(product);
    expect(productFromHost(`${product.toUpperCase()}.UNFCK.ORG`)).toBe(product);
    expect(productFromHost(`${product}.unfck.org.evil.example`)).toBeNull();
    expect(resolveProduct(new URL(`https://${product}.unfck.org/path?site=ods&next=https://evil.example`))).toBe(product);
  });
  it('allows product previews only on loopback and never redirects unknown production hosts', () => {
    expect(resolveProduct(new URL('http://localhost:5174/?site=journal'))).toBe('journal');
    expect(resolveProduct(new URL('https://preview.vercel.app/?site=journal'))).toBeNull();
    expect(resolveProduct(new URL('http://localhost:5174/?site=unknown'))).toBeNull();
    expect(destination).toBe('https://daily.unfck.org');
    expect(products).toHaveLength(7);
  });
});
describe('language selection and complete catalogues', () => {
  it('resolves query, source path, browser preferences, then English', () => {
    expect(resolveLocale(new URL('https://journal.unfck.org/fr?lang=ar'), ['es'])).toBe('ar');
    expect(resolveLocale(new URL('https://journal.unfck.org/fr/path'), ['es'])).toBe('fr');
    expect(resolveLocale(new URL('https://journal.unfck.org'), ['de', 'zh-CN'])).toBe('zh');
    expect(resolveLocale(new URL('https://journal.unfck.org'), ['de'])).toBe('en');
    for (const invalid of ['constructor', '__proto__', 'toString']) {
      expect(resolveLocale(new URL(`https://journal.unfck.org?lang=${invalid}`), ['en'])).toBe('en');
    }
  });
  it.each(Object.entries(catalogues))('%s has every key and all seven product descriptions', (locale, copy) => {
    expect(Object.keys(copy).sort()).toEqual(Object.keys(catalogues.en).sort());
    expect(Object.keys(copy.products).sort()).toEqual([...products].sort());
    expect(Object.keys(copy.descriptions).sort()).toEqual([...products].sort());
    expect(copy.headline).toContain('{product}');
    expect(copy.countdown).toContain('{seconds}');
    for (const [key, value] of Object.entries(copy)) {
      if (typeof value === 'string') {
        expect(value.trim()).not.toBe('');
        if (locale !== 'en') expect(value).not.toBe(catalogues.en[key as keyof typeof catalogues.en]);
      }
    }
  });
  it('preserves the exact requested English disclaimer', () => {
    expect(catalogues.en.disclaimer).toBe('An independent project by UNFCK, the United Nations Framework for Collaboration and Kindness. Not an official United Nations website.');
  });
});
describe('redirect deadline', () => {
  it('counts down eight seconds and never underflows', () => {
    expect(redirectDelay).toBe(8000);
    for (let elapsed = 0; elapsed <= 8000; elapsed += 1000) {
      expect(secondsRemaining(8000, elapsed)).toBe(8 - elapsed / 1000);
    }
    expect(secondsRemaining(8000, 7999)).toBe(1);
    expect(secondsRemaining(8000, 10000)).toBe(0);
  });
});
