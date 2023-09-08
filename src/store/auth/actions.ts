/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */

import { ActionTree } from 'vuex';
import { $http } from '../../main';
import { REINITIALIZE_ACDB_MODULE } from '../acdb';
import { ADD_NOTIFICATION, REINITIALIZE_NOTIF_MODULE } from '../notifications';
import { FetchError, RootState } from '../types';
import { FETCH_CURRENT_USER, REINITIALIZE_USERS_MODULE } from '../users';
import {
  LOG_OUT,
  REINITIALIZE_AUTH_MODULE,
  // mutations
  SET_AUTHENTICATION,
  SET_LOGOUT_REASON,
  // actions
  SIGN_IN_USERNAME_PASSWORD,
  SIGN_OUT,
  UNSET_AUTHENTICATION,
} from './constants';
import { AuthState, SignInPayload } from './types';

export const actions: ActionTree<AuthState, RootState> = {
  /**
   * Unset the logout reason in the Auth state
   * Call the "login" HTTP request
   * if the HTTP status code equals 201:
   * - The user is correctly autenticated
   * else
   * - The user will received a notification with the nature of the error
   * @param {SignInPayload} payload
   */
  async [SIGN_IN_USERNAME_PASSWORD](
    { commit, dispatch },
    payload: SignInPayload,
  ): Promise<void> {
    // clear $http first
    commit(SET_LOGOUT_REASON, null);
    const services = Object.keys($http);
    services.forEach((s: string) => delete $http[s].options.token);

    try {
      const credentials = await $http.auth.login(
        payload.login,
        payload.password,
      );

      if (!(credentials.token as string).startsWith('Bearer ')) {
        credentials.token = 'Bearer ' + credentials.token;
      }

      // attach to every $http services a property "token"
      services.forEach((s: string) => {
        Object.assign($http[s].options, { token: credentials.token });
      });

      commit(SET_AUTHENTICATION, credentials);
      dispatch(FETCH_CURRENT_USER);
    } catch (error) {
      if (error instanceof TypeError) throw error;

      if (error instanceof FetchError) {
        if ((error as FetchError).statusCode === 403) {
          commit(ADD_NOTIFICATION, {
            message: 'userBlocked',
            color: 'error',
          });
        }
      }
      throw error;
    }
  },

  /**
   * Call the "logout" HTTP request.
   * Reinitialize the following modules state (in this order):
   *  * Notifications
   *  * Users
   *  * Auth
   * Set the logout reason in the Auth state to "properlyDisconnected"
   * @param {void} payload
   */
  async [SIGN_OUT]({ commit, getters }, payload: void): Promise<void> {
    // const token = getters[GET_AUTHENTICATION];
    await $http.auth.logout();

    // delete the token property in every service options.
    const services = Object.keys($http);
    services.forEach((s: string) => delete $http[s].options.token);

    commit(REINITIALIZE_NOTIF_MODULE);
    commit(REINITIALIZE_USERS_MODULE);
    commit(REINITIALIZE_AUTH_MODULE);
    commit(REINITIALIZE_ACDB_MODULE);

    commit(SET_LOGOUT_REASON, {
      action: 'properlyDisconnected',
      type: 'success',
    });
  },
  [LOG_OUT]({ commit }, payload) {
    commit(UNSET_AUTHENTICATION);
    const router = require('@/router').default;
    router.push('/sign-in');

    commit(REINITIALIZE_NOTIF_MODULE);
    commit(REINITIALIZE_USERS_MODULE);
    commit(REINITIALIZE_AUTH_MODULE);
    commit(REINITIALIZE_ACDB_MODULE);

    const services = Object.keys($http);
    services.forEach((s: string) => delete $http[s].options.token);

    commit(SET_LOGOUT_REASON, {
      action: payload.action,
      type: 'error',
    });
  },
};
