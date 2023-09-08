/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */

export interface NotificationsState {
  /** A counter to add for each new notification */
  id: number;
  /**
   * The list of notifications
   */
  notifications: Notification[];
}

export interface Notification {
  id: number;
  timeoutId?: number;
  message: string;
  color: NotificationColor;
  data?: object;
}

type NotificationColor = 'success' | 'warning' | 'error';
