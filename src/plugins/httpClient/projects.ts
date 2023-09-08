/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   See License in the LICENSE file
 */

import {
  Project,
  ProjectFile,
  CircularityCreate,
  ElementTypeCreate,
  ElementTypeUpdate,
  ElementTypeDelete,
  ElementTypeFileUpload,
  ElementTypeFileDownloadDelete,
  MaterialType,
  MaterialTypeCreate,
  MaterialTypeUpdate,
  MaterialTypeDelete,
  ElementCreate,
  ElementUpdate,
  ElementDelete,
  CircularityUpdate,
  CircularityDelete,
  CircularityFileUploadUpdate,
  FilterQuery
} from '@/store/project';
import { pick, pickBy } from 'lodash-es';
import { HttpClientOptions } from '../@ListSOA/vue-http';
import {
  BlobResponse,
  GenericResponse,
  getToken,
  Query,
  searchParamsBuilder,
} from './index';

const projects: HttpClientOptions = {
  name: 'projects',
  domain: `/projects`,
  options: { token: getToken(sessionStorage, 'vuex', 'authModule.auth') },

  create(project: Project) {
    const sanitizedProject: any = pickBy(project, (value, key) => {
      return !(value === undefined || value === null);
    });

    return fetch(`${this.domain}`, {
      method: 'POST',
      headers: {
        Authorization: this.options.token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sanitizedProject),
    }).then(GenericResponse);
  },

  listProjects() {
    return fetch(`${this.domain}`, {
      method: 'GET',
      headers: {
        Authorization: this.options.token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(GenericResponse);
  },

  getOneProject(projectId: number) {
    return fetch(`${this.domain}/${projectId}`, {
      method: 'GET',
      headers: {
        Authorization: this.options.token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(GenericResponse);
  },

  deleteProject(projectId: number) {
    return fetch(`${this.domain}/${projectId}`, {
      method: 'DELETE',
      headers: {
        Authorization: this.options.token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(GenericResponse);
  },

  updateProject(projectId: number, updatedProject: Project) {
    return fetch(`${this.domain}/${projectId}`, {
      method: 'PATCH',
      headers: {
        Authorization: this.options.token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProject),
    }).then(GenericResponse);
  },

  addParticipant(userId: number, projectId: number, role: string) {
    return fetch(`${this.domain}/${projectId}/participants/${userId}`, {
      method: 'POST',
      headers: {
        Authorization: this.options.token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role }),
    }).then(GenericResponse);
  },

  updateParticipant(userId: number, projectId: number, role: string) {
    return fetch(`${this.domain}/${projectId}/participants/${userId}`, {
      method: 'PATCH',
      headers: {
        Authorization: this.options.token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role }),
    }).then(GenericResponse);
  },

  removeParticipant(userId: number, projectId: number) {
    return fetch(`${this.domain}/${projectId}/participants/${userId}`, {
      method: 'DELETE',
      headers: {
        Authorization: this.options.token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(GenericResponse);
  },

  listParticipants(projectId: number) {
    return fetch(`${this.domain}/${projectId}/participants`, {
      method: 'GET',
      headers: {
        Authorization: this.options.token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(GenericResponse);
  },

  listProjectLocations(projectId: Number) {
    return fetch(`${this.domain}/${projectId}/locations`, {
      method: 'GET',
      headers: {
        Authorization: this.options.token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(GenericResponse);
  },

  addLocationToProject(locationPayload: any) {
    const { projectId, ...location } = locationPayload;
    return fetch(`${this.domain}/${projectId}/locations`, {
      method: 'POST',
      headers: {
        Authorization: this.options.token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(location),
    }).then(GenericResponse);
  },

  deleteLocationFromProject(locationPayload: any) {
    const { projectId, locationId } = locationPayload;
    return fetch(`${this.domain}/${projectId}/locations/${locationId}`, {
      method: 'DELETE',
      headers: {
        Authorization: this.options.token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(GenericResponse);
  },

  updateLocationFromProject(locationPayload: any) {
    const { projectId, id, ...location } = locationPayload;
    return fetch(`${this.domain}/${projectId}/locations/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: this.options.token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(location),
    }).then(GenericResponse);
  },

  uploadProjectFile(projectId: number, file: File, metadata: any) {
    const fd = new FormData();
    fd.append('file', file);

    // Clean metadata here
    const cleanedMetadata: any = pick(metadata, [
      'title',
      'description',
      'locationId',
      'documentAuthor',
      'documentDate',
    ]);

    Object.keys(cleanedMetadata).forEach(
      key => cleanedMetadata[key] && fd.append(key, cleanedMetadata[key]),
    );

    return fetch(`${this.domain}/${projectId}/files`, {
      method: 'POST',
      headers: {
        Authorization: this.options.token,
      },
      body: fd,
    }).then(/*BlobResponse*/ GenericResponse);
  },

  updateProjectFile(projectId: number, file: File, metadata: any) {
    const fd = new FormData();
    if (file) fd.append('file', file);

    // Clean metadata here
    const cleanedMetadata: any = pick(metadata, [
      'title',
      'description',
      'locationId',
      'documentAuthor',
      'documentDate',
    ]);

    Object.keys(cleanedMetadata).forEach(
      key => cleanedMetadata[key] && fd.append(key, cleanedMetadata[key]),
    );

    return fetch(`${this.domain}/${projectId}/files/${metadata.id}`, {
      method: 'PATCH',
      headers: {
        Authorization: this.options.token,
      },
      body: fd,
    }).then(/*BlobResponse*/ GenericResponse);
  },

  fetchProjectFiles(projectId: number, query: Query): Promise<any> {
    const urlWithQuery = searchParamsBuilder(
      `${this.domain}/${projectId}/files`,
      query,
    );

    const token = this.options.token;

    return fetch(urlWithQuery, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    }).then(GenericResponse);
  },

  // Get a file and display the file in the application (most of the time: images)
  fetchProjectPicture(projectId: number, query: Query) {
    const token = this.options.token;

    return (this.fetchProjectFiles(projectId, query) as Promise<any>)
      .then(arrayResponse => arrayResponse.data[0])
      .then(response => {
        if (!response) throw null;

        return fetch(
          `${this.domain}/${projectId}/files/${response.id}/stream`,
          {
            method: 'GET',
            headers: {
              Authorization: token,
            },
          },
        );
      })
      .then(res => {
        if (res.ok) return res.blob();
        else throw res.json();
      })
      .catch(err => null);
  },

  // Get a file and display the file in the application (most of the time: images)
  getProjectFile(projectId: number, fileId: string) {
    return fetch(`${this.domain}/${projectId}/files/${fileId}`, {
      method: 'GET',
      headers: {
        Authorization: this.options.token,
      },
    }).then(BlobResponse);
  },

  // Dowload a file (any type of files)
  downloadProjectFile(projectId: number, fileId: string, fileName: string) {
    return fetch(`${this.domain}/${projectId}/files/${fileId}`, {
      method: 'GET',
      headers: {
        Authorization: this.options.token,
      },
    })
      .then(BlobResponse)
      .then(response => {
        const url = URL.createObjectURL(response);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
      });
  },

  downloadCircularityDocument(projectId: number, circularityUid: string, fileUid: string, fileName: string) {
    return fetch(`${this.domain}/${projectId}/inventory/circularity/${circularityUid}/files/${fileUid}`, {
      method: 'GET',
      headers: {
        Authorization: this.options.token,
      },
    })
      .then(BlobResponse)
      .then(response => {
        const url = URL.createObjectURL(response);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
      });
  },

  // Delete a file (any type of files)
  deleteProjectFile(projectId: number, query: Query) {
    const { token } = this.options;

    return (this.fetchProjectFiles(projectId, query) as Promise<any>)
      .then(arrayResponse => arrayResponse.data[0])
      .then(response => {
        if (response === null) throw null;
        return fetch(`${this.domain}/${projectId}/files/${response.id}`, {
          method: 'DELETE',
          headers: {
            Authorization: token,
          },
        });
      })
      .then(GenericResponse);
  },
  
  deleteProjectDocument(projectId: number, documentId: number) {
    const { token } = this.options;

    return fetch(`${this.domain}/${projectId}/files/${documentId}`, {
      method: 'DELETE',
      headers: {
        Authorization: token,
      },
    })
    .then(GenericResponse);
  },

  getProject3dScanConfig(projectId: number) {
    return fetch(`${this.domain}/${projectId}/scan/config`, {
      method: 'GET',
      headers: {
        Authorization: this.options.token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(GenericResponse);
  },

  createProject3dScanConfig(scan3dConfig: any) {
    const { projectId } = scan3dConfig;
    delete scan3dConfig.projectId;
    delete scan3dConfig.id;
    return fetch(`${this.domain}/${projectId}/scan/config`, {
      method: 'POST',
      headers: {
        Authorization: this.options.token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scan3dConfig),
    }).then(GenericResponse);
  },

  updateProject3dScanConfig(scan3dConfig: any) {
    const { projectId, id } = scan3dConfig;
    delete scan3dConfig.projectId;
    delete scan3dConfig.id;
    return fetch(`${this.domain}/${projectId}/scan/config/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: this.options.token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scan3dConfig),
    }).then(GenericResponse);
  },
  saveAutodeskCredentials(payload: any) {
    let projectId = payload.projectId;
    delete payload.projectId;
    return fetch(`${this.domain}/${projectId}/autodesk`, {
      method: 'PUT',
      headers: {
        Authorization: this.options.token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).then(GenericResponse);
  },
  fetchAutodeskAccessToken(payload: any) {
    let projectId = payload.projectId;
    delete payload.projectId;
    return fetch(`${this.domain}/${projectId}/autodesk`, {
      method: 'GET',
      headers: {
        Authorization: this.options.token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(GenericResponse)
      .then(autodesk => {
        const now = new Date(Date.now());
        now.setSeconds(autodesk.expires_in);
        autodesk.valid_until = now;
        return autodesk;
      });
  },

  /* - INVENTORY ------------------------------------------------------------ */

  uploadInventoryFile(projectId: number, file: File) {
    const fd = new FormData();
    fd.append('file', file);

    return fetch(`${this.domain}/${projectId}/inventory`, {
      method: 'POST',
      headers: {
        Authorization: this.options.token,
      },
      body: fd,
    }).then(/*BlobResponse*/ GenericResponse);
  },

  fetchInventoryElementMaterials(
    projectId: number,
    itemId: number,
    query: any,
  ) {
    let url = `${this.domain}/${projectId}/inventory/elements/${itemId}/materials`;

    if (!!query) url = searchParamsBuilder(url, query);

    return fetch(url, {
      method: 'GET',
      headers: {
        Authorization: this.options.token,
      },
    }).then(GenericResponse);
  },

  fetchPointsOfInterest(
    projectId: number,
    query: any,
  ) {
    let url = `${this.domain}/${projectId}/scan/points-of-interest`;

    if (!!query) url = searchParamsBuilder(url, query);

    return fetch(url, {
      method: 'GET',
      headers: {
        Authorization: this.options.token,
      },
    }).then(GenericResponse);
  },

  fetchCircularityAnalysisElements(projectId: number, query: Query) {
    const urlWithQuery = searchParamsBuilder(
      `${this.domain}/${projectId}/inventory/elements/circularity/analysis`,
      query,
    );

    const token = this.options.token;

    return fetch(urlWithQuery, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    }).then(GenericResponse);
  },

  deleteCircularityDocument(projectId: number, circularityUid: string, fileUid: string) {
    let url = `${this.domain}/${projectId}/inventory/circularity/${circularityUid}/files/${fileUid}`;
    return fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: this.options.token,
        'Content-Type': 'application/json',
      }
    }).then(GenericResponse);
  },

  // ELEMENT TYPES

  // create an ElementType
  postInventoryElementsTypes(elementTypeCreate: ElementTypeCreate) {
    const { projectId, ...body } = elementTypeCreate;
    let url = `${this.domain}/${projectId}/inventory/elements/types`;

    return fetch(url, {
      method: 'POST',
      headers: {
        Authorization: this.options.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then(GenericResponse);
  },

  // retrieve all ElementTypes
  getInventoryElementsTypes(projectId: number) {
    let url = `${this.domain}/${projectId}/inventory/elements/types`;
    return fetch(url, {
      method: 'GET',
      headers: {
        Authorization: this.options.token,
      },
    }).then(GenericResponse);
  },

  getInventoryElementsTypesQuery(projectId: number, filterQuery: FilterQuery) {
    
    let baseUrl = `${this.domain}/${projectId}/inventory/elements/types/query`;
    let url = new URL(baseUrl);

    if (filterQuery.size) url.searchParams.append('size', filterQuery.size.toString());
    if (filterQuery.offset) url.searchParams.append('offset', filterQuery.offset.toString());
    if (filterQuery.selects?.length) {
      filterQuery.selects.forEach(select => {
        const { isActive, ...body } = select;
        if (isActive) url.searchParams.append('selects', JSON.stringify(body))
      });
    }
    if (filterQuery.conditions?.length) {
      filterQuery.conditions.forEach(condition => {
        const { isActive, ...body} = condition
        if (isActive) url.searchParams.append('conditions', JSON.stringify(body))
      });
    }

    return fetch(url.toString(), {
      method: 'GET',
      headers: {
        Authorization: this.options.token,
      }
    }).then(GenericResponse);
  },

  // retrieve an ElementType with dependencies
  getInventoryElementsTypesDependencies(elementType: ElementTypeUpdate) {
    const { projectId, uid } = elementType; 
    let url = `${this.domain}/${projectId}/inventory/elements/types/${uid}`;

    return fetch(url, {
      method: 'GET',
      headers: {
        Authorization: this.options.token,
      },
    }).then(GenericResponse);
  },

  // update an ElementType
  patchInventoryElementsTypes(elementTypeUpdate: ElementTypeUpdate) {
    const { projectId, uid, ...body } = elementTypeUpdate;
    let url = `${this.domain}/${projectId}/inventory/elements/types/${uid}`;
    
    return fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: this.options.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then(GenericResponse);
  },

  // delete an ElementType
  deleteInventoryElementsTypes( elementTypeDelete: ElementTypeDelete) {
    const { projectId, uid } = elementTypeDelete;
    let url = `${this.domain}/${projectId}/inventory/elements/types/${uid}`;

    return fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: this.options.token,
        'Content-Type': 'application/json',
      },
    }).then(GenericResponse);
  },

  // get statistics on all ElementType instances
  getInventoryElementsAnalysis(projectId: number) {
    let url = `${this.domain}/${projectId}/inventory/elements/analysis`;

    return fetch(url, {
      method: 'GET',
      headers: {
        Authorization: this.options.token,
      },
    }).then(GenericResponse);
  },

  // upload and attach a File to and ElementType
  postElementsTypesFiles(elementTypeFileUpload: ElementTypeFileUpload) {
    const { projectId, elementTypeUid } = elementTypeFileUpload;
    const formData = new FormData();
    formData.append('file', elementTypeFileUpload.file);
    formData.append('title', elementTypeFileUpload.title);
    if (elementTypeFileUpload.description) formData.append('description', elementTypeFileUpload.description);
    if (elementTypeFileUpload.documentAuthor) formData.append('documentAuthor', elementTypeFileUpload.documentAuthor);
    if (elementTypeFileUpload.documentDate) formData.append('documentDate', elementTypeFileUpload.documentDate.toDateString());

    return fetch(`${this.domain}/${projectId}/inventory/elements/types/${elementTypeUid}/files`, {
      method: 'POST',
      headers: {
        Authorization: this.options.token,
      },
      body: formData,
    }).then(GenericResponse);
  },

  // delete an ElementType file
  deleteInventoryElementsTypesFiles(elementTypeFileDelete: ElementTypeFileDownloadDelete) {
    const { projectId, elementTypeUid, document } = elementTypeFileDelete;
    let url = `${this.domain}/${projectId}/inventory/elements/types/${elementTypeUid}/files/${document.uid}`;
    return fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: this.options.token,
      },
    })
    .then(GenericResponse);
  },

  // stream an ElementType file
  getInventoryElementsTypesFilesStream(elementTypeFileDownload: ElementTypeFileDownloadDelete) {
    const { projectId, elementTypeUid, document } = elementTypeFileDownload;
    let url = `${this.domain}/${projectId}/inventory/elements/types/${elementTypeUid}/files/${document.uid}/stream`;

    return fetch(url, {
        method: 'GET',
        headers: {
          Authorization: this.options.token,
        },
      },
    ).then(BlobResponse);
  },
  
  // INVENTORY ELEMENT MATERIALS

  getInventoryElementsMaterialsAnalysis(projectId: number) {
    let url = `${this.domain}/${projectId}/inventory/elements/materials/analysis`;

    return fetch(url, {
      method: 'GET',
      headers: {
        Authorization: this.options.token,
      },
    }).then(GenericResponse);
  },

  // INVENTORY MATERIAL TYPES

  postInventoryMaterialsTypes(materialTypeCreate: MaterialTypeCreate) {
    const { projectId, ...body } = materialTypeCreate;
    let url = `${this.domain}/${projectId}/inventory/materials/types`;

    return fetch(url, {
      method: 'POST',
      headers: {
        Authorization: this.options.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then(GenericResponse);
  },

  // patch a MaterialType
  patchInventoryMaterialsTypes(materialTypeUpdate: MaterialTypeUpdate) {
    const { projectId, uid, ...body } = materialTypeUpdate; 
    let url = `${this.domain}/${projectId}/inventory/materials/types/${uid}`;

    return fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: this.options.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then(GenericResponse);
  },

  // delete a MaterialType
  deleteInventoryMaterialsTypes(materialTypeDelete: MaterialTypeDelete) {
    const { projectId, uid } = materialTypeDelete;
    let url = `${this.domain}/${projectId}/inventory/materials/types/${uid}`;

    return fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: this.options.token,
        'Content-Type': 'application/json',
      },
    }).then(GenericResponse);
  },

  // get a Material Type
  getInventoryMaterialsTypesDependencies(materialType: MaterialType) {
    const { projectId, uid, ...fields } = materialType; 
    let url = `${this.domain}/${projectId}/inventory/materials/types/${uid}`;

    return fetch(url, {
      method: 'GET',
      headers: {
        Authorization: this.options.token,
      },
    }).then(GenericResponse);
  },

  // get inventory elements
  getInventoryElements(projectId: number) {
    let url = `${this.domain}/${projectId}/inventory/elements`
    return fetch(url, {
      method: 'GET',
      headers: {
        Authorization: this.options.token,
      },
    }).then(GenericResponse);
  },

  getInventoryElementsIdenfifiers(projectId: number) {
    let url = `${this.domain}/${projectId}/inventory/elements/identifiers`;

    return fetch(url, {
      method: 'GET',
      headers: {
        Authorization: this.options.token,
      },
    }).then(GenericResponse);
  },
  
  // get inventory of elements with complex query filtering
  getInventoryElementsQuery(projectId: number, filterQuery: FilterQuery) {

    let baseUrl = `${this.domain}/${projectId}/inventory/elements/query`;
    let url = new URL(baseUrl);

    if (filterQuery.size) url.searchParams.append('size', filterQuery.size.toString());
    if (filterQuery.offset) url.searchParams.append('offset', filterQuery.offset.toString());
    if (filterQuery.selects?.length) {
      filterQuery.selects.forEach(select => {
        const { isActive, ...body } = select;
        if (isActive) url.searchParams.append('selects', JSON.stringify(body))
      });
    }
    if (filterQuery.conditions?.length) {
      filterQuery.conditions.forEach(condition => {
        const { isActive, ...body} = condition
        if (isActive) url.searchParams.append('conditions', JSON.stringify(body))
      });
    }

    return fetch(url.toString(), {
      method: 'GET',
      headers: {
        Authorization: this.options.token,
      }
    }).then(GenericResponse);
  },

  postInventoryElements(elementCreate: ElementCreate) {
    const { projectId, ...body} = elementCreate;
    let url = `${this.domain}/${projectId}/inventory/elements`;

    return fetch(url, {
      method: 'POST',
      headers: {
        Authorization: this.options.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then(GenericResponse);
  },

  patchInventoryElements(elementUpdate: ElementUpdate) {
    const { projectId, uid, ...body } = elementUpdate;
    let url = `${this.domain}/${projectId}/inventory/elements/${uid}`;

    return fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: this.options.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then(GenericResponse);
  },

  deleteInventoryElements(projectId:number, elementDelete: ElementDelete) {
    const { uid } = elementDelete;
    let url = `${this.domain}/${projectId}/inventory/elements/${uid}`;

    return fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: this.options.token,
        'Content-Type': 'application/json',
      },
    }).then(GenericResponse);
  },

  getInventoryElementsDependencies(element: ElementUpdate) {
    const { projectId, uid, ...body } = element; 
    let url = `${this.domain}/${projectId}/inventory/elements/${uid}/dependencies`;

    return fetch(url, {
      method: 'GET',
      headers: {
        Authorization: this.options.token,
      },
    }).then(GenericResponse);
  },

  getInventoryElementsSummaryReuseDecision(projectId: number) {
    let url = `${this.domain}/${projectId}/inventory/elements/summary/reuse-decision`;
    return fetch(url, {
      method: 'GET',
      headers: {
        Authorization: this.options.token,
      },
    }).then(GenericResponse);
  },

  // create and attach a circularity to a material type
  postInventoryMaterialsTypesCircularity(projectId: number, circularityCreate: CircularityCreate) {
    let url = `${this.domain}/${projectId}/inventory/materials/types/${circularityCreate.attachId}/circularity`;

    return fetch(url, {
      method: 'POST',
      headers: {
        Authorization: this.options.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(circularityCreate.circularity),
    }).then(GenericResponse);
  },

  // create and attach a circularity to an element type
  postInventoryElementsTypesCircularity(projectId: number, circularityCreate: CircularityCreate) {
    let url = `${this.domain}/${projectId}/inventory/elements/types/${circularityCreate.attachId}/circularity`;

    return fetch(url, {
      method: 'POST',
      headers: {
        Authorization: this.options.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(circularityCreate.circularity),
    }).then(GenericResponse);
  },

  // create and attach a circularity to an element
  postInventoryElementsCircularity(projectId: number, circularityCreate: CircularityCreate) {
    let url = `${this.domain}/${projectId}/inventory/elements/circularity`;
    const appendedUrl = new URL(url);

    appendedUrl.searchParams.append("elementUids", circularityCreate.attachId);
    
    return fetch(appendedUrl.toString(), {
      method: 'POST',
      headers: {
        Authorization: this.options.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(circularityCreate.circularity),
    }).then(GenericResponse);
  },

  // update a circularity object
  patchInventoryCircularity(projectId: number, circularityUpdate :CircularityUpdate) {
    const { uid, ...body } = circularityUpdate; 
    let url = `${this.domain}/${projectId}/inventory/circularity/${circularityUpdate.uid}`;

    return fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: this.options.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then(GenericResponse);
  },

  deleteInventoryCircularity(projectId: number, circularityDelete: CircularityDelete)
  {
     let url = `${this.domain}/${projectId}/inventory/circularity/${circularityDelete.uid}`;

     return fetch(url, {
       method: 'DELETE',
       headers: {
         Authorization: this.options.token,
         'Content-Type': 'application/json',
       },
     }).then(GenericResponse);
   },

   postInventoryCircularityFiles(projectId: number, circularityFileUpload: CircularityFileUploadUpdate) {
    const { circularityUid } = circularityFileUpload;
    const formData = new FormData();
    formData.append('file', circularityFileUpload.file);
    formData.append('title', circularityFileUpload.title);
    if (circularityFileUpload.documentDate) formData.append('documentDate', circularityFileUpload.documentDate.toDateString());

    return fetch(`${this.domain}/${projectId}/inventory/circularity/${circularityUid}/files`, {
      method: 'POST',
      headers: {
        Authorization: this.options.token,
      },
      body: formData,
    }).then(/*BlobResponse*/ GenericResponse);
  },

  getInventoryCircularityFiles(projectId: number, circularityDelete: CircularityDelete) {
    let url = `${this.domain}/${projectId}/inventory/circularity/${circularityDelete.uid}/files`;

    return fetch(url, {
      method: 'GET',
      headers: {
        Authorization: this.options.token,
      },
    }).then(GenericResponse);
  },

  patchInventoryCircularityFiles(projectId: number, circularityUid: string, file: ProjectFile) {
    let url = `${this.domain}/${projectId}/inventory/circularity/${circularityUid}/files/${file.uid}`;
    return fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: this.options.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: file.title }),
    }).then(GenericResponse);
  },
  

};

export default projects;
