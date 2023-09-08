/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */

// actions
export const SIGN_IN_USERNAME_PASSWORD = "signInUsernamePassword";
export const SIGN_OUT = "signOut";
export const LOG_OUT = "logOut";

// mutations
export const REINITIALIZE_AUTH_MODULE = "reinitializeAuthModule";
export const SET_AUTHENTICATION = "setAuthentication";
export const UNSET_AUTHENTICATION = "unsetAuthentication";
export const UNSET_CURRENT_USER = "unsetCurrentUser";
export const SET_LOGOUT_REASON = "setLogoutReason";
export const UNSET_LOGOUT_REASON = "unsetLogoutReason";

// getters
export const GET_AUTHENTICATION = "getAuthentication";
export const GET_LOGOUT_REASON = "getLogoutReason";
