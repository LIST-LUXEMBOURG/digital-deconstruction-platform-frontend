/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */

import { MutationTree } from "vuex";
import { AppState } from "./types";

import { TOGGLE_DRAWER, SET_INITIAL_ROUTE } from "./constants";

export const mutations: MutationTree<AppState> = {
  /** Update the drawer state */
  [TOGGLE_DRAWER](state, drawer: boolean) {
    state.drawer = drawer;
  },

  /**
   * Set the initial route with the route the client try to reach
   * If the client isn't connected, the app will redirect him to an
   * appropriate page
   */
  [SET_INITIAL_ROUTE](state, payload: string) {
    state.initialRoute = payload;
  }
};
