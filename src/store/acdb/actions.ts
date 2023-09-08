/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */

// node_modules
import { $http } from '@/main';
import { ActionTree } from 'vuex';
import { LOG_OUT } from '../auth';
import { RootState } from '../types';
// Constants
import {
  FETCH_AND_RETURN_RESOURCE_PRIVILEGES_YAML,
  FETCH_AND_RETURN_ROLE_PRIVILEGES_YAML, FETCH_FILTERED_RESOURCES_NAME, FETCH_MULTIPLE_ACDB, FETCH_SINGLE_ACDB, SET_FILTERED_RESOURCES_NAME, SET_SINGLE_ACDB
} from './constants';
// Types
import { AcdbState } from './types';



export const actions: ActionTree<AcdbState, RootState> = {
  /**
   * Documentation template
   * @param {dataPayload} payload
   */
  // async [CONSTANT]({commit}, payload: DataPayload): Promise<void>{}

  async [FETCH_SINGLE_ACDB](
    { commit, dispatch },
    { accessType, resourceName },
  ): Promise<void> {
    try {
      const query = await $http.acdb.single({
        accessType,
        resourceName,
      });
      return commit(SET_SINGLE_ACDB, query);
    } catch (e) {
      const error = e as any;
      if (error.statusCode === 401 || error.statusCode === 407) {
        dispatch(LOG_OUT, { action: error.messageCode });
      }
    }
  },
  async [FETCH_MULTIPLE_ACDB](
    { commit, dispatch },
    accessRequestsArray: [],
  ): Promise<void> {
    try {
      const multipleACDB: any[] = await (
        await import('@/main')
      ).$http.acdb.multiple(accessRequestsArray);
      multipleACDB.forEach(singleACDB => commit(SET_SINGLE_ACDB, singleACDB));
    } catch (e) {
      const error = e as any;
      console.log(FETCH_MULTIPLE_ACDB, error);
      if (error.statusCode === 401 || error.statusCode === 407) {
        dispatch(LOG_OUT, { action: error.messageCode });
      }
    }
  },
  async [FETCH_FILTERED_RESOURCES_NAME](
    { commit, dispatch },
    filterName: string,
  ) {
    try {
      const fetchedResourcesName = await $http.acdb.getResourceList(filterName);

      commit(SET_FILTERED_RESOURCES_NAME, fetchedResourcesName);
    } catch (e) {
      const error = e as any;
      if (error.statusCode === 401 || error.statusCode === 407) {
        dispatch(LOG_OUT, { action: error.messageCode });
      }
    }
  },
  async [FETCH_AND_RETURN_RESOURCE_PRIVILEGES_YAML](
    { dispatch },
    resourceName: string,
  ) {
    try {
      const fetchedResourcePrivilegesYAML = await $http.acdb.getResourcePrivilegesYAML(
        resourceName,
      );

      return fetchedResourcePrivilegesYAML;
    } catch (e) {
      const error = e as any;
      if (error.statusCode === 401 || error.statusCode === 407) {
        dispatch(LOG_OUT, { action: error.messageCode });
      }
    }
  },
  async [FETCH_AND_RETURN_ROLE_PRIVILEGES_YAML](
    { dispatch },
    { roleID, roleName },
  ) {
    try {
      const fetchedRolePrivilegesYAML = await $http.acdb.getRolePrivilegesYAML({
        roleID,
        roleName,
      });

      return fetchedRolePrivilegesYAML;
    } catch (e) {
      const error = e as any;
      if (error.statusCode === 401 || error.statusCode === 407) {
        dispatch(LOG_OUT, { action: error.messageCode });
      }
    }
  },
};
