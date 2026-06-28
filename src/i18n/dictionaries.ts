import 'server-only';

export type Locale = 'en' | 'hi';

const dictionaries = {
  en: () => import('./en.json').then((module) => module.default),
  hi: () => import('./hi.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => dictionaries[locale]();
