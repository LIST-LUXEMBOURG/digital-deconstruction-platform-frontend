/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */

// actions
export const FETCH_CONNECTED_USERS = "fetchConnectedUsers";
export const FETCH_CURRENT_USER = "fetchCurrentUser";
export const FETCH_USERS = "fetchAllUsers";
export const FETCH_AND_RETURN_USER_BY_ID = "fetchAndRetrunUserById";
export const FETCH_FILTERED_USERS = "fetchFilteredUsers";
export const UPDATE_USER = "updateUser";
export const UPDATE_USER_PASSWORD = "updateUserPassword";
export const ADD_USER = "addUser";
export const FORCE_LOGOUT = "forceLogout";

// mutations
export const REINITIALIZE_USERS_MODULE = "reinitializeUsersModule";
export const SET_CONNECTED_USERS = "setConnectedUsers";
export const SET_CURRENT_USER = "setCurrentUser";
export const SET_ALL_USERS = "setAllUsers";
export const SET_FILTERED_USERS = "setFilteredUsers";
export const SET_ACTIVE_USERS_FILTER = "setActiveUsersFilter";
export const SET_BLOCKED_USERS_FILTER = "setBlockedUsersFilter";
export const SET_USERS_FILTER = "setUsersFilter";
export const ADD_USER_ROLES = "addUserRoles";

// getters
export const GET_ALL_CONNECTED_USERS = "getAllConnectedUsers";
export const GET_CURRENT_USER = "getCurrentUser";
export const GET_ALL_USERS = "getAllUsers";
export const GET_FILTERED_USERS = "getFilteredUsers";
export const GET_ACTIVE_USERS_FILTER = "getActiveUsersFilter";
export const GET_BLOCKED_USERS_FILTER = "getBlockedUsersFilter";
export const GET_USERS_FILTER = "getUsersFilter";
