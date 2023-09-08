/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */

import { NavigationGuard } from 'vue-router';

import store from '@/store';
import { GET_AUTHENTICATION } from '@/store/auth';

/**
 * If the page that you want to reach is protected by authentication
 * and you are not properly authenticated,
 * you will be redirected to the sign-in page.
 *
 * To protect a route by authentication, attach a metadata
 * "auth" to the corresponding route.
 *
 * E.g. for the home page:
 * {
 *   path: "/",
 *   name: "home",
 *   component: Home,
 *   meta: { auth: true }
 * },
 */
export const authGuard: NavigationGuard = function(to, from, next): void {
  const requireAuth: boolean = to.matched.some(m => m.meta.auth === true);
  const isNotAuthenticated: boolean =
    store.getters[GET_AUTHENTICATION] === null;
  if (requireAuth && isNotAuthenticated)
    return next({ name: 'sign in', params: { lang: to.params.lang || 'en' } });
  return;
};
