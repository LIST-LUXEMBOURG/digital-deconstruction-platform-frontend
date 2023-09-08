/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */

// node_modules
import { forEach } from 'lodash-es';
import { ActionTree } from 'vuex';
import { $http } from '../../main';
import { LOG_OUT, UNSET_AUTHENTICATION } from '../auth';
import { ADD_NOTIFICATION } from '../notifications';
import { FETCH_USER_ROLES } from '../roles';
import { RootState, SET_LOADING } from '../types';
// Constants
import {
  ADD_USER, FETCH_AND_RETURN_USER_BY_ID, FETCH_CONNECTED_USERS, FETCH_CURRENT_USER, FETCH_FILTERED_USERS, FETCH_USERS, FORCE_LOGOUT, GET_ACTIVE_USERS_FILTER,
  GET_BLOCKED_USERS_FILTER,
  GET_CURRENT_USER, GET_USERS_FILTER, SET_ALL_USERS, SET_CONNECTED_USERS, SET_CURRENT_USER, SET_FILTERED_USERS,
  UPDATE_USER, UPDATE_USER_PASSWORD
} from './constants';
// Types
import { ConnectedUser, ListUser, UsersState } from './types';




export const actions: ActionTree<UsersState, RootState> = {

  /**
   * Fetch the all the connected users and populate the connectedUsers in the UserModule store
   *
   * If a 401 or 407 Exception is catched while performing the HTTP request,
   * the user is logged out from the application and send to the loggin page
   * with an annotation explainning why he/she has been logged out
   */
  async [FETCH_CONNECTED_USERS]({ commit, dispatch }): Promise<void> {
    try {
      const connectedUsers: ConnectedUser[] = await $http.auth.allConnectedUsers();

      commit(SET_CONNECTED_USERS, connectedUsers);
    } catch (e) {
      const error = e as any;
      if (error.statusCode === 401 || error.statusCode === 407) {
        dispatch(LOG_OUT, { action: error.messageCode });
      } else if (error.statusCode !== 403) {
        commit(ADD_NOTIFICATION, {
          message: error.messageCode,
          color: 'error',
        });
      }
    }
  },
  /**
   * [API] Call the "login" HTTP request
   * if the HTTP status code equals 201:
   * - The user is correctly autenticated
   * else
   * - The user will received a notification with the nature of the error
   * @param {SignInPayload} payload
   */
  async [FETCH_CURRENT_USER]({ commit, dispatch }): Promise<void> {
    try {
      const user = await $http.users.currentUser();
      commit(SET_CURRENT_USER, user);
    } catch (e) {
      const error = e as any;

      if (error.statusCode === 401 || error.statusCode === 407) {
        dispatch(LOG_OUT, { action: error.messageCode });
      } else if (error.statusCode !== 403) {
        commit(ADD_NOTIFICATION, {
          message: error.messageCode,
          color: 'error',
        });
      }
    }
  },
  async [FETCH_USERS]({ commit, getters }): Promise<void> {
    try {
      const userList: ListUser[] = await $http.users.list();
      commit(SET_ALL_USERS, userList);

      const currentUser = userList.find(
        user => user.id === getters[GET_CURRENT_USER].id,
      );

      if (currentUser) commit(SET_CURRENT_USER, currentUser);
    } catch (e) {
      const error = e as any;

      if (error.statusCode === 401 || error.statusCode === 407) {
        commit(UNSET_AUTHENTICATION);
        const router = require('@/router').default;
        router.push('/sign-in');
      } else if (error.statusCode !== 403) {
        commit(ADD_NOTIFICATION, {
          message: error.messageCode,
          color: 'error',
        });
      }
    }
  },
  /**
   * Fetch the user's information based on its ID and return the result
   *
   * @param userId - The user's ID to be fetched and returned
   */
  async [FETCH_AND_RETURN_USER_BY_ID](_, userId): Promise<ConnectedUser> {
    const [userById, ...rest] = await $http.users.list({ id: userId });
    return userById;
  },
  async [FETCH_FILTERED_USERS](
    { commit, getters, dispatch },
    query,
  ): Promise<void> {
    try {
      for (let attr of Object.keys(query)) {
        if (query[attr] === undefined) delete query[attr];
      }
      const filteredUsers: ListUser[] = await $http.users.filter(query);

      commit(SET_FILTERED_USERS, filteredUsers);

      await Promise.all(forEach(filteredUsers, async user => {
        await dispatch(FETCH_USER_ROLES, user.id);
      }));

      const currentUser = filteredUsers.find(
        user => user.id === getters[GET_CURRENT_USER].id,
      );

      if (currentUser) commit(SET_CURRENT_USER, currentUser);
    } catch (e) {
      const error = e as any;
      if (error.statusCode === 401 || error.statusCode === 407) {
        dispatch(LOG_OUT, { action: error.messageCode });
      } else if (error.statusCode !== 403) {
        commit(ADD_NOTIFICATION, {
          message: error.messageCode,
          color: 'error',
        });
      }
    }
  },
  async [UPDATE_USER]({ getters, dispatch, commit }, modifiedUser: ListUser) {
    try {
      delete modifiedUser.roles;
      await $http.users.update(modifiedUser);

      commit(ADD_NOTIFICATION, {
        message: 'userUpdated',
        color: 'success',
      });
      await dispatch(FETCH_FILTERED_USERS, {
        filter: getters[GET_USERS_FILTER],
        active: getters[GET_ACTIVE_USERS_FILTER],
        blocked: getters[GET_BLOCKED_USERS_FILTER],
      });
    } catch (e) {
      const error = e as any;
      if (error.statusCode === 401 || error.statusCode === 407) {
        await dispatch(LOG_OUT, { action: error.messageCode });
        // Login already taken
      } else if (error.statusCode === 409) {
        throw error.messageCode;
      } else if (error.statusCode !== 403) {
        commit(ADD_NOTIFICATION, {
          message: error.messageCode,
          color: 'error',
        });
      }
    }
  },
  async [UPDATE_USER_PASSWORD](
    { dispatch, commit },
    { userId, newPassword, isOwnUser, currentPassword },
  ) {
    try {
      if (!isOwnUser)
        await $http.users.update({ id: userId, password: newPassword });
      else {
        await $http.users.changePassword({ currentPassword, newPassword });
      }
    } catch (e) {
      const error = e as any;
      switch (error.statusCode) {
        case 401 || 407:
          dispatch(LOG_OUT, { action: error.message });
          break;
        case 403:
          commit(ADD_NOTIFICATION, {
            message: error.message,
            color: 'error',
          });
          break;
        default:
          throw error.message;
      }
    }
  },
  async [ADD_USER]({ getters, dispatch, commit }, user: ListUser) {
    try {
      await $http.users.create(user);

      commit(ADD_NOTIFICATION, {
        message: "userCreated",
        color: 'success',
      });
      await dispatch(FETCH_FILTERED_USERS, {
        filter: getters[GET_USERS_FILTER],
        active: getters[GET_ACTIVE_USERS_FILTER],
        blocked: getters[GET_BLOCKED_USERS_FILTER],
      });
    } catch (e) {
      const error = e as any;
      if (error.statusCode === 401 || error.statusCode === 407) {
        dispatch(LOG_OUT, { action: error.messageCode });
        // Login already taken
      } else if (error.statusCode === 409) {
        throw error.messageCode;
      } else if (error.statusCode !== 403) {
        commit(ADD_NOTIFICATION, {
          message: error.messageCode,
          color: 'error',
        });
      }
    }
  },
  async [FORCE_LOGOUT]({ dispatch, commit }, userId) {
    try {
      commit(SET_LOADING, true);
      await $http.auth.forcedLogout(userId);
      await dispatch(FETCH_CONNECTED_USERS);
    } catch (e) {
      const error = e as any;

      switch (error.statusCode) {
        case 401 || 407:
          dispatch(LOG_OUT, { action: error.message });
          break;
        case 403:
          commit(ADD_NOTIFICATION, {
            message: error.message,
            color: 'error',
          });
          break;
        default:
          throw error.message;
      }
    } finally {
      commit(SET_LOADING, false);
    }
  },
};
