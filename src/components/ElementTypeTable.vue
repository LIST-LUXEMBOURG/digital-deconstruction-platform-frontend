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
            :items="elementTypesFiltered.data"
            :items-per-page="10"
            class="elevation-5"
            :loading="isLoading"
            :item-per-page="options.itemsPerPage"
            :options.sync="options"
            item-key="uid"
            :show-select="true"
            :server-items-length="elementTypesFiltered.count"
        >
            <template v-slot:top>
                <v-row align="center" class="ml-4 mr-4">
                    <v-col></v-col>
                    <v-spacer></v-spacer>
                    <v-col align="center">
                      <v-btn class="mb-3" x-large plain d-block text>Element Types Inventory</v-btn>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col align="right">
                      <v-btn
                        color="primary"
                        class="mr-2"
                        @click="createElementType">
                        <v-icon>{{ mdiPlus }}</v-icon>
                      </v-btn>
                    </v-col>
                </v-row>
            </template>
            <template v-slot:[`header.name`]="{ header }">
              <TableItemFilterMenu :fetchFunction="fetchElementTypesFiltered" :parentFilter="elementTypesFilter" :header="header" :isFilterable="true" :isNumericalFilter="false"/>
            </template>
            <template v-slot:[`header.description`]="{ header }">
              <TableItemFilterMenu :fetchFunction="fetchElementTypesFiltered" :parentFilter="elementTypesFilter" :header="header" :isFilterable="true" :isNumericalFilter="false"/>
            </template>
            <template v-slot:[`header.designer`]="{ header }">
              <TableItemFilterMenu :fetchFunction="fetchElementTypesFiltered" :parentFilter="elementTypesFilter" :header="header" :isFilterable="true" :isNumericalFilter="false"/>
            </template>
            <template v-slot:[`header.trademark`]="{ header }">
              <TableItemFilterMenu :fetchFunction="fetchElementTypesFiltered" :parentFilter="elementTypesFilter" :header="header" :isFilterable="true" :isNumericalFilter="false"/>
            </template>
            <template v-slot:[`header.historicalValue`]="{ header }">
              <TableItemFilterMenu :fetchFunction="fetchElementTypesFiltered" :parentFilter="elementTypesFilter" :header="header" :isFilterable="true" :isNumericalFilter="false"/>
            </template>
            <template v-slot:[`header.category`]="{ header }">
              <TableItemFilterMenu :fetchFunction="fetchElementTypesFiltered" :parentFilter="elementTypesFilter" :header="header" :isFilterable="true" :isNumericalFilter="false"/>
            </template>
            <template v-slot:[`header.ifcType`]="{ header }">
              <TableItemFilterMenu :fetchFunction="fetchElementTypesFiltered" :parentFilter="elementTypesFilter" :header="header" :isFilterable="true" :isNumericalFilter="false"/>
            </template>
            <template v-slot:[`header.count`]="{ header }">
              <TableItemFilterMenu :header="header" :isFilterable="false"/>
            </template>
            <template v-slot:[`header.actions`]="{ header }">
              <TableItemFilterMenu :header="header" :isFilterable="false"/>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-menu bottom left :close-on-content-click="!confirmDeletion">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn icon v-bind="attrs" v-on="on"><v-icon>{{ mdiDotsVertical }}</v-icon></v-btn>
                    </template>
                    <v-list>
                        <v-list-item @click="onMenuClick('edit', item)">
                            <v-list-item-icon>
                                <v-icon>{{ mdiPencil }}</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>{{ $t('edit') }} </v-list-item-title>
                        </v-list-item>
                    <v-list-item @click="onMenuClick('delete', item)">
                        <v-list-item-icon>
                        <v-icon :color="confirmDeletion ? 'error' : null"> {{ mdiDelete }} </v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>
                            <span :class="confirmDeletion ? 'confirm-deletion' : null">
                                {{ confirmDeletion ? $t('confirmDeletion') : $t('delete') }}
                            </span>
                        </v-list-item-title>
                    </v-list-item>
                    </v-list>
                </v-menu>
            </template>
        </v-data-table>
        <ElementTypeAddEditDialog 
            v-bind:elementType="elementTypeSelected"
            v-bind:editMode="elementTypeAddEditDialogEditMode" 
            v-bind:dialogEnabled="elementTypeAddEditDialogEnabled" 
            v-on:addEditElementTypeDialogClosed="elementTypeAddEditDialogEnabled = false" 
            @exit="elementTypeAddEditDialogEnabled = false">
        </ElementTypeAddEditDialog>
        <v-dialog v-model="filterDialogEnabled" max-width="400px">
          <v-card>
            <v-card-title>
              <h5>Showing over 500 elements will impact your browser's performance. <br> 
              Are you sure?
              </h5>
            </v-card-title>
            <v-card-actions>
              <v-btn @click="rollBackfilter()">Cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="error" @click="updateFilterParams(options)">Yes</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { mdiDotsVertical, mdiPencil, mdiDelete, mdiPlus } from '@mdi/js';

import ElementTypeAddEditDialog from '@/components/ElementTypeAddEditDialog.vue';
import ElementTableFilter from '@/components/ElementTableFilter.vue';
import TableItemFilterMenu from '@/components/TableItemFilterMenu.vue';

import {
  GET_CURRENT_PROJECT,
  DELETE_ELEMENT_TYPE,
  FETCH_ELEMENT_TYPE_SELECTED,
  FETCH_ELEMENT_TYPE_IMAGE,
  GET_ELEMENT_TYPE_SELECTED,
  SET_ELEMENT_TYPE_SELECTED,
  ProjectFile,
  SET_CIRCULARITY_SELECTED,
  SET_ELEMENT_TYPES_FILTER,
  GET_ELEMENT_TYPES_FILTER,
  FETCH_ELEMENT_TYPES_FILTERED,
  GET_ELEMENT_TYPES_FILTERED
} from '@/store/project';

import { ElementType, ElementTypeAnalysis, ElementTypeFileDownloadDelete, FilterQuery, FilterQueryCondition, FilterQuerySelect } from '@/store/project/types';

export default Vue.extend({

  name: 'ElementTypeTable',
  components: { ElementTypeAddEditDialog, ElementTableFilter, TableItemFilterMenu  },
  data() {
    const headers = [
      { text: 'Name', value: 'name', sortable: false },
      { text: 'Description', value: 'description', sortable: false, width: "20%" },
      { text: 'Category', value: 'category', sortable: false, width: "5%" },
      { text: 'IFC Type', value: 'ifcType', sortable: false, width: "5%" },
      { text: 'Designer', value: 'designer', sortable: false, width: "5%" },
      { text: 'Trademark', value: 'trademark', sortable: false, width: "5%" },
      { text: 'Historical Value', value: 'historicalValue', sortable: false, width: "5%" },
      { text: 'Actions', value: 'actions', align: 'center', sortable: false, width: "5%" },
    ];
    return {
      mdiDotsVertical,
      mdiPencil,
      mdiDelete,
      mdiPlus,
      elementTypeAddEditDialogEnabled: false,
      elementTypeAddEditDialogEditMode: false,
      headers,
      filterDialogEnabled: false,
      confirmDeletion: false,
      item: {} as ElementTypeAnalysis,
      isLoading: false,
      options: {
        groupBy: [],
        groupDesc: [],
        itemsPerPage: 10,
        multiSort: false,
        mustSort: false,
        page: 1,
        sortBy: [],
      },
      oldOptions: {
        groupBy: [],
        groupDesc: [],
        itemsPerPage: 10,
        multiSort: false,
        mustSort: false,
        page: 1,
        sortBy: [],
      },
    };
  },
  computed: {
    ...mapGetters({
      currentProject: GET_CURRENT_PROJECT,
      elementTypeSelected: GET_ELEMENT_TYPE_SELECTED,
      elementTypesFilter: GET_ELEMENT_TYPES_FILTER,
      elementTypesFiltered: GET_ELEMENT_TYPES_FILTERED
    }),
  },
  methods: {
    ...mapActions({
      deleteElementType: DELETE_ELEMENT_TYPE,
      fetchElementTypeImage: FETCH_ELEMENT_TYPE_IMAGE,
      fetchElementTypeSelected: FETCH_ELEMENT_TYPE_SELECTED,
      fetchElementTypesFiltered: FETCH_ELEMENT_TYPES_FILTERED
    }),
    ...mapMutations({
      setElementTypeSelected: SET_ELEMENT_TYPE_SELECTED,
      setCircularitySelected: SET_CIRCULARITY_SELECTED,
      setElementTypesFilter: SET_ELEMENT_TYPES_FILTER
    }),
    createElementType(){
      this.setElementTypeSelected({} as ElementType);
      this.setCircularitySelected(undefined);
      this.elementTypeAddEditDialogEnabled = true;
      this.elementTypeAddEditDialogEditMode = false;
    },
    editElementType(elementType: ElementType) {
      if(elementType.projectId === undefined) elementType.projectId = this.currentProject.id;
      this.fetchElementTypeSelected(elementType);
      this.elementTypeAddEditDialogEnabled = true;
      this.elementTypeAddEditDialogEditMode = true;
    },
    onMenuClick(action: string, item: ElementTypeAnalysis) {
      if (action === 'edit') {
        this.editElementType(item);
        this.confirmDeletion = false;
      } else if (action === 'delete' && !this.confirmDeletion) {
        this.confirmDeletion = true;
      } else if (action === 'delete' && this.confirmDeletion) {
        item.projectId = this.currentProject.id;
        this.deleteElementType(item);
        this.confirmDeletion = false;
      }
    },
    rollBackfilter () {
      this.options.itemsPerPage = this.oldOptions.itemsPerPage;
      this.updateFilterParams(this.oldOptions);
    },
    async updateFilterParams(newValue: any) {
      if (this.filterDialogEnabled) this.filterDialogEnabled = false;
      this.isLoading = true;
      if (newValue.itemsPerPage === -1) newValue.itemsPerPage = this.elementTypesFiltered.count;
      try {
        this.elementTypesFilter.size = newValue.itemsPerPage;
        this.elementTypesFilter.offset = (newValue.page - 1) * newValue.itemsPerPage;
        await this.fetchElementTypesFiltered();
      } catch(error) {
      } finally {
        this.isLoading = false;
      }
    },
  },
  created() {
    this.setElementTypesFilter({
      size: 10,
      offset: 0,
      selects: [] as FilterQuerySelect[],
      conditions: [] as FilterQueryCondition[]
    } as FilterQuery)
  },
  watch: {
    elementTypeSelected (newElementType, oldElementType) {
        if (newElementType.files === undefined) return;
        newElementType.files.forEach((document: ProjectFile) => {
        if (document.fileType === "image/png" || document.fileType === "image/jpeg" || document.fileType === "image/webp")
        {
          this.fetchElementTypeImage({ 
            projectId:this.currentProject.id, 
            elementTypeUid: newElementType.uid, 
            document: document
          } as ElementTypeFileDownloadDelete);
        }
      });
    },
    options: {
      deep: true,
      immediate: true,
      handler(newValue, oldValue) {
        if (newValue.itemsPerPage === -1 && this.elementTypesFiltered.count > 500) {
          this.filterDialogEnabled = true;
          this.oldOptions = { ...oldValue };
        } else {
          this.updateFilterParams(newValue);
        }
      },
    },
  },
});
</script>