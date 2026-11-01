import en from './locales/en.json';
import fr from './locales/fr.json';
import es from './locales/es.json';
import ru from './locales/ru.json';
import zh from './locales/zh.json';
import ar from './locales/ar.json';
export const languages = { en: 'English', fr: 'Français', es: 'Español', ru: 'Русский', zh: '中文', ar: 'العربية' };
export type Locale = keyof typeof languages;
export type Copy = typeof en;
export const catalogues: Record<Locale, Copy> = { en, fr, es, ru, zh, ar };
export function resolveLocale(url: URL, preferred: readonly string[]): Locale {
  const candidates = [url.searchParams.get('lang'), url.pathname.split('/')[1], ...preferred];
  return candidates.map(value => value?.toLowerCase().split('-')[0])
    .find((value): value is Locale => !!value && Object.hasOwn(languages, value)) ?? 'en';
}
