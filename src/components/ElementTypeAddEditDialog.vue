<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
  <v-dialog v-model="dialogEnabled" max-width="900px" @click:outside="closeDialog" @keydown.esc="closeDialog">
    <v-stepper v-model="step">
      <v-stepper-header>
        <v-stepper-step :complete="step > 1" :editable="elementType.uid != null && editMode" step="1">
          {{ editMode ? "Edit an element type..." : "Add a new element type..." }}
        </v-stepper-step>
        <v-stepper-step :editable="elementType.uid != null" step="2">
          {{ editMode ? "Edit element type documents..." : "Add element type documents..." }}
        </v-stepper-step>
        <v-stepper-step :editable="elementType.uid != null" step="3">
          {{ editMode ? "Edit circularity data..." : "Add circularity data..." }}
        </v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <br>
          <v-form ref="form" v-model="valid">
            <v-row dense>
              <v-col>
                <v-text-field
                  label="Name*"
                  v-model="elementType.name"
                  :rules="[v => !!v || '*required field']"
                  required>
                </v-text-field>
                <v-text-field
                  label="Category"
                  v-model="elementType.category">
                </v-text-field>
              </v-col>
              <v-col>
                <v-textarea
                  label="Description"
                  v-model="elementType.description"
                  rows="4"
                  hint="Type specific descriptions"
                  outlined
                  dense>
                </v-textarea> 
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row dense>
              <v-col cols="10">
                <v-btn color="primary" text @click="ifcExpandEnabled = !ifcExpandEnabled"> IFC Metadata</v-btn>
              </v-col>
              <v-col cols="2">
                <v-btn icon @click="ifcExpandEnabled = !ifcExpandEnabled">
                    <v-icon>{{ ifcExpandEnabled ? mdiChevronDoubleUp : mdiChevronDoubleDown }}</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-expand-transition>
              <v-row dense v-show="ifcExpandEnabled">
                <v-col cols="6">
                  <v-text-field
                    label="IFC type"
                    v-model="elementType.ifcType"
                    outlined
                    dense>
                  </v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    label="IFC identifier"
                    v-model="elementType.ifcId"
                    outlined
                    dense>
                  </v-text-field>
                </v-col>
              </v-row>
            </v-expand-transition>
            <v-divider></v-divider>
            <v-row dense>
              <v-col cols="10">
                <v-btn color="primary" text @click="tradePropertiesExpandEnabled = !tradePropertiesExpandEnabled">Trade properties</v-btn>
              </v-col>
              <v-col cols="2">
                <v-btn icon @click="tradePropertiesExpandEnabled = !tradePropertiesExpandEnabled">
                    <v-icon>{{ tradePropertiesExpandEnabled ? mdiChevronDoubleUp : mdiChevronDoubleDown }}</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-expand-transition>
              <v-row dense v-show="tradePropertiesExpandEnabled">
                <v-col cols="4">
                  <v-text-field
                    label="Trademark"
                    v-model="elementType.trademark"
                    outlined
                    dense>
                  </v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    label="Designer"
                    v-model="elementType.designer"
                    outlined
                    dense>
                  </v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    label="Historical Value"
                    v-model="elementType.historicalValue"
                    outlined
                    dense>
                  </v-text-field>
                </v-col>
              </v-row>
            </v-expand-transition>
            <v-divider></v-divider>
            <v-row dense>
              <v-col cols="10">
                <v-btn color="primary" text @click="codesEnabledExpanded = !codesEnabledExpanded"> Classifications</v-btn>
              </v-col>
              <v-col cols="2">
                <v-btn icon @click="codesEnabledExpanded = !codesEnabledExpanded">
                    <v-icon>{{ codesEnabledExpanded ? mdiChevronDoubleUp : mdiChevronDoubleDown }}</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-expand-transition>
              <v-row dense v-show="codesEnabledExpanded">
                <v-col cols=12>
                  <ElementTypeAddEditClassificationTable
                      v-bind:classificationEntries="elementType.classificationEntries"
                      @validateClassifications="setClassifications">
                  </ElementTypeAddEditClassificationTable>
                </v-col>
              </v-row>
            </v-expand-transition>
            <v-row>
              <v-spacer></v-spacer>
              <v-btn color="primary" v-on:click="close">
                Close
              </v-btn>
              <v-spacer></v-spacer>
              <v-spacer></v-spacer>
              <v-btn color="primary" :disabled="!valid" @click="submit">
                {{ editMode ? "Save" : "Create"  }}
              </v-btn>
              <v-spacer></v-spacer>
            </v-row>
            <small>*indicates required field</small>
          </v-form>
        </v-stepper-content>
        <v-stepper-content step="2">
          <v-row v-if="elementType.files">
          <v-carousel v-if="elementType.files.length > 0" :continuous="true" hide-delimiter-background >
            <v-carousel-item eager v-for="(file) in elementType.files" :key="file.uid">
              <v-container>
                  <v-img v-if="file.streamedImage" :src="file.streamedImage.src">
                    <div class="d-flex flex-row">
                    <v-chip dark> {{ file.title }} </v-chip>
                    <v-chip dark> {{ file.description ? file.description : "no description" }} </v-chip>
                    <v-chip dark> {{ file.documentDate ? file.documentDate : "no date" }} </v-chip>
                    <v-spacer></v-spacer>
                    <v-spacer></v-spacer>
                    <v-btn
                      fab
                      color="secondary"
                      @click="deleteFile(file)">
                      <v-icon>{{mdiDelete}}</v-icon>
                    </v-btn>
                    </div>
                  </v-img>  
              </v-container>
            </v-carousel-item>
          </v-carousel>
          </v-row>
          <v-row>
            <br>
            <v-col cols="6">
            <v-file-input
              :label="$t('projects.picture')"
              :prepend-icon="mdiImageArea"
              accept="image/*"
              @change="onChangeImage"
              outlined
              dense
              show-size>
            </v-file-input>
            </v-col>
            <v-col>
            <v-btn
              block
              color="primary"
              @click="uploadFile"
              >upload
            </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
            <v-btn
              block
              color="primary"
              @click="closeDialog"
              >close
            </v-btn>
            </v-col>
          </v-row>
        </v-stepper-content>
        <v-stepper-content step="3">
        <CircularityAddEditCard
          v-bind:circularity="circularitySelected" 
          v-bind:attachId="elementType.uid"
          v-bind:attachedToElementType="true"
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
import { mdiChevronDoubleDown, mdiChevronDoubleUp, mdiImageArea, mdiDelete } from '@mdi/js';
import {
  CREATE_ELEMENT_TYPE,
  UPDATE_ELEMENT_TYPE,
  GET_CURRENT_PROJECT,
  UPLOAD_ELEMENT_TYPE_IMAGE,
  DELETE_ELEMENT_TYPE_IMAGE,
  ElementType,
  ClassificationEntry,
  ProjectFile,
  ElementTypeFileUpload,
  ElementTypeFileDownloadDelete,
  GET_CIRCULARITY_SELECTED
} from '@/store/project';

import ElementTypeAddEditClassificationTable from '@/components/ElementTypeAddEditClassificationTable.vue';
import CircularityAddEditCard from '@/components/CircularityAddEditCard.vue';

export default Vue.extend({
  name: 'ElementTypeAddEditDialog',
  components: { ElementTypeAddEditClassificationTable, CircularityAddEditCard },
  props:{
    elementType: {
      required:true,
      type: Object as () => ElementType,
      default(){ return {} as ElementType }
    },
    dialogEnabled: {
      required: true,
      default: false
    },
    editMode: {
      required: true,
      default: false
    }
  },
  data: () => ({
    //icons 
    mdiChevronDoubleDown,
    mdiChevronDoubleUp,
    mdiImageArea,
    mdiDelete,
    // others
    ifcExpandEnabled: false,
    tradePropertiesExpandEnabled: false,
    codesEnabledExpanded: false,
    valid: false,
    editModeCircularity: false,
    // selected image for upload
    imageToUpload: {} as File,
    step: 1,
  }),
  computed: {
    ...mapGetters({
      currentProject: GET_CURRENT_PROJECT,
      circularitySelected: GET_CIRCULARITY_SELECTED
    }),
  },

  methods: {
    ...mapActions({
      createElementType: CREATE_ELEMENT_TYPE,
      updateElementType: UPDATE_ELEMENT_TYPE,
      uploadElementTypeImage: UPLOAD_ELEMENT_TYPE_IMAGE,
      deleteElementTypeImage: DELETE_ELEMENT_TYPE_IMAGE
    }),
    setClassifications(classifications: ClassificationEntry[]) {
      this.elementType.classificationEntries = classifications;
      this.codesEnabledExpanded = false;
    },
    close() {
      this.$emit('addEditElementTypeDialogClosed');
    },
    submit() {
      if (this.editMode) this.modify();
      else this.create();
    },
    closeDialog() {
      this.$emit('addEditElementTypeDialogClosed');
      this.step = 1;
    },
    async create() {
      let newElementType = await this.createElementType({
        ...this.elementType,
        projectId: this.currentProject.id,
      });

      // copy received UID and move to step 2
      if(newElementType) {
        this.elementType.uid = newElementType.uid;
        this.step = 2;
      }
      else this.closeDialog();
    },
    async modify() {
      setTimeout(async () => {
        // TO DO - update files
        delete this.elementType.files;
        let isOkay = await this.updateElementType(this.elementType);
        if(isOkay) this.step = 2;
        else this.closeDialog();
      });
    },
    onChangeImage(file: File) {
      if (!!file) {
        this.imageToUpload = file;
      }
    },
    async uploadFile() {
      await this.uploadElementTypeImage({
        projectId: this.currentProject.id,
        elementTypeUid: this.elementType.uid,
        file: this.imageToUpload,
        title: this.elementType.name + "-" + Date.now().toString(),
        description: undefined,
        documentAuthor: undefined,
        documentDate: undefined,
      } as ElementTypeFileUpload);
    },
    async deleteFile(document: ProjectFile) {
      await this.deleteElementTypeImage({
        projectId: this.currentProject.id,
        elementTypeUid: this.elementType.uid,
        document: document
      } as ElementTypeFileDownloadDelete)
    }
  },
  watch: {
    circularitySelected(newValue, oldValue) {
      if (newValue) this.editModeCircularity = true;
      else this.editModeCircularity = false;
    },
    elementType: {
      deep: true,
      handler(newValue, oldValue) {
        for (const key in newValue) {
          if (typeof newValue[key] === 'string' && newValue[key] === '')
            (this.elementType as any)[key] = null;
        }
        if (this.editMode === false) this.step = 1;
      },
    },
  },
});

</script>