/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */

import { GetterTree } from "vuex";
import { AuthState } from "./types";
import { RootState } from "../types";

import { GET_AUTHENTICATION, GET_LOGOUT_REASON } from "./constants";

export const getters: GetterTree<AuthState, RootState> = {
  /** @returns The authentication object (credentials) */
  [GET_AUTHENTICATION]: (state): JSON | string | null => state.auth,
  /** @returns The reason why the user has been logged out */
  [GET_LOGOUT_REASON]: state => state.logoutReason
};
