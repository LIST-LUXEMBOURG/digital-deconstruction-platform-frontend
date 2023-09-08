<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
  <v-container fluid>
    <v-row class="align-center mb-2 ml-2 mr-2">
      <v-btn
        fab
        color="secondary"
        class="mb-2"
        :hidden="!inventoryElementsSelected"
        :loading="isSelecting || isUploading"
        :disabled="!canUpsertInventory()"
        @click="handleFileImport">
        <v-icon>{{ mdiUpload }}</v-icon>
      </v-btn>
      <v-file-input
        v-show="false"
        ref="uploader"
        v-model="file"
        accept="application/json"
        show-size
        outlined
        dense
        prepend-icon=""
        :disabled="file != null"
        :rules="max25Mb"
        :loading="isUploading"
        :append-icon="isUploaded ? mdiCheck : null"
        @change="onFileChange"
      />
      <v-spacer></v-spacer>
      <v-btn
        fab
        color="primary"
        class="mr-2 mb-2"
        :disabled="inventoryElementsSelected"
        @click="selectInventoryElements">
        <v-icon>{{ mdiCubeOutline }}</v-icon>
      </v-btn>
      <v-btn
        fab
        color="primary"
        class="mr-2 mb-2"
        :disabled="inventoryElementTypesSelected"
        @click="selectInventoryElementTypes">
        <v-icon>{{ mdiSubtitlesOutline }}</v-icon>
      </v-btn>
      <v-btn
        fab
        color="primary"
        class="mr-2 mb-2"
        :disabled="inventoryMaterialTypesSelected"
        @click="selectInventoryMaterialTypes">
        <v-icon>{{ mdiWall }}</v-icon>
      </v-btn>
    </v-row>
    <v-row class="mb-4" v-if="elementsFiltered.length == 0 && !inventoryFilterActive">
        No inventory information!<br />
        You can upload a JSON file here.<br />
        Make sure you repect the platform's specifications.<br />
        <v-spacer></v-spacer>
        ...or add elements here
    </v-row>
    <v-row v-show="inventoryElementsSelected" dense>
      <v-col v-if="canReadInventory()">
        <ElementTable/>
      </v-col>
    </v-row>
    <v-row v-show="inventoryElementTypesSelected" dense>
      <v-col>
        <ElementTypeTable/>
      </v-col>
    </v-row>
    <v-row v-show="inventoryMaterialTypesSelected" dense>
      <v-col>
        <MaterialTypeTable/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import { mdiUpload, mdiCheck, mdiPlus, mdiAtomVariant, mdiCubeOutline, mdiWall, mdiSubtitlesOutline } from '@mdi/js';
import ElementTable from '@/components/ElementTable.vue';
import ElementTypeTable from '@/components/ElementTypeTable.vue';
import MaterialTypeTable from '@/components/MaterialTypeTable.vue';
import ElementAddEditDialog from '@/components/ElementAddEditDialog.vue';
import ElementTypeAddEditDialog from '@/components/ElementTypeAddEditDialog.vue';
import MaterialTypeAddEditDialog from '@/components/MaterialTypeAddEditDialog.vue';
import { FETCH_MULTIPLE_ACDB, GET_ACDB } from '@/store/acdb';
import { GET_CURRENT_USER } from '@/store/users';
import {
  UPLOAD_INVENTORY_FILE,
  GET_CURRENT_PROJECT,
  FETCH_PARTICIPANTS_LIST_FROM_CURRENT_PROJECT,
  GET_CURRENT_PROJECT_PARTICIPANTS,
  GET_INVENTORY_FILTER_ACTIVE,
  GET_ELEMENTS_FILTERED
} from '@/store/project';

export default Vue.extend({
  name:"TheInventoryPanel",
  components: {
    ElementTable,
    ElementTypeTable,
    MaterialTypeTable,
    ElementAddEditDialog,
    ElementTypeAddEditDialog,
    MaterialTypeAddEditDialog
  },
  data() {
    return {
      file: null,
      mdiUpload,
      mdiCheck,
      mdiPlus,
      mdiAtomVariant,
      mdiWall,
      mdiCubeOutline,
      mdiSubtitlesOutline,
      isSelecting: false,
      isUploading: false,
      isUploaded: false,
      max25Mb: [
        v =>
          !v ||
          v.size < 32 * 1000 /* Mb */ * 1000 /* bytes */ ||
          'Invalid file size',
      ],
      addElementDialogEnabled: false,
      addElementTypeDialogEnabled: false,
      addMaterialTypeDialogEnabled: false,
      inventoryElementsSelected: true,
      inventoryElementTypesSelected: false,
      inventoryMaterialTypesSelected: false
    };
  },
  methods: {
    ...mapActions({
      fetchMultipleAcdb: FETCH_MULTIPLE_ACDB,
      uploadInventoryFile: UPLOAD_INVENTORY_FILE,
      fetchProjectParticipants: FETCH_PARTICIPANTS_LIST_FROM_CURRENT_PROJECT,
    }),
    selectInventoryElements() {
      this.inventoryElementsSelected = true;
      this.inventoryElementTypesSelected = false;
      this.inventoryMaterialTypesSelected = false;
    },
    selectInventoryElementTypes() {
      this.inventoryElementsSelected = false;
      this.inventoryElementTypesSelected = true;
      this.inventoryMaterialTypesSelected = false;
    },
    selectInventoryMaterialTypes() {
      this.inventoryElementsSelected = false;
      this.inventoryElementTypesSelected = false;
      this.inventoryMaterialTypesSelected = true;
    },
    toggleAddChoice() {
      if (this.inventoryElementsSelected) this.toggleAddElement();
      else if (this.inventoryElementTypesSelected) this.toggleAddElementType();
      else if (this.inventoryMaterialTypesSelected) this.toggleAddMaterialType();

    },
    toggleAddElement() {
      this.addElementDialogEnabled = !this.addElementDialogEnabled;
    },
    toggleAddElementType() {
      this.addElementTypeDialogEnabled = !this.addElementTypeDialogEnabled;
    },
    
    async handleFileImport() {
      this.file = null;
      this.isUploaded = false;

      // small wrapper to ensure things are running sequentially
      const self = this;
      async function wait() {
        self.isSelecting = true;
        return;
      }
      await wait();

      // Restore the button state to normal when closing the FilePicker
      window.addEventListener(
        'focus',
        () => {
          this.isSelecting = false;
        },
        { once: true },
      );
      window.removeEventListener('focus', () => {});

      // A small trick to trigger the file-input component pop-up
      this.$refs.uploader.$refs.input.click();
    },
    async onFileChange(file) {
      if (!file || file.size > 32 * 1000 * 1000) return;

      const self = this;
      async function wait() {
        self.isUploading = true;
        self.isUploaded = false;
        return;
      }
      await wait();

      await this.uploadInventoryFile({
        file: this.file,
        projectId: this.currentProject.id,
      });

      this.isUploading = false;
      this.isUploaded = true;
    },

    // ACDBs
    canReadInventory() {
      if (
        !!this.currentProject &&
        this.currentProject.owner === this.currentUser.id
      )
        return this.getAcdb('read', 'ownProjectInventory').hasAccess;

      return this.getAcdb('read', 'inventory').hasAccess;
    },

    canUpsertInventory() {
      const currentParticipant = this.projectParticipants.find(
        p => p.userId === this.currentUser.id,
      );
      if (
        !!this.currentProject &&
        this.currentProject.owner === this.currentUser.id
      )
        return (
          this.getAcdb('create', 'ownProjectInventory').hasAccess &&
          this.getAcdb('update', 'ownProjectInventory').hasAccess
        );

      if (!!currentParticipant && currentParticipant.role === 'Contributor')
        return (
          this.getAcdb('create', 'participatingProjectInventory').hasAccess &&
          this.getAcdb('update', 'participatingProjectInventory').hasAccess
        );

      return (
        this.getAcdb('create', 'inventory').hasAccess &&
        this.getAcdb('update', 'inventory').hasAccess
      );
    },

    canAddInventoryElement() {
      return this.canUpsertInventory() /*  && this.inventoryElements.length > 0 */;
    },
  },

  computed: {
    ...mapGetters({
      currentProject: GET_CURRENT_PROJECT,
      currentUser: GET_CURRENT_USER,
      getAcdb: GET_ACDB,
      elementsFiltered: GET_ELEMENTS_FILTERED,
      projectParticipants: GET_CURRENT_PROJECT_PARTICIPANTS,
      inventoryFilterActive: GET_INVENTORY_FILTER_ACTIVE
    }),
  },
  watch: {
    elementsFiltered(newValue, oldValue) {
      if (newValue.length > 0) this.isUploaded = true;
      else this.isUploaded = false;
    },
  },
  async created() {
    await this.fetchProjectParticipants(this.currentProject.id);
    await this.fetchMultipleAcdb([
      {
        accessType: 'read',
        resourceName: 'inventory',
      },
      {
        accessType: 'read',
        resourceName: 'ownProjectInventory',
      },

      {
        accessType: 'create',
        resourceName: 'inventory',
      },

      {
        accessType: 'create',
        resourceName: 'ownProjectInventory',
      },

      {
        accessType: 'update',
        resourceName: 'inventory',
      },
      {
        accessType: 'update',
        resourceName: 'ownProjectInventory',
      },
      {
        accessType: 'create',
        resourceName: 'participatingProjectInventory',
      },

      {
        accessType: 'update',
        resourceName: 'participatingProjectInventory',
      },
    ]);
  },
});
</script>