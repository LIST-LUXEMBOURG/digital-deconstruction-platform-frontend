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
      width="100%"
      v-model="selectedInventoryElements"
      :headers="headers"
      :items="elementsFiltered.data"
      :loading="isLoading"
      :item-per-page="options.itemsPerPage"
      :options.sync="options"
      class="elevation-5"
      item-key="uid"
      :show-select="true"
      :server-items-length="elementsFiltered.count"
      >
      <template v-slot:top>
        <v-row align="center" class="ml-4 mr-4">
          <v-col>
          </v-col>
          <v-spacer></v-spacer>
          <v-col align="center">
            <v-btn class="mb-3" x-large d-block plain text>Elements Inventory</v-btn>
          </v-col>
          <v-spacer></v-spacer>
          <v-col align="end">
          <v-badge class="mr-2" :color="isViewerInitialised ? 'success' : 'error'" dot>
             BIM <b v-if="isViewerInitialised">loaded </b>
            <b v-else>not loaded </b>
          </v-badge>
          &
          <v-badge class="ml-2" :color="dynamicBimEnabled ? 'success' : 'error'" dot>
              <b v-if="!dynamicBimEnabled">static </b>
            <b v-else>dynamic</b>
          </v-badge>
            <v-btn
              color="primary"
              class="ml-4 mr-2"
              :disabled="!isViewerInitialised"
              :outlined='dynamicBimEnabled ? true: false'
              @click="toggleDynamicBIM">
              <v-icon :color='dynamicBimEnabled ? "black":"white"'>{{ mdiAtomVariant }}</v-icon>
            </v-btn>
            <v-btn
              color="primary"
              class="mr-2"
              @click="createElement">
              <v-icon>{{ mdiPlus }}</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </template>

      <template v-slot:[`header.name`]="{ header }">
        <TableItemFilterMenu :parentFilter="elementsFilter" :fetchFunction="fetchElementsFiltered" :header="header" :isFilterable="true" :isNumericalFilter="false"/>
      </template>
      <template v-slot:[`header.description`]="{ header }">
        <TableItemFilterMenu :parentFilter="elementsFilter" :fetchFunction="fetchElementsFiltered" :header="header" :isFilterable="true" :isNumericalFilter="false"/>
      </template>
      <template v-slot:[`header.surfaceDamage`]="{ header }">
        <TableItemFilterMenu :parentFilter="elementsFilter" :fetchFunction="fetchElementsFiltered" :header="header" :isFilterable="true" :isNumericalFilter="false" :isMultiChoiceFilter="true" :multipleChoiceOptions="surfaceDamageList"/>
      </template>
      <template v-slot:[`header.reusePotential`]="{ header }">
        <TableItemFilterMenu :parentFilter="elementsFilter" :fetchFunction="fetchElementsFiltered" :header="header" :isFilterable="true" :isNumericalFilter="true"/>
      </template>
      <template v-slot:[`header.reuseDecision`]="{ header }">
        <TableItemFilterMenu :parentFilter="elementsFilter" :fetchFunction="fetchElementsFiltered" :header="header" :isFilterable="true" :isNumericalFilter="false" :isMultiChoiceFilter="true" :multipleChoiceOptions="reuseDecisionList"/>
      </template>
      <template v-slot:[`header.hazardAssessment`]="{ header }">
        <TableItemFilterMenu :parentFilter="elementsFilter" :fetchFunction="fetchElementsFiltered" :header="header" :isFilterable="true" :isNumericalFilter="false" :isMultiChoiceFilter="true" :multipleChoiceOptions="hazardAssessmentList"/>
      </template>
      <template v-slot:[`header.hazardAssessmentStatus`]="{ header }">
        <TableItemFilterMenu :parentFilter="elementsFilter" :fetchFunction="fetchElementsFiltered" :header="header" :isFilterable="true" :isNumericalFilter="false" :isMultiChoiceFilter="true" :multipleChoiceOptions="hazardAssessmentStatusList"/>
      </template>
      <template v-slot:[`header.info`]="{ header }">
        <TableItemFilterMenu :header="header" :isFilterable="false"/>
      </template>
      <template v-slot:[`header.view-3d`]="{ header }">
        <TableItemFilterMenu :header="header" :isFilterable="false"/>
      </template>
      <template v-slot:[`header.actions`]="{ header }">
        <TableItemFilterMenu :header="header" :isFilterable="false"/>
      </template>

      <template v-slot:[`item.info`]="{ item }">
        <v-icon @click="toggleElementInfo(item)">{{ mdiInformation }}</v-icon>
      </template>

      <template v-slot:[`item.surfaceDamage`]="{ item }">
        {{ item.surfaceDamage && $t('projects.item.surfaceDamage.' + `${item.surfaceDamage}`) }}
      </template>

      <template v-slot:[`item.reuseDecision`]="{ item }">
        {{
          item.reuseDecision &&
            $t('projects.item.reuseDecision.' + `${item.reuseDecision}`)
        }}
      </template>

      <template v-slot:[`item.hazardAssessment`]="{ item }">
        {{
          item.hazardAssessment
            ? $t('projects.item.hazardAssessment.' + `${item.hazardAssessment}`)
            : null
        }}
      </template>

      <template v-slot:[`item.hazardAssessmentStatus`]="{ item }">
        {{
          item.hazardAssessmentStatus
            ? $t('projects.item.hazardAssessmentStatus.' + `${item.hazardAssessmentStatus}`)
            : null
        }}
      </template>

      <template v-slot:[`item.view-3d`]="{ item }">
        <v-icon @click="focusElementOnBim(item)">{{ mdiRotate3d }}</v-icon>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-menu :close-on-content-click="!confirmDeletion" left>
          <template v-slot:activator="{ on }">
            <v-icon v-on="on">{{ mdiDotsVertical }}</v-icon>
          </template>

          <v-list>
            <v-list-item-group>
              <!-- Edit an inventory item -->
              <v-list-item @click="editElement(item)">
                <v-list-item-icon>
                  <v-icon>
                    {{ mdiPencil }}
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-title style="cursor: pointer;">
                  Edit
                </v-list-item-title>
              </v-list-item>
              <!-- Remove an inventory item -->
              <v-list-item
                @click="
                  onClickRemove(item)
                "
              >
                <v-list-item-icon>
                  <v-icon :class="confirmDeletion ? 'red--text' : null">
                    {{ mdiDelete }}
                  </v-icon>
                </v-list-item-icon>

                <v-list-item-title v-if="!confirmDeletion"
                  >Remove</v-list-item-title
                >
                <v-list-item-title v-else class="red--text">
                  Are you sure?
                </v-list-item-title>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
      </template>
    </v-data-table>
    <ElementAddEditDialog 
      v-bind:element="elementWithDependencies" 
      v-bind:editMode="elementAddEditDialogEditMode" 
      v-bind:dialogEnabled="elementAddEditDialogEnabled" 
      v-on:addEditElementDialogClosed="elementAddEditDialogEnabled = false" 
      @exit="elementAddEditDialogEnabled = false"
    />
    <ElementViewDialog 
      v-bind:element="elementWithDependencies"
      v-bind:elementType="checkElementType"
      v-bind:dialogEnabled="elementInfoEnabled" 
      v-on:elementInfoDialogClosed="toggleElementInfo" 
      @exit="toggleElementInfo"
    />
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
import { mapActions, mapGetters, mapMutations  } from 'vuex';
import ElementViewDialog from '@/components/ElementViewDialog.vue';
import ElementAddEditDialog from '@/components/ElementAddEditDialog.vue';
import ElementTableFilter from '@/components/ElementTableFilter.vue';
import TableItemFilterMenu from '@/components/TableItemFilterMenu.vue';

import {
  mdiInformation,
  mdiMagnify,
  mdiRotate3d,
  mdiDotsVertical,
  mdiPencil,
  mdiDelete,
  mdiPlus,
  mdiAtomVariant,
  mdiFilterMenu,
  mdiFilterOutline,
  mdiFilterCheck,
  mdiFilterVariant,
  mdiSortAscending,
  mdiSortDescending
} from '@mdi/js';

import {
  SET_PROJECT_TAB_INDEX,
  ProjectTab,
  DELETE_ELEMENT,
  GET_CURRENT_PROJECT,
  GET_ELEMENT_SELECTED,
  ElementType,
  Element,
  ProjectFile,
  GET_INVENTORY_FILTER_ACTIVE,
  ElementTypeFileDownloadDelete,
  GET_ELEMENTS_FILTERED,
  ElementDelete,
  SET_ELEMENTS_SELECTION,
  GET_ELEMENTS_SELECTION,
  FETCH_ELEMENT_SELECTED,
  SET_ELEMENT_SELECTED,
  FETCH_ELEMENT_IMAGE_TYPE_SELECTED,
  SET_CIRCULARITY_SELECTED,
  SET_ELEMENTS_FILTER,
  FilterQuery,
  FilterQuerySelect,
  FilterQueryCondition,
  ReuseDecision,
  SurfaceDamage,
  HazardAssessment,
  HazardAssessmentStatus,
  FETCH_ELEMENTS_FILTERED,
  GET_ELEMENTS_FILTER
} from '@/store/project';

import { SET_IFCIDS, GET_VIEWER_INITIALISED } from '@/store/viewer';

export default Vue.extend({
  name:"ElementTable",
  components: {
    ElementTableFilter,
    ElementViewDialog,
    ElementAddEditDialog,
    TableItemFilterMenu
  },
  data() {

    const reuseDecisionList = Object.values(ReuseDecision).map(decision => ({ value: decision, text: `${decision}` }));
    const surfaceDamageList = Object.values(SurfaceDamage).map(damage => ({ value: damage, text: `${damage}` }));
    const hazardAssessmentList = Object.values(HazardAssessment).map(assessment => ({ value: assessment, text: `${assessment}` }));
    const hazardAssessmentStatusList = Object.values(HazardAssessmentStatus).map(status => ({ value: status, text: `${status}` }));

    return {
      mdiInformation,
      mdiMagnify,
      mdiRotate3d,
      mdiDotsVertical,
      mdiPencil,
      mdiDelete,
      mdiPlus,
      mdiAtomVariant,
      mdiFilterMenu,
      mdiFilterOutline,
      mdiFilterCheck,
      mdiFilterVariant,
      mdiSortAscending,
      mdiSortDescending,
      reuseDecisionList,
      surfaceDamageList,
      hazardAssessmentList,
      hazardAssessmentStatusList,
      search: '',
      isLoading: true,
      offset: 0,
      size: 10,
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
      // elements properties to display
      headers: [
        { text: 'Name', value: 'name', sortable: false },
        { text: 'Description', value: 'description', sortable: false, width: "10%"  },
        { text: 'Surface Damage', value: 'surfaceDamage', sortable: false, width: "5%"  },
        { text: 'Reuse Potential', value: 'reusePotential', sortable: false, width: "5%"  },
        { text: 'Reuse Decision', value: 'reuseDecision', sortable: false, width: "5%"  },
        { text: 'Hazard', value: 'hazardAssessment', sortable: false, width: "5%"  },
        { text: 'Assessment Status', value: 'hazardAssessmentStatus', sortable: false, width: "5%"  },
        { text: 'Info', value: 'info', align: 'center', sortable: false, width: "5%" },
        { text: '3D', value: 'view-3d', align: 'center', sortable: false, width: "5%" },
        { text: 'Actions', value: 'actions', align: 'center', sortable: false, width: "5%" },
      ],
      showAddInventoryElementDialog: false,
      editingElement: null,
      confirmDeletion: false,
      elementInfoEnabled: false,
      elementAddEditDialogEnabled: false,
      elementAddEditDialogEditMode: false,
      dynamicBimEnabled: false,
      filterDialogEnabled: false
    }
  },
  created() {
    this.setElementsFilter({
      size: 10,
      offset: 0,
      selects: [] as FilterQuerySelect[],
      conditions: [] as FilterQueryCondition[]
    } as FilterQuery)
  },
  methods: {
    ...mapActions({
      fetchElementWithDependencies: FETCH_ELEMENT_SELECTED,
      deleteElement: DELETE_ELEMENT,
      fetchElementsFiltered: FETCH_ELEMENTS_FILTERED
    }),
    ...mapMutations({
      setProjectTabIndex: SET_PROJECT_TAB_INDEX,
      setElementWithDependencies: SET_ELEMENT_SELECTED,
      setCircularitySelected: SET_CIRCULARITY_SELECTED,
      setIfcIds: SET_IFCIDS,
      setElementsFilter: SET_ELEMENTS_FILTER
    }),
    createElement() {
      this.setElementWithDependencies({} as Element);
      this.setCircularitySelected(undefined);
      this.elementAddEditDialogEnabled = true;
      this.elementAddEditDialogEditMode = false;
    },
    editElement(item: Element): void {
      if (item.projectId === undefined) item.projectId = this.currentProject.id;
        this.fetchElementWithDependencies(item);
        this.elementAddEditDialogEnabled = true;
        this.elementAddEditDialogEditMode = true;
    },
    focusElementOnBim(item: Element): void {
      if (this.isViewerInitialised == false) return;
      this.setIfcIds([item.ifcId]);
      this.setProjectTabIndex(ProjectTab.Model);
    },
    async onClickRemove(payload: ElementDelete) {
      if (!this.confirmDeletion) {
        this.confirmDeletion = true;
        return;
      }
      await this.deleteElement(payload);
      this.confirmDeletion = false;
    },
    toggleElementInfo(item: Element): void {
      if(this.elementInfoEnabled === false) {
        if (item.projectId === undefined) item.projectId = this.currentProject.id;
        this.$store.dispatch(FETCH_ELEMENT_SELECTED, item);
      }
      this.elementInfoEnabled = !this.elementInfoEnabled;
    },
    toggleDynamicBIM(){
      this.dynamicBimEnabled = !this.dynamicBimEnabled;
    },
    rollBackfilter () {
      this.options.itemsPerPage = this.oldOptions.itemsPerPage;
      this.updateFilterParams(this.oldOptions);
    },
    async updateFilterParams(newValue: any) {
      if (this.filterDialogEnabled) this.filterDialogEnabled = false;
      this.isLoading = true;
      if (newValue.itemsPerPage === -1) newValue.itemsPerPage = this.elementsFiltered.count;
      try {
        this.elementsFilter.size = newValue.itemsPerPage;
        this.elementsFilter.offset = (newValue.page - 1) * newValue.itemsPerPage;
        await this.fetchElementsFiltered();
      } catch(error) {
      } finally {
        this.isLoading = false;
      }
    },
  },
  computed: {
    ...mapGetters({
      elementsFiltered: GET_ELEMENTS_FILTERED,
      currentProject: GET_CURRENT_PROJECT,
      elementWithDependencies: GET_ELEMENT_SELECTED,
      isViewerInitialised: GET_VIEWER_INITIALISED,
      inventoryFilterActive: GET_INVENTORY_FILTER_ACTIVE,
      elementsFilter: GET_ELEMENTS_FILTER
    }),
    checkElementType(): ElementType {
      if (this.elementWithDependencies.elementType) return this.elementWithDependencies.elementType;
      else return {} as ElementType;
    },
    selectedInventoryElements: {
      get(): Element[] {
        return this.$store.getters[GET_ELEMENTS_SELECTION];
      },
      set(selectedItems: Element[]) {
        this.$store.commit(SET_ELEMENTS_SELECTION, selectedItems);
        if (!this.isViewerInitialised) return;
        if (this.dynamicBimEnabled == true) {
          let ifcIds = selectedItems ? selectedItems.map(v => v.ifcId) : [];
          this.setIfcIds(ifcIds);
        }
      },
    },
  },
  watch: {
    elementsFiltered: {
      deep: true,
      immediate: true,
      handler: function(newValue, oldValue) {
        if (!this.isViewerInitialised) return;
        if (this.dynamicBimEnabled == true) {
          let ifcIds = newValue.data ? newValue.data.map((v: { ifcId: any; }) => v.ifcId) : [];
          this.setIfcIds(ifcIds);
        }
      }
    },
    elementWithDependencies(newElement, oldElement)
    {
      let elementType = newElement.elementType;
      if (elementType === undefined || elementType == null) return;
      else {
        if (elementType.files === undefined || elementType.files == null) return;
        
        elementType.files.forEach((document: ProjectFile) => {
        if (document.fileType === "image/png" || document.fileType === "image/jpeg" || document.fileType === "image/webp")
        {
          this.$store.dispatch(FETCH_ELEMENT_IMAGE_TYPE_SELECTED, { 
            projectId:this.currentProject.id, 
            elementTypeUid: elementType.uid, 
            document: document
          } as ElementTypeFileDownloadDelete);
        }
        });
      }
    },
    options: {
      deep: true,
      immediate: true,
      handler(newValue, oldValue) {
        if (newValue.itemsPerPage === -1 && this.elementsFiltered.count > 500) {
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
