<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
  <div>
    <v-card :height='height'>
    <v-card-title>Circularity Data</v-card-title>
    <v-data-table
        dense
        :headers='circularityTableHeaders'
        :items='circularities'
        item-key="uid"
        hide-default-footer
    >
    
        <template v-slot:[`item.documents`]='{ item }'>
        <v-btn v-if="item.hasDocuments" @click="openDocuments(item)" small>
            <v-icon>{{ mdiFileDocument }}</v-icon>
        </v-btn>
        </template>
    
    </v-data-table>
    </v-card>
    <v-dialog max-width="50%" v-model="documentsDialogEnabled">
      <CircularityAddEditDocumentTable
        :documents="selectedDocuments"
        :editMode="false"
        :parentUid="selectedCircularity.uid">
      </CircularityAddEditDocumentTable>
    </v-dialog>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';

import { mdiFileDocument, mdiBedEmpty } from '@mdi/js';
import { Circularity, ProjectFile, FETCH_CIRCULARITY_DOCUMENTS, GET_CURRENT_PROJECT } from '@/store/project';

import CircularityAddEditDocumentTable from '@/components/CircularityAddEditDocumentTable.vue';
import { mapGetters } from 'vuex';


export default Vue.extend({
  name: 'ElementViewCircularityTable',
  components: { CircularityAddEditDocumentTable },
  data: () => ({
    // icons
    mdiFileDocument,
    mdiBedEmpty,
    documentsDialogEnabled: false,
    selectedDocuments: [] as ProjectFile[],
    selectedCircularity:{} as Circularity,
    circularityTableHeaders: [
      {
        text: 'Origin',
        value: 'origin',
        sortable: false,
        width: "10%"
      },
      {
        text: 'Market Value',
        value: 'marketValue',
        sortable: false,
        width: "15%"
      },
      {
        text: 'CO2 Savings',
        value: 'savingsCO2',
        sortable: false,
        width: "15%"
      },
      {
        text: 'Social Balance',
        value: 'socialBalance',
        sortable: false,
        width: "10%"
      },
      {
        text: 'Documents',
        value: 'documents',
        sortable: false,
        width: "10%"
      },
    ]
  }),
  props: {
    circularities: {
        required:true,
        default: []
    },
    height: {
        required: false,
        default: 240
    }
  },
  computed: {
    ...mapGetters({
      currentProject: GET_CURRENT_PROJECT,
    }),
  },
  methods: {
    openDocuments(circularity: any) {
      if (circularity && circularity.uid) {
        this.selectedCircularity = circularity;
        if (circularity.documents) {
          this.selectedDocuments = circularity.documents;
          this.documentsDialogEnabled = true;
        }
      }
    }
  }
});
</script>