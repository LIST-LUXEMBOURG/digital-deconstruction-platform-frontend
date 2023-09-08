/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */

import { HttpClientOptions } from '../@ListSOA/vue-http';
import { GenericResponse, getToken } from './index';

export interface Role {
  /** the unique role name */
  longName: string;
  /** the role description */
  description: string;
}
export interface RoleQuery {
  id?: number;
  description?: string;
}

export interface UserRole {
  userId: number;
  roleId: number;
}

const roles: HttpClientOptions = {
  name: 'roles',
  domain: `/roles`,
  options: { token: getToken(sessionStorage, 'vuex', 'authModule.auth') },
  /**
   * Create a new role (not implemented yet).
   *
   * @param {Role} role
   *
   * @returns The newly created role, including a unique, generated ID.
   *
   * Response code:
   *
   * 201 - The role has been successfully created.
   *
   * 400 - The name is missing in the payload. The description is missing in the payload.
   *
   * 403 - Not allowed to create a new role.
   *
   * 409 - The role name is already used by another role. The role could not be created, whatever the reason.
   */
  create(role: Role) {
    return fetch(`${this.domain}`, {
      method: 'POST',
    });
  },
  /**
   *
   */
  getUserRoles(userId: number) {
    return fetch(`${this.domain}/userRoles/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: this.options.token,
      },
    }).then(GenericResponse);
  },

  /**
   * An role list.
   *
   * @returns the list of roles that match the query.
   *
   * Response code:
   *
   * 200 - The roles have been successfully listed.
   *
   * 403 - Not allowed to list roles.
   */
  list() {
    return fetch(`${this.domain}/list`, {
      method: 'GET',
      headers: {
        Authorization: this.options.token,
      },
    }).then(GenericResponse);
  },
  /*
   * Modify all attributes of the role identified by roleID.
   *
   * @param updatedRole Therole object with the attributes to update.
   * @returns the updated role object.
   *
   * Response code:
   *
   * 200 - The role has been successfully updated.
   *
   * 400 - The role ID is missing in the payload.
   *
   * 403 - Not allowed to update role.
   *
   * 404 - The role ID does not identify an existing role.
   *
   * 409 - The name provided in the payload is not unique among all role names.
   */
  update(updatedRole: RoleQuery) {
    return fetch(`${this.domain}`, {
      method: 'PUT',
      body: JSON.stringify(updatedRole),
      headers: {
        Authorization: this.options.token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(GenericResponse);
  },
  /**
   *
   * @param payload
   */
  assignRole(payload: UserRole) {
    return fetch(`${this.domain}/assignRole`, {
      method: 'PUT',
      headers: {
        Authorization: this.options.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).then(GenericResponse);
  },
  /**
   *
   * @param payload
   */
  revokeRole(payload: UserRole) {
    return fetch(`${this.domain}/revokeRole`, {
      method: 'PUT',
      headers: {
        Authorization: this.options.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).then(GenericResponse);
  },
};

export default roles;
