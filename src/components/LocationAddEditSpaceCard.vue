<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
  <v-card>
    <v-list dense>
      <v-subheader>{{ $t('projects.location.newSubdivisions') }}</v-subheader>
      <v-list-item
        :disabled="!canCreateLocation"
        @click="addLocationInTree(location.id, 'space')"
      >
        <v-list-item-icon>
          <v-icon>{{ mdiFloorPlan }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{$t('projects.location.space')}}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list dense>
      <!-- Delete -->
      <v-list-item
        :disabled="location.subdivisions.length > 0 || !canUpdateLocation"
        @click="removeLocationInTree(location)"
      >
        <v-list-item-icon>
          <v-icon>{{ mdiTrashCan }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{$t('projects.location.deleteSpace')}}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <!-- Rename -->
      <v-list-item
        :disabled="!canDeleteLocation"
        @click="setLocationInEditMode(location)"
      >
        <v-list-item-icon>
          <v-icon>{{ mdiCursorText }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{$t('projects.location.renameSpace')}}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';

import {
  mdiFloorPlan,
  mdiTrashCan,
  mdiCursorText,
  mdiEarthPlus,
  mdiEyePlusOutline
} from '@mdi/js';

import PointOfInterest from './LocationAddEditPointOfInterestCard.vue';

export default Vue.extend({
  name: "LocationAddEditSpaceCard",
  components: {
    PointOfInterest
  },
  props: {
    location: {
      required: true,
      type: Object,
    },
    addLocationInTree: {
      required: true,
      type: Function,
    },
    removeLocationInTree: {
      required: true,
      type: Function,
    },
    setLocationInEditMode: {
      required: true,
      type: Function,
    },
    canCreateLocation: {
      required: true,
      type: Boolean,
    },
    canDeleteLocation: {
      required: true,
      type: Boolean,
    },
    canUpdateLocation: {
      required: true,
      type: Boolean,
    },
  },
  data() {
    return {
      mdiFloorPlan,
      mdiTrashCan,
      mdiCursorText,
      mdiEarthPlus,
      mdiEyePlusOutline,
      displayPOIForm: false,
    };
  }
});
</script>