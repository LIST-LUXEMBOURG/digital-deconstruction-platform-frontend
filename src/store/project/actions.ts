/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   See License in the LICENSE file
 */

import { $http } from '@/main';
import { ActionTree } from 'vuex';
import { createImageAsync } from '../../utils';
import { LOG_OUT } from '../auth';
import { ADD_NOTIFICATION } from '../notifications';
import { RootState } from '../types';
import * as CONSTANTS from './constants';
import {
  Project,
  Project3dScanConfig,
  ProjectsState,
  PropertyType,
  ElementTypeCreate,
  ElementTypeUpdate,
  ElementTypeDelete,
  ElementTypeFileUpload,
  ElementTypeFileDownloadDelete,
  ClassificationEntryQuery,
  MaterialTypeCreate,
  MaterialType,
  MaterialTypeUpdate,
  MaterialTypeDelete,
  ElementsFilterResponse,
  ElementCreate,
  ElementUpdate,
  ElementDelete,
  CircularityCreate,
  CircularityUpdate,
  CircularityDelete,
  CircularityFileUploadUpdate,
  ElementsMaterialsReuseQuantity,
  ElementTypesFilterResponse,

} from './types';

export const actions: ActionTree<ProjectsState, RootState> = {

  // --- PROJECTS 

  async [CONSTANTS.ADD_PROJECT]({ dispatch, commit }, project: Project): Promise<void> {
    try {
      delete project.id;
      delete project.createdAt;
      delete project.createdBy;

      const newProject = await $http.projects.create(project);
      commit(CONSTANTS.SET_CURRENT_PROJECT, newProject);

      commit(ADD_NOTIFICATION, {
        message: 'projectCreated',
        color: 'success',
      });
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.FETCH_PROJECTS]({ dispatch, commit }) {
    try {
      commit(CONSTANTS.SET_PROJECTS, await $http.projects.listProjects());
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.FETCH_ONE_PROJECT]({ dispatch, commit }, projectId: number) {
    try {
      const project = await $http.projects.getOneProject(projectId);
      commit(CONSTANTS.SET_CURRENT_PROJECT, project);
      commit(CONSTANTS.SET_PROJECT_TAB_INDEX, 0);
      dispatch(CONSTANTS.FETCH_PARTICIPANTS_LIST_FROM_CURRENT_PROJECT, projectId);
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.DELETE_PROJECT]({ dispatch, commit }, projectId: number) {
    try {
      await $http.projects.deleteProject(projectId);

      commit(ADD_NOTIFICATION, {
        message: 'projectDeleted',
        color: 'success',
      });
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.UPDATE_PROJECT]({ dispatch, commit }, updatedProject: Project) {
    try {
      delete updatedProject.createdAt;
      delete updatedProject.createdBy;
      const { id, ...remaining } = updatedProject;
      const project = await $http.projects.updateProject(id, remaining);
      commit(CONSTANTS.SET_CURRENT_PROJECT, project);
      commit(ADD_NOTIFICATION, {
        message: 'projectUpdated',
        color: 'success',
      });
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  // project images
  async [CONSTANTS.UPLOAD_PROJECT_PICTURE]({ dispatch, commit }, payload) {
    const { projectId, file, metadata } = payload;
    try {
      const result = await $http.projects.uploadProjectFile(
        projectId,
        file,
        metadata,
      );

      if (result !== undefined) {
        await dispatch(CONSTANTS.FETCH_PROJECT_PICTURE, projectId);
        commit(ADD_NOTIFICATION, {
          message: `projectPictureUploaded`,
          color: 'success',
        });
      } else {
        commit(ADD_NOTIFICATION, {
          message: `projectPictureUploaded`,
          color: 'error',
        });
      }
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.FETCH_PROJECT_PICTURE]({ dispatch, commit }, projectId) {
    try {
      const result = await $http.projects.fetchProjectPicture(projectId, {
        title: 'cover',
      });
      let picture = null;
      if (result !== null) picture = await createImageAsync(result);

      commit(CONSTANTS.SET_PROJECT_PICTURE, { projectId, picture });
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.DELETE_PROJECT_PICTURE]({ dispatch, commit }, projectId) {
    try {
      await $http.projects.deleteProjectFile(projectId, { title: 'cover' });
      commit(CONSTANTS.SET_PROJECT_PICTURE, { projectId, picture: null });
      commit(ADD_NOTIFICATION, {
        message: `projectPictureDeleted`,
        color: 'success',
      });
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  // project files

  async [CONSTANTS.UPLOAD_PROJECT_FILE]({ dispatch, commit }, payload) {
    const { projectId, file, metadata } = payload;
    try {
      const result = await $http.projects.uploadProjectFile(
        projectId,
        file,
        metadata,
      );
      dispatch(CONSTANTS.LIST_PROJECT_FILES, projectId);

      commit(ADD_NOTIFICATION, {
        message: `fileAddedToProject`,
        color: 'success',
      });

      return result;
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.UPDATE_PROJECT_FILE]({ dispatch, commit }, payload) {
    const { projectId, file, metadata } = payload;
    try {
      const result = await $http.projects.updateProjectFile(
        projectId,
        file,
        metadata,
      );
      dispatch(CONSTANTS.LIST_PROJECT_FILES, projectId);

      commit(ADD_NOTIFICATION, {
        message: `fileUpdatedInProject`,
        color: 'success',
      });
      return result;
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.DELETE_PROJECT_FILE]({ dispatch, commit }, { projectId, documentId }) {
    try {
      await $http.projects.deleteProjectDocument(projectId,  documentId);
      dispatch(CONSTANTS.LIST_PROJECT_FILES, projectId);
      commit(ADD_NOTIFICATION, {
        message: `projectDocumentDeleted`,
        color: 'success',
      });
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.LIST_PROJECT_FILES]({ dispatch, commit }, projectId) {
    try {
      const projectFiles = await $http.projects.fetchProjectFiles(projectId);
      if (projectFiles) commit(CONSTANTS.SET_CURRENT_PROJECT_FILES, projectFiles.data);
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
      commit(CONSTANTS.SET_CURRENT_PROJECT_FILES, undefined);
    }
  },

  async [CONSTANTS.DOWNLOAD_PROJECT_FILE](
    { dispatch, commit },
    { projectId, fileId, fileName },
  ) {
    try {
      return await $http.projects.downloadProjectFile(
        projectId,
        fileId,
        fileName,
      );
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.GET_PROJECT_FILE]({ dispatch, commit }, { projectId, fileId }) {
    try {
      return await $http.projects.getProjectFile(projectId, fileId);
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },


  // --- PARTICIPANTS ---

  async [CONSTANTS.ADD_PARTICIPANT_TO_PROJECT](
    { dispatch, commit },
    particpantPayload: any,
  ) {
    try {
      const { userId, projectId, role } = particpantPayload;
      await $http.projects.addParticipant(userId, projectId, role);

      await dispatch(CONSTANTS.FETCH_PARTICIPANTS_LIST_FROM_CURRENT_PROJECT, projectId);

      commit(ADD_NOTIFICATION, {
        message: `participantAddedToProject`,
        color: 'success',
      });
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.UPDATE_PARTICIPANT_FROM_PROJECT](
    { dispatch, commit },
    particpantPayload: any,
  ) {
    try {
      const { userId, projectId, role } = particpantPayload;
      await $http.projects.updateParticipant(userId, projectId, role);

      await dispatch(CONSTANTS.FETCH_PARTICIPANTS_LIST_FROM_CURRENT_PROJECT, projectId);

      commit(ADD_NOTIFICATION, {
        message: `participantUpdatedInProject`,
        color: 'success',
      });
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.REMOVE_PARTICIPANT_FROM_PROJECT](
    { dispatch, commit },
    particpantPayload: any,
  ) {
    try {
      const { userId, projectId } = particpantPayload;
      await $http.projects.removeParticipant(userId, projectId);

      await dispatch(CONSTANTS.FETCH_PARTICIPANTS_LIST_FROM_CURRENT_PROJECT, projectId);

      commit(ADD_NOTIFICATION, {
        message: `participantRemovedFromProject`,
        color: 'success',
      });
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.FETCH_PARTICIPANTS_LIST_FROM_CURRENT_PROJECT](
    { dispatch, commit },
    projectId: number,
  ) {
    try {
      commit(
        CONSTANTS.SET_CURRENT_PROJECT_PARTICIPANTS,
        await $http.projects.listParticipants(projectId),
      );
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  // --- LOCATIONS ---

  async [CONSTANTS.FETCH_LOCATIONS_FROM_CURRENT_PROJECT](
    { dispatch, commit },
    projectId,
  ) {
    try {
      commit(
        CONSTANTS.SET_CURRENT_PROJECT_LOCATIONS,
        await $http.projects.listProjectLocations(projectId),
      );
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.ADD_LOCATION_TO_PROJECT]({ dispatch, commit }, locationPayload) {
    try {
      await $http.projects.addLocationToProject(locationPayload);

      commit(ADD_NOTIFICATION, {
        message: `locationAddedToProject`,
        color: 'success',
      });

      commit(
        CONSTANTS.SET_CURRENT_PROJECT_LOCATIONS,
        await $http.projects.listProjectLocations(locationPayload.projectId),
      );
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.REMOVE_LOCATION_FROM_PROJECT]({ dispatch, commit }, locationPayload) {
    try {
      await $http.projects.deleteLocationFromProject(locationPayload);

      commit(ADD_NOTIFICATION, {
        message: `locationRemovedFromProject`,
        color: 'success',
      });

      commit(
        CONSTANTS.SET_CURRENT_PROJECT_LOCATIONS,
        await $http.projects.listProjectLocations(locationPayload.projectId),
      );
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.UPDATE_LOCATION_FROM_PROJECT]({ dispatch, commit }, locationPayload) {
    try {
      await $http.projects.updateLocationFromProject(locationPayload);

      commit(
        CONSTANTS.SET_CURRENT_PROJECT_LOCATIONS,
        await $http.projects.listProjectLocations(locationPayload.projectId),
      );

      commit(ADD_NOTIFICATION, {
        message: `locationUpdatedFromProject`,
        color: 'success',
      });
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  // --- SCAN ---

  async [CONSTANTS.FETCH_PROJECT_3D_SCAN_CONFIG]({ dispatch, commit }, { projectId }) {
    try {
      let scanConfigs = await $http.projects.getProject3dScanConfig(projectId);
      if (scanConfigs) {
        if (scanConfigs[0]) commit(CONSTANTS.SET_PROJECT_3D_SCAN_CONFIG, scanConfigs[0]);
        else commit(CONSTANTS.SET_PROJECT_3D_SCAN_CONFIG, {});
      }
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.CREATE_PROJECT_3D_SCAN_CONFIG](
    { dispatch, commit },
    scan3dConfig: Project3dScanConfig,
  ) {
    try {
      const { projectId } = scan3dConfig;
      await $http.projects.createProject3dScanConfig(scan3dConfig);
      await dispatch(CONSTANTS.FETCH_PROJECT_3D_SCAN_CONFIG, { projectId: projectId });
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.UPDATE_PROJECT_3D_SCAN_CONFIG](
    { dispatch, commit },
    scan3dConfig: Project3dScanConfig,
  ) {
    try {
      console.log("data scan config:", scan3dConfig);
      const { projectId } = scan3dConfig;
      await $http.projects.updateProject3dScanConfig(scan3dConfig);
      await dispatch(CONSTANTS.FETCH_PROJECT_3D_SCAN_CONFIG, { projectId: projectId });
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.FETCH_POINTS_OF_INTEREST](
    { dispatch, commit },
    payload,
  ): Promise<ElementsFilterResponse | undefined> {
    const { projectId, query } = payload;
    try {
      const results: ElementsFilterResponse = await $http.projects.fetchPointsOfInterest(
        projectId,
        query,
      );
      commit(CONSTANTS.SET_POINTS_OF_INTEREST, results);
      return results;
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  // --- INVENTORY ---
  
  async [CONSTANTS.FETCH_AUTODESK_ACCESS_TOKEN]({ dispatch, commit }, payload) {
    try {
      const accessToken = await $http.projects.fetchAutodeskAccessToken(
        payload,
      );
      if (accessToken) {
        commit(CONSTANTS.SET_AUTODESK_ACCESS_TOKEN, accessToken);
      }
    } catch (e) {
      // do nothing
    }
  },

  async [CONSTANTS.SAVE_AUTODESK_CREDENTIALS]({ dispatch, commit }, bimModelConfig) {
    try {
      const accessToken = await $http.projects.saveAutodeskCredentials(
        bimModelConfig,
      );
      commit(CONSTANTS.SET_AUTODESK_ACCESS_TOKEN, accessToken);
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.UPLOAD_INVENTORY_FILE]({ dispatch, commit }, payload) {
    const { projectId, file } = payload;
    try {
      const result = await $http.projects.uploadInventoryFile(projectId, file);
      // dispatch(FETCH_INVENTORY_ELEMENTS, projectId)
      if (result) {
        commit(ADD_NOTIFICATION, { message: 'new inventory uploaded', color: 'success'});
        await dispatch(CONSTANTS.FETCH_ELEMENTS_FILTERED);
        await dispatch(CONSTANTS.FETCH_ELEMENT_TYPES_FILTERED);
        await dispatch(CONSTANTS.FETCH_MATERIAL_TYPES, this.getters[CONSTANTS.GET_CURRENT_PROJECT].id);
      }
      return result;
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },
    
  // ERROR HANDLER

  [CONSTANTS.ACTION_HANDLE_ERROR]({dispatch, commit}, error) {
    console.error(error);
    if (error.statusCode === 401 || error.statusCode === 407) {
      dispatch(LOG_OUT, { action: error.messageCode });
    } else {
      commit(ADD_NOTIFICATION, {
        message: error.messageCode,
        data: error.messageData,
        color: 'error',
      });
    }
  },
  
  // --- ELEMENT TYPES ---

  async [CONSTANTS.FETCH_ELEMENT_TYPES]({ dispatch, commit }, projectId) {
    try {
      const elementTypes = await $http.projects.getInventoryElementsTypes(projectId);
      if (elementTypes) commit(CONSTANTS.SET_ELEMENT_TYPES, elementTypes);
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.FETCH_ELEMENT_TYPES_FILTERED]({ dispatch, commit }){
    try {
      const results: ElementTypesFilterResponse = await $http.projects.getInventoryElementsTypesQuery(
        this.getters[CONSTANTS.GET_CURRENT_PROJECT].id,
        this.getters[CONSTANTS.GET_ELEMENT_TYPES_FILTER]);
      commit(CONSTANTS.SET_ELEMENT_TYPES_FILTERED, results);
      return results;
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.CREATE_ELEMENT_TYPE]({ dispatch, commit }, elementTypeCreate: ElementTypeCreate) {
    try {
      const newElementType = await $http.projects.postInventoryElementsTypes(elementTypeCreate);
      if (newElementType) {
        commit(CONSTANTS.INSERT_ELEMENT_TYPE, newElementType);
        commit(CONSTANTS.INSERT_ELEMENT_TYPE_FILTERED, newElementType);
        commit(CONSTANTS.INSERT_ELEMENT_TYPE_ANALYSIS, newElementType);
        commit(ADD_NOTIFICATION, { message: 'ElementType created', color: 'success' });
        return newElementType; // needed for the ElementType creation steps
      }
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.UPDATE_ELEMENT_TYPE]({ dispatch, commit }, elementTypeUpdate: ElementTypeUpdate) {
    try {
      const updatedElementType = await $http.projects.patchInventoryElementsTypes(elementTypeUpdate);
      if (updatedElementType) {
        commit(CONSTANTS.REPLACE_ELEMENT_TYPE, updatedElementType);
        commit(CONSTANTS.REPLACE_ELEMENT_TYPE_ANALYSIS, updatedElementType);
        commit(CONSTANTS.REPLACE_ELEMENT_TYPE_FILTRED, updatedElementType);
        commit(ADD_NOTIFICATION, { message: 'ElementType updated', color: 'success' });
      }
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.DELETE_ELEMENT_TYPE]({ dispatch, commit }, elementTypeDelete: ElementTypeDelete,) {
    try {
      const deletedElementType = await $http.projects.deleteInventoryElementsTypes(elementTypeDelete);
      if (deletedElementType) {
        commit(CONSTANTS.REMOVE_ELEMENT_TYPE, deletedElementType.uid);
        commit(CONSTANTS.REMOVE_ELEMENT_TYPE_ANALYSIS, deletedElementType.uid);
        commit(CONSTANTS.REMOVE_ELEMENT_TYPE_FILTERED, deletedElementType.uid)
        commit(ADD_NOTIFICATION, { message: 'ElementType deleted', color: 'success' });
      }
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.UPLOAD_ELEMENT_TYPE_IMAGE]({ dispatch, commit }, elementTypeFileUpload: ElementTypeFileUpload) {
    try {
      if (elementTypeFileUpload.file.type === "image/png" 
          || elementTypeFileUpload.file.type === "image/jpeg"
          || elementTypeFileUpload.file.type === "image/webp") {
        const uploadFileResponse = await $http.projects.postElementsTypesFiles(elementTypeFileUpload);
        if (uploadFileResponse) {
          dispatch(CONSTANTS.FETCH_ELEMENT_TYPE_IMAGE, { 
            projectId: elementTypeFileUpload.projectId, 
            elementTypeUid: elementTypeFileUpload.elementTypeUid, 
            document: uploadFileResponse
          } as ElementTypeFileDownloadDelete); 
          commit(ADD_NOTIFICATION, { message: `Image uploaded`, color: 'success' });
        } else {
          commit(ADD_NOTIFICATION, { message: `Image upload failed`, color: 'error' });
        } 
      } else {
        commit(ADD_NOTIFICATION, { message: `Wrong file format`, color: 'error' });
      }
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },
  
  async [CONSTANTS.FETCH_ELEMENT_TYPE_IMAGE]({ dispatch, commit }, elementTypeFileDownload: ElementTypeFileDownloadDelete) {
    try {
      const elementTypeFileStream = await $http.projects.getInventoryElementsTypesFilesStream(elementTypeFileDownload);
      if (elementTypeFileStream !== null) {
        elementTypeFileDownload.document.streamedImage = await createImageAsync(elementTypeFileStream);
        commit(CONSTANTS.INSERT_ELEMENT_TYPE_IMAGE_SELECTED, elementTypeFileDownload.document);
      }
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.DELETE_ELEMENT_TYPE_IMAGE]({ dispatch, commit }, elementTypeFileDelete: ElementTypeFileDownloadDelete) {
    try {
      if (elementTypeFileDelete.document.fileType === "image/png" 
          || elementTypeFileDelete.document.fileType === "image/jpeg"
          || elementTypeFileDelete.document.fileType === "image/webp") {
        const deletedDocument = await $http.projects.deleteInventoryElementsTypesFiles(elementTypeFileDelete);
        if (deletedDocument){
          commit(CONSTANTS.REMOVE_ELEMENT_TYPE_IMAGE_SELECTED, deletedDocument);
          commit(ADD_NOTIFICATION, { message: `ElementType picture deleted`, color: 'success' });
        }
      }
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.FETCH_ELEMENT_TYPE_SELECTED]({ dispatch, commit }, elementType: ElementTypeUpdate) {
    try {
      const elementTypeDependencies = await $http.projects.getInventoryElementsTypesDependencies(elementType);
      if (elementTypeDependencies) {
        commit(CONSTANTS.SET_ELEMENT_TYPE_SELECTED, elementTypeDependencies);
        commit(CONSTANTS.SET_CIRCULARITY_SELECTED, elementTypeDependencies.circularity);
      }
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.FETCH_ELEMENT_TYPES_ANALYSIS]({ dispatch, commit }, projectId: number) {
    try {
      const elementTypeAnalysisResponse = await $http.projects.getInventoryElementsAnalysis(projectId);
      if (elementTypeAnalysisResponse) {
        commit(CONSTANTS.SET_ELEMENT_TYPES_ANALYSIS, elementTypeAnalysisResponse);
      }
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  // --- CLASSIFICATIONS --- 

  async [CONSTANTS.FETCH_CLASSIFICATION_SYSTEMS]({ dispatch, commit }) {
    try {
      const result = await $http.core.getClassificationSystems();
      if (result.data) return commit(CONSTANTS.SET_CLASSIFICATION_SYSTEMS, result);
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.FETCH_CLASSIFICATION_ENTRIES]({ dispatch, commit }, classificationEntryQuery: ClassificationEntryQuery) {
    try {
      const classificationEntriesResponse = await $http.core.getClassificationEntries(classificationEntryQuery);
      if (classificationEntriesResponse) {
        commit(CONSTANTS.SET_CLASSIFICATION_ENTRIES, classificationEntriesResponse);
      }
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  // --- MATERIAL TYPES ---

  async [CONSTANTS.FETCH_MATERIAL_TYPES]({ dispatch, commit }, projectId: number) {
    try {
      const materialTypesAnalysis = await $http.projects.getInventoryElementsMaterialsAnalysis(projectId);
      if (materialTypesAnalysis) { // TO DO - update on new route
        commit(CONSTANTS.SET_MATERIAL_TYPES, materialTypesAnalysis);
      }
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.CREATE_MATERIAL_TYPE]({ dispatch, commit }, materialTypeCreate: MaterialTypeCreate) {
    try {
      const newMaterialType = await $http.projects.postInventoryMaterialsTypes(materialTypeCreate);
      if (newMaterialType) {
        commit(CONSTANTS.INSERT_MATERIAL_TYPE, newMaterialType);
        commit(CONSTANTS.INSERT_MATERIAL_TYPE_ANALYSIS, newMaterialType);
        commit(ADD_NOTIFICATION, { message: 'MaterialType created', color: 'success' });
        return newMaterialType;
      }
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.UPDATE_MATERIAL_TYPE]({ dispatch, commit }, materialTypeUpdate: MaterialTypeUpdate) {
    try {
      const updatedMaterialType = await $http.projects.patchInventoryMaterialsTypes(materialTypeUpdate);
      if (updatedMaterialType) {
        commit(CONSTANTS.REPLACE_MATERIAL_TYPE, updatedMaterialType);
        commit(CONSTANTS.REPLACE_MATERIAL_TYPE_ANALYSIS, updatedMaterialType);
        commit(ADD_NOTIFICATION, { message: 'MaterialType updated', color: 'success' });
      }
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },
    
  async [CONSTANTS.DELETE_MATERIAL_TYPE]({ dispatch, commit }, materiaTypeDelete: MaterialTypeDelete) {
    try {
      const deletedMaterialType = await $http.projects.deleteInventoryMaterialsTypes(materiaTypeDelete);
      if (deletedMaterialType) {        
        commit(CONSTANTS.REMOVE_MATERIAL_TYPE, deletedMaterialType.uid);
        commit(CONSTANTS.REMOVE_MATERIAL_TYPE_ANALYSIS, deletedMaterialType.uid);
        commit(ADD_NOTIFICATION, { message: 'MaterialType deleted', color: 'success' });
      }
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.FETCH_MATERIAL_TYPE_SELECTED]({ dispatch, commit }, materialType: MaterialType) {
    try {
      const materialTypeDependencies = await $http.projects.getInventoryMaterialsTypesDependencies(materialType);
      if (materialTypeDependencies) {
        commit(CONSTANTS.SET_MATERIAL_TYPE_SELECTED, materialTypeDependencies);
        commit(CONSTANTS.SET_CIRCULARITY_SELECTED, materialTypeDependencies.circularity);
      }
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.FETCH_MATERIAL_TYPES_ANALYSIS]({ dispatch, commit }, projectId: number) {
    try {
      const materialTypesAnalysis: unknown = await $http.projects.getInventoryElementsMaterialsAnalysis(projectId);
      if (materialTypesAnalysis) {
        commit(CONSTANTS.SET_MATERIAL_TYPES_ANALYSIS, materialTypesAnalysis);
      }
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  // --- ELEMENTS ---

  async [CONSTANTS.FETCH_ELEMENTS]({ dispatch, commit }){
    try {
      // fetches all elements for BIM coloring
      const results: ElementsFilterResponse = await $http.projects.getInventoryElementsIdenfifiers(this.getters[CONSTANTS.GET_CURRENT_PROJECT].id)
      commit(CONSTANTS.SET_ELEMENTS, results.data);
      return results;
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.FETCH_ELEMENTS_FILTERED]({ dispatch, commit }){
    try {
      const results: ElementsFilterResponse = await $http.projects.getInventoryElementsQuery(
        this.getters[CONSTANTS.GET_CURRENT_PROJECT].id,
        this.getters[CONSTANTS.GET_ELEMENTS_FILTER]);
      commit(CONSTANTS.SET_ELEMENTS_FILTERED, results);
      return results;
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.CREATE_ELEMENT]({ dispatch, commit }, elementCreate: ElementCreate) {
    try {
      const newElement = await $http.projects.postInventoryElements(elementCreate);
      if (newElement) {
        commit(CONSTANTS.INSERT_ELEMENT, newElement);
        commit(ADD_NOTIFICATION, { message: 'Element created', color: 'success' });
        return newElement;
      }
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.UPDATE_ELEMENT]({ dispatch, commit }, elementUpdate: ElementUpdate) {
    try {
      const updatedElement = await $http.projects.patchInventoryElements(elementUpdate);
      if (updatedElement) {
        commit(CONSTANTS.REPLACE_ELEMENT, updatedElement);
        commit(ADD_NOTIFICATION, { message: 'Element updated', color: 'success' });
      }
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.DELETE_ELEMENT]({ dispatch, commit }, elementDelete: ElementDelete) {
    try {
      const deletedElement = await $http.projects.deleteInventoryElements(
        this.getters[CONSTANTS.GET_CURRENT_PROJECT].id, // TO DO - clean up,
        elementDelete);
      if (deletedElement) {
        commit(CONSTANTS.REMOVE_ELEMENT, deletedElement.uid);
        commit(ADD_NOTIFICATION, { message: 'Element deleted', color: 'success' });
        return deletedElement;
      }
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.FETCH_ELEMENT_SELECTED]({ dispatch, commit }, elementUpdate: ElementUpdate) {
    try {
      const elementWithDependencies = await $http.projects.getInventoryElementsDependencies(elementUpdate);
      if (elementWithDependencies) {
        commit(CONSTANTS.SET_ELEMENT_SELECTED, elementWithDependencies);
        commit(CONSTANTS.SET_CIRCULARITY_SELECTED, elementWithDependencies.circularities[0]);
        return elementWithDependencies;
      }
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.FETCH_ELEMENT_IMAGE_TYPE_SELECTED]({ dispatch, commit }, elementTypeFileDownload: ElementTypeFileDownloadDelete) {
    try {
      const elementTypeFileStream = await $http.projects.getInventoryElementsTypesFilesStream(elementTypeFileDownload);
      if (elementTypeFileStream !== null) {
        elementTypeFileDownload.document.streamedImage = await createImageAsync(elementTypeFileStream);
        commit(CONSTANTS.INSERT_ELEMENT_IMAGE_TYPE_SELECTED, elementTypeFileDownload.document);
      }
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.FETCH_ELEMENTS_MATERIALS_REUSE_SUMMARY]({ dispatch, commit }) {
    try {
      const results: ElementsMaterialsReuseQuantity[] = await $http.projects.getInventoryElementsSummaryReuseDecision(
        this.getters[CONSTANTS.GET_CURRENT_PROJECT].id);
        if (results) commit(CONSTANTS.SET_ELEMENTS_MATERIALS_REUSE_SUMMARY, results);
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  // --- PROPERTIES ---

  async [CONSTANTS.FETCH_PROPERTY_TYPES]({ dispatch, commit }) {
    try {
      const propertyTypes = await $http.core.getPropertyTypes();
      if (propertyTypes.data) {
        return commit(CONSTANTS.SET_PROPERTY_TYPES, propertyTypes);
      }
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.CREATE_PROPERTY_TYPE]({ dispatch, commit }, propertyType: PropertyType) {
    try {
      const newPropertyType = await $http.core.postPropertyTypes(propertyType);
      if (newPropertyType) {
        commit(CONSTANTS.INSERT_PROPERTY_TYPE, newPropertyType);
        commit(ADD_NOTIFICATION, {message: 'Property created', color: 'success',});
        return newPropertyType;
      }
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  // --- CIRCULARITIES --- 

  async [CONSTANTS.CREATE_ATTACH_CIRCULARITY]({ dispatch, commit }, circularityCreate: CircularityCreate) {
    var newCircularity;
    try {
      const projectId = this.getters[CONSTANTS.GET_CURRENT_PROJECT].id;
      if (circularityCreate.isAttachMaterialType)
        newCircularity = await $http.projects.postInventoryMaterialsTypesCircularity(projectId, circularityCreate);
      else if (circularityCreate.isAttachElementType) 
        newCircularity = await $http.projects.postInventoryElementsTypesCircularity(projectId, circularityCreate);
      else if (circularityCreate.isAttachElement)
        newCircularity = await $http.projects.postInventoryElementsCircularity(projectId, circularityCreate);
      if (newCircularity) {
        commit(ADD_NOTIFICATION, { message: 'Circularity created', color: 'success' });
        // TO DO - commit to store?
        return newCircularity;
      }
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.UPDATE_CIRCULARITY]({ dispatch, commit }, circularityUpdate: CircularityUpdate) {
    try {
      const projectId = this.getters[CONSTANTS.GET_CURRENT_PROJECT].id;
      const updatedCircularity = await $http.projects.patchInventoryCircularity(projectId, circularityUpdate);
      if (updatedCircularity) {
        commit(ADD_NOTIFICATION, { message: 'Circularity updated', color: 'success' });
        return updatedCircularity;
      }
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.DELETE_CIRCULARITY]({ dispatch, commit }, circularityDelete: CircularityDelete)
  {
    try {
      const projectId = this.getters[CONSTANTS.GET_CURRENT_PROJECT].id;
      const deletedCircularity = await $http.projects.deleteInventoryCircularity(projectId, circularityDelete);
      if (deletedCircularity) {
        commit(ADD_NOTIFICATION, { message: 'Circularity deleted', color: 'success' });
        return deletedCircularity;
      }
      // TO DO - something?
      return true;
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.UPLOAD_CIRCULARITY_DOCUMENT]({ dispatch, commit }, circularityFileUpload: CircularityFileUploadUpdate) {
    try {
      const projectId = this.getters[CONSTANTS.GET_CURRENT_PROJECT].id;
      const uploadedCircularityDocument = await $http.projects.postInventoryCircularityFiles(projectId, circularityFileUpload);
      if (uploadedCircularityDocument) {
        commit(ADD_NOTIFICATION, { message: 'Circularity document uploaded', color: 'success' });
        return uploadedCircularityDocument;
      }
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.FETCH_CIRCULARITY_DOCUMENTS]({ dispatch, commit }, circularityDelete: CircularityDelete) {
    try {
      const projectId = this.getters[CONSTANTS.GET_CURRENT_PROJECT].id;
      const circularityDocuments = await $http.projects.getInventoryCircularityFiles(projectId, circularityDelete);
      if (circularityDocuments) {
        commit(CONSTANTS.SET_CIRCULARITY_SELECTED_DOCUMENTS, circularityDocuments);
        return circularityDocuments;
      }
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },
  
  async [CONSTANTS.UPDATE_CIRCULARITY_DOCUMENT]({ dispatch, commit }, payload) 
  {
    const { projectId, circularityUid, file  } = payload;
    try {
      const updated = await $http.projects.patchInventoryCircularityFiles(projectId, circularityUid, file);
      // DO SOMETHING?
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.DOWNLOAD_CIRCULARITY_DOCUMENT]({ dispatch, commit }, payload) 
  {
    const {projectId, circularityUid, fileUid, fileName } = payload
    try {
      return await $http.projects.downloadCircularityDocument(
        projectId,
        circularityUid,
        fileUid,
        fileName
      );
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.DELETE_CIRCULARITY_DOCUMENT]({ dispatch, commit }, payload)
  {
    const { projectId, circularityUid, fileUid  } = payload;
    try {
      const deleted = await $http.projects.deleteCircularityDocument(projectId, circularityUid, fileUid);
      return true;
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

  async [CONSTANTS.FETCH_CIRCULARITY_ANALYSIS_ELEMENTS]({ dispatch, commit }, payload) {
    const { projectId, query } = payload;
    try {
      const result = await $http.projects.fetchCircularityAnalysisElements(
        projectId,
        query
      );

      commit(CONSTANTS.SET_CIRCULARITY_ANALYSIS_ELEMENTS, result);
    } catch (e) {
      dispatch(CONSTANTS.ACTION_HANDLE_ERROR, e);
    }
  },

};
