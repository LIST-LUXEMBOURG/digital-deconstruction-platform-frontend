/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */


import { MutationTree } from "vuex";
import { state as usersState } from "./";
import {
  ADD_USER_ROLES, REINITIALIZE_USERS_MODULE, SET_ACTIVE_USERS_FILTER, SET_ALL_USERS, SET_BLOCKED_USERS_FILTER, SET_CONNECTED_USERS, SET_CURRENT_USER, SET_FILTERED_USERS, SET_USERS_FILTER
} from "./constants";
import { ConnectedUser, CurrentUser, ListUser, UsersState } from "./types";


export const mutations: MutationTree<UsersState> = {
  [REINITIALIZE_USERS_MODULE](state, _: void) {
    Object.assign(state, usersState);
  },
  /** Sets the connected users list  */
  [SET_CONNECTED_USERS](state, connectedUsers: ConnectedUser[]) {
    state.connectedUsers = connectedUsers;
  },
  /** Sets the current user  */
  [SET_CURRENT_USER](state, currentUser: CurrentUser) {
    state.currentUser = currentUser;
  },
  /** Sets the users list  */
  [SET_ALL_USERS](state, listUsers: ListUser[]) {
    state.listUsers = listUsers;
  },
  [SET_FILTERED_USERS](state, filteredUsers) {
    state.filteredUsers = filteredUsers;
  },
  [SET_ACTIVE_USERS_FILTER](state, value: boolean | undefined) {
    state.activeUsersFilter = value;
  },
  [SET_BLOCKED_USERS_FILTER](state, value: boolean | undefined) {
    state.blockedUsersFilter = value;
  },
  [SET_USERS_FILTER](state, filter: string | undefined) {
    state.usersFilter = filter;
  },
  [ADD_USER_ROLES](state, { id, roles }) {
    const userIndex = state.filteredUsers.findIndex((user) => user.id === id);
    if (userIndex != -1) state.filteredUsers[userIndex].roles = roles;
  },
};
