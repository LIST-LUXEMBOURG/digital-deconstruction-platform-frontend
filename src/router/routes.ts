/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */

import { RouteConfig } from 'vue-router';
// components
import Home from '../views/Home.vue';

/** routes - level 1 -------------------------------------------------------- */

export const SignIn = {
  path: 'sign-in',
  name: 'sign in',
  component: () =>
    import(/* webpackChunkName: "signIn" */ '../views/SignIn.vue'),
  meta: {
    auth: false,
  },
};
export const About = {
  path: 'about',
  name: 'about',
  meta: {
    slug: 'about',
    icon: 'mdiInformation',
    auth: false,
  },
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),

};

export const SelfRegistration = {
  path: 'self-registration',
  name: 'self registration',
  component: () => import('../views/SelfRegistration.vue'),
  meta: {
    auth: false,
  },
};

export const SelfRegistrationConfirmation = {
  path: 'self-registration/:token',
  name: 'self registration confirmation',
  component: () => import('../views/SelfRegistrationConfirmation.vue'),
  meta: {
    auth: false,
  },
};

export const ResetPassword = {
  path: 'reset-password',
  name: 'reset password',
  component: () =>
    import(
      /* webpackChunkName: "resetPassword" */ '../views/ResetPassword.vue'
    ),
  meta: {
    auth: false,
  },
};

export const ResetPasswordForm: RouteConfig = {
  path: 'reset-password/:token',
  name: 'reset password form',
  component: () =>
    import(
      /* webpackChunkName: "resetPasswordForm" */ '../views/ResetPasswordForm.vue'
    ),
  meta: {
    auth: false,
  },
};

/** routes - level 2 (Home children) ---------------------------------------- */

export const Welcome = {
  // SessionManagement will be rendered inside Home's <router-view>
  // by default
  path: 'welcome',
  name: 'welcome',
  meta: {
    slug: 'welcome',
    icon: 'mdiHome',
    auth: false,
  },
  component: () =>
    import(/* webpackChunkName: "welcome" */ '../views/Welcome.vue'),
};
export const SessionManagement = {
  // SessionManagement will be rendered inside Home's <router-view>
  // by default
  path: 'sessionManagement',
  name: 'sessionManagement',
  meta: {
    slug: 'sessionManagement',
    icon: 'mdiTimelineClock',
    auth: true,
  },
  component: () =>
    import(
      /* webpackChunkName: "sessionManagement" */ '@/views/UsersSessionView.vue'
    ),
};
export const UserManagement = {
  // UserManagement will be rendered inside Home's <router-view>
  // when /userManagement is matched
  path: 'userManagement',
  name: 'userManagement',
  meta: {
    slug: 'userManagement',
    icon: 'mdiAccountEdit',
    auth: true,
  },
  component: () =>
    import(
      /* webpackChunkName: "userManagement" */ '@/views/UsersManagementView.vue'
    ),
};
export const PrivilegesManagement = {
  // PrivilegesManagement will be rendered inside Home's <router-view>
  // when /privilegesManagement is matched
  path: 'privilegesManagement',
  name: 'privilegesManagement',

  meta: {
    slug: 'privilegesManagement',
    icon: 'mdiAccountEdit',
    auth: true,
  },
  component: () =>
    import(
      /* webpackChunkName: "privilegesManagement" */ '../views/PrivilegesManagement.vue'
    ),
};
export const ProjectsManagement = {
  // ProjectsManagement will be rendered inside Home's <router-view>
  // when /projectsManagement is matched
  path: 'projectsManagement',
  name: 'projectsManagement',
  meta: {
    slug: 'projectsManagement',
    icon: 'mdiSitemap',
    auth: true,
  },
  component: () =>
    import(
      /* webpackChunkName: "projectsManagement" */ '../views/ProjectManagementView.vue'
    ),
};

export const Project = {
  path: 'project',
  name: 'Project',
  meta: {
    slug: 'project',
    icon: 'mdiToyBrickMarker',
    auth: true,
  },
  props: true, // When props is set to true, the route.params will be set as the component props.
  component: () =>
    import(/* webpackChunkName: "project" */ '../views/Project.vue'),
};

export const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'home',
    component: Home,
    redirect: { name: 'welcome' },
    children: [
      Welcome,
      SessionManagement,
      UserManagement,
      PrivilegesManagement,
      ProjectsManagement,
      Project,
      About
    ],
    meta: {
      auth: false,
    },
  },
  SignIn,
  ResetPassword,
  ResetPasswordForm,
  SelfRegistration,
  SelfRegistrationConfirmation,
];
