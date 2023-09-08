/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */

import { MutationTree } from 'vuex';
import {
  ViewerState,
  RbimElement,
  BimGroup,
} from './types';
import { state as viewerState } from './index';
import {
  
  REINITIALIZE_VIEWER_MODULE,
  SET_IFCIDS,
  SET_VIEWER_DBIDS,
  SET_VIEWER_INITIALISED,
  SET_VIEWER_SELECTED_ELEMENTS,
  SET_RBIM_ALL_ELEMENTS,
  SET_RBIM_SELECTED_ELEMENTS
} from './constants';

export const mutations: MutationTree<ViewerState> = {
  [REINITIALIZE_VIEWER_MODULE](state, _: void) {
    Object.assign(state, viewerState);
  },
  [SET_IFCIDS](state, payload: []) {
    state.ifcIds = payload;
  },
  [SET_VIEWER_DBIDS](state, dbIds:any) {
    state.viewerDbids = dbIds;
  },
  [SET_VIEWER_INITIALISED](state, treeLoaded:boolean) {
    state.isViewerInitialised = treeLoaded;
  },
  [SET_VIEWER_SELECTED_ELEMENTS](state, newSelection) {
    state.selectedDbids = newSelection;
  },
  [SET_RBIM_ALL_ELEMENTS](state, elements: RbimElement[]) {
    state.rbimAllElements = { groupBy: BimGroup.ReusePotential };

    // Group the elements by a numerical key (from 0 to n).
    // Returns an "object" where the keys are the numerical keys and the value is an
    // object with 2 properties "list" and "color".
    const groupBy = function(list: any[], key: string) {
      return list.reduce(function(acc, curr) {
        if (!(curr[key] in acc)) acc[curr[key]] = [];
        acc[curr[key]].push(curr);
        return acc;
      }, {});
    };
    const parts = groupBy(elements, state.rbimAllElements.groupBy);

    state.rbimAllElements = parts;
  },
  [SET_RBIM_SELECTED_ELEMENTS](state, elements: RbimElement[]) {
    state.rbimSelectedElements = { groupBy: BimGroup.ReusePotential };

    // Group the elements by a numerical key (from 0 to n).
    // Returns an "object" where the keys are the numerical keys and the value is an
    // object with 2 properties "list" and "color".
    const groupBy = function(list: any[], key: string) {
      return list.reduce(function(acc, curr) {
        if (!(curr[key] in acc)) acc[curr[key]] = [];
        acc[curr[key]].push(curr);
        return acc;
      }, {});
    };
    const parts = groupBy(elements, state.rbimSelectedElements.groupBy);

    state.rbimSelectedElements = parts;
  },
};