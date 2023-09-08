/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */


import { MutationTree } from "vuex";
import { RolesState } from "./types";
import { SET_ROLES } from "./constants";

export const mutations: MutationTree<RolesState> = {
  [SET_ROLES](state, roles) {
    state.roles = roles;
  },
};
