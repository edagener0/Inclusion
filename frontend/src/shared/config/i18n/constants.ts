import en from './assets/en.svg?url';
import ru from './assets/ru.svg?url';

export type AppLanguage = 'ru' | 'en';

export type LanguageConfig = {
  key: AppLanguage;
  name: string;
  flagUrl: string;
};

export const supportedLanguages = [
  {
    key: 'en',
    name: 'English',
    flagUrl: en,
  },
  {
    key: 'ru',
    name: 'Русский',
    flagUrl: ru,
  },
] as const satisfies LanguageConfig[];
