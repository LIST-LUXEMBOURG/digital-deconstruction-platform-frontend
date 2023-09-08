/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */


import { MutationTree } from "vuex";
import { state as notifState } from "./";
import {
  ADD_NOTIFICATION, REINITIALIZE_NOTIF_MODULE, REMOVE_NOTIFICATION
} from "./constants";
import { Notification, NotificationsState } from "./types";


export const mutations: MutationTree<NotificationsState> = {
  [REINITIALIZE_NOTIF_MODULE](state, _: void) {
    Object.assign(state, notifState);
  },
  /** Add a notification */
  [ADD_NOTIFICATION](state, notification: Notification) {
    state.id++;
    notification.id = state.id;
    state.notifications.push(notification);
    state.notifications.sort((a: Notification, b: Notification) => a.id + b.id)

  },
  /** Remove the first element in the notification list */
  [REMOVE_NOTIFICATION](state, id = null) {
    const index = state.notifications.findIndex(n => n.id === id);
    state.notifications.splice(index, 1);
  }
};
