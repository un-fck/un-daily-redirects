import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { App } from './app';
import { headline } from './copy';
import { Merger } from './merger';
import { products, productHosts, productFromHost, resolveProduct } from './products';
import { animationDurationMs, reducedMotionDurationMs, completionDestination, destination } from './redirect';
import html from '../index.html?raw';

const officialHosts = [
  'journal.un.org', 'igov.un.org', 'webtv.un.org', 'transcripts.un.org',
  'digitallibrary.un.org', 'documents.un.org', 'bluebook.e-delegate.un.org',
  'e-speakers.e-delegate.un.org',
];
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
  it('keeps e-Speakers display-only without inventing another incoming host', () => {
    expect(productFromHost('espeakers.unfck.org')).toBeNull();
    expect(productFromHost('e-speakers.unfck.org')).toBeNull();
    expect(resolveProduct(new URL('http://localhost:5174/?site=espeakers'))).toBeNull();
  });
});
describe('English-only minimal output', () => {
  it.each([...products, null])('renders eight official hostnames for %s, with no disclaimer or controls', product => {
    expect(productHosts).toEqual({
      journal: 'journal.un.org', igov: 'igov.un.org', webtv: 'webtv.un.org',
      transcripts: 'transcripts.un.org', digitallibrary: 'digitallibrary.un.org',
      ods: 'documents.un.org', bluebook: 'bluebook.e-delegate.un.org',
    });
    const markup = renderToStaticMarkup(createElement(App, { product }));
    expect(markup).toContain('lang="en"');
    expect(markup).toContain(headline(product));
    expect(markup).not.toMatch(/disclaimer|independent project|not an official/i);
    expect(markup).toContain('<p class="sr-only">8 mandates. 1 integrated website.</p>');
    expect(markup).toContain('<span>8 mandates.</span>');
    expect(markup).not.toContain('7 mandates.');
    expect(markup).toContain('1 integrated website.');
    for (const host of officialHosts) expect(markup).toContain(`<span>${host}</span>`);
    expect(markup.match(/class="source-product/g)).toHaveLength(8);
    expect(markup).toContain('<div class="merged-brand"><div class="brand-name"><strong>UN</strong><span>Daily</span></div><p class="slogan">');
    expect(markup).not.toMatch(/<(button|select|input|footer|a)(?:\s|>)/);
  });
  it.each([...products, null])('centres all eight rows around the origin for %s', product => {
    const markup = renderToStaticMarkup(createElement(Merger, { selected: product }));
    const slots = [...markup.matchAll(/style="--slot:([^;]+);/g)].map(match => Number(match[1]));
    expect(slots).toEqual([-3.5, -2.5, -1.5, -.5, .5, 1.5, 2.5, 3.5]);
    expect(markup).toContain('--source-count:8');
    const origin = product ? slots[products.indexOf(product)] : 0;
    expect(markup).toContain(`--origin-slot:${origin}`);
  });
});
describe('no-JavaScript fallback', () => {
  it('uses the same fixed destination without controls or a disclaimer', () => {
    const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1];
    expect(head).toContain(`<noscript><meta http-equiv="refresh" content="0;url=${destination}"`);
    expect(html).toContain('Eight mandates');
    expect(html).toContain('UN Daily — 8 mandates. 1 integrated website.');
    expect(html).not.toMatch(/Seven mandates|7 mandates|disclaimer|<(button|select|input|footer|a)(?:\s|>)/i);
  });
});
describe('single animation completion', () => {
  it('uses only the fixed about target after the full or reduced-motion timeline finishes', () => {
    expect(destination).toBe('https://daily.un-two-zero.org/about');
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
