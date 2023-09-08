<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
  <div>
    <v-tabs v-model="tabIndex" fixed-tabs>
      <v-tab>Details</v-tab>
      <v-tab :disabled="isCreationMode">Participants</v-tab>
      <v-tab :disabled="isCreationMode">Locations</v-tab>
      <v-tab :disabled="isCreationMode">Documents</v-tab>
      <v-tab :disabled="isCreationMode">3D Scan</v-tab>
      <v-tab :disabled="isCreationMode">Reversible BIM</v-tab>
      <v-tab :disabled="isCreationMode">Inventory</v-tab>
      <v-tab :disabled="isCreationMode">Analysis</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tabIndex">
      <v-tab-item :value="ProjectTab.Details">
        <TheProjectDetailsPanel/>
      </v-tab-item>
      <v-tab-item :value="ProjectTab.Participants">
        <TheParticipantsPanel/>
      </v-tab-item>
      <v-tab-item :value="ProjectTab.Locations">
        <TheProjectLocationsPanel/>
      </v-tab-item>
      <v-tab-item :value="ProjectTab.Documentation">
        <TheDocumentsPanel/>
      </v-tab-item>
      <v-tab-item :value="ProjectTab.Scan">
        <TheScanModelPanel/>
      </v-tab-item>
      <v-tab-item :value="ProjectTab.Model">
        <TheReverseModelPanel/>
      </v-tab-item>
      <v-tab-item :value="ProjectTab.Inventory">
        <TheInventoryPanel/>
      </v-tab-item>
      <v-tab-item :value="ProjectTab.Analysis">
        <TheAnalysisPanel/>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script >
import Vue from 'vue';
import { mapGetters, mapActions, mapMutations } from 'vuex';

// Own Components
import TheProjectDetailsPanel from '@/components/TheProjectDetailsPanel.vue';
import TheParticipantsPanel from '@/components/TheParticipantsPanel.vue';
import TheProjectLocationsPanel from '@/components/TheProjectLocationsPanel.vue';
import TheDocumentsPanel from '@/components/TheDocumentsPanel.vue';
import TheReverseModelPanel from '@/components/TheReverseModelPanel.vue';
import TheScanModelPanel from '@/components/TheScanModelPanel.vue';
import TheInventoryPanel from '@/components/TheInventoryPanel.vue';
import TheAnalysisPanel from '@/components/TheAnalysisPanel.vue';

import {
  GET_CURRENT_PROJECT,
  SET_CURRENT_PROJECT,
  GET_PROJECT_TAB_INDEX,
  SET_PROJECT_TAB_INDEX,
  ProjectTab,
} from '@/store/project';
import { GET_AUTHENTICATION } from '@/store/auth';
import { FETCH_MULTIPLE_ACDB } from '@/store/acdb';
import { SET_VIEWER_INITIALISED } from '@/store/viewer';

export default Vue.extend({
  name: 'Project',
  components: {
    TheProjectDetailsPanel,
    TheParticipantsPanel,
    TheProjectLocationsPanel,
    TheDocumentsPanel,
    TheScanModelPanel,
    TheReverseModelPanel,
    TheInventoryPanel,
    TheAnalysisPanel
  },
  props: {
    selectedTab: {
      required: false,
      type: 'number',
    },
  },
  data() {
    return {
      ProjectTab,
    };
  },
  methods: {
    ...mapActions({
      fetchMultipleAcdb: FETCH_MULTIPLE_ACDB,
    }),
    ...mapMutations({
      setCurrentProject: SET_CURRENT_PROJECT,
      setViewerInitilised: SET_VIEWER_INITIALISED,
    }),
    onBack() {
      this.$router.push('projectsManagement');
    },
  },
  computed: {
    ...mapGetters({
      project: GET_CURRENT_PROJECT,
      auth: GET_AUTHENTICATION,
    }),

    tabIndex: {
      get() {
        return this.$store.getters[GET_PROJECT_TAB_INDEX];
      },
      set(value) {
        this.$store.commit(SET_PROJECT_TAB_INDEX, value);
      },
    },
    isCreationMode() {
      if (
        this.project === null ||
        this.project?.id === null ||
        this.project?.id === undefined
      )
        return true;
      else return false;
    },
  },

  async beforeMount() {
    if (this.auth) {
      // Making sure that the needed rights are fetched before the mounting
      await this.fetchMultipleAcdb([
        { accessType: 'create', resourceName: 'project' },
        { accessType: 'read', resourceName: 'project' },
        { accessType: 'update', resourceName: 'project' },
        { accessType: 'delete', resourceName: 'project' },
        { accessType: 'update', resourceName: 'ownProject' },
        {
          accessType: 'read',
          resourceName: 'projectDocument',
        },
        {
          accessType: 'create',
          resourceName: 'projectDocument',
        },
        {
          accessType: 'update',
          resourceName: 'projectDocument',
        },
        {
          accessType: 'delete',
          resourceName: 'projectDocument',
        },
        {
          accessType: 'read',
          resourceName: 'ownProjectDocument',
        },
        {
          accessType: 'create',
          resourceName: 'ownProjectDocument',
        },
        {
          accessType: 'update',
          resourceName: 'ownProjectDocument',
        },
        {
          accessType: 'delete',
          resourceName: 'ownProjectDocument',
        },
        {
          accessType: 'read',
          resourceName: 'participatingProjectDocument',
        },
        {
          accessType: 'create',
          resourceName: 'participatingProjectDocument',
        },
        {
          accessType: 'update',
          resourceName: 'participatingProjectDocument',
        },
        {
          accessType: 'delete',
          resourceName: 'participatingProjectDocument',
        },
        {
          accessType: 'read',
          resourceName: 'inventory',
        },

        {
          accessType: 'read',
          resourceName: 'ownProjectInventory',
        },

        {
          accessType: 'create',
          resourceName: 'inventory',
        },

        {
          accessType: 'create',
          resourceName: 'ownProjectInventory',
        },

        {
          accessType: 'update',
          resourceName: 'inventory',
        },
        {
          accessType: 'update',
          resourceName: 'ownProjectInventory',
        },
      ]);
    }
  },
  beforeRouteLeave(to, from, next) {
    this.setCurrentProject({});
    this.setViewerInitilised(false);
    next();
  },
});
</script>