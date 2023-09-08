/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   See License in the LICENSE file
 */

// --- PROJECTS ---

export const FETCH_PROJECTS = 'fetchProjects';
export const GET_PROJECTS = 'getProjects';
export const ADD_PROJECT = 'addProject';
export const DELETE_PROJECT = 'deleteProject';
export const UPDATE_PROJECT = 'updateProject';
export const FETCH_ONE_PROJECT = 'fetchOneProject';
export const SET_PROJECTS = 'setProjects';
export const SET_PROJECT_TAB_INDEX = 'setProjectTabIndex';
export const GET_PROJECT_TAB_INDEX = 'getProjectTabIndex';


// project pictures
export const GET_PROJECTS_PICTURE = 'getProjectsPicture';
export const SET_PROJECT_PICTURE = 'setProjectPicture';
export const UPLOAD_PROJECT_PICTURE = 'uploadProjectPicture';
export const FETCH_PROJECT_PICTURE = 'fetchProjectPicture';
export const DELETE_PROJECT_PICTURE = 'deleteProjectPicture';

// project files
export const UPLOAD_PROJECT_FILE = 'uploadProjectFile';
export const UPDATE_PROJECT_FILE = 'updateProjectFile';
export const LIST_PROJECT_FILES = 'getProjectFiles';
export const DELETE_PROJECT_FILE = 'deleteProjectFile';
export const DOWNLOAD_PROJECT_FILE = 'downloadProjectFile';
export const GET_PROJECT_FILE = 'getProjectFile';

// current project
export const GET_CURRENT_PROJECT = 'getCurrentProject';
export const GET_CURRENT_PROJECT_PARTICIPANTS = 'getCurrentProjectParticipants';
export const SET_CURRENT_PROJECT = 'setCurrentProject';
export const SET_CURRENT_PROJECT_FILES = 'setCurrentProjectFiles';
export const GET_CURRENT_PROJECT_FILES = 'getCurrentProjectFiles';

// --- PARTICIPANTS ---

export const ADD_PARTICIPANT_TO_PROJECT = 'addParticipantToProject';
export const REMOVE_PARTICIPANT_FROM_PROJECT = 'removeParticipantToProject';
export const UPDATE_PARTICIPANT_FROM_PROJECT = 'updateParticipantToProject';
export const FETCH_PARTICIPANTS_LIST_FROM_CURRENT_PROJECT =
  'fetchParticipantsListFromCurrentProject';
  export const SET_CURRENT_PROJECT_PARTICIPANTS = 'setCurrentProjectParticipants';

// --- LOCATIONS ---

export const FETCH_LOCATIONS_FROM_CURRENT_PROJECT =
  'fetchLocationsFromCurrentProject';
export const ADD_LOCATION_TO_PROJECT = 'addLocationToProject';
export const REMOVE_LOCATION_FROM_PROJECT = 'removeLocationFromProject';
export const UPDATE_LOCATION_FROM_PROJECT = 'updateLocationFromProject';
export const SET_CURRENT_PROJECT_LOCATIONS = 'setCurrentProjectLocations';
export const GET_CURRENT_PROJECT_LOCATIONS = 'getCurrentProjectLocations';

// --- SCAN ---

export const FETCH_PROJECT_3D_SCAN_CONFIG = 'fetchProject3dScanConfig';
export const CREATE_PROJECT_3D_SCAN_CONFIG = 'createProject3dScanConfig';
export const UPDATE_PROJECT_3D_SCAN_CONFIG = 'updateProject3dScanConfig';
export const FETCH_POINTS_OF_INTEREST='fetchPointsOfIterest';
export const SET_POINTS_OF_INTEREST='setPointsOfIterest';
export const GET_POINTS_OF_INTEREST='getPointsOfIterest';
export const SET_PROJECT_3D_SCAN_CONFIG = 'setProject3dScanConfig';
export const GET_PROJECT_3D_SCAN_CONFIG = 'getProject3dScanConfig';

// --- INVENTORY ---

export const GET_INVENTORY_FILTER_ACTIVE = 'getinventoryFilterActive';
export const SET_INVENTORY_FILTER_ACTIVE = 'setinventoryFilterActive';
export const UPLOAD_INVENTORY_FILE = 'uploadInventoryFile';

export const SAVE_AUTODESK_CREDENTIALS = 'saveAutodeskCredentials';
export const FETCH_AUTODESK_ACCESS_TOKEN = 'fetchAutodeskAccessToken';
export const SET_AUTODESK_ACCESS_TOKEN = 'setAutodeskAccessToken';
export const GET_AUTODESK_ACCESS_TOKEN = 'getAutodeskAccessToken';

// --- ERROR HANDLER ---

export const ACTION_HANDLE_ERROR = 'actionHandleError';

// --- ELEMENTS ---

// element - all elements
export const FETCH_ELEMENTS = 'fetchElements';
export const SET_ELEMENTS = 'setElements';
export const GET_ELEMENTS = 'getElements';

// element - inventory 
export const FETCH_ELEMENTS_FILTERED = 'fetchElementsFiltered';
export const SET_ELEMENTS_FILTERED = 'setElementsFiltered';
export const GET_ELEMENTS_FILTERED = 'getElementsFiltered';
export const CREATE_ELEMENT = 'createElement';
export const INSERT_ELEMENT = 'insertElement';
export const UPDATE_ELEMENT = 'updateElement';
export const REPLACE_ELEMENT = 'replaceElement';
export const DELETE_ELEMENT = 'deleteElement';
export const REMOVE_ELEMENT = 'removeElement';
export const SET_ELEMENTS_FILTER = 'setElementsFilter';
export const GET_ELEMENTS_FILTER = 'setElementsFilter';

// element - selection
export const SET_ELEMENTS_SELECTION = 'setElementsSelection';
export const GET_ELEMENTS_SELECTION = 'getElementsSelection';
export const FETCH_ELEMENT_SELECTED = 'fetchElementSelected';
export const SET_ELEMENT_SELECTED = 'setElementSelected';
export const GET_ELEMENT_SELECTED = 'getElementSelected';
export const FETCH_ELEMENT_IMAGE_TYPE_SELECTED = 'fetchElementImageTypeSelected';
export const INSERT_ELEMENT_IMAGE_TYPE_SELECTED = 'insertElementImageTypeSelected';

// element - analysis
export const FETCH_ELEMENTS_MATERIALS_REUSE_SUMMARY = 'fetchElementsMaterialsReuseSummary';
export const SET_ELEMENTS_MATERIALS_REUSE_SUMMARY = 'setElementsMaterialsReuseSummary';
export const GET_ELEMENTS_MATERIALS_REUSE_SUMMARY = 'getElementsMaterialsReuseSummary';

// --- ELEMENT TYPES ---

// element type - inventory
export const FETCH_ELEMENT_TYPES = 'fetchElementTypes';
export const SET_ELEMENT_TYPES = 'setElementTypes';
export const GET_ELEMENT_TYPES = 'getElementTypes';
export const FETCH_ELEMENT_TYPES_FILTERED = 'fetchElementTypesFiltered';
export const SET_ELEMENT_TYPES_FILTERED = 'setElementTypesFiltered';
export const GET_ELEMENT_TYPES_FILTERED = 'getElementTypesFiltered';
export const CREATE_ELEMENT_TYPE = 'createElementType';
export const INSERT_ELEMENT_TYPE = 'insertElementType';
export const INSERT_ELEMENT_TYPE_FILTERED = 'insertElementTypeFiltered';
export const UPDATE_ELEMENT_TYPE = 'updateElementType';
export const REPLACE_ELEMENT_TYPE = 'replaceElementType';
export const REPLACE_ELEMENT_TYPE_FILTRED = 'replaceElementTypeFiltered';
export const DELETE_ELEMENT_TYPE = 'deleteElementType';
export const REMOVE_ELEMENT_TYPE = 'removeElementType';
export const REMOVE_ELEMENT_TYPE_FILTERED = 'removeElementTypeFiltered';
export const UPLOAD_ELEMENT_TYPE_IMAGE = 'uploadElementTypeImage';
export const FETCH_ELEMENT_TYPE_IMAGE = 'fetchElementTypeImage';
export const DELETE_ELEMENT_TYPE_IMAGE = 'deleteElementTypeImage';
export const SET_ELEMENT_TYPES_FILTER = 'setElementTypesFilter';
export const GET_ELEMENT_TYPES_FILTER = 'setElementTypesFilter';

// element type - selection
export const FETCH_ELEMENT_TYPE_SELECTED = 'fetchElementTypeSelected';
export const SET_ELEMENT_TYPE_SELECTED = 'setElementTypeSelected';
export const GET_ELEMENT_TYPE_SELECTED = 'getElementTypeSelected';
export const INSERT_ELEMENT_TYPE_IMAGE_SELECTED = 'insertElementTypeImageSelected';
export const REMOVE_ELEMENT_TYPE_IMAGE_SELECTED = 'removeElementTypeImageSelected';

// element type - analysis
export const FETCH_ELEMENT_TYPES_ANALYSIS = 'fetchElementTypesAnalysis';
export const GET_ELEMENT_TYPES_ANALYSIS = 'getElementTypesAnalysis';
export const SET_ELEMENT_TYPES_ANALYSIS = 'setElementTypesAnalysis';
export const INSERT_ELEMENT_TYPE_ANALYSIS = 'insertElementTypeAnalysis';
export const REPLACE_ELEMENT_TYPE_ANALYSIS = 'replaceElementTypeAnalysis';
export const REMOVE_ELEMENT_TYPE_ANALYSIS = 'removeElementTypeAnalysis';

// --- CLASSIFICATIONS ---

export const FETCH_CLASSIFICATION_SYSTEMS = 'fetchClassificationSystems';
export const GET_CLASSIFICATION_SYSTEMS = 'getClassificationSystems';
export const SET_CLASSIFICATION_SYSTEMS = 'setClassificationSystems';
export const FETCH_CLASSIFICATION_ENTRIES = 'fetchClassificationEntries';
export const GET_CLASSIFICATION_ENTRIES = 'getClassificationEntries';
export const SET_CLASSIFICATION_ENTRIES = 'setClassificationEntries';

// --- MATERIAL TYPES ---

// material type - inventory
export const FETCH_MATERIAL_TYPES = 'fetchMaterialTypes'; // TO DO - update when new route is availble
export const SET_MATERIAL_TYPES = 'setMaterialTypes';
export const GET_MATERIAL_TYPES = 'getMaterialTypes';
export const CREATE_MATERIAL_TYPE = 'createMaterialType';
export const INSERT_MATERIAL_TYPE = 'insertMaterialType';
export const UPDATE_MATERIAL_TYPE = 'updateMaterialType';
export const REPLACE_MATERIAL_TYPE = 'replaceMaterialType';
export const DELETE_MATERIAL_TYPE = 'deleteMaterialType';
export const REMOVE_MATERIAL_TYPE = 'removeMaterialType';

// material type - selection
export const FETCH_MATERIAL_TYPE_SELECTED = 'fetchMaterialTypeSelected';
export const SET_MATERIAL_TYPE_SELECTED = 'setMaterialTypeSelected';
export const GET_MATERIAL_TYPE_SELECTED = 'getMaterialTypeSelected';

// material type - analysis
export const FETCH_MATERIAL_TYPES_ANALYSIS = 'fetchMaterialTypesAnalysis';
export const SET_MATERIAL_TYPES_ANALYSIS = 'setMaterialTypesAnalysis';
export const GET_MATERIAL_TYPES_ANALYSIS = 'getMaterialTypesAnalysis';
export const INSERT_MATERIAL_TYPE_ANALYSIS = 'insertMaterialTypeAnalysis';
export const REPLACE_MATERIAL_TYPE_ANALYSIS = 'replaceMaterialTypeAnalysis';
export const REMOVE_MATERIAL_TYPE_ANALYSIS = 'removeMaterialTypeAnalysis';

// --- PROPERTIES ---

export const FETCH_PROPERTY_TYPES = 'fetchPropertyTypes';
export const SET_PROPERTY_TYPES = 'setPropertyTypes';
export const GET_PROPERTY_TYPES = 'getPropertyTypes';
export const CREATE_PROPERTY_TYPE='createPropertyType';
export const INSERT_PROPERTY_TYPE='insertPropertyType';

// --- CIRCULARITIES ---

// circularity - inventory
export const CREATE_ATTACH_CIRCULARITY = 'createAttachCircularity';
export const UPDATE_CIRCULARITY = 'updateCircularity';
export const DELETE_CIRCULARITY = 'deleteCircularity';
export const UPLOAD_CIRCULARITY_DOCUMENT = 'uploadCircularityDocument';
export const FETCH_CIRCULARITY_DOCUMENTS = 'fetchCircularityDocuments';
export const DOWNLOAD_CIRCULARITY_DOCUMENT = 'downloadCircularityDocument';
export const UPDATE_CIRCULARITY_DOCUMENT = 'updateCircularityDocument';
export const DELETE_CIRCULARITY_DOCUMENT = 'deleteCircularityDocument';

// Circulairty - selection
export const SET_CIRCULARITY_SELECTED = 'setCircularitySelected';
export const GET_CIRCULARITY_SELECTED = 'getCircularitySelected';
export const SET_CIRCULARITY_SELECTED_DOCUMENTS = 'setCircularitySelectedDocuments';
export const GET_CIRCULARITY_SELECTED_DOCUMENTS = 'getCircularitySelectedDocuments';

export const SET_AGGREGATED_CIRCULARITIES = 'setAggregatedCircularities';
export const GET_AGGREGATED_CIRCULARITIES = 'getAggregatedCircularities';

export const FETCH_CIRCULARITY_ANALYSIS_ELEMENTS = 'fetchCircularityAnalysisElements';
export const SET_CIRCULARITY_ANALYSIS_ELEMENTS = 'setCircularityAnalysisElements';
export const GET_CIRCULARITY_ANALYSIS_ELEMENTS = 'getCircularityAnalysisElements';
