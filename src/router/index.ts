/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */

import Vue from 'vue';
import VueRouter from 'vue-router';

// I18n
import i18n from '../i18n';

import { routes } from './routes';

import { i18nGuard } from './guards/i18n-guard';
import { authGuard } from './guards/auth-guard';

Vue.use(VueRouter);

const router = new VueRouter({
  // mode: "history",
  // base: process.env.BASE_URL,

  routes: [
    {
      // i18n wrapper
      path: '/:lang',
      component: { render: (c: any) => c('router-view') },
      children: routes,
      meta: {
        auth: false,
      },
    },
    {
      path: '/',
      redirect: `/${i18n.locale}`,
    },
    {
      path: '/reset-password/:token',
      redirect: `${i18n.locale}/reset-password/:token`,
    },
    {
      path: '/self-registration/:token',
      redirect: `${i18n.locale}/self-registration/:token`,
    },
  ],
});

// global navigation guards

router.beforeEach((to, from, next) => {
  // see related doc inside the guard
  i18nGuard(to, from, next);

  authGuard(to, from, next);

  i18n.locale = to.params.lang;
  next();
});

export default router;
