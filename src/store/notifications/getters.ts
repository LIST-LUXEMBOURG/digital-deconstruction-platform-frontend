/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */


import { GetterTree } from "vuex";
import { NotificationsState, Notification } from "./types";
import { RootState } from "../types";

import { GET_ALL_NOTIFICATIONS } from "./constants";

export const getters: GetterTree<NotificationsState, RootState> = {
  /** @returns The list of notifications to display in the app SnackbarQueue */
  [GET_ALL_NOTIFICATIONS]: (state): Notification[] => state.notifications
};
