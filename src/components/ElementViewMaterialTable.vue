<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
    <v-card :height='height'>
        <v-card-title>Embedded Materials</v-card-title>
        <v-data-table
            dense  
            :headers='materialTableHeaders'
            :items='materials'
            item-key="uid"
            hide-default-footer
        >
            <template v-slot:[`item.materialType.isHazard`]='{ item }'>
            <v-icon :color="item.materialType.isHazard ? 'red': 'black'">{{ mdiHazardLights }}</v-icon>
            </template>
        </v-data-table>
    </v-card>
</template>

<script lang="ts">

import Vue from 'vue';
import { mdiHazardLights } from '@mdi/js';

export default Vue.extend({
  name: 'ElementViewMaterialTable',
  data: () => ({
    // icons
    mdiHazardLights,
    // table properties
    materialTableHeaders: [
      {
        text: 'Hazard',
        value: 'materialType.isHazard',
        sortable: false,
        width: "10%"
      },
      {
        text: 'Name',
        value: 'materialType.name',
        sortable: false,
        width: "40%"
      },
      {
        text: 'Category',
        value: 'materialType.category',
        sortable: false,
        width: "40%"
      },
      {
        text: 'Mass',
        value: 'mass',
        sortable: false,
        width: "10%"
      },
      {
        text: 'Volume',
        value: 'volume',
        sortable: false,
        width: "10%"
      }
    ]
  }),
  props: {
    materials: {
        required:true,
        default: []
    },
    height: {
        required: false,
        default: 280
    }
  }
});
</script>
          