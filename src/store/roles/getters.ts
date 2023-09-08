/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */


import { GetterTree } from "vuex";
import { RolesState, Role } from "./types";
import { RootState } from "../types";
import { GET_ROLES } from "./constants";

export const getters: GetterTree<RolesState, RootState> = {
  [GET_ROLES]: (state): Role[] => state.roles,
};
