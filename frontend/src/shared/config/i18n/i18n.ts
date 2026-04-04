import { initReactI18next } from 'react-i18next';

import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { z } from 'zod';

import { supportedLanguages } from './constants';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: supportedLanguages.map(l => l.key),
    nonExplicitSupportedLngs: true,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common'],
    debug: import.meta.env.DEV,
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
  });

i18n.on('languageChanged', lng => {
  if (lng === 'ru' && z.locales.ru) {
    z.config(z.locales.ru());
  } else if (lng === 'en' && z.locales.en) {
    z.config(z.locales.en());
  } else if (lng === 'pt' && z.locales.pt) {
    z.config(z.locales.pt());
  } else if (lng === 'es' && z.locales.es) {
    z.config(z.locales.es());
  } else if (lng === 'fr' && z.locales.fr) {
    z.config(z.locales.fr());
  } else if (lng === 'ja' && z.locales.ja) {
    z.config(z.locales.ja());
  }
});

export async function loadNamespace(ns: string | string[]) {
  await i18n.loadNamespaces(ns);
}
export { i18n };
