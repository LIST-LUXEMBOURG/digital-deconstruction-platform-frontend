<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
    <v-card :height='height'>
    <v-card-title>Related Documents</v-card-title>
    <v-data-table
        dense
        :headers='documentsTableHeaders'
        :items='documents'
        item-key="Name"
        hide-default-footer
    >
        <template v-slot:[`item.Resource`]='{ item }'>
        <v-btn small :href="item.Resource" target="_blank">
            <v-icon>{{ mdiFileDocument }}</v-icon>
        </v-btn>
        </template>
    </v-data-table>
    </v-card>
</template>

<script lang="ts">

import Vue from 'vue';

import { mdiFileDocument } from '@mdi/js';


export default Vue.extend({
  name: 'ElementViewDocumentTable',
  data: () => ({
    // icons
    mdiFileDocument,
    documentsTableHeaders: [
      {
        text: 'Name',
        value: 'Name',
        sortable: false,
        width: "20%"
      },
      {
        text: 'Author',
        value: 'Author',
        sortable: false,
        width: "15%"
      },
      {
        text: 'Last Modified',
        value: 'LastModified',
        sortable: false,
        width: "15%"
      },
      {
        text: 'Resource',
        value: 'Resource',
        sortable: false,
        width: "10%"
      },
    ]
  }),
  props: {
    documents: {
        required:true,
        default: []
    },
    height: {
        required: false,
        default: 180
    }
  }
});
</script>