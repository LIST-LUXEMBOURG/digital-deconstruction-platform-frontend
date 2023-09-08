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
        @click="addLocationInTree(location.id, 'building')"
      >
        <v-list-item-icon>
          <v-icon>{{ mdiHomeVariant }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{
            $t('projects.location.building')
          }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item
        :disabled="!canCreateLocation"
        @click="addLocationInTree(location.id, 'space')"
      >
        <v-list-item-icon>
          <v-icon>{{ mdiFloorPlan }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{
            $t('projects.location.space')
          }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list dense>
      <!-- Delete -->
      <v-list-item
        :disabled="location.subdivisions.length > 0 || !canDeleteLocation"
        @click="removeLocationInTree(location)"
      >
        <v-list-item-icon>
          <v-icon>{{ mdiTrashCan }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{
            $t('projects.location.deleteSite')
          }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <!-- Rename -->
      <v-list-item
        :disabled="!canUpdateLocation"
        @click="setLocationInEditMode(location)"
      >
        <v-list-item-icon>
          <v-icon>{{ mdiCursorText }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{
            $t('projects.location.renameSite')
          }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <!-- Site Coordinate -->
      <v-list-item
        :disabled="!canUpdateLocation"
        @click.stop="openCoordinatesForm"
      >
        <v-list-item-icon>
          <v-icon>{{ mdiEarthPlus }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{
            $t('projects.location.siteCoordinates')
          }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

    </v-list>
    <v-dialog v-model="displaySiteCoordinatesForm" max-width="33%">
      <LocationAddEditSiteCoordinatesCard
        :location="location"
        :closeCoordinatesForm="closeCoordinatesForm"
      />
    </v-dialog>
    <v-dialog v-model="displayPOIForm" max-width="50%">
      <point-of-interest
        :location="location"
        :closePOIForm="closePOIForm"
      ></point-of-interest>
    </v-dialog>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  mdiHomeVariant,
  mdiFloorPlan,
  mdiTrashCan,
  mdiCursorText,
  mdiEarthPlus,
  mdiEyePlusOutline,
} from '@mdi/js';
import LocationAddEditSiteCoordinatesCard from './LocationAddEditSiteCoordinatesCard.vue';
import LocationAddEditPointOfInterestCard from './LocationAddEditPointOfInterestCard.vue';

export default Vue.extend({
  name: "LocationAddEditSiteCard",
  components: {
    LocationAddEditSiteCoordinatesCard,
    LocationAddEditPointOfInterestCard,
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
      mdiHomeVariant,
      mdiFloorPlan,
      mdiTrashCan,
      mdiCursorText,
      mdiEarthPlus,
      mdiEyePlusOutline,
      displaySiteCoordinatesForm: false,
      displayPOIForm: false,
    };
  },
  methods: {
    openCoordinatesForm() {
      (this as any).displaySiteCoordinatesForm = true;
    },
    closeCoordinatesForm() {
      (this as any).displaySiteCoordinatesForm = false;
    },
    openPOIForm() {
      (this as any).displayPOIForm = true;
    },
    closePOIForm() {
      (this as any).displayPOIForm = false;
    },
  }
});
</script>