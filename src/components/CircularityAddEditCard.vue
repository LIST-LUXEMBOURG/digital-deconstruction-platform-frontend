<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->


<template>
  <v-form ref="form" v-model="valid">
    <v-card>
      <v-card-title class="text-h5">
          {{ editMode ? "Circularity data" : "No data saved here. Add some?" }}
      </v-card-title>
      <v-card-text>
        <v-text-field
            label="Market Value"
            v-model="circularity.marketValue"
            :prepend-icon='editMode ? mdiCheck : ""'
            required
            outlined
            dense>
        </v-text-field>
        <v-text-field
            label="CO2 Savings"
            v-model="circularity.savingsCO2"
            :prepend-icon='editMode ? mdiCheck : ""'
            outlined
            dense>
        </v-text-field>
        <v-text-field
            label="Social Balance"
            v-model="circularity.socialBalance"
            :prepend-icon='editMode ? mdiCheck : ""'
            required
            outlined
            dense>
        </v-text-field>
        <CircularityAddEditDocumentTable
          :documents="circularitySelectedDocuments"
          :hidden="!editMode"
          :editMode="editMode"
          :parentUid="circularity.uid">
        </CircularityAddEditDocumentTable>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
          <v-btn :color='confirmDeletion ? "red" : "primary"' :hidden="!editMode" @click="remove"><v-icon>{{ mdiDelete }}</v-icon></v-btn>
          <v-btn text color="red" :hidden="!confirmDeletion" @click="remove">Are you sure?</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="close">Close</v-btn>
          <v-btn color="primary" text @click="submit" :disabled="!valid">{{ editMode ? "Save" : "Create" }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script lang="ts">

import Vue from 'vue';
import CircularityAddEditDocumentTable from '@/components/CircularityAddEditDocumentTable.vue';
import { mapGetters } from 'vuex';
import { mdiDelete, mdiCheck } from '@mdi/js';
import {
    // TO DO
    CREATE_ATTACH_CIRCULARITY,
    UPDATE_CIRCULARITY,
    DELETE_CIRCULARITY,
    GET_CURRENT_PROJECT,
    FETCH_CIRCULARITY_DOCUMENTS,
    Circularity,
    GET_CIRCULARITY_SELECTED_DOCUMENTS,
    CircularityCreate,
    ProjectFile
} from '@/store/project';

export default Vue.extend({
  name: 'CircularityAddEditCard',
  components: { CircularityAddEditDocumentTable },
  props:{
    circularity: {
      required:true,
      type: Object as () => Circularity,
      default(){ return { marketValue:0, savingsCO2:0, socialBalance:0 } as Circularity }
    },
    attachId: {
      required: false,
    },
    attachedToMaterial: {
      required: false,
      default: false
    },
    attachedToElementType: {
      required: false,
      default: false
    },
    attachedToElement:{
      required: false,
      default: false
    },
    editMode: {
      required: true,
      default: false
    },
  },
  data: () => ({
      //icons
      mdiDelete,
      mdiCheck,
      // props
      valid: false,
      confirmDeletion: false
  }),
  computed: {
    ...mapGetters({
      currentProject: GET_CURRENT_PROJECT,
      circularitySelectedDocuments: GET_CIRCULARITY_SELECTED_DOCUMENTS
    }),
  },

  methods: {
    close() {
      this.$emit('addEditCircularityClosed');
      this.confirmDeletion = false;
    },
    remove() {
      if (this.confirmDeletion) {
        setTimeout(async () => {
          const done = await this.$store.dispatch(DELETE_CIRCULARITY, this.circularity);
          this.$emit('addEditCircularityClosed');
        });
      }
      this.confirmDeletion = !this.confirmDeletion;
    },
    submit() {
      if (this.editMode) this.modify();
      else this.create();
    },
    async create() {
      await this.$store.dispatch(CREATE_ATTACH_CIRCULARITY, {
        isAttachMaterialType: this.attachedToMaterial,
        isAttachElementType: this.attachedToElementType,
        isAttachElement: this.attachedToElement,
        attachId: this.attachId,
        circularity: {...this.circularity},
      } as CircularityCreate);
      this.$emit('addEditCircularityClosed');
    },
    async modify() {
      setTimeout(async () => {
        await this.$store.dispatch(UPDATE_CIRCULARITY, this.circularity);
        this.$emit('addEditCircularityClosed');
      });
    },
  },
  watch:{
    async circularity(newValue, oldValue){
      if (newValue.uid)
      {
        await this.$store.dispatch(FETCH_CIRCULARITY_DOCUMENTS, newValue);
      }
    }
  }
});
</script>