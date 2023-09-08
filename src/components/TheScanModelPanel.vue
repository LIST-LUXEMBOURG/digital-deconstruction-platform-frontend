<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

 <template>
  <v-container fluid>
    <v-row>
      <v-btn
        :disabled="!canUpsertProject3DScanConfig"
        color="secondary"
        fab
        class="mb-2 ml-2 mr-2"
        @click="
          () => {
            displayConfigureProject3DScan = true;
          }
        "
      >
        <v-icon>{{ mdiCogOutline }}</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn class="mb-2 ml-2 mr-2" color="primary" fab @click="togglePoiList">
        <v-icon>{{ mdiScatterPlotOutline }}</v-icon>
      </v-btn>
    </v-row>
    <v-row align="center">

          <v-responsive
            v-show="!!currentProject3dScanConfig.scanUrl"
            :aspect-ratio="16 / 6.5"
          >
            <iframe
              :src="currentProject3dScanConfig.scanUrl"
              width="100%"
              height="100%"
              frameborder="0"
              class="pa-auto"
            >
            </iframe>
          </v-responsive>
          <span v-show="!currentProject3dScanConfig.scanUrl">
            There is no URL for this project 3D scan
          </span>
    </v-row>
    <v-dialog
      v-model="displayConfigureProject3DScan"
      max-width="40%"
    >
      <ScanModelConfigurationCard
        :project3DScanConfig="currentProject3dScanConfig"
        :closeUpsert3DScanConfigForm="closeUpsert3DScanConfigForm"
      ></ScanModelConfigurationCard>
    </v-dialog>
    <PointsOfInterestListViewDialog
      v-bind:dialogEnabled="poiListDialogEnabled"
      v-on:poiListDialogClosed="togglePoiList" 
      @exit="togglePoiList">
    </PointsOfInterestListViewDialog>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { mdiCogOutline, mdiScatterPlotOutline } from '@mdi/js';

import ScanModelConfigurationCard from '@/components/ScanModelConfigurationCard.vue';
import PointsOfInterestListViewDialog from '@/components/PointsOfInterestListViewDialog.vue';
import { mapActions, mapGetters } from 'vuex';
import {
  FETCH_PROJECT_3D_SCAN_CONFIG,
  GET_CURRENT_PROJECT,
  GET_PROJECT_3D_SCAN_CONFIG,
} from '@/store/project';
import { GET_ACDB, FETCH_MULTIPLE_ACDB } from '@/store/acdb';

export default Vue.extend({
  name: "TheScanModelPanel",
  components: {
    ScanModelConfigurationCard,
    PointsOfInterestListViewDialog
  },
  methods: {
    ...mapActions({
      fetchMultipleAcdb: FETCH_MULTIPLE_ACDB,
      fetchCurrentProject3dScanConfig: FETCH_PROJECT_3D_SCAN_CONFIG,
    }),
    closeUpsert3DScanConfigForm() {
      this.displayConfigureProject3DScan = false;
    },
    togglePoiList(){
      this.poiListDialogEnabled = !this.poiListDialogEnabled;
    }
  },
  async created() {
    await this.fetchMultipleAcdb([
      { accessType: 'read', resourceName: 'project3DScanConfig' },
      { accessType: 'read', resourceName: 'ownProject3DScanConfig' },
      { accessType: 'read', resourceName: 'participatingProject3DScanConfig' },
      { accessType: 'create', resourceName: 'project3DScanConfig' },
      { accessType: 'update', resourceName: 'project3DScanConfig' },
    ]);
    await this.fetchCurrentProject3dScanConfig({projectId: this.currentProject.id});
    this.canUpsertProject3DScanConfig =
      this.getAcdb('create', 'project3DScanConfig').hasAccess ||
      (this.getAcdb('update', 'project3DScanConfig').hasAccess &&
        !!this.currentProject3dScanConfig.id);
  },
  data() {
    return {
      mdiCogOutline,
      mdiScatterPlotOutline,
      displayConfigureProject3DScan: false,
      canUpsertProject3DScanConfig: false,
      poiListDialogEnabled: false,
    };
  },
  computed: {
    ...mapGetters({
      currentProject: GET_CURRENT_PROJECT,
      currentProject3dScanConfig: GET_PROJECT_3D_SCAN_CONFIG,
      getAcdb: GET_ACDB,
    }),
  },
});
</script>