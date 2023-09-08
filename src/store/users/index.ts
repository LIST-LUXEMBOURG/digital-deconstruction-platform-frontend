/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */

import { Module } from "vuex";
import { RootState } from "../types";
import { actions } from "./actions";
import { getters } from "./getters";
import { mutations } from "./mutations";
import { CurrentUser, UsersState } from "./types";


export const state: UsersState = {
  connectedUsers: [],
  currentUser: {} as CurrentUser,
  listUsers: [],
  filteredUsers: [],
  activeUsersFilter: undefined,
  blockedUsersFilter: undefined,
  usersFilter: undefined,
};

// https://vuex.vuejs.org/guide/modules.html#namespacing
export const namespaced: boolean = false;

export const usersModule: Module<UsersState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};

export * from "./constants";
export * from "./types";

