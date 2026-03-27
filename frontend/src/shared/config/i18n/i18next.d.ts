import 'i18next';

import auth from '../../../../public/locales/en/auth.json';
import common from '../../../../public/locales/en/common.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof common;
      auth: typeof auth;
    };
    keySeparator: '.';
  }
}
