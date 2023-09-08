/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */

import { Module } from 'vuex';
import { ViewerState, BimGroup, colorRange } from './types';
import { RootState } from '../types';

import { actions } from './actions';
import { getters } from './getters';
import { mutations } from './mutations';

export const state: ViewerState = {
  ifcIds: [],
  isViewerInitialised: false,
  viewerDbids: [],
  selectedDbids: [],
  rbimAllElements: { groupBy: BimGroup.ReusePotential },
  rbimSelectedElements: { groupBy: BimGroup.ReusePotential },
};

// https://vuex.vuejs.org/guide/modules.html#namespacing
export const namespaced: boolean = false;

export const viewerModule: Module<ViewerState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};

export * from './constants';
export * from './types';

interface ColorSchema {
  [key: number]: string | THREE.Vector4;
}

function calc(i: number) {
  let value = i > 0 ? i / colorRange : 0;
  value *= 100;
  value = Math.round(value) / 100;
  return value;
}

export const redToGreen = (range: number = colorRange, alpha = 0.9) => {
  let results: ColorSchema = {};
  for (let i = 0; i <= range; i++) {
    const v = calc(i);
    const red = 1 - v; // 1, 0.9, 0.8, 0.7... 0
    const green = 0 + v; // 0, 0.1, 0.2 ... 1
    results[i] = new THREE.Vector4(red, green, 0, alpha);
  }

  return results;
};