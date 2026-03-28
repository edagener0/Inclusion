import { defineConfig } from 'i18next-cli';

export default defineConfig({
  locales: ['en', 'ru', 'ua', 'pt', 'es'],
  extract: {
    input: 'src/**/*.{js,jsx,ts,tsx}',
    output: 'public/locales/{{language}}/{{namespace}}.json',
  },
  types: {
    input: 'public/locales/en/*.json',
    output: 'src/shared/config/i18n/types/i18next.d.ts',
    resourcesFile: 'src/shared/config/i18n/types/resources.d.ts',
  },
});
