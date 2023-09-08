<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
<div>
  <v-card>
    <v-data-table
        dense  
        :headers='classificationTableHeaders'
        :items='classificationEntries'
        hide-default-footer
    >
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon color="red" @click="deleteEntry(item)">
        {{mdiDelete}}
      </v-icon>
    </template>
    </v-data-table>
  </v-card>
  <br>
  <v-row>
    <v-col cols="3">
      <v-autocomplete 
        dense
        filled
        outlined
        :items="classifications.data"
        label="system"
        v-model="selectedSystem"
        :item-value="v =>v.children"
        :item-text="v => v.name">
      </v-autocomplete>
    </v-col>
    <v-col cols="3">
      <v-autocomplete
        :disabled="!selectedSystem.length"
        dense
        filled
        outlined
        :items="selectedSystem"
        label="table"
        v-model="selectedTable"
        :item-value="v =>v"
        :item-text="v => v.name">
      </v-autocomplete>
    </v-col>
    <v-col cols ="6">
      <v-text-field 
        v-if="selectedTable"
        :disabled="!selectedTable.id"
        dense
        outlined
        clearable
        type="text"
        :clear-icon=mdiCloseCircle
        v-model="search"
        label="search labels"
        :append-outer-icon="mdiSearchWeb"
        @click:append-outer="searchCodes"
        @keyup.enter="searchCodes"
        ></v-text-field>
        <v-text-field v-else label="no table selected" disabled outlined dense></v-text-field>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="5">
      <v-autocomplete
        v-if="foundEntries.length"
        dense
        filled
        outlined
        :items="foundEntries"
        label="...found entries"
        v-model="selectedEntry"
        :item-value="v =>v"
        :item-text="v => v.label">
      </v-autocomplete>
      <v-text-field v-else label="no results" disabled outlined dense></v-text-field>
    </v-col>
    <v-col cols="3">
      <v-text-field v-if="selectedEntry && selectedEntry.code" v-model="selectedEntry.code" label="code" disabled outlined dense></v-text-field>
      <v-text-field v-else label="" disabled outlined dense></v-text-field>
    </v-col>
    <v-col cols="2">
      <v-btn color="secondary" @click="addNewEntry()"><v-icon>{{mdiPlus}}</v-icon></v-btn>
    </v-col>
    <v-col cols="1">
      <v-btn color="primary" @click="validateClassifications(classificationEntries)"><v-icon>{{mdiCheck}}</v-icon></v-btn>
    </v-col>
  </v-row>
</div>
</template>

<script lang="ts">

import Vue from 'vue';
import { mdiDelete, mdiPlus, mdiSearchWeb, mdiCloseCircle, mdiCheck } from '@mdi/js';
import { mapActions, mapGetters } from 'vuex';
import {
  ClassificationEntry,
  ClassificationSystem,
  FETCH_CLASSIFICATION_SYSTEMS,
  GET_CLASSIFICATION_SYSTEMS,
  FETCH_CLASSIFICATION_ENTRIES,
  GET_CLASSIFICATION_ENTRIES,
  ClassificationEntryQuery
} from '@/store/project';

export default Vue.extend({
  name: 'ElementTypeAddEditClassificationTable',
  props: {
    classificationEntries: {
      required:true,
      type: Array as () => ClassificationEntry[],
      default(){ return []}
    }
  },
  data: () => ({
    // icons
    mdiDelete,
    mdiPlus,
    mdiSearchWeb,
    mdiCloseCircle,
    mdiCheck,
    // eddited data
    search: "",
    selectedSystem: [],
    selectedTable: {} as ClassificationSystem,
    selectedEntry: {} as ClassificationEntry,
    classificationTableHeaders: [
      {
        text: 'Code',
        value: 'code',
        sortable: true,
        width: "25%"
      },
      {
        text: 'Label',
        value: 'label',
        sortable: true,
        width: "50%"
      },
      {
        text:'Actions',
        value:'actions',
        sortable: false,
        width: "15%"
      }
    ]
  }),
  async created() {
    await this.fetchClassificationSystems();
  },
  methods: {
    ...mapActions({
      fetchClassificationSystems: FETCH_CLASSIFICATION_SYSTEMS,
      fetchClassificationEntries: FETCH_CLASSIFICATION_ENTRIES
    }),
    async searchCodes() {
      await this.fetchClassificationEntries({
        size: 20,
        systemId: this.selectedTable.id,
        label: this.search,
        property: "label",
        direction: "ascending"
      } as ClassificationEntryQuery);
    },
    addNewEntry() {
      const newEntry : ClassificationEntry = Object.assign({}, this.selectedEntry);
      // check duplicates first
      if (this.checkDuplicateEntries(newEntry)==true) {
        this.classificationEntries.push(newEntry);
      }
    },
    checkDuplicateEntries(newEntry: ClassificationEntry) {
      let isOk = true;
      this.classificationEntries.forEach(entry => {
        if (newEntry.id === entry.id) {
          isOk = false;
        }
      });
      return isOk;
    },
    deleteEntry(item: ClassificationEntry) {
      const index = this.classificationEntries.indexOf(item, 0);
      if (index > -1) this.classificationEntries.splice(index,1);
    },
    validateClassifications(classificationsEntries: ClassificationEntry[]) {
      this.$emit('validateClassifications', classificationsEntries);
      this.selectedSystem = [];
      this.selectedTable = {} as ClassificationSystem;
      this.selectedEntry = {} as ClassificationEntry;
    },
  },
  computed: {
    ...mapGetters({
      foundEntries: GET_CLASSIFICATION_ENTRIES,
      classifications: GET_CLASSIFICATION_SYSTEMS
    }),

  }
});
</script>
          