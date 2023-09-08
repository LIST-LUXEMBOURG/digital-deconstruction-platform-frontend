/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */

import { GetterTree } from 'vuex';
import {
  ViewerState,
  GroupedBimElements,
} from './types';
import { RootState } from '../types';
import {
  GET_VIEWER_INITIALISED,
  GET_IFCIDS,
  GET_VIEWER_SELECTED_ELEMENTS,
  GET_RBIM_ALL_ELEMENTS,
  GET_RBIM_SELECTED_ELEMENTS
} from './constants';

export const getters: GetterTree<ViewerState, RootState> = {
  [GET_VIEWER_INITIALISED](state): boolean {
    return state.isViewerInitialised;
  },
  [GET_IFCIDS](state): [] {
    return state.ifcIds;
  },
  [GET_VIEWER_SELECTED_ELEMENTS](state): [] {
    return state.selectedDbids;
  },
  [GET_RBIM_ALL_ELEMENTS](state): GroupedBimElements {
    return state.rbimAllElements;
  },
  [GET_RBIM_SELECTED_ELEMENTS](state): GroupedBimElements {
    return state.rbimSelectedElements;
  }
};
