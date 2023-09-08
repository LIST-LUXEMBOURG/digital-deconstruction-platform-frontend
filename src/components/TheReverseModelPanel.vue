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
        fab
        class="mb-2 mr-2 ml-2"
        color="secondary"
        @click="() => (displayConfigureBimModel = true)">
        <v-icon>{{ mdiCogOutline }}</v-icon>
      </v-btn>
      <v-btn
        fab
        class="mb-2 ml-2"
        color="secondary"
        :disabled="!autodeskAccessToken.access_token"
        @click="resetModel()">
        <v-icon>{{ mdiAutorenew }}</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        fab
        class="mb-2 mr-2"
        color="primary"
        :disabled='rbimLayerDisabled'
        @click="enableRbimLayer">
        <v-icon>{{ mdiGantryCrane }}</v-icon>
      </v-btn>
      <v-btn
        fab
        class="mb-2 mr-2"
        color="primary"
        :disabled=rbimElementsLayerDisabled
        @click="enableRbimElementsLayer">
        <v-icon>{{ mdiGradientHorizontal }}</v-icon>
      </v-btn>
      <v-btn
        fab
        class="mb-2 mr-2"
        color="primary"
        :disabled=bimLayerDisabled
        @click="enableBimLayer">
        <v-icon>{{ mdiWarehouse }}</v-icon>
      </v-btn>

    </v-row>

    <v-row
      align-content="center"
      justify="center"
      v-if="!!autodeskAccessToken.access_token">
      <v-responsive :aspect-ratio="16 / 6.5">
          <forge-vuer
            id="forge-vuer"
            :getAccessToken="getTokenAsync"
            :urn="autodeskAccessToken.formattedUrn"
            :options="{ api: autodeskAccessToken.zone }"
            @viewerStarted="onViewerStarted"
            @object-tree-created-event="initialiseViewerData"
          />
      </v-responsive>
    </v-row>

    <v-row align="center" justify="center" v-if="isLoading === false && !autodeskAccessToken.access_token">
      <v-col>
        <v-row align="center" justify="center">
          <v-btn
            outlined
            color="primary"
            @click.stop="() => (displayConfigureBimModel = true)"
          >
            <v-icon left>{{ mdiCogOutline }}</v-icon>
            setup
          </v-btn>
        </v-row>
        <v-row align="center" justify="center">
          <br>
          You must configure the viewer before going further.
        </v-row>
      </v-col>
    </v-row>

    <v-overlay opacity="0" :absolute="true" :value="isLoading">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
    </v-overlay>

    <v-dialog
      v-model="displayConfigureBimModel"
      width="auto "
      :fullscreen="$vuetify.breakpoint.xsOnly"
      max-width="50%"
    >
      <ReverseModelConfigurationDialog :closeDialog="closeDialog" :project3dModel="{ id: 1 }" />
    </v-dialog>

  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { mdiCogOutline, mdiAutorenew, mdiWarehouse, mdiGradientHorizontal, mdiGantryCrane } from '@mdi/js';
import ReverseModelConfigurationDialog from '@/components/ReverseModelConfigurationDialog.vue';
import ForgeVuer from 'forge-vuer';
import {
  FETCH_AUTODESK_ACCESS_TOKEN,
  GET_CURRENT_PROJECT,
  GET_AUTODESK_ACCESS_TOKEN,
  GET_ELEMENTS,
  FETCH_ELEMENTS,
  GET_ELEMENTS_FILTERED
} from '@/store/project';
import {
  GET_IFCIDS,
  GET_VIEWER_SELECTED_ELEMENTS,
  GET_RBIM_ALL_ELEMENTS,
  GET_RBIM_SELECTED_ELEMENTS,
  INITIALISE_VIEWER_DATA,
  GET_VIEWER_INITIALISED,
  MATCH_VIEWER_ELEMENTS_IFC,
  MATCH_VIEWER_ELEMENTS_RBIM_IFC,
  redToGreen,
  colorRange,
} from '@/store/viewer';

export default {
  name: 'TheReverseModelPanel',
  components: {
    ForgeVuer,
    ReverseModelConfigurationDialog,
  },
  data() {
    return {
      mdiCogOutline,
      mdiAutorenew,
      mdiWarehouse,
      mdiGradientHorizontal,
      mdiGantryCrane,
      displayConfigureBimModel: false,

      isLoading: false,

      viewer3d: null,
      viewerModel: null,
      bimLayerDisabled: true,
      rbimLayerDisabled: true,
      rbimElementsLayerDisabled: false,
    };
  },
  methods: {
    ...mapActions({
      fetchElements: FETCH_ELEMENTS,
      fetchAutodeskAccessToken: FETCH_AUTODESK_ACCESS_TOKEN,
      initialiseViewerData: INITIALISE_VIEWER_DATA,
      matchViewerElementsIfc: MATCH_VIEWER_ELEMENTS_IFC,
      matchViewerElementsRbimIfc: MATCH_VIEWER_ELEMENTS_RBIM_IFC
    }),
    enableBimLayer() {
      this.viewer3d.clearThemingColors();
      this.bimLayerDisabled = true;
      this.rbimLayerDisabled = false;
      this.rbimElementsLayerDisabled = false;
    },
    enableRbimLayer() {
      this.createRbimColorLayer(this.rbimAllElements);
      this.rbimLayerDisabled = true;
      this.bimLayerDisabled = false;
      this.rbimElementsLayerDisabled = false;
    },
    enableRbimElementsLayer() {
      this.matchViewerElementsRbimIfc({ viewer3d: this.viewer3d, inventory:this.elementsFiltered.data, selectedOnly:true });
      this.rbimElementsLayerDisabled = true;
      this.rbimLayerDisabled = false;
      this.bimLayerDisabled = false;
    },
    createRbimColorLayer(rbimElements) {
      this.viewer3d.clearThemingColors();
      let colors = redToGreen(colorRange, 1);
      const { groupBy, ...groups } = rbimElements;
      for (let key in groups) {
        groups[key]
          .map(node => node.dbIds)
          .flat()
          .forEach(node => {
            this.viewer3d.setThemingColor(
              node,
              colors[parseInt(key)],
              null,
              true,
            );
          });
      }
      this.viewer3d.impl.invalidate(true);
    },
    getTokenAsync: async function(onSuccess) {
      let token = this.autodeskAccessToken.access_token;
      let expireTimeSeconds = 3599;
      onSuccess(token, expireTimeSeconds);
    },
    async refreshToken() {
      await this.fetchAutodeskAccessToken({
        projectId: this.currentProject.id,
      });
    },
    closeDialog() {
      this.displayConfigureBimModel = false;
    },
    onViewerStarted(viewer3d) {
      this.viewer3d = viewer3d;
    },
    resetModel() {
      this.viewer3d.showAll();
    }
  },
  computed: {
    ...mapGetters({
      currentProject: GET_CURRENT_PROJECT,
      elements: GET_ELEMENTS,
      elementsFiltered: GET_ELEMENTS_FILTERED,
      autodeskAccessToken: GET_AUTODESK_ACCESS_TOKEN,
      ifcIds: GET_IFCIDS,
      selectedIds: GET_VIEWER_SELECTED_ELEMENTS,
      rbimAllElements: GET_RBIM_ALL_ELEMENTS,
      rbimSelectedElements: GET_RBIM_SELECTED_ELEMENTS,
      isViewerInitialised: GET_VIEWER_INITIALISED
    }),
    modelName() {
      if (!this.autodeskAccessToken.urn) return '';
      let splitted = this.autodeskAccessToken.urn.split('/');

      return `${splitted[splitted.length - 1]}`;
    },
  },
  async created() {
    
    this.isLoading = true;
    await this.fetchAutodeskAccessToken({
      projectId: this.currentProject.id,
    });
    this.isLoading = false;
  },
  watch: {
    ifcIds(newValues, oldValues) {
      this.matchViewerElementsIfc( {ifcIds:newValues, viewer3d:this.viewer3d } );
      if (this.rbimElementsLayerDisabled) {
        this.matchViewerElementsRbimIfc({ viewer3d: this.viewer3d, inventory:this.elementsFiltered.data, selectedOnly:true });
      }
    },
    selectedIds(newSelection, oldSelection) {
      this.viewer3d.select(newSelection);
      this.viewer3d.isolate(newSelection);
      this.viewer3d.fitToView(newSelection);
    },
    rbimSelectedElements(newElements, oldElements) {
      if (this.rbimElementsLayerDisabled == false) return;
      if (newElements) this.createRbimColorLayer(newElements);
    },
    isViewerInitialised(newValue, oldValue) {
      // once the viewer model arrives, trigger reuse color layers for full model (once per load)
      this.fetchElements().then(response => {
        this.matchViewerElementsRbimIfc({ viewer3d: this.viewer3d, inventory: this.elements, selectedOnly:false });
        this.rbimLayerDisabled = false;
      });
    }
  },
};
</script>