import en from './assets/en.svg?url';
import pt from './assets/pt.svg?url';
import ru from './assets/ru.svg?url';
import ua from './assets/ua.svg?url';

type AppLanguage = 'en' | 'pt' | 'ru' | 'ua';

type LanguageConfig = {
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
    key: 'pt',
    name: 'Português',
    flagUrl: pt,
  },
  {
    key: 'ru',
    name: 'Русский',
    flagUrl: ru,
  },
  {
    key: 'ua',
    name: 'Україньска',
    flagUrl: ua,
  },
] as const satisfies LanguageConfig[];
