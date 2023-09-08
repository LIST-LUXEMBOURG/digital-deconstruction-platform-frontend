/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */

import { NavigationGuard } from 'vue-router';
import i18n from '@/i18n';

/**
 * if the page that you reach as no "lang" parameter or
 * the language provided doesn't match an available traduction,
 * redirects to the default language.
 */
export const i18nGuard: NavigationGuard = function(to, from, next): void {
  const defaultLanguage = process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en';
  const { lang } = to.params;
  if (!lang || !i18n.availableLocales.includes(lang)) {
    to.params.lang = defaultLanguage;
    i18n.locale = defaultLanguage;
    return next({
      path: `/${to.params.lang}`,
      params: { ...to.params, lang: defaultLanguage },
    });
  }
  return;
};
