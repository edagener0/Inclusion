import 'i18next';

import auth from '../../../../public/locales/en/auth.json';
import comment from '../../../../public/locales/en/comment.json';
import common from '../../../../public/locales/en/common.json';
import inc from '../../../../public/locales/en/inc.json';
import note from '../../../../public/locales/en/note.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof common;
      auth: typeof auth;
      comment: typeof comment;
      inc: typeof inc;
      note: typeof note;
    };
    keySeparator: '.';
  }
}
