<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
    <v-dialog v-model="dialogEnabled" max-width="700px" @click:outside="$emit('addEditMaterialTypeDialogClosed')" @keydown.esc="$emit('addEditMaterialTypeDialogClosed')">
      <v-stepper v-model="step">
        <v-stepper-header>
          <v-stepper-step :complete="step > 1" :editable='materialType.uid != null && editMode' step="1">
            {{ editMode ? "Edit a material type..." : "Add a new material type..." }}
          </v-stepper-step>
          <v-stepper-step :editable="materialType.uid != null" step="2">
            {{ editMode ? "Edit circularity data..." : "Add circularity data..." }}
          </v-stepper-step>
        </v-stepper-header>
        <v-stepper-items>
        <v-stepper-content step="1">
          <v-form ref="form" v-model="valid">
            <v-card>
                <v-card-title class="text-h5">
                    {{ editMode ? "Edit material type..." : "Create a new material type..." }}
                </v-card-title>
                <v-card-text>
                    <v-text-field
                        label="Name*"
                        v-model="materialType.name"
                        :rules="[v => !!v || '*required field']"
                        required
                        outlined
                        dense>
                    </v-text-field>
                    <v-text-field
                        label="Description"
                        v-model="materialType.description"
                        outlined
                        dense>
                    </v-text-field>
                    <v-text-field
                        label="Category*"
                        v-model="materialType.category"
                        :rules="[v => !!v || '*required field']"
                        required
                        outlined
                        dense>
                    </v-text-field>
                    <v-switch
                        v-model="materialType.isHazard"
                        inset
                        dense
                        :color="`${materialType.isHazard ? 'red' : 'gray'}`"
                        :label="`Hazard: ${materialType.isHazard ? 'yes' : 'no'}`">
                    </v-switch>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                  <small>*indicates required field</small>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="close">Close</v-btn>
                    <v-btn color="primary" text @click="submit" :disabled="!valid">{{ editMode ? "Save" : "Create" }}</v-btn>
                </v-card-actions>
            </v-card>
          </v-form>
        </v-stepper-content>
        <v-stepper-content step="2">
        <CircularityAddEditCard
          v-bind:circularity="circularitySelected" 
          v-bind:attachId="materialType.uid"
          v-bind:attachedToMaterial="true"
          v-bind:editMode="editModeCircularity"
          v-on:addEditCircularityClosed="close">
        </CircularityAddEditCard>
        </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-dialog>
</template>

<script lang="ts">

import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import {
  CREATE_MATERIAL_TYPE,
  UPDATE_MATERIAL_TYPE,
  GET_CURRENT_PROJECT,
  MaterialType,
  MaterialTypeCreate,
  GET_CIRCULARITY_SELECTED
} from '@/store/project';

import CircularityAddEditCard from '@/components/CircularityAddEditCard.vue';
import { mdiHazardLights } from '@mdi/js';

export default Vue.extend({
  name: 'MaterialTypeAddEditDialog',
  components: { CircularityAddEditCard },
  props:{
    materialType: {
      required:true,
      type: Object as () => MaterialType,
      default(){ return {} as MaterialType }
    },
    dialogEnabled: {
      required: true,
      default: false
    },
    editMode: {
      required: true,
      default: false
    },
  },
  data: () => ({
      // icons 
      mdiHazardLights,
      // props
      valid: false,
      step: 1,
      editModeCircularity: false,
  }),
  computed: {
    ...mapGetters({
      currentProject: GET_CURRENT_PROJECT,
      circularitySelected: GET_CIRCULARITY_SELECTED
    }),
  },

  methods: {
    ...mapActions({
      createMaterialType: CREATE_MATERIAL_TYPE
    }),
    close() {
      this.$emit('addEditMaterialTypeDialogClosed');
      this.step = 1;
    },
    cancel() {
      this.$emit('addEditMaterialTypeDialogClosed');
    },
    submit() {
      if (this.editMode) this.modify();
      else this.create();
    },
    circularityDataExists(){
      console.log("called?");
      if (this.materialType.circularity) 
      {
        console.log("false!", this.materialType.circularity);
        return false;
      }
      else return true;
    },
    async create() {
        let newMaterialType = await this.createMaterialType({
          ...this.materialType,
          projectId: this.currentProject.id,
        } as MaterialTypeCreate);
        if(newMaterialType) {
          this.materialType.uid = newMaterialType.uid;      
          this.step = 2;
        } else this. close();

    },
    async modify() {
      setTimeout(async () => {
        await this.$store.dispatch(UPDATE_MATERIAL_TYPE, this.materialType);
        this.$emit('addEditMaterialTypeDialogClosed');
      });
    },
  },
  watch:{ 
    circularitySelected(newValue, oldValue) {
      if (newValue) this.editModeCircularity = true;
      else this.editModeCircularity = false;
    },
    materialType(newValue, oldValue) {
      if (this.editMode === false) this.step = 1;
    }
  }
});
</script>