<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
    <v-card :height='height'>
        <v-card-title>Element Properties</v-card-title>
        <v-data-table
            dense
            :headers='physicalPropertiesTableHeaders'
            :items='properties'
            item-key="Name"
            hide-default-footer
        >
        </v-data-table>
    </v-card>
</template>

<script lang="ts">

import Vue from 'vue';

export default Vue.extend({
  name: 'ElementViewPropertyTable',
  data: () => ({
    physicalPropertiesTableHeaders: [
      {
        text: 'Name',
        value: 'propertyType.name',
        sortable: false,
        width: "40%"
      },
      {
        text: 'Value',
        value: 'value',
        sortable: false,
        width: "30%"
      },
      {
        text: 'Unit',
        value: 'propertyUnit.symbol',
        sortable: false,
        width: "30%"
      },
    ],

  }),
  props: {
    properties: {
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
          