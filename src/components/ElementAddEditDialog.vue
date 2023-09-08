<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
  <v-dialog v-model="dialogEnabled" max-width="800px" @click:outside="$emit('addEditElementDialogClosed')" @keydown.esc="$emit('addEditElementDialogClosed')">
    <v-stepper v-model="step">
      <v-stepper-header>
        <v-stepper-step :complete="step > 1" :editable="element.uid != null && editMode" step="1">
          {{ editMode ? "Edit an element..." : "Add a new element..." }}
        </v-stepper-step>
        <v-stepper-step :editable="element.uid != null" step="2">
          {{ editMode ? "Edit circularity data..." : "Add circularity data..." }}
        </v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card>
            <br>
            <v-card-title>{{ editMode ? "Edit a deconstruction element..." : "Add a new element for deconstruction..." }}</v-card-title>
            <v-card-text>
              <v-form ref="form" v-model="valid">
                <v-row dense>
                  <v-col cols=12>
                    <v-text-field
                      label="Name*"
                      v-model="element.name"
                      :rules="[v => !!v || '*required field']"
                      required
                      outlined
                      dense>
                    </v-text-field>
                    <v-textarea
                      label="Description"
                      v-model="element.description"
                      rows="2"
                      hint="Element specific descriptions"
                      outlined
                      dense>
                    </v-textarea> 
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="8">
                    <v-autocomplete 
                      dense 
                      filled 
                      solo-inverted 
                      outlined
                      :items="elementTypes"
                      label="Element type"
                      v-model="element.elementType"
                      :item-text="v => v.name"
                      :item-value="v => v">
                    </v-autocomplete>  
                  </v-col>
                  <v-col cols="4" class="text-center">
                    <v-btn color="primary" @click="toggleAddElementType">Create new type</v-btn>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row dense>
                  <v-col cols="10">
                    <v-btn color="primary" text @click="reuseExpandEnabled = !reuseExpandEnabled"> Reuse Properties</v-btn>
                  </v-col>
                  <v-col cols="2">
                    <v-btn icon @click="reuseExpandEnabled = !reuseExpandEnabled">
                        <v-icon>{{ reuseExpandEnabled ? mdiChevronDoubleUp : mdiChevronDoubleDown }}</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-expand-transition>
                  <v-row dense v-show="reuseExpandEnabled">
                    <v-col cols="4">
                      <v-text-field
                        label="Reuse potential"
                        hint="A value between 0 and 1"
                        v-model="element.reusePotential"
                        :rules="[v => ruleNumber(v), ruleInRange(0, 1)]"
                        required
                        outlined
                        dense>
                      </v-text-field>
                    </v-col>
                    <v-col cols="4">
                      <v-autocomplete
                        :items="surfaceDamageList"
                        label="Surface Damage"
                        v-model="element.surfaceDamage"
                        :item-text="v => $t(v.text)"
                        full-width
                        outlined
                        clearable
                        dense>
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="4">
                      <v-autocomplete
                        :items="reuseDecisionList"
                        label="Reuse decision"
                        v-model="element.reuseDecision"
                        :item-text="v => $t(v.text)"
                        full-width
                        outlined
                        clearable
                        dense>
                      </v-autocomplete>
                    </v-col>
                  </v-row>
                </v-expand-transition>
                <v-divider></v-divider>
                <v-row dense>
                  <v-col cols="10">
                    <v-btn color="primary" text @click="hazardExpandEnabled = !hazardExpandEnabled"> Hazard Assessment</v-btn>
                  </v-col>
                  <v-col cols="2">
                    <v-btn icon @click="hazardExpandEnabled = !hazardExpandEnabled">
                        <v-icon>{{ hazardExpandEnabled ? mdiChevronDoubleUp : mdiChevronDoubleDown }}</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-expand-transition>
                  <v-row dense v-show="hazardExpandEnabled">
                    <v-col cols="6">
                      <v-autocomplete
                        :items="hazardAssessmentStatusList"
                        label="Hazard Assessment Status"
                        v-model="element.hazardAssessmentStatus"
                        :item-text="v => $t(v.text)"
                        full-width
                        outlined
                        clearable
                        dense>
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="6">
                      <v-autocomplete
                        :items="hazardAssessmentList"
                        label="Hazard Assessment"
                        v-model="element.hazardAssessment"
                        :item-text="v => $t(v.text)"
                        full-width
                        outlined
                        clearable
                        dense>
                      </v-autocomplete>
                    </v-col>
                  </v-row>
                </v-expand-transition>
                <v-divider></v-divider>
                <v-row dense>
                  <v-col cols="10">
                    <v-btn color="primary" text @click="identifiersExpandEnabled = !identifiersExpandEnabled"> Identifiers</v-btn>
                  </v-col>
                  <v-col cols="2">
                    <v-btn icon @click="identifiersExpandEnabled = !identifiersExpandEnabled">
                        <v-icon>{{ identifiersExpandEnabled ? mdiChevronDoubleUp : mdiChevronDoubleDown }}</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-expand-transition>
                  <v-row dense v-show="identifiersExpandEnabled">
                    <v-col cols="6">
                      <v-text-field
                        label="IFC identifier"
                        v-model="element.ifcId"
                        required
                        outlined
                        dense>
                      </v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                          label="Revit identifier"
                          v-model="element.revitId"
                          required
                          outlined
                          dense>
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-expand-transition>
                <v-divider></v-divider>
                <v-row dense>
                  <v-col cols="10">
                    <v-btn color="primary" text @click="materialsEnabledExpanded = !materialsEnabledExpanded"> Materials</v-btn>
                  </v-col>
                  <v-col cols="2">
                    <v-btn icon @click="materialsEnabledExpanded = !materialsEnabledExpanded">
                        <v-icon>{{ materialsEnabledExpanded ? mdiChevronDoubleUp : mdiChevronDoubleDown }}</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-expand-transition>
                  <v-row dense v-show="materialsEnabledExpanded">
                    <v-col cols=12>
                      <ElementAddEditMaterialTable @validateMaterials="setMaterials" v-bind:materials="element.materials" v-bind:materialTypes="materialTypes"> </ElementAddEditMaterialTable>
                    </v-col>
                  </v-row>
                </v-expand-transition>
                <v-divider></v-divider>
                <v-row dense>
                  <v-col cols="10">
                    <v-btn color="primary" text @click="propsEnabledExpanded = !propsEnabledExpanded"> Physical Properties</v-btn>
                  </v-col>
                  <v-col cols="2">
                    <v-btn icon @click="propsEnabledExpanded = !propsEnabledExpanded">
                        <v-icon>{{ propsEnabledExpanded ? mdiChevronDoubleUp : mdiChevronDoubleDown }}</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-expand-transition>
                  <v-row dense v-show="propsEnabledExpanded">
                    <v-col cols=12>
                      <ElementAddEditPropertyTable @validateProperties='setProperties' v-bind:properties="element.properties"></ElementAddEditPropertyTable>
                    </v-col>
                  </v-row>
                </v-expand-transition>
                </v-form>
                <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" v-on:click="cancel">
                Cancel
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn color="primary" :disabled="!valid" @click="submit">
                {{ editMode ? "Save" : "Create"  }}
              </v-btn>
            </v-card-actions>
          </v-card>
          <ElementTypeAddEditDialog 
            v-bind:elementType="selectedElementType" 
            v-bind:editMode="false" 
            v-bind:dialogEnabled="addElementTypeDialogEnabled" 
            v-on:addEditElementTypeDialogClosed="toggleAddElementType" 
            @exit="toggleAddElementType">
          </ElementTypeAddEditDialog>
        </v-stepper-content>
        <v-stepper-content step="2">
          <CircularityAddEditCard
            v-bind:circularity="circularitySelected" 
            v-bind:attachId="element.uid"
            v-bind:attachedToElement="true"
            v-bind:editMode="editModeCircularity"
            v-on:addEditCircularityClosed="cancel">
          </CircularityAddEditCard>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-dialog>
</template>

<script lang="ts">

import Vue from 'vue';
import { mapActions, mapGetters  } from 'vuex';
import { mdiChevronDoubleDown, mdiChevronDoubleUp} from '@mdi/js';
import {
  FETCH_ELEMENT_TYPES,
  GET_ELEMENT_TYPES,
  FETCH_MATERIAL_TYPES,
  GET_MATERIAL_TYPES,
  CREATE_ELEMENT,
  GET_CURRENT_PROJECT,
  UPDATE_ELEMENT,
  SET_ELEMENT_TYPE_SELECTED,
  GET_ELEMENT_TYPE_SELECTED,
  Element,
  ReuseDecision,
  SurfaceDamage,
  HazardAssessment,
  HazardAssessmentStatus,
  Material,
  PhysicalProperty,
  GET_CIRCULARITY_SELECTED
} from '@/store/project';
import { isEmpty } from 'lodash-es';
import i18n from '@/i18n';
import { isNumeric } from '@/utils';

import ElementTypeAddEditDialog from '@/components/ElementTypeAddEditDialog.vue';
import ElementAddEditMaterialTable from '@/components/ElementAddEditMaterialTable.vue';
import ElementAddEditPropertyTable from '@/components/ElementAddEditPropertyTable.vue';
import CircularityAddEditCard from '@/components/CircularityAddEditCard.vue';

export default Vue.extend({
  name: 'ElementAddEditDialog',
  components: { ElementTypeAddEditDialog, ElementAddEditMaterialTable, ElementAddEditPropertyTable, CircularityAddEditCard },
  props:{
    element: {
      required:true,
      type: Object as () => Element,
      default(){ return {} as Element }
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
  data() {
    const reuseDecisionList = Object.values(ReuseDecision).map(decision => ({
      value: decision,
      text: `${decision}`,
    }));

    const surfaceDamageList = Object.values(SurfaceDamage).map(damage => ({
      value: damage,
      text: `${damage}`,
    }));

    const hazardAssessmentList = Object.values(HazardAssessment).map(assessment => ({
      value: assessment,
      text: `${assessment}`,
    }));

    const hazardAssessmentStatusList = Object.values(HazardAssessmentStatus).map(status => ({
      value: status,
      text: `${status}`,
    }));

    return {
      //icons 
      mdiChevronDoubleDown,
      mdiChevronDoubleUp,
      materialsEnabledExpanded: false,
      identifiersExpandEnabled: false,
      reuseExpandEnabled: false,
      hazardExpandEnabled: false,
      propsEnabledExpanded: false,
      codesEnabledExpanded: false,
      valid: false,
      search: '',
      reuseDecisionList,
      surfaceDamageList,
      hazardAssessmentList,
      hazardAssessmentStatusList,
      addElementTypeDialogEnabled: false,
      step: 1,
      editModeCircularity: false,
      firstCircularity: {},
    };
  },
  async created() {
    if (this.currentProject && this.currentProject.id) {
      // fetch material types
      await this.fetchMaterialTypes(this.currentProject.id);

      // fetch element types
      await this.fetchElementTypes(this.currentProject.id,);
    }
  },
  computed: {
    ...mapGetters({
      currentProject: GET_CURRENT_PROJECT,
      elementTypes: GET_ELEMENT_TYPES,
      materialTypes: GET_MATERIAL_TYPES,
      selectedElementType: GET_ELEMENT_TYPE_SELECTED,
      circularitySelected: GET_CIRCULARITY_SELECTED
    }),
  },

  methods: {
    ...mapActions({
      fetchElementTypes: FETCH_ELEMENT_TYPES,
      fetchMaterialTypes: FETCH_MATERIAL_TYPES,
      createElement: CREATE_ELEMENT
    }),
    ruleInRange(min = 0, max = 1) {
      return (v: string | number) => {
        let bool = false;
        if (v) {
          if (typeof v === 'number') bool = v >= min && v <= max;
          else if (typeof v === 'string') {
            let float = parseFloat(v);
            if (float !== null && float !== undefined)
              bool = float >= min && float <= max;
          }
        } else if (v === null || v === undefined || v === '') bool = true;
        return bool || 'Must be a number between 0 and 1';
      };
    },
    ruleNumber(v: any) {
      if (isEmpty(v)) return true;
      if (typeof v === 'number') return true;
      if (typeof v === 'string' && isNumeric(v)) return true;
      return i18n.t('numberField');
    },
    ruleGreaterThan(value: number, orEquals = false) {
      return (v: string | number) => {
        if (isEmpty(v)) return true;
        const n = typeof v === 'string' ? parseFloat(v) : v;
        if (orEquals) return n >= value || i18n.t('greaterThan', { value });

        return n > value || i18n.t('greaterThan', { value });
      };
    },
    setMaterials(materials: Material[]) {
      this.element.materials = materials;
      this.materialsEnabledExpanded = false;
    },
    setProperties(properties: PhysicalProperty[]) {
      this.element.properties = properties;
      this.propsEnabledExpanded = false;
    },
    toggleAddElementType() {
      if (this.addElementTypeDialogEnabled === false) {
        // reset selected element and pictures
        this.$store.commit(SET_ELEMENT_TYPE_SELECTED, {});
      }
      this.addElementTypeDialogEnabled = !this.addElementTypeDialogEnabled;
    },
    cancel() {
      this.$emit('addEditElementDialogClosed');
    },
    submit() {
      if (this.editMode) this.modifyElement();
      else this.createNewElement();
    },
    closeDialog() {
      this.$emit('addEditElementDialogClosed');
      this.step = 1;
    },
    async createNewElement() {
      let newElement = await this.createElement({
        ...this.element,
        projectId: this.currentProject.id,
      });
      if (newElement) {
        this.element.uid = newElement.uid;
        this.step = 2;
      }
      else this.closeDialog();
    },
    async modifyElement() {
      // The following setTimeout line is used for a specific case where the combobox is focused and you click directly on edit.
      // The combobox value will not be updated until the combobox lose the focus.
      // Like this, the action is done in the next render (nextTick not working).

      setTimeout(async () => {
        await this.$store.dispatch(UPDATE_ELEMENT, { ...this.element, projectId: this.currentProject.id} );
        this.$emit('addEditElementDialogClosed');
      });
    },
  },
  watch: {
    circularitySelected(newValue, oldValue) {
      if (newValue) this.editModeCircularity = true;
      else this.editModeCircularity = false;
    },
    element: {
      deep: true,
      handler(newValue, oldValue) {
        for (const key in newValue) {
          if (typeof newValue[key] === 'string' && newValue[key] === '')
            (this.element as any)[key] = null;
        }
        if (this.editMode === false) this.step = 1;
      },
    },
  },
});
</script>