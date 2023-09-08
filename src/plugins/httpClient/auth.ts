/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */

import { GenericResponse, getToken, removeToken } from '.';
import { HttpClientOptions } from '../@ListSOA/vue-http';

export interface ResetPassword {
  token: string;
  /** The new password */
  password: string;
}

const auth: HttpClientOptions = {
  name: 'auth',
  domain: `/auth`,
  options: { token: getToken(sessionStorage, 'vuex', 'authModule.auth') },
  /**
   * AKA "user login" or "user connection"
   *
   * @param {string} login
   * @param {string} password
   *
   * @returns Generates and returns a JWT access token that contains the user informations
   * in its payload, including his roles, but without the password.
   *
   * Response code:
   *
   * 201 - The user is authenticated.
   *
   * 400 - The login is missing in payload.
   *
   * 401 - Failed to authenticate the user.
   */
  login(login: string, password: string) {
    return fetch(`${this.domain}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ login, password }),
    }).then(async response => {
      if (!response.ok) throw await response.json();
      const credentials = await response.json();
      this.options = { ...this.options, token: credentials.token };

      return credentials;
    });
  },
  /**
   * AKA "user logout" or "user disconnection"
   *
   * @param {string} token The JWT
   *
   * @Returns Remove the requesting user's authorization to use the backend application.
   *
   * Response code:
   *
   * 200 - The user is no more authenticated by any token.
   *
   * 409 - Cannot disconnect the user.
   */
  logout(token: string) {
    return fetch(`${this.domain}/logout`, {
      method: 'POST',
      headers: {
        Authorization: this.options.token,
      },
    }).then(() => {
      delete this.options.token;
      removeToken(sessionStorage, 'vuex');
    });
  },
  /**
   * All connected users { userId, userName, UTC }
   *
   * @returns a list with the information on all currently connected users
   *
   * Response code:
   *
   * 200 - The list with the information on all currently connected users.
   *
   * 403 - Not allowed to list connected users.
   *
   * 409 - Cannot get the connected user information list.
   */
  allConnectedUsers() {
    return fetch(`${this.domain}/allConnectedUsers`, {
      method: 'GET',
      headers: {
        Authorization: this.options.token,
      },
    }).then(GenericResponse);
  },
  /**
   * Remove the requesting user's authorization to use the backend application.
   *
   * @returns a boolean isSuccess or isFailed about the disconnection.
   *
   * Response code:
   *
   * 200 - The user was successfully disconnected.
   *
   * 400 - Missing userId.
   *
   * 403 - Not allowed to disconnect a user.
   *
   * 404 - The userId does not identify an existing user.
   */
  forcedLogout(userId: number) {
    return fetch(`${this.domain}/forcedLogout`, {
      method: 'PUT',
      headers: {
        Authorization: this.options.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    }).then(GenericResponse);
  },

  /**
   *
   */
  requestResetPassword(email: string) {
    return fetch(`${this.domain}/requestResetPassword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
      }),
    });
  },
  resetPassword(token: string, password: string | null | undefined) {
    // check if the token is valid and retrieves the user details.
    if (!password) {
      return fetch(`${this.domain}/resetPassword/${token}`).then(
        GenericResponse,
      );
    }

    // reset the user password
    return fetch(`${this.domain}/resetPassword/${token}`, {
      method: 'POST',
      body: JSON.stringify({ password }),
    }).then(GenericResponse);
  },

  /**
   *
   */
  resetPasswordConfirmation(rp: ResetPassword) {
    return fetch(`${this.domain}/resetPassword`, {
      method: 'POST',
      body: JSON.stringify(rp),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(GenericResponse);
  },
};

export default auth;
