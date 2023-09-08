/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */

import { GetterTree } from "vuex";
import { AppState } from "./types";
import { RootState } from "../types";

import { GET_DRAWER, GET_INITIAL_ROUTE } from "./constants";

export const getters: GetterTree<AppState, RootState> = {
  /** @returns The state of the application drawer (show|hide) */
  [GET_DRAWER]: (state): boolean => state.drawer,

  /** @returns The initial route named 'home' or the last navigated route (n-1) */
  [GET_INITIAL_ROUTE]: (state): String => state.initialRoute
};
