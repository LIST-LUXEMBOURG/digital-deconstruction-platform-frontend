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
        :headers='materialTableHeaders'
        :items='materials'
        hide-default-footer
    >
    <template v-slot:[`item.materialType.isHazard`]='{ item }'>
      <v-icon v-bind:color="!item.isHazard ? 'black': 'red'">{{ mdiHazardLights }}</v-icon>
    </template>
    <template v-slot:[`item.materialType.name`]="{ item }">
      <v-autocomplete 
            dense 
            :items="materialTypes"
            :item-text="materialType => materialType.name"
            :item-value="materialType => materialType"
            v-model="editMaterial.materialType"
            v-if="editMaterial.uid === item.uid"
            hide-details>
      </v-autocomplete> 
      <span v-else>{{item.materialType.name}}</span>
    </template>
    <template v-slot:[`item.mass`]="{ item }">
      <v-text-field v-model="editMaterial.mass" type="number" hide-details dense single-line autofocus v-if="editMaterial.uid === item.uid"></v-text-field>
      <span v-else>{{item.mass}}</span>
    </template>
    <template v-slot:[`item.volume`]="{ item }">
      <v-text-field v-model="editMaterial.volume" type="number" hide-details dense single-line autofocus v-if="editMaterial.uid === item.uid"></v-text-field>
      <span v-else>{{item.volume}}</span>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <div v-if="editMaterial.uid === item.uid">
        <v-icon color="red" class="mr-3" @click="resetEntry()">
          {{mdiWindowClose}}
        </v-icon>
        <v-icon color="green"  @click="saveEntry(item)">
          {{mdiContentSave}}
        </v-icon>
      </div>
      <div v-else>
        <v-icon color="green" class="mr-3" @click="editEntry(item)">
          {{mdiPencil}}
        </v-icon>
        <v-icon color="red" @click="deleteEntry(item)">
          {{mdiDelete}}
        </v-icon>
      </div>
    </template>
    </v-data-table>
  </v-card>
  <br>
  <v-container>
    <v-row>
      <v-autocomplete 
        dense
        filled
        solo-inverted 
        outlined
        :items="materialTypes"
        label="material types"
        :item-text="v => v.name">
      </v-autocomplete>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="toggleAddMaterialType">Create</v-btn>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-btn color="secondary" @click="addNewEntry()"><v-icon>{{mdiPlus}}</v-icon></v-btn>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="validateMaterials(materials)"><v-icon>{{mdiCheck}}</v-icon></v-btn>
    </v-row>
  </v-container>
  <MaterialTypeAddEditDialog 
    v-bind:materialType="emptyMaterialType" 
    v-bind:editMode="false" 
    v-bind:dialogEnabled="addMaterialTypeDialogEnabled" 
    v-on:addEditMaterialTypeDialogClosed="toggleAddMaterialType" 
    @exit="toggleAddMaterialType">
  </MaterialTypeAddEditDialog>
</div>
</template>

<script lang="ts">

import Vue from 'vue';
import MaterialTypeAddEditDialog from '@/components/MaterialTypeAddEditDialog.vue';
import { mdiHazardLights, mdiWindowClose, mdiContentSave, mdiPencil, mdiDelete, mdiPlus, mdiCheck } from '@mdi/js';
import {
  Material,
  MaterialType
} from '@/store/project';

export default Vue.extend({
  name: 'ElementAddEditMaterialTable',
  components: { MaterialTypeAddEditDialog },
  data: () => ({
    // icons
    mdiHazardLights,
    mdiWindowClose,
    mdiContentSave,
    mdiPencil,
    mdiDelete,
    mdiPlus,
    mdiCheck,
    // dialogs
    addMaterialTypeDialogEnabled: false,
    emptyMaterialType: {} as MaterialType,
    // eddited data
    newEntry: {
        uid:"-1",  
        materialType: {
          name: "",
          isHazard: false,
        },
        mass: 0,
        volume: 0
    } as Material,
    editMaterial: {
      uid:"0",  
      materialType: {
        name: "",
        isHazard: false,
      },
      mass: 0,
      volume: 0
    } as Material,
    emptyMaterial:  {
      uid:"0",   
      materialType: {
        name: "",
        isHazard: false
      },
      mass: 0,
      volume: 0
    } as Material,
    materialTableHeaders: [
      {
        text: 'Hazard',
        value: 'materialType.isHazard',
        sortable: true,
        width: "15%"
      },
      {
        text: 'Name',
        value: 'materialType.name',
        sortable: true,
        width: "40%"
      },
      {
        text: 'Mass',
        value: 'mass',
        sortable: true,
        width: "15%"
      },
      {
        text: 'Volume',
        value: 'volume',
        sortable: true,
        width: "15%"
      },
      {
        text:'Actions',
        value:'actions',
        sortable: false,
        width: "15%"
      }
    ]
  }),
  methods: {
    addNewEntry() {
      const newMat : Material = Object.assign({}, this.newEntry);
      newMat.uid += this.materials.length++;
      this.materials.pop();
      this.materials.push(newMat);
      this.editMaterial = Object.assign({}, newMat);
    },
    editEntry (item: Material) {
        this.editMaterial = Object.assign({}, item);
    },
    resetEntry () {
      this.editMaterial = Object.assign({}, this.emptyMaterial);
    },
    saveEntry(item: Material) {
      if (this.editMaterial.mass < 0.0) this.editMaterial.mass = 0.0;
      if (this.editMaterial.volume < 0.0) this.editMaterial.volume = 0.0;
      const index = this.materials.indexOf(item, 0);
      if (index > -1) Object.assign(this.materials[index], this.editMaterial)
      this.resetEntry();
    },
    deleteEntry(item: Material) {
      const index = this.materials.indexOf(item, 0);
      if (index > -1) this.materials.splice(index,1);
    },
    validateMaterials(materials: Material[]) {
      this.$emit('validateMaterials', materials);
    },
    toggleAddMaterialType() {
      this.addMaterialTypeDialogEnabled = !this.addMaterialTypeDialogEnabled;
    }
  },
  props: {
    materialTypes: {
      required: true,
      type: Array as () => MaterialType[],
      default(){ return []}
    },
    materials: {
      required:true,
      type: Array as () => Material[],
      default(){ return []}
    }
  }
});
</script>
          