<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->
 
<template>
  <v-app>
    <TheAppBar />
    <TheAppDrawer />
    <v-main>
      <router-view></router-view>
      <TheAppSnackbarQueue :notifications="notifications" />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
// Store
import { mapGetters, mapMutations } from 'vuex';
import { GET_ALL_NOTIFICATIONS } from '@/store/notifications';

// Specific components
import TheAppBar from '@/components/TheAppBar.vue';
import TheAppDrawer from '@/components/TheAppDrawer.vue';

// Core / generic components
import TheAppSnackbarQueue from '@/components/TheAppSnackbarQueue.vue';
import { REINITIALIZE_VIEWER_MODULE } from './store/viewer';
import { SET_ELEMENTS_SELECTION } from './store/project';

export default Vue.extend({
  name: 'App',
  components: { TheAppBar, TheAppDrawer, TheAppSnackbarQueue },

  computed: {
    ...mapGetters({
      notifications: GET_ALL_NOTIFICATIONS,
    }),
  },
  methods: {
    ...mapMutations({
      resetViewerModule: REINITIALIZE_VIEWER_MODULE,
      setElementsSelection: SET_ELEMENTS_SELECTION,
    }),
  },
  created() {
    // do something after page refresh
    if (performance.navigation.type == 1) {
      this.resetViewerModule();
      this.setElementsSelection([]);
    }
  },
});
</script>

<style lang="scss">
@import 'theme/style.scss';
</style>
