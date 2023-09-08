/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   See License in the LICENSE file
 */

import { GetterTree } from 'vuex';
import { RootState } from '../types';
import * as CONSTANTS from './constants';

import {
  Location,
  Participant,
  Project,
  ProjectFile,
  ProjectsPicture,
  ProjectsState,
  Project3dScanConfig,
  AutodeskAccessToken,
  Element,
  ElementType,
  ElementsFilterResponse,
  ClassificationEntry,
  ClassificationSystem,
  PropertyType,
  PointOfInterest,
  MaterialType,
  Circularity,
  CircularityAnalysis,
  MaterialTypesAnalysis,
  ElementTypesAnalysis,
  FilterQuery,
  ElementTypesFilterResponse,
  ElementsMaterialsReuseQuantity,
} from './types';

export const getters: GetterTree<ProjectsState, RootState> = {

  // --- PROJECTS ---

  [CONSTANTS.GET_PROJECTS](state): Project[] | null {
    return state.allProjects;
  },

  [CONSTANTS.GET_CURRENT_PROJECT](state): Project | null {
    return state.currentProject;
  },

  [CONSTANTS.GET_PROJECT_TAB_INDEX](state): number {
    return state.tabIndex;
  },

  [CONSTANTS.GET_PROJECTS_PICTURE](state): ProjectsPicture {
    return state.projectsPicture;
  },
  
  [CONSTANTS.GET_CURRENT_PROJECT_FILES](state): ProjectFile[] {
    return state.currentProjectFiles;
  },

  // --- PARTICIPANTS ---

  [CONSTANTS.GET_CURRENT_PROJECT_PARTICIPANTS](state): Participant[] {
    return state.currentProjectParticipants;
  },

  // --- LOCATIONS ---
  [CONSTANTS.GET_CURRENT_PROJECT_LOCATIONS](state): Location[] {
    return state.currentProjectLocations;
  },

  // --- SCAN ---

  [CONSTANTS.GET_PROJECT_3D_SCAN_CONFIG](state): Project3dScanConfig {
    return state.currentProject3dScanConfig;
  },

  [CONSTANTS.GET_POINTS_OF_INTEREST](state): PointOfInterest[] {
    return state.pointsOfInterest;
  },
  // --- INVENTORY --- 

  [CONSTANTS.GET_INVENTORY_FILTER_ACTIVE](state): boolean {
    return state.inventoryFilterActive;
  },

  [CONSTANTS.GET_AUTODESK_ACCESS_TOKEN](state): AutodeskAccessToken {
    return state.autodeskAccessToken;
  },

  // --- ELEMENT TYPE ---

  [CONSTANTS.GET_ELEMENT_TYPES](state): ElementType[] {
    return state.elementTypes;
  },

  [CONSTANTS.GET_ELEMENT_TYPES_FILTERED](state): ElementTypesFilterResponse {
    return state.elementTypesFilterResponse;
  },

  [CONSTANTS.GET_ELEMENT_TYPE_SELECTED](state): ElementType {
    return state.elementTypeSelected;
  },

  [CONSTANTS.GET_ELEMENT_TYPES_ANALYSIS](state): ElementTypesAnalysis {
    return state.elementTypesAnalysis;
  },

  [CONSTANTS.GET_ELEMENT_TYPES_FILTER](state): FilterQuery {
    return state.elementTypesFilter;
  },

  // --- CLASSIFCATIONS ---

  [CONSTANTS.GET_CLASSIFICATION_SYSTEMS](state): ClassificationSystem[] {
    return state.classificationSystems;
  },

  [CONSTANTS.GET_CLASSIFICATION_ENTRIES](state): ClassificationEntry[] {
    return state.classificationEntries;
  },

  // --- MATERIAL TYPE ---

  [CONSTANTS.GET_MATERIAL_TYPES](state): MaterialType[] {
    return state.materialTypes;
  },

  [CONSTANTS.GET_MATERIAL_TYPES_ANALYSIS](state): MaterialTypesAnalysis {
    return state.materialTypesAnalysis;
  },

  [CONSTANTS.GET_MATERIAL_TYPE_SELECTED](state): MaterialType {
    return state.materialTypeSelected;
  },

  // --- ELEMENT --- 

  [CONSTANTS.GET_ELEMENTS](state): Element[] {
    return state.elements;
  },

  [CONSTANTS.GET_ELEMENTS_FILTERED](state): ElementsFilterResponse {
    return state.elementsFilterResponse;
  },

  [CONSTANTS.GET_ELEMENT_SELECTED](state): Element {
    return state.elementSelected;
  },
  
  [CONSTANTS.GET_ELEMENTS_FILTER](state): FilterQuery {
    return state.elementsFilter;
  },

  [CONSTANTS.GET_ELEMENTS_MATERIALS_REUSE_SUMMARY](state): ElementsMaterialsReuseQuantity[] {
    return state.elementsMaterialsReuseSummary;
  },

  // --- PROPERTIES ---

  [CONSTANTS.GET_PROPERTY_TYPES](state): PropertyType[] {
    return state.propertyTypes;
  },

  // --- CIRCULARITIES ---

  [CONSTANTS.GET_CIRCULARITY_SELECTED](state): Circularity {
    return state.circularitySelected;
  },
  
  [CONSTANTS.GET_CIRCULARITY_SELECTED_DOCUMENTS](state): ProjectFile[] {
    return state.circularitySelectedDocuments;
  },

  [CONSTANTS.GET_AGGREGATED_CIRCULARITIES](state): Circularity[] {
    return state.aggregatedCircularities;
  },

  [CONSTANTS.GET_CIRCULARITY_ANALYSIS_ELEMENTS](state): CircularityAnalysis {
    return state.analysisCircularityElements;
  },

};
