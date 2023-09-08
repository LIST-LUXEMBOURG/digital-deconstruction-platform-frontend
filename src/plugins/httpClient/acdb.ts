/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */

import qs, { ParsedUrlQueryInput } from "querystring";
import { HttpClientOptions } from "../@ListSOA/vue-http";
import { GenericResponse, getToken } from "./index";

export interface MultipleQueries {
  requests: SingleQuery[];
}

export interface SingleQuery {
  accessType: string;
  resourceName: string;
}

export interface RolePrivilegesQuery {
  roleID?: string | undefined | null;
  roleName?: string | undefined | null;
}

const acdb: HttpClientOptions = {
  name: "acdb",
  domain: `/acdb`,
  options: { token: getToken(sessionStorage, "vuex", "authModule.auth") },
  /**
   * Single access control query.
   *
   * @param singleQuery
   *
   * @returns an access query response object with 3 attributes: { accessType, resourceName, hasAccess }
   *
   * Response code:
   *
   * 200 - The acdb query has been answered.
   *
   * 403 - Not allowed to perform access control queries.
   *
   * 404 - Unknown accessType request. Must be one of { create, read, update, delete }.
   */
  single({ accessType, resourceName }: SingleQuery) {
    return fetch(
      `${this.domain}?${qs.stringify({ accessType, resourceName })}`,
      {
        method: "GET",
        headers: {
          // token must be initialized before performing this request.
          // See ./auth and the auth module (Vuex).
          Authorization: this.options.token,
        },
      }
    ).then(GenericResponse);
  },

  /**
   * Multiple access control query
   *
   * @param multipleQueries
   *
   * @returns A list of access query response objects.
   *
   * Response code:
   *
   * 200 - The access request has been answered.
   *
   * 403 - Not allowed to perform access control queries.
   *
   * 404 - Unknown %accessType request: { %accessTypeN, %resourceNameN }.
   * Must be one of { create, read, update, delete }.
   *
   */
  multiple(multipleQueries: MultipleQueries) {
    return fetch(`${this.domain}`, {
      method: "POST",
      body: JSON.stringify({ requests: multipleQueries }),
      headers: {
        Authorization: this.options.token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then(GenericResponse);
  },

  /**
   *
   */
  getRolePrivilegesJSON({ roleID, roleName }: RolePrivilegesQuery) {
    let query: ParsedUrlQueryInput = {};
    if (!!roleID) query.roleID = roleID;
    if (!!roleName) query.roleName = roleName;
    return fetch(`${this.domain}/rolePrivileges/json?${qs.stringify(query)}`, {
      method: "GET",
      headers: {
        Authorization: this.options.token,
      },
    }).then(GenericResponse);
  },

  /**
   *
   */
  getRolePrivilegesYAML({ roleID, roleName }: RolePrivilegesQuery) {
    let query: ParsedUrlQueryInput = {};
    if (!!roleID) query.roleId = roleID;
    if (!!roleName) query.roleName = roleName;
    return fetch(`${this.domain}/rolePrivileges/yaml?${qs.stringify(query)}`, {
      method: "GET",
      headers: {
        Authorization: this.options.token,
      },
    }).then((response) => response.text());
  },

  /**
   *
   */
  getResourceList(filterName: string) {
    return fetch(
      `${this.domain}/resource/list?${qs.stringify({ filterName })}`,
      {
        method: "GET",
        headers: {
          Authorization: this.options.token,
        },
      }
    ).then(GenericResponse);
  },

  /**
   *
   */
  getResourcePrivilegesJSON(resourceName: string) {
    return fetch(
      `${this.domain}/resourcePrivileges/json?resourceName=${resourceName}`,
      {
        method: "GET",
        headers: {
          Authorization: this.options.token,
        },
      }
    ).then(GenericResponse);
  },

  /**
   *
   */
  getResourcePrivilegesYAML(resourceName: string) {
    return fetch(
      `${this.domain}/resourcePrivileges/yaml?resourceName=${resourceName}`,
      {
        method: "GET",
        headers: {
          Authorization: this.options.token,
        },
      }
    ).then((response) => response.text());
  },
};

export default acdb;
