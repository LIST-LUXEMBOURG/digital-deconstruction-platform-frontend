/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */

import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  isAfter,
} from 'date-fns';
import { GetterTree } from 'vuex';
import { RootState } from '../types';
import {
  GET_ACTIVE_USERS_FILTER,
  GET_ALL_CONNECTED_USERS,
  GET_ALL_USERS,
  GET_BLOCKED_USERS_FILTER,
  GET_CURRENT_USER,
  GET_FILTERED_USERS,
  GET_USERS_FILTER,
} from './constants';
import { ConnectedUser, CurrentUser, ListUser, UsersState } from './types';
import i18n from '@/i18n';

export const getters: GetterTree<UsersState, RootState> = {
  /** @returns The list of all connected users */
  [GET_ALL_CONNECTED_USERS]: (state): ConnectedUser[] => {
    return state.connectedUsers
      .map(user => {
        return Object.assign(user, {
          connectionDuration: formatDurationFromNow(new Date(user.timestamp)),
        });
      })
      .sort((userA, userB) => {
        return isAfter(new Date(userA.timestamp), new Date(userB.timestamp))
          ? 1
          : -1;
      });
  },
  [GET_CURRENT_USER]: (state): CurrentUser | null => {
    return state.currentUser;
  },
  [GET_ALL_USERS]: (state): ListUser[] => {
    return state.listUsers.sort((a, b) => a.id - b.id);
  },
  [GET_FILTERED_USERS]: (state): ListUser[] => {
    return state.filteredUsers;
  },
  [GET_ACTIVE_USERS_FILTER]: (state): boolean | undefined => {
    return state.activeUsersFilter;
  },
  [GET_BLOCKED_USERS_FILTER]: (state): boolean | undefined => {
    return state.blockedUsersFilter;
  },
  [GET_USERS_FILTER]: (state): string | undefined => {
    return state.usersFilter;
  },
};

/** Format the given object representing a duration into a traduced string
 * @param connectionDate - a JS Date
 */
function formatDurationFromNow(connectionDate: Date) {
  const now = new Date();
  let formatedDuration = '';

  // If the duration is more than a day, add it to the string
  const days = differenceInDays(now, connectionDate);
  if (days > 0)
    formatedDuration +=
      i18n.tc('days', days, {
        days: days,
      }) + ', ';

  // If the duration is more than an hour (without counting the day(s)), add it to the string
  const hours = differenceInHours(now, connectionDate) % 24;
  // Adding the minutes and seconds with a prefixed '0' if the value is less than '10'
  const minutes = differenceInMinutes(now, connectionDate) % 60;
  // const seconds = differenceInSeconds(now, connectionDate) % 60;
  formatedDuration += hours + ':';
  formatedDuration += minutes < 10 ? `0${minutes}` : minutes;
  formatedDuration += ' ' + i18n.t('hours');

  return formatedDuration;
}
