/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */

import { isNil, omitBy } from 'lodash-es';
import qs from 'querystring';
import { HttpClientOptions } from '../@ListSOA/vue-http';
import { GenericResponse, getToken } from './index';

export interface User {
  id?: number;
  /** The user unique login */
  login: string;
  /** The user password */
  password: string;
  /** The user lastname */
  name: string;
  /** The user firstname */
  firstName: string;
  /** The user email address */
  email?: string;
  /** Wether the user is active or not (default: true) */
  active?: boolean;
  /** Flag to indicate if the user is blocked (default: false) */
  blocked?: boolean;
  /** Reason why the user is blocked */
  blockingReason: string;
}

export interface UserQuery {
  id?: number;
  login?: string;
  name?: string;
  firstName?: string;
  email?: string;
  active?: boolean;
  blocked?: boolean;
  blockingReason?: string;
  [k: string]: any;
}

export interface ChangePassword {
  currentPassword: string;
  newPassword: string;
}

export interface RequestSelfRegistration {
  readonly name: string;
  readonly firstName: string;
  readonly login: string;
  readonly email: string;
}

export interface ConfirmSelfRegistration {
  readonly token: string;
  readonly password: string;
}

export const users: HttpClientOptions = {
  name: 'users',
  domain: `/users`,
  options: { token: getToken(sessionStorage, 'vuex', 'authModule.auth') },
  /**
   * Create a new user (not implemented yet).
   *
   * @returns the newly created user with attributes, including a new generated ID but not the password.
   *
   * Response code:
   *
   * 201 - The user has been successfully created.
   *
   * 400 - The login is missing in the payload.
   * The password is missing in the payload.
   * The name is missing in the payload.
   * The firstName is missing in the payload.
   *
   * 403 - Not allowed to create a new user.
   *
   * 409 - The login name is already used by another user.
   * The user could not be created, whatever the reason
   */
  create(user: User) {
    return fetch(`${this.domain}`, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        Authorization: this.options.token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(GenericResponse);
  },
  /**
   * An user list.
   *
   * @param {UserQuery} query (Not used in this version)
   *
   * @returns the list of users that match the query.
   *
   * Response code:
   *
   * 200 - The list of users or an empty list.
   *
   * 403 - Not allowed to list users.
   */
  list(query: UserQuery) {
    // const keys = Object.keys(query);
    // const formattedQuery = {};

    // keys.forEach((k: string) => {
    //   Object.assign(formattedQuery, { [k]: query[k] });
    // });
    let promise;

    if (query === null || Object.keys(query).length === 0)
      promise = fetch(`${this.domain}/list`, {
        method: 'GET',
        headers: {
          // Token is initialized by the auth http client.
          Authorization: this.options.token,
        },
      });
    else {
      const formattedQuery = qs.stringify(query);
      promise = fetch(`${this.domain}/list?${formattedQuery}`, {
        method: 'GET',
        headers: {
          // Token is initialized by the auth http client.
          Authorization: this.options.token,
        },
      });
    }

    return promise.then(GenericResponse);
  },
  /**
   * Get the current user.
   *
   * @returns the user object that corresponds to the authorization token that is passed along the request.
   *
   * Response code:
   *
   * 200 - The information of the current user.
   *
   * 403 - Not allowed to get the current user informations.
   */
  currentUser() {
    return fetch(`${this.domain}/currentUser`, {
      method: 'GET',
      headers: {
        Authorization: this.options.token,
      },
    }).then(GenericResponse);
  },
  /**
   * Filter the list of all users
   *
   * @param {object} query ()
   *
   * @returns the filtered list of users based on the "filter" param.
   *
   * Response code:
   *
   * 200 - The filtered users.
   *
   * 403 - Not allowed to filter users.
   */
  filter(query: {}) {
    const formattedQuery = qs.stringify(omitBy(query, isNil));
    const headers = {
      Authorization: this.options.token,
    };

    let promise;

    if (!formattedQuery) {
      promise = fetch(`${this.domain}/filter`, { headers });
    } else
      promise = fetch(`${this.domain}/filter?${formattedQuery}`, { headers });

    return promise.then(GenericResponse);
  },
  /**
   * Modify all attributes of the user identified by userId.
   *
   * @param updatedUser The user object with the attributes to update.
   * @returns the updated user object.
   *
   * Response code:
   *
   * 200 - The user has been successfully updated.
   *
   * 400 - The user ID is missing in the payload.
   *
   * 403 - Not allowed to update a user.
   *
   * 409 - The login provided in the payload is not unique among all user logins.
   */
  update(updatedUser: UserQuery) {
    return fetch(`${this.domain}`, {
      method: 'PUT',
      body: JSON.stringify(updatedUser),
      headers: {
        Authorization: this.options.token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(GenericResponse);
  },

  changePassword(cp: ChangePassword) {
    return fetch(`${this.domain}/changePassword`, {
      method: 'POST',
      body: JSON.stringify(cp),
      headers: {
        Authorization: this.options.token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(GenericResponse);
  },

  requestSelfRegistration(payload: RequestSelfRegistration) {
    return fetch(`${this.domain}/requestRegistration`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        Authorization: this.options.token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw data;
      return data;
    });
  },

  getUserToRegister(payload: any) {
    return fetch(`${this.domain}/registration?${qs.stringify(payload)}`, {
      method: 'GET',
      headers: {
        Authorization: this.options.token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw data;
      return data;
    });
  },

  selfRegistrationConfirmation(payload: ConfirmSelfRegistration) {
    return fetch(`${this.domain}/registration`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        Authorization: this.options.token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw data;
      return data;
    });
  },
};

export default users;
