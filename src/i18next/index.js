import i18n from 'i18next';

import {initReactI18next} from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import en from './translations/en';
import ms from './translations/ms';
// import bhasa_malaysia from './translations/spanish.json';

/**
 * Constants
 */

export const USER_PREFERRED_LANGUAGE = RNLocalize.getLocales()[0].languageCode;

const MODULE_TYPE = 'languageDetector';

console.log(USER_PREFERRED_LANGUAGE);

const LANGUAGE_DETECTOR = {
  async: true,
  cacheUserLanguage: () => {},
  detect: cb => {
    return cb(USER_PREFERRED_LANGUAGE);
  },
  init: () => {},
  type: MODULE_TYPE,
};

const RESOURCES = {
  en: {translation: en},
  ms: {translation: ms},
  // es: spanish,
};

/**
 * i18next
 */

i18n
  // pass the i18n instance to react-i18next.
  .use(LANGUAGE_DETECTOR)
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    compatibilityJSON: 'v3',
    resources: RESOURCES,
    // language to use if translations in user language are not available
    fallbackLng: 'en',
  });

export default i18n;
