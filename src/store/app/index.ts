/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */

import { Module } from "vuex";
import { AppState } from "./types";
import { RootState } from "../types";

import { actions } from "./actions";
import { getters } from "./getters";
import { mutations } from "./mutations";

export const state: AppState = {
  drawer: false,
  initialRoute: "home"
};

// https://vuex.vuejs.org/guide/modules.html#namespacing
export const namespaced: boolean = false;

export const appModule: Module<AppState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};

export * from "./constants";
