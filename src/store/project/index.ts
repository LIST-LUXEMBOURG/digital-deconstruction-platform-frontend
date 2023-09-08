/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   See License in the LICENSE file
 */

import { Module } from 'vuex';
import { RootState } from '../types';
import { actions } from './actions';
import { getters } from './getters';
import { mutations } from './mutations';

import {
  Project,
  Project3dScanConfig,
  ProjectsState,
  AutodeskAccessToken,
  ElementType,
  Element,
  ClassificationSystem,
  ClassificationEntry,
  PropertyType,
  PointOfInterest,
  ElementsFilterResponse,
  MaterialType,
  CircularityAnalysis,
  ElementTypesAnalysis,
  MaterialTypesAnalysis,
  Circularity,
  FilterQuery,
  ElementsMaterialsReuseQuantity,
  CircularityResultElement,
  MaterialTypeAnalysis,
  ElementTypesFilterResponse
} from './types';

export const state: ProjectsState = {
  // projects
  allProjects: [],
  projectsPicture: {},
  tabIndex: 0,
  currentProject: {} as Project,
  currentProjectParticipants: [],
  currentProjectLocations: [],
  currentProjectFiles: [],
  // elements
  elements: [] as Element[],
  elementsFilter: { size: 10, offset: 0, selects:{}, conditions:{} } as FilterQuery,
  elementsFilterResponse: {} as ElementsFilterResponse,
  elementsSelection: [] as Element[],
  elementSelected: {} as Element,
  elementsMaterialsReuseSummary: [] as ElementsMaterialsReuseQuantity[],
  // element types
  elementTypes: [],
  elementTypesFilter: { size: 10, offset: 0, selects:{}, conditions:{} } as FilterQuery,
  elementTypesFilterResponse: {} as ElementTypesFilterResponse,
  elementTypeSelected: {} as ElementType,
  elementTypesAnalysis: {} as ElementTypesAnalysis,
  // classifications
  classificationSystems: {} as ClassificationSystem[],
  classificationEntries: {} as ClassificationEntry[],
  // material types
  materialTypes: [] as MaterialType[],
  materialTypeSelected: {} as MaterialType,
  materialTypesAnalysis: { materials: [] as MaterialTypeAnalysis[], overallMass: 0, overallVolume: 0 } as MaterialTypesAnalysis,
  // circularities
  circularitySelected: {} as Circularity,
  circularitySelectedDocuments: [],
  aggregatedCircularities: [],
  analysisCircularityElements: { results: [] as CircularityResultElement[] } as CircularityAnalysis,
  // other
  inventoryFilterActive: false,
  propertyTypes: {} as PropertyType[],
  pointsOfInterest: [] as PointOfInterest[],
  currentProject3dScanConfig: {} as Project3dScanConfig,
  autodeskAccessToken: {} as AutodeskAccessToken,
};

export const namespaced: boolean = false;

export const projectsModule: Module<ProjectsState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};

export * from './constants';
export * from './types';
