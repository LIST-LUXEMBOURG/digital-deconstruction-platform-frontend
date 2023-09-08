<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
    <div>
      <v-data-table
        :headers="headers"
        :items="materialTypes"
        :items-per-page="10"
        class="elevation-5"
        :show-select="true"
      >
        <template v-slot:top>
            <v-row align="center" class="ml-4 mr-4">
                <v-col>
                </v-col>
                <v-spacer></v-spacer>
                <v-col align="center">
                    <v-btn class="mb-3" x-large plain d-block text>Material Types Inventory</v-btn>
                </v-col>
                <v-spacer></v-spacer>
                <v-col align="right">
                  <v-btn
                    color="primary"
                    class="mr-2"
                    @click="createMaterialType">
                    <v-icon>{{ mdiPlus }}</v-icon>
                  </v-btn>
                </v-col>
            </v-row>
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <v-menu bottom left :close-on-content-click="!confirmDeletion">
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>{{ mdiDotsVertical }}</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item @click="onMenuClick('edit', item)">
                <v-list-item-icon>
                  <v-icon>
                    {{ mdiPencil }}
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{ $t('edit') }} </v-list-item-title>
              </v-list-item>

              <v-list-item @click="onMenuClick('delete', item)">
                <v-list-item-icon>
                  <v-icon :color="confirmDeletion ? 'error' : null">
                    {{ mdiDelete }}
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-title>
                  <span :class="confirmDeletion ? 'confirm-deletion' : null">
                    {{
                      confirmDeletion ? $t('confirmDeletion') : $t('delete')
                    }}
                  </span>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
        <MaterialTypeAddEditDialog 
            v-bind:materialType="materialTypeSelected"
            v-bind:editMode="materialTypeAddEditDialogEditMode" 
            v-bind:dialogEnabled="materialTypeAddEditDialogEnabled" 
            v-on:addEditMaterialTypeDialogClosed="materialTypeAddEditDialogEnabled = false" 
            @exit="materialTypeAddEditDialogEnabled = false">
        </MaterialTypeAddEditDialog>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { mdiDotsVertical, mdiPencil, mdiDelete, mdiPlus } from '@mdi/js';

import MaterialTypeAddEditDialog from '@/components/MaterialTypeAddEditDialog.vue';
import ElementTableFilter from '@/components/ElementTableFilter.vue';

import {
  GET_CURRENT_PROJECT,
  GET_MATERIAL_TYPES,
  FETCH_MATERIAL_TYPES,
  DELETE_MATERIAL_TYPE,
  GET_MATERIAL_TYPE_SELECTED,
  FETCH_MATERIAL_TYPE_SELECTED,
  SET_MATERIAL_TYPE_SELECTED,
  SET_CIRCULARITY_SELECTED
} from '@/store/project';

import { MaterialType, MaterialTypeAnalysis } from '@/store/project/types';

export default Vue.extend({
  name: 'MaterialTypeTable',
  components: { MaterialTypeAddEditDialog, ElementTableFilter },
  data() {
    const headers = [
      { text: 'Name', value: 'name' },
      { text: 'Description', value: 'description', width: "25%" },
      { text: 'Category', value: 'category', width: "10%" },
      { text: 'Hazard', value: 'isHazard', width: "10%" },
      { text: 'Total mass', value: 'totalMass', width: "10%" },
      { text: 'Total volume', value: 'totalVolume', width: "10%" },
      { text: 'Count', value: 'count', align: 'right', width: "5%" },
      { text: 'Actions', value: 'action', sortable: false, width: "5%" },
    ];
    return {
      mdiDotsVertical,
      mdiPencil,
      mdiDelete,
      mdiPlus,
      materialTypeAddEditDialogEnabled: false,
      materialTypeAddEditDialogEditMode: false,
      headers,
      confirmDeletion: false,
      item: {} as MaterialTypeAnalysis,
    };
  },
  computed: {
    ...mapGetters({
      currentProject: GET_CURRENT_PROJECT,
      materialTypes: GET_MATERIAL_TYPES,
      materialTypeSelected: GET_MATERIAL_TYPE_SELECTED
    }),
  },
  methods: {
    ...mapActions({
      fetchMaterialTypes: FETCH_MATERIAL_TYPES,
      fetchMaterialTypeSelected: FETCH_MATERIAL_TYPE_SELECTED,
      deleteMaterialType: DELETE_MATERIAL_TYPE
    }),
    ...mapMutations({
      setMaterialTypeSelected: SET_MATERIAL_TYPE_SELECTED,
      setCircularitySelected: SET_CIRCULARITY_SELECTED
    }),
    createMaterialType() {
      this.setMaterialTypeSelected({} as MaterialType);
      this.setCircularitySelected(undefined);
      this.materialTypeAddEditDialogEditMode = false;
      this.materialTypeAddEditDialogEnabled = true;

    },
    editMaterialType(item: MaterialType) {
      this.fetchMaterialTypeSelected(item);
      this.materialTypeAddEditDialogEditMode = true;
      this.materialTypeAddEditDialogEnabled = true;
    },
    onMenuClick(action: string, item: MaterialTypeAnalysis) {
      if (action === 'edit') {
        this.editMaterialType(item);
        this.confirmDeletion = false;
      } else if (action === 'delete' && !this.confirmDeletion) {
        this.confirmDeletion = true;
      } else if (action === 'delete' && this.confirmDeletion) {
        this.deleteMaterialType(item);
        this.confirmDeletion = false;
      }
    }
  },
  async created() {
    await this.fetchMaterialTypes(this.currentProject.id);
  }
});
</script>