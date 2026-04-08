import en from './assets/en.svg?url';
import es from './assets/es.svg?url';
import fr from './assets/fr.svg?url';
import ja from './assets/ja.svg?url';
import pt from './assets/pt.svg?url';
import ru from './assets/ru.svg?url';
import ua from './assets/ua.svg?url';

type AppLanguage = 'en' | 'pt' | 'es' | 'fr' | 'ru' | 'ua' | 'ja';

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
    key: 'es',
    name: 'España',
    flagUrl: es,
  },
  {
    key: 'fr',
    name: 'Français',
    flagUrl: fr,
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
  {
    key: 'ja',
    name: '日本語',
    flagUrl: ja,
  },
] as const satisfies LanguageConfig[];
