/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */

import { ActionTree } from 'vuex';
import { RootState } from '../types';
import {
  MATCH_VIEWER_ELEMENTS_IFC,
  SET_VIEWER_SELECTED_ELEMENTS,
  INITIALISE_VIEWER_DATA,
  SET_VIEWER_DBIDS,
  SET_VIEWER_INITIALISED,
  MATCH_VIEWER_ELEMENTS_RBIM_IFC,
  SET_RBIM_SELECTED_ELEMENTS,
  SET_RBIM_ALL_ELEMENTS
} from './constants';
import {
  ViewerState,
} from './types';

export const actions: ActionTree<ViewerState, RootState> = {

  async [MATCH_VIEWER_ELEMENTS_IFC]({ commit, state }, { ifcIds, viewer3d }) {
    let newIdsSelection:any[] = [];
    await viewer3d.model.getBulkProperties(
      state.viewerDbids, 
      { propFilter: ['GLOBALID'], ignoreHidden: true},
      (elements:any) => {
        const promise = Promise.resolve(
          elements.forEach((element:any) => {
              for (var property of element.properties) {
                var found = ifcIds.find((ifcId:string) => ifcId === property.displayValue);
                if (found) {
                  newIdsSelection.push(element.dbId);
                  break;
                }
              }
            }
          )
        );
        promise.then(response => {
          commit(SET_VIEWER_SELECTED_ELEMENTS, newIdsSelection);
          }
        )
      }
    );
  },

  async [MATCH_VIEWER_ELEMENTS_RBIM_IFC]({ commit, state }, { viewer3d, inventory, selectedOnly }) {
    let newRBIMSelection:any[] = [];
    await viewer3d.model.getBulkProperties(
      state.viewerDbids, 
      { propFilter: ['GLOBALID'], ignoreHidden: true},
      (elements:any) => {
        const promise = Promise.resolve(
          elements.forEach((element:any) => {
              for (var property of element.properties) {
                var foundInventoryElement = inventory.find((inventoryElement:any) => inventoryElement.ifcId === property.displayValue);
                if (foundInventoryElement) {
                  if (typeof foundInventoryElement.reusePotential === 'string') {
                    if (foundInventoryElement.reusePotential.includes(','))
                    foundInventoryElement.reusePotential = foundInventoryElement.reusePotential.replace(',', '.');
                    foundInventoryElement.reusePotential = parseFloat(foundInventoryElement.reusePotential as string);
                  }
                  let groupElement = {
                    ifcId: foundInventoryElement.ifcId,
                    reusePotential: foundInventoryElement.reusePotential,
                    reuseGroup: Math.floor(foundInventoryElement.reusePotential * 10),
                    dbIds: element.dbId,
                  };
                  newRBIMSelection.push(groupElement);
                  break;
                }
              }
            }
          )
        );
        promise.then(response => {
            if (selectedOnly === true) {
              commit(SET_RBIM_SELECTED_ELEMENTS, newRBIMSelection);
            } else {
              commit(SET_RBIM_ALL_ELEMENTS, newRBIMSelection);
            } 
          }
        )
      }
    );
  },

  async [INITIALISE_VIEWER_DATA]({ commit }, treeCreatedEventData ) {

    if (treeCreatedEventData) {
      let instanceTree = treeCreatedEventData.model.getData().instanceTree;
      var allDbIdsStr = Object.keys(instanceTree.nodeAccess.dbIdToIndex);
      let dbIds = allDbIdsStr.map(function (id) { return parseInt(id) });
      if (dbIds) {
        commit(SET_VIEWER_DBIDS, dbIds);
        commit(SET_VIEWER_INITIALISED, true);
      }
    }
  },
};