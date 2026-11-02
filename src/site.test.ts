import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { App } from './app';
import { headline } from './copy';
import { Merger } from './merger';
import { products, productHosts, productFromHost, resolveProduct } from './products';
import { animationDurationMs, reducedMotionDurationMs, completionDestination, destination } from './redirect';
describe('seven exact shadow hosts', () => {
  it.each(products)('recognizes %s without forwarding paths or accepting a lookalike', product => {
    expect(productFromHost(`${product}.unfck.org`)).toBe(product);
    expect(productFromHost(`${product.toUpperCase()}.UNFCK.ORG`)).toBe(product);
    expect(productFromHost(`${product}.unfck.org.evil.example`)).toBeNull();
    expect(resolveProduct(new URL(`https://${product}.unfck.org/path?site=ods&next=https://evil.example`))).toBe(product);
  });
  it('limits product overrides to loopback hosts', () => {
    expect(products).toHaveLength(7);
    expect(resolveProduct(new URL('http://localhost:5174/?site=journal'))).toBe('journal');
    expect(resolveProduct(new URL('http://127.0.0.1:5174/?site=ods'))).toBe('ods');
    expect(resolveProduct(new URL('https://preview.vercel.app/?site=journal'))).toBeNull();
    expect(resolveProduct(new URL('http://localhost:5174/?site=unknown'))).toBeNull();
  });
});
describe('English-only minimal output', () => {
  it('renders all seven official hostnames and the correct headline, with no disclaimer or controls', () => {
    expect(productHosts).toEqual({
      journal: 'journal.un.org', igov: 'igov.un.org', webtv: 'webtv.un.org',
      transcripts: 'transcripts.un.org', digitallibrary: 'digitallibrary.un.org',
      ods: 'documents.un.org', bluebook: 'bluebook.e-delegate.un.org',
    });
    for (const product of products) {
      const markup = renderToStaticMarkup(createElement(App, { product }));
      expect(markup).toContain('lang="en"');
      expect(markup).toContain(headline(product));
      expect(markup).not.toMatch(/disclaimer|independent project|not an official/i);
      expect(markup).toContain('7 mandates.');
      expect(markup).toContain('1 integrated website.');
      for (const host of Object.values(productHosts)) expect(markup).toContain(`<span>${host}</span>`);
      expect(markup).toContain('<div class="merged-brand"><div class="brand-name"><strong>UN</strong><span>Daily</span></div><p class="slogan">');
      expect(markup).not.toMatch(/<(button|select|input|footer|a)(?:\s|>)/);
    }
  });
});
describe('single animation completion', () => {
  it('uses only the fixed about target after the full or reduced-motion timeline finishes', () => {
    expect(destination).toBe('https://daily.unfck.org/about');
    expect(completionDestination('unite', true)).toBe(destination);
    expect(completionDestination('settled', true)).toBe(destination);
    expect(completionDestination('unite', false)).toBeNull();
    expect(completionDestination('anything-else', true)).toBeNull();
    expect(animationDurationMs).toBe(12500);
    expect(reducedMotionDurationMs).toBe(3500);
  });
  it('navigates from the completion handler and ignores child events', () => {
    const assign = vi.fn();
    vi.stubGlobal('window', { location: { assign } });
    const root = {};
    const element = Merger({ selected: 'journal' });
    element.props.onAnimationEnd({ animationName: 'unite', target: {}, currentTarget: root });
    expect(assign).not.toHaveBeenCalled();
    element.props.onAnimationEnd({ animationName: 'unite', target: root, currentTarget: root });
    expect(assign).toHaveBeenCalledExactlyOnceWith(destination);
    vi.unstubAllGlobals();
  });
});
