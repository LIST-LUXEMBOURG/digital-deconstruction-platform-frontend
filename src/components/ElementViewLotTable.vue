<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
    <v-card :height='height'>
        <v-card-title>Lot</v-card-title>
        <v-simple-table>
            <template v-slot:default>
                <tbody>
                    <tr>
                        <td><b>Reference</b> {{ lot.Reference }} </td>
                        <td><b>Quantity</b> {{ lot.Quantity }}</td>
                    </tr>
                </tbody>
            </template>
        </v-simple-table>
    </v-card>
</template>

<script lang="ts">

import Vue from 'vue';

export default Vue.extend({
  name: 'ElementViewLotTable',
  data: () => ({
    lotTableHeaders: [
      {
        text: 'Lot',
        value: 'Reference',
        sortable: false,
      },
      {
        text: 'Quantity',
        value: 'Quantity',
        sortable: false,
      }
    ],
  }),
  props: {
    lot: {
        required:true,
        default: {}
    },
    height: {
        required: false,
        default: 240
    }
  }
});
</script>