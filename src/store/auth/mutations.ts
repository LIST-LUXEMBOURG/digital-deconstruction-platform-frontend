/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */

import { MutationTree } from "vuex";
import { state as authState } from "./";
import { AuthState } from "./types";

import {
  SET_AUTHENTICATION,
  UNSET_AUTHENTICATION,
  SET_LOGOUT_REASON,
  UNSET_LOGOUT_REASON,
  REINITIALIZE_AUTH_MODULE
} from "./constants";

export const mutations: MutationTree<AuthState> = {
  [REINITIALIZE_AUTH_MODULE](state, _: void) {
    Object.assign(state, authState);
  },
  /**
   * Set auth & user JSON object in the store and in the localeStorage
   * if the remember attribute is set to "true"
   */
  [SET_AUTHENTICATION](state, credentials) {
    const { token } = credentials;
    state.auth = token;
  },

  /**
   * Unset the auth and user object in the store.
   * Remove the auth and user object from the localStorage
   */
  [UNSET_AUTHENTICATION](state, _: void) {
    state.auth = null;
  },
  /**
   * Sets the logout reason in the store to the value provided in 'reason'
   *
   * @param state
   * @param reason
   */
  [SET_LOGOUT_REASON](state, reason: string) {
    state.logoutReason = reason;
  },
  /**
   * Sets the logout reason in the store to null
   *
   * @param state
   * @param _
   */
  [UNSET_LOGOUT_REASON](state, _: void) {
    state.logoutReason = undefined;
  }
};
