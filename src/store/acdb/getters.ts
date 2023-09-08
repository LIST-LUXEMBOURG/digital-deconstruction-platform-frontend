/*
 *   Copyright (c) 2021 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */

import { GetterTree } from "vuex";
import { AcdbState } from "./types";
import { RootState } from "../types";
import { GET_ACDB, GET_FILTERED_RESOURCES_NAME } from "./constants";

export const getters: GetterTree<AcdbState, RootState> = {
  [GET_ACDB]: (state) => (accessType: string, resource: string) => {
    try {
      const requestedACDB = state.acdb[accessType][resource];
      if (requestedACDB !== undefined) return requestedACDB;
      else return { hasAccess: false };
    } catch(e) {
      return { hasAccess: false };
    }
  },
  [GET_FILTERED_RESOURCES_NAME]: (state) => {
    return state.resources;
  }
};
