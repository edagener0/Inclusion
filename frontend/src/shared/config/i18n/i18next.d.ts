import 'i18next';

import auth from '../../../../public/locales/en/auth.json';
import comment from '../../../../public/locales/en/comment.json';
import common from '../../../../public/locales/en/common.json';
import inc from '../../../../public/locales/en/inc.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof common;
      auth: typeof auth;
      comment: typeof comment;
      inc: typeof inc;
    };
    keySeparator: '.';
  }
}
