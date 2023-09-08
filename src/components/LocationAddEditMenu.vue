<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
  <LocationAddEditSiteCard
    v-if="location.type === 'site'"
    :location="location"
    :addLocationInTree="addLocationInTree"
    :removeLocationInTree="removeLocationInTree"
    :setLocationInEditMode="setLocationInEditMode"
    :canCreateLocation="canCreateLocation"
    :canDeleteLocation="canDeleteLocation"
    :canUpdateLocation="canUpdateLocation"
  >
  </LocationAddEditSiteCard>
  <LocationAddEditBuildingCard
    v-else-if="location.type === 'building'"
    :location="location"
    :addLocationInTree="addLocationInTree"
    :removeLocationInTree="removeLocationInTree"
    :setLocationInEditMode="setLocationInEditMode"
    :canCreateLocation="canCreateLocation"
    :canDeleteLocation="canDeleteLocation"
    :canUpdateLocation="canUpdateLocation"
  >
  </LocationAddEditBuildingCard>
  <LocationAddEditStoreyCard
    v-else-if="location.type === 'storey'"
    :location="location"
    :addLocationInTree="addLocationInTree"
    :removeLocationInTree="removeLocationInTree"
    :setLocationInEditMode="setLocationInEditMode"
    :canCreateLocation="canCreateLocation"
    :canDeleteLocation="canDeleteLocation"
    :canUpdateLocation="canUpdateLocation"
  >
  </LocationAddEditStoreyCard>
  <LocationAddEditSpaceCard
    v-else-if="location.type === 'space'"
    :location="location"
    :addLocationInTree="addLocationInTree"
    :removeLocationInTree="removeLocationInTree"
    :setLocationInEditMode="setLocationInEditMode"
    :canCreateLocation="canCreateLocation"
    :canDeleteLocation="canDeleteLocation"
    :canUpdateLocation="canUpdateLocation"
  >
  </LocationAddEditSpaceCard>
</template>

<script lang="ts">
import Vue from 'vue';

import LocationAddEditSiteCard from '@/components/LocationAddEditSiteCard.vue';
import LocationAddEditBuildingCard from '@/components/LocationAddEditBuildingCard.vue';
import LocationAddEditStoreyCard from '@/components/LocationAddEditStoreyCard.vue';
import LocationAddEditSpaceCard from '@/components/LocationAddEditSpaceCard.vue';


export default Vue.extend({
  name: "LocationAddEditMenu",
  components: {
    LocationAddEditSiteCard,
    LocationAddEditBuildingCard,
    LocationAddEditStoreyCard,
    LocationAddEditSpaceCard,
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
      type: Boolean
    },
    canDeleteLocation: {
      required: true,
      type: Boolean
    },
    canUpdateLocation: {
      required: true,
      type: Boolean
    }
  },
});
</script>