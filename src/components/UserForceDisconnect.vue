<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
  <v-dialog
    v-model="user"
    @click:outside.stop="cancel"
    :persistent="isLoading"
    max-width="360px"
  >
    <v-card outlined>
      <v-card-title>{{ $t('forceDisconnection.title') }}</v-card-title>
      <v-card-text class="pb-2">{{
        $t('forceDisconnection.text', { login: user.login })
      }}</v-card-text>
      <v-card-actions class="mx-2 mb-1">
        <v-btn
          @click="disconnect"
          :disabled="isLoading"
          color="primary"
          :dark="!isLoading"
          >{{ $t('forceDisconnection.disconnect') }}</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn @click.stop="cancel" color="primary" :disabled="isLoading">{{
          $t('cancel')
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { IS_LOADING } from '@/store/types';
import { FORCE_LOGOUT } from '@/store/users';

export default Vue.extend({
  props: ['user'],
  methods: {
    async disconnect() {
      await this.$store.dispatch(FORCE_LOGOUT, this.user.userId);
      this.cancel();
    },
    cancel() {
      // Only trigger the event if the application is not loading
      // prevent the dialog to hide when the user click outside of the dialog
      if (!this.isLoading) this.$emit('update:user', null);
    },
  },
  computed: {
    ...mapGetters({
      isLoading: IS_LOADING,
    }),
  },
});
</script>