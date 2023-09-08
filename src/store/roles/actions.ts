/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */

import { ActionTree } from 'vuex';
// Http client
import { $http } from '../../main';
import { LOG_OUT } from '../auth';
import { ADD_NOTIFICATION } from '../notifications';
import { RootState } from '../types';
import { ADD_USER_ROLES, FETCH_FILTERED_USERS, GET_ACTIVE_USERS_FILTER, GET_BLOCKED_USERS_FILTER, GET_USERS_FILTER } from '../users';
// Contants
import {
  FETCH_ROLES,
  FETCH_USER_ROLES,
  SET_ROLES,
  UPDATE_ROLE,
  UPDATE_USER_ROLES
} from './constants';
// Types
import { Role, RolesState, UpdateUserRoles } from './types';

export const actions: ActionTree<RolesState, RootState> = {
  async [FETCH_ROLES]({ commit, dispatch }): Promise<void> {
    try {
      const roles = await $http.roles.list();
      commit(SET_ROLES, roles);
    } catch (e) {
      const error = e as any;

      if (error.statusCode === 403) {
        // do nothing
      } else if (error.statusCode === 401 || error.statusCode === 407) {
        dispatch(LOG_OUT, { action: error.messageCode });
      }
    }
  },
  async [FETCH_USER_ROLES]({ dispatch, commit }, userId: number) {
    try {
      const roles = await $http.roles.getUserRoles(userId);

      commit(ADD_USER_ROLES, {
        id: userId,
        roles,
      });
      return;
    } catch (e) {
      const error = e as any;

      if (error.statusCode === 401 || error.statusCode === 407) {
        dispatch(LOG_OUT, { action: error.messageCode });
        // Login already taken
      } else if (error.statusCode !== 403) {
        // do nothing
      }
    }
  },
  async [UPDATE_USER_ROLES](
    { commit, state, dispatch, getters },
    { roles, user }: UpdateUserRoles,
  ) {
    const roles_ = state.roles.filter(r => roles.includes(r.longName));

    const newRolesId = roles_.map(r => r.id);
    const userRolesId = user.roles.map(r => r.id);

    const toAssign = newRolesId.filter(r => !userRolesId.includes(r));
    const toAssignPromise = toAssign.map(roleId =>
      $http.roles.assignRole({ roleId, userId: user.id }),
    );
    const toRevoke = userRolesId.filter(r => !newRolesId.includes(r));
    const toRevokePromise = toRevoke.map(roleId =>
      $http.roles.revokeRole({ roleId, userId: user.id }),
    );

    try {
      await Promise.all([...toAssignPromise, ...toRevokePromise]);

      commit(ADD_USER_ROLES, {
        id: user.id,
        roles: roles_,
      });

      await dispatch(FETCH_FILTERED_USERS, {
        filter: getters[GET_USERS_FILTER],
        active: getters[GET_ACTIVE_USERS_FILTER],
        blocked: getters[GET_BLOCKED_USERS_FILTER],
      });

      return true;
    } catch (e) {
      const error = e as any;

      console.error(error);

      await Promise.all([
        ...toRevoke.map(roleId =>
          $http.roles.assignRole({ roleId, userId: user.id }),
        ),
        ...toAssign.map(roleId =>
          $http.roles.revokeRole({ roleId, userId: user.id }),
        ),
      ]);
      commit(ADD_NOTIFICATION, {
        message: error.messageCode,
        color: error,
      });
      return false;
    }
  },
  async [UPDATE_ROLE]({ dispatch, commit }, modifiedRole: Role) {
    try {
      const updatedRole = await $http.roles.update(modifiedRole);
      commit(ADD_NOTIFICATION, {
        message: 'roleUpdated',
        color: 'success',
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
};
