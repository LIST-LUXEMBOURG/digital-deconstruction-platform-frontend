<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
    <v-dialog v-model="dialogEnabled" max-width="500px" @click:outside="$emit('addEditPropertyTypeDialogClosed')" @keydown.esc="$emit('addEditPropertyTypeDialogClosed')">
        <v-form ref="form" v-model="valid">
            <v-card>
                <v-card-title class="text-h5">
                    {{ editMode ? "Edit property type..." : "Create a new property type..." }}
                </v-card-title>
                <v-card-text>
                    <v-text-field
                        label="Name*"
                        v-model="propertyType.name"
                        :rules="[v => !!v || '*required field']"
                        required
                        outlined
                        dense>
                    </v-text-field>
                    <v-switch
                        v-model="propertyType.isNumeric"
                        inset
                        dense
                        :label="`Numeric: ${propertyType.isNumeric ? 'yes' : 'no'}`">
                    </v-switch>
                    <v-divider>
                    </v-divider>
                    <v-container>
                    <v-text-field
                        label="Unit name"
                        v-model="propertyType.propertyUnits[0].name"
                        outlined
                        dense>
                    </v-text-field>
                    <v-text-field
                        label="Unit symbol"
                        v-model="propertyType.propertyUnits[0].symbol"    
                        outlined
                        dense>
                    </v-text-field>
                    </v-container>
                    <small>*indicates required field</small>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="cancel">Cancel</v-btn>
                    <v-btn color="primary" text @click="submit" :disabled="!valid">{{ editMode ? "Save" : "Create" }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </v-dialog>
</template>

<script lang="ts">

import Vue from 'vue';
import {
  CREATE_PROPERTY_TYPE,
  PropertyType,
  PropertyUnit
} from '@/store/project';

export default Vue.extend({
  name: 'PropertyTypeAddEditDialog',
  props:{
    propertyType: {
      required:true,
      type: Object as () => PropertyType,
      default(){ return { isNumeric: false, propertyUnits:[{name:"", symbol:""}] as PropertyUnit[]} as PropertyType }
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
      // props
      valid: false,
  }),
  methods: {
    cancel() {
      this.$emit('addEditPropertyTypeDialogClosed');
    },
    submit() {
      if (this.editMode) { 
        // do nothing 
        // cannot edit basic properties on front-end
      }
      else this.create();
    },
    async create() {
        await this.$store.dispatch(CREATE_PROPERTY_TYPE, this.propertyType);
        (this.$refs.form as HTMLFormElement).reset();
        this.$emit('addEditPropertyTypeDialogClosed');
    },
  },
});
</script>