/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */


export interface AuthState {
  /** The user credentials... (JWT) */
  auth: JSON | string | null;
  /** The reason why the user has been logged out */
  logoutReason?: String | null;
}

// Actions payload

export interface SignInPayload {
  /** The user username (can be an email) */
  login: string;
  /** The user password */
  password: string;
  /** The boolean that allow to store the user details and credentials */
  // remember: boolean;
}
