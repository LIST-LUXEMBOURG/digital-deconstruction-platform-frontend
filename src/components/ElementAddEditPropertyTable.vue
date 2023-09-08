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
        :headers='physicalPropertiesTableHeaders'
        :items='properties'
        hide-default-footer
    >
    <template v-slot:[`item.propertyType.name`]="{ item }">
      <v-autocomplete 
            dense 
            :items="propertyTypes"
            :item-text="property => property.name"
            :item-value="property => property"
            v-model="editProperty.propertyType"
            v-if="editProperty.uid === item.uid"
            hide-details>
      </v-autocomplete> 
      <span v-else>{{item.propertyType.name}}</span>
    </template>
    <template v-slot:[`item.propertyUnit.symbol`]="{ item }">
      <v-autocomplete 
            dense 
            :items="editProperty.propertyType.propertyUnits"
            :item-text="propertyUnit => propertyUnit.symbol"
            :item-value="propertyUnit => propertyUnit"
            v-model="editProperty.propertyUnit"
            v-if="editProperty.uid === item.uid"
            hide-details>
      </v-autocomplete> 
      <span v-else>{{ item.propertyUnit ? item.propertyUnit.symbol : ""}}</span>
    </template>
    <template v-slot:[`item.value`]="{ item }">
      <v-text-field v-model="editProperty.value" hide-details dense single-line autofocus v-if="editProperty.uid === item.uid"></v-text-field>
      <span v-else>{{item.value}}</span>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <div v-if="editProperty.uid === item.uid">
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
      <v-btn color="primary" @click="toggleAddPropertyType">Create</v-btn>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-btn color="secondary" @click="addNewEntry()"><v-icon>{{mdiPlus}}</v-icon></v-btn>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="validateProperties(properties)"><v-icon>{{mdiCheck}}</v-icon></v-btn>
    </v-row>
  </v-container>
  <PropertyTypeAddEditDialog 
    v-bind:propertyType="emptyPropertyType" 
    v-bind:editMode="false"
    v-bind:dialogEnabled="addPropertyTypeDialogEnabled" 
    v-on:addEditPropertyTypeDialogClosed="toggleAddPropertyType" 
    @exit="toggleAddPropertyType">
  </PropertyTypeAddEditDialog>
</div>
</template>

<script lang="ts">

import Vue from 'vue';
import { mapGetters } from 'vuex';
import PropertyTypeAddEditDialog from '@/components/PropertyTypeAddEditDialog.vue';

import { mdiWindowClose, mdiContentSave, mdiPencil, mdiDelete, mdiPlus, mdiCheck } from '@mdi/js';
import {
  FETCH_PROPERTY_TYPES,
  GET_PROPERTY_TYPES,
} from '@/store/project';
import {
    PhysicalProperty,
    PropertyType,
    PropertyUnit
} from '@/store/project/types';

export default Vue.extend({
  name: 'ElementAddEditPropertyTable',
  components: { PropertyTypeAddEditDialog },
  data: () => ({
    // icons
    mdiWindowClose,
    mdiContentSave,
    mdiPencil,
    mdiDelete,
    mdiPlus,
    mdiCheck,
    // eddited data
    addPropertyTypeDialogEnabled: false,
    emptyPropertyType:{ isNumeric: false, propertyUnits:[{name:"", symbol:""}] as PropertyUnit[]} as PropertyType,
    selectedPropertyType: {} as PropertyType,
    newEntry:  {
        uid: "-1",
        propertyType: {
            name:""
        },
        propertyUnit: {
            symbol:""
        },
        value: ""
    } as PhysicalProperty,
    editProperty:  {
        uid: "0",
        propertyType: {
            name:""
        },
        propertyUnit: {
            symbol:""
        },
        value: ""
    } as PhysicalProperty,
    emptyProperty:  {
        uid: "0",
        propertyType: {
            name:""
        },
        propertyUnit: {
            symbol:""
        },
        value: ""
    } as PhysicalProperty,
    physicalPropertiesTableHeaders: [
      {
        text: 'Name',
        value: 'propertyType.name',
        sortable: false,
        width: "30%"
      },
      {
        text: 'Unit',
        value: 'propertyUnit.symbol',
        sortable: false,
        width: "15%"
      },
      {
        text: 'Value',
        value: 'value',
        sortable: false,
        width: "40%"
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
    // fetch properties
    await this.$store.dispatch(FETCH_PROPERTY_TYPES, {
    });
  },
  methods: {
    addNewEntry() {
      const newProp : PhysicalProperty = Object.assign({}, this.newEntry);
      newProp.uid += this.properties.length++;
      this.properties.pop();
      this.properties.push(newProp);
      this.editProperty = Object.assign({}, newProp);
    },
    editEntry (item: PhysicalProperty) {
        this.editProperty = Object.assign({}, item);
    },
    resetEntry () {
      this.editProperty = Object.assign({}, this.emptyProperty);
    },
    saveEntry(item: PhysicalProperty) {
      const index = this.properties.indexOf(item, 0);
      if (index > -1) Object.assign(this.properties[index], this.editProperty)
      this.resetEntry();
    },
    deleteEntry(item: PhysicalProperty) {
      const index = this.properties.indexOf(item, 0);
      if (index > -1) this.properties.splice(index,1);
    },
    validateProperties(properties: PhysicalProperty[]) {
      this.$emit('validateProperties', properties);
    },
    toggleAddPropertyType() {
        this.addPropertyTypeDialogEnabled = !this.addPropertyTypeDialogEnabled;
    },
  },
  computed: {
    ...mapGetters({
      propertyTypes: GET_PROPERTY_TYPES,
    }),
  },
  props: {
    properties: {
      required:true,
      type: Array as () => PhysicalProperty[],
      default(){ return []}
    }
  }
});
</script>
          