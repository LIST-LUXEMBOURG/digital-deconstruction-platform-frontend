/*
 *   Copyright (c) 2021 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */

import { Module } from "vuex";
import { AcdbState, AccessControlDataBase } from "./types";
import { RootState } from "../types";

import { actions } from "./actions";
import { getters } from "./getters";
import { mutations } from "./mutations";

const acdb: AccessControlDataBase = {
  create: {},
  read: {},
  update: {},
  delete: {}
}

export const state: AcdbState = {
  acdb,
  resources: []
};

// https://vuex.vuejs.org/guide/modules.html#namespacing
export const namespaced: boolean = false;

export const acdbModule: Module<AcdbState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};

export * from "./constants";
export * from "./types";
