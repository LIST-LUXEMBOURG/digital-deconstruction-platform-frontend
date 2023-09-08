/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   See License in the LICENSE file
 */

import { MutationTree } from 'vuex';
import { AutodeskAccessToken } from '.';
import * as CONSTANTS from './constants';
import {
  Location,
  Participant,
  Project,
  ProjectFile,
  ProjectsState,
  Project3dScanConfig,
  ElementType,
  MaterialType,
  ClassificationSystem,
  ClassificationEntriesResponse,
  PropertyType,
  Circularity,
  CircularityAnalysis,
  ElementTypesAnalysis,
  MaterialTypesAnalysis,
  ElementTypeAnalysis,
  MaterialTypeAnalysis,
  Element,
  ElementsFilterResponse,
  FilterQuery,
  ElementsMaterialsReuseQuantity,
  ElementTypesFilterResponse
} from './types';

export const mutations: MutationTree<ProjectsState> = {

  // --- PROJECTS ---

  [CONSTANTS.SET_PROJECTS](state, projects: Project[]) {
    state.allProjects = projects.sort((a, b) => {
      if (typeof a.createdAt === 'string') {
        let b_date = new Date(b.createdAt as string);
        let a_date = new Date(a.createdAt as string);
        return b_date.getTime() - a_date.getTime();
      }
      return 0;
    });
  },

  [CONSTANTS.SET_CURRENT_PROJECT](state, project: Project) {
    state.currentProject = project;
    state.tabIndex = 0;
    state.inventoryFilterActive = false;
    state.autodeskAccessToken = {} as AutodeskAccessToken;
  },

  [CONSTANTS.SET_PROJECT_PICTURE](state, { projectId, picture }) {
    state.projectsPicture[projectId] = picture;
  },

  [CONSTANTS.SET_CURRENT_PROJECT_FILES](state, files: ProjectFile[]) {
    state.currentProjectFiles = files;
  },

  [CONSTANTS.SET_PROJECT_TAB_INDEX](state, index: number) {
    state.tabIndex = index;
  },

  // --- PARTICIPANTS ---

  [CONSTANTS.SET_CURRENT_PROJECT_PARTICIPANTS](state, participants: Participant[]) {
    state.currentProjectParticipants = participants;
  },

  // --- LOCATIONS ---
  [CONSTANTS.SET_CURRENT_PROJECT_LOCATIONS](state, locations: Location[]) {
    state.currentProjectLocations = locations;
  },

  // --- SCAN ---

  [CONSTANTS.SET_PROJECT_3D_SCAN_CONFIG](state, scan3dConfig: Project3dScanConfig) {
    state.currentProject3dScanConfig = scan3dConfig;
  },

  [CONSTANTS.SET_POINTS_OF_INTEREST](state, payload: any) {
    state.pointsOfInterest = payload.data;
  },

  // --- INVENTORY ---

  [CONSTANTS.SET_AUTODESK_ACCESS_TOKEN](state, accessToken: AutodeskAccessToken) {
    state.autodeskAccessToken = accessToken;
  },

  [CONSTANTS.SET_INVENTORY_FILTER_ACTIVE](state, payload: boolean) {
    state.inventoryFilterActive = payload;
  },

  // --- ELEMENT TYPES ---

  [CONSTANTS.SET_ELEMENT_TYPES](state, elementTypes: ElementType[]) {
    state.elementTypes = elementTypes;
  },

  [CONSTANTS.SET_ELEMENT_TYPES_FILTERED](state, elementTypesFilterResponse: ElementTypesFilterResponse) {
    state.elementTypesFilterResponse = elementTypesFilterResponse;
  },

  [CONSTANTS.INSERT_ELEMENT_TYPE](state, elementType: ElementType) {
    state.elementTypes.push(elementType);
  },
  
  [CONSTANTS.INSERT_ELEMENT_TYPE_FILTERED](state, elementType: ElementType) {
    state.elementTypesFilterResponse.data.push(elementType);
    state.elementTypesFilterResponse.totalCount++;
    state.elementTypesFilterResponse.count++;
  },

  [CONSTANTS.REPLACE_ELEMENT_TYPE](state, elementType: ElementType) {
    let index = state.elementTypes?.findIndex(item => item.uid === elementType.uid);
    if (index > -1) state.elementTypes.splice(index, 1, elementType);
  },

  [CONSTANTS.REPLACE_ELEMENT_TYPE_FILTRED](state, elementType: ElementType) {
    let index = state.elementTypesFilterResponse?.data.findIndex(item => item.uid === elementType.uid);
    if (index > -1) state.elementTypesFilterResponse.data.splice(index, 1, elementType);
  },

  [CONSTANTS.REMOVE_ELEMENT_TYPE](state, uid: string) {
      let index = state.elementTypes?.findIndex(item => item.uid === uid);
      if (index > -1) state.elementTypes.splice(index, 1);
  },
  
  [CONSTANTS.REMOVE_ELEMENT_TYPE_FILTERED](state, uid: string) {
    let index = state.elementTypesFilterResponse?.data.findIndex(item => item.uid === uid);
    if (index > -1) {
      state.elementTypesFilterResponse.data.splice(index, 1);
      state.elementTypesFilterResponse.totalCount--;
      state.elementTypesFilterResponse.count--;
    }
  },

  [CONSTANTS.SET_ELEMENT_TYPE_SELECTED](state, elementType: ElementType) {
    state.elementTypeSelected = elementType;
  },

  [CONSTANTS.INSERT_ELEMENT_TYPE_IMAGE_SELECTED](state, document: ProjectFile) {
    if (state.elementTypeSelected && state.elementTypeSelected.files) {
      let index = state.elementTypeSelected.files?.findIndex(item => item.uid === document.uid);
      if (index > -1) {
        // remove and add the "same" value as a new entry
        state.elementTypeSelected.files?.splice(index, 1);
      }
      // this triggers VUE reactivity
      state.elementTypeSelected.files.push(document);
    }
  },

  [CONSTANTS.REMOVE_ELEMENT_TYPE_IMAGE_SELECTED](state, document: ProjectFile) {
    if (state.elementTypeSelected && state.elementTypeSelected.files) {
      const newFiles = state.elementTypeSelected.files.filter(el => el.uid !== document.uid);
      // this triggers VUE reactivity
      state.elementTypeSelected.files = newFiles;
    }
  },

  [CONSTANTS.SET_ELEMENT_TYPES_ANALYSIS](state, elementTypesAnalysis: ElementTypesAnalysis) {
    state.elementTypesAnalysis = elementTypesAnalysis;
  },

  [CONSTANTS.INSERT_ELEMENT_TYPE_ANALYSIS](state, elementType: ElementType) {
    state.elementTypesAnalysis.types.push({ 
      ...elementType,
      count: 0, 
      averageReusePotential: 0.0, 
      maxReusePotential: 0.0, 
      minReusePotential: 0.0 
    } as ElementTypeAnalysis);
  },

  [CONSTANTS.REPLACE_ELEMENT_TYPE_ANALYSIS](state, elementType: ElementType) {
    if (state.elementTypesAnalysis && state.elementTypesAnalysis.types) {
      let elementTypeAnalysis = state.elementTypesAnalysis.types.find(item => item.uid === elementType.uid);
      if (elementTypeAnalysis) {
        let index = state.elementTypesAnalysis.types.findIndex(item => item.uid === elementType.uid);
        state.elementTypesAnalysis.types.splice(index, 1, { ...elementTypeAnalysis, ...elementType } as ElementTypeAnalysis);
        // force triggers vuex reactivity
        state.elementTypesAnalysis.types.push();
      }
    }
  },

  [CONSTANTS.REMOVE_ELEMENT_TYPE_ANALYSIS](state, uid: string) {
    if (state.elementTypesAnalysis && state.elementTypesAnalysis.types) {
      let index = state.elementTypesAnalysis.types.findIndex(item => item.uid === uid);
      if (index > -1) state.elementTypesAnalysis.types.splice(index, 1);
    }
  },

  [CONSTANTS.SET_ELEMENT_TYPES_FILTER](state, filterQuery: FilterQuery) {
    state.elementTypesFilter = filterQuery;
  },
  
  // --- CLASSIFICATIONS --- 

  [CONSTANTS.SET_CLASSIFICATION_SYSTEMS](state, classificationSystems: ClassificationSystem[]) {
    state.classificationSystems = classificationSystems;
  },

  [CONSTANTS.SET_CLASSIFICATION_ENTRIES](state, classificationEntriesResponse: ClassificationEntriesResponse) {
    state.classificationEntries = classificationEntriesResponse.data;
  },

  // --- MATERIAL TYPES ---
 
  [CONSTANTS.SET_MATERIAL_TYPES](state, materialTypes: MaterialTypesAnalysis,) {
    state.materialTypes = materialTypes.materials; // TO DO - update on new route
  }, 

  [CONSTANTS.INSERT_MATERIAL_TYPE](state, materialType: MaterialType) {
    state.materialTypes.push(materialType);
  },

  [CONSTANTS.REPLACE_MATERIAL_TYPE](state, materialType: MaterialTypeAnalysis) {
    let index = state.materialTypes?.findIndex(item => item.uid === materialType.uid);
    if (index > -1) state.materialTypes.splice(index, 1, materialType);
  },

  [CONSTANTS.REMOVE_MATERIAL_TYPE](state, uid: string) {
    let index = state.materialTypes?.findIndex(item => item.uid === uid);
    if (index > -1) state.materialTypes.splice(index, 1);
  },

  [CONSTANTS.SET_MATERIAL_TYPE_SELECTED](state, payload: MaterialType) {
    state.materialTypeSelected = payload;
  },

  [CONSTANTS.SET_MATERIAL_TYPES_ANALYSIS](state, materialTypesAnalysis: MaterialTypesAnalysis,) {
    state.materialTypesAnalysis = materialTypesAnalysis;
  },

  [CONSTANTS.INSERT_MATERIAL_TYPE_ANALYSIS](state, materialType: MaterialType) {
    state.materialTypesAnalysis.materials.push({ 
      ...materialType,
      count: 0, 
      totalVolume: 0.0, 
      totalMass: 0.0,
    } as MaterialTypeAnalysis);
  },

  [CONSTANTS.REPLACE_MATERIAL_TYPE_ANALYSIS](state, materialType: MaterialType) {
    if (state.materialTypesAnalysis && state.materialTypesAnalysis.materials) {
      let materialTypeAnalysis = state.materialTypesAnalysis.materials.find(item => item.uid === materialType.uid);
      if (materialTypeAnalysis) {
        let index = state.materialTypesAnalysis.materials.findIndex(item => item.uid === materialType.uid);
        state.materialTypesAnalysis.materials.splice(index, 1, { ...materialTypeAnalysis, ...materialType } as MaterialTypeAnalysis);
        // force triggers vuex reactivity
        state.materialTypesAnalysis.materials.push();
      }
    }
  },

  [CONSTANTS.REMOVE_MATERIAL_TYPE_ANALYSIS](state, uid: string) {
    if (state.materialTypesAnalysis && state.materialTypesAnalysis.materials) {
      let index = state.materialTypesAnalysis.materials.findIndex(item => item.uid === uid);
      if (index > -1) state.materialTypesAnalysis.materials.splice(index, 1);
    }
  },

  // --- ELEMENTS ---

  [CONSTANTS.SET_ELEMENTS](state, elements: Element[]) {
    state.elements = elements;
  },

  [CONSTANTS.SET_ELEMENTS_FILTERED](state, elementsFilterResponse: ElementsFilterResponse) {
    state.elementsFilterResponse = elementsFilterResponse;
  },

  [CONSTANTS.SET_ELEMENTS_SELECTION](state, elementsSelection: Element[]) {
    state.elementsSelection = elementsSelection;
  },

  [CONSTANTS.INSERT_ELEMENT](state, element: Element) {
     state.elementsFilterResponse.data.push(element);
  },

  [CONSTANTS.REPLACE_ELEMENT](state, element: Element) {
    const index = state.elementsFilterResponse.data.findIndex(
      item => item.uid === element.uid,
    );
    state.elementsFilterResponse.data.splice(index, 1, element);
  },

  [CONSTANTS.REMOVE_ELEMENT](state, uid: string) {
    let index = state.elementsFilterResponse?.data.findIndex(item => item.uid === uid);
    if (index > -1) state.elementsFilterResponse.data.splice(index, 1);
  },

  [CONSTANTS.SET_ELEMENT_SELECTED](state, element: Element) {
    state.elementSelected = element;
  },

  [CONSTANTS.INSERT_ELEMENT_IMAGE_TYPE_SELECTED](state, document: ProjectFile) {
    if (state.elementSelected.elementType.files) {
      let index = state.elementSelected.elementType.files.findIndex(item => item.uid === document.uid);
      if (index > -1) {
        state.elementSelected.elementType.files.splice(index, 1);
      }
      state.elementSelected.elementType.files.push(document);
    }
  },

  [CONSTANTS.SET_ELEMENTS_FILTER](state, filterQuery: FilterQuery) {
    state.elementsFilter = filterQuery;
  },

  [CONSTANTS.SET_ELEMENTS_MATERIALS_REUSE_SUMMARY](state, elementsMaterialsReuseSummary: ElementsMaterialsReuseQuantity[]) {
    state.elementsMaterialsReuseSummary = elementsMaterialsReuseSummary;
  },

  // --- PROPERTIES ---

  [CONSTANTS.SET_PROPERTY_TYPES](state, propertyTypes: any) {
    state.propertyTypes = propertyTypes.data;
  },

  [CONSTANTS.INSERT_PROPERTY_TYPE](state, propertyType: PropertyType) {
    state.propertyTypes.push(propertyType);
  },
  
  // --- CIRCULARITIES ---

  [CONSTANTS.SET_CIRCULARITY_SELECTED](state, circularity: Circularity) {
    state.circularitySelected = circularity;
  },

  [CONSTANTS.SET_CIRCULARITY_SELECTED_DOCUMENTS](state, circularityDocuments: ProjectFile[]) {
    state.circularitySelectedDocuments = circularityDocuments;
  },
  
  [CONSTANTS.SET_AGGREGATED_CIRCULARITIES](state, payload: Circularity[]) {
    state.aggregatedCircularities = payload;
  },

  [CONSTANTS.SET_CIRCULARITY_ANALYSIS_ELEMENTS](state, payload: CircularityAnalysis) {
    state.analysisCircularityElements = payload;
  },

};
