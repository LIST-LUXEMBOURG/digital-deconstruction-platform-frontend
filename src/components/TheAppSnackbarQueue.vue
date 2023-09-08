<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
  <!-- Inspired by the VSnackbarQueue component here: https://github.com/ajanes93/vuetify-snackbar-queue -->
  <div>
    <!-- The snackbar is populated with all the notifications -->
    <v-snackbar
      v-for="(notification, i) in notifications"
      :key="notification.id"
      :value="i === 0"
      :timeout="timeout"
      :color="notification.color"
      :top="top"
      :right="right"
      :absolute="absolute"
      :bottom="bottom"
      :left="left"
      :multi-line="multiLine"
      :vertical="vertical"
    >
      <!-- But only the current notification is translated and displayed  -->
      {{ currentNotification.message }}
      <template v-slot:action="{ attrs }">
        <v-btn
          icon
          color="white"
          @click="removeNotif(notification.id)"
          aria-label="close-notification"
          v-bind="attrs"
        >
          <v-icon v-if="notifications.length === 1">{{ mdiClose }}</v-icon>
          <v-icon v-else>{{ mdiChevronRight }}</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>


<script lang="ts">
/**
 * The snackbar queue has been re-implemented and adjusted to the project needs
 * This version is linked and managed via the vuex store.
 *
 * The available interactions with the store are:
 * - ADD_NOTIFICATION and a Notification object
 * - REMOVE_NOTIFICATION no payload
 * - GET_ALL_NOTIFICIATIONS no payload, returns a list of Notification
 *
 * How it works?
 *
 *
 */

import Vue from 'vue';

import { mapMutations } from 'vuex';
import { REMOVE_NOTIFICATION } from '@/store/notifications';
import { Notification } from '@/store/notifications/types';
import { mdiChevronRight, mdiClose } from '@mdi/js';

export default Vue.extend({
  name: 'TheAppSnackbarQueue',
  data: () => ({
    mdiChevronRight,
    mdiClose,
    currentNotification: {} as Notification,
    traducedMessage: '',
  }),
  methods: {
    ...mapMutations({
      removeNotification: REMOVE_NOTIFICATION,
    }),
    processNotifications() {
      if (this.notifications.length > 0) {
        Object.assign(this.currentNotification, this.notifications[0]);
        this.currentNotification.message = this.$t(
          this.currentNotification.message,
          this.currentNotification.data ? this.currentNotification.data : {},
        ).toString();

        if (!this.currentNotification.timeoutId) {
          const vm = this;
          this.currentNotification.timeoutId =
            this.timeout === 0
              ? -1
              : window.setTimeout(
                  () => vm.removeNotif(this.currentNotification.id || 0),
                  vm.timeout,
                );
        }
      }
    },
    /**
     *  Check if the current item has a valid timeout and clear it.
     *  Then, remove the first item in the notifications list (always at index 0).
     *  Replace the currentNotification by the new notification a index 0.
     *  Reset currentNotification.
     */
    removeNotif(i: number) {
      if (this.currentNotification.timeoutId !== -1)
        clearTimeout(this.currentNotification.timeoutId);

      this.removeNotification(i);

      this.processNotifications();

      this.currentNotification = {} as Notification;
    },
  },
  watch: {
    notifications() {
      // When the notifications props changes, process the notifications array
      this.processNotifications();
    },
    // when the currrent language changes
    '$i18n.locale'() {
      // If there is at least one notification
      if (this.notifications.length > 0) {
        // The first notification's message is translated
        const notification = this.notifications[0] as Notification;
        this.currentNotification.message = this.$t(
          notification.message,
          notification.data ? notification.data : {},
        ).toString();
        this.$forceUpdate();
      }
    },
  },
  props: {
    /**
     * Array for notifications to display [{color: '', message: ''}]
     */
    notifications: {
      type: Array,
      required: true,
      default: () => [] as Notification[],
    },
    value: {
      required: false,
      default: false,
    },
    timeout: {
      required: false,
      default: 2000, // 3000
    },
    color: {
      required: false,
      default: 'error',
    },
    top: {
      required: false,
      default: true,
    },
    right: {
      required: false,
      default: true,
    },
    absolute: {
      required: false,
      default: false,
    },
    autoHeight: {
      required: false,
      default: false,
    },
    bottom: {
      required: false,
      default: false,
    },
    left: {
      required: false,
      default: false,
    },
    multiLine: {
      required: false,
      default: true,
    },
    vertical: {
      required: false,
      default: false,
    },
  },
});
</script>
