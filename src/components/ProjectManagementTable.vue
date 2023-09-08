<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
  <v-data-table
    :loading="loadingProjects"
    :headers="headers"
    :items="getAllProjects"
  >
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon v-show="canUpdateProject(item)" @click="onOpenProject(item)" color="primary">
        {{ mdiPencil }}
      </v-icon>
      <v-icon v-show="canDeleteProject" @click="openDeleteProjectDialog(item)" color="primary">
        {{ mdiDelete }}
      </v-icon>
    </template>
    <template v-slot:top>
      <v-dialog v-model="dialogDelete" persistent scrollable width="30%">
        <ProjectDeleteDialog
          :selectedProject="selectedProject"
          :closeDeleteProjectDialog="closeDeleteProjectDialog"
          :closeDeleteProjectDialogOnConfirm="closeDeleteProjectDialogOnConfirm"
        ></ProjectDeleteDialog>
      </v-dialog>
      <v-dialog v-model="dialogUpdate" scrollable persistent> </v-dialog>
    </template>
  </v-data-table>
</template>

<script lang="ts">

import Vue from 'vue';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { mdiPencil, mdiDelete } from '@mdi/js';
import { FETCH_MULTIPLE_ACDB, GET_ACDB } from '@/store/acdb';
import { GET_CURRENT_USER } from '@/store/users';
import {
  FETCH_ONE_PROJECT,
  FETCH_PROJECTS,
  GET_PROJECTS,
  Project,
  SET_CURRENT_PROJECT,
} from '@/store/project';
import ProjectDeleteDialog from './ProjectDeleteDialog.vue';

export default Vue.extend({
  name: "ProjectManagementTable",
  components: {
    ProjectDeleteDialog,
  },
  async mounted() {
    await (this as any).fetchMultipleAcdb([
      {
        accessType: 'update',
        resourceName: 'project',
      },
      {
        accessType: 'delete',
        resourceName: 'project',
      },
    ]);
    await (this as any).loadAllProjects();
  },
  data: () => {
    return {
      loadingProjects: true,
      dialogDelete: false,
      dialogUpdate: false,
      headers: [
        {
          text: 'Name',
          align: 'start',
          sortable: true,
          value: 'shortName',
        },
        {
          text: 'Actions',
          align: 'end',
          value: 'actions',
          sortable: false,
        },
      ],
      mdiPencil,
      mdiDelete,
      selectedProject: {} as Project,
    };
  },
  methods: {
    ...mapActions({
      fetchAllProjects: FETCH_PROJECTS,
      fetchMultipleAcdb: FETCH_MULTIPLE_ACDB,
      fetchProject: FETCH_ONE_PROJECT,
    }),
    ...mapMutations({
      setCurrentProject: SET_CURRENT_PROJECT
    }),
    async loadAllProjects() {
      this.loadingProjects = true;
      await (this as any).fetchAllProjects();
      this.loadingProjects = false;
    },
    openDeleteProjectDialog(selectedProject: Project) {
      Object.assign(this.selectedProject, {}, selectedProject);
      this.$forceUpdate();
      this.dialogDelete = true;
    },
    async onOpenProject(project: Project) {
      await (this as any).setCurrentProject(project);
      this.$router.push({ name: 'Project' });
    },
    closeDeleteProjectDialog() {
      this.dialogDelete = false;
      this.selectedProject = ({} as unknown) as Project;
    },
    closeUpdateProjectDialog() {
      this.dialogUpdate = false;
      this.selectedProject = ({} as unknown) as Project;
    },
    async closeDeleteProjectDialogOnConfirm() {
      (this as any).closeDeleteProjectDialog();
      await (this as any).loadAllProjects();
    },
    async closeUpdateProjectDialogOnSave() {
      (this as any).closeUpdateProjectDialog();
      await (this as any).loadAllProjects();
    },
    canUpdateProject(project: Project) {
      return (
        this.getAcdb('update', 'project').hasAccess ||
        (this.getAcdb('update', 'ownProject').hasAccess &&
          project.owner === this.getCurrentUser.id)
      );
    },
  },
  computed: {
    ...mapGetters({
      getAllProjects: GET_PROJECTS,
      getAcdb: GET_ACDB,
      getCurrentUser: GET_CURRENT_USER,
    }),
    canDeleteProject() {
      return this.getAcdb('delete', 'project').hasAccess;
    },
  },
});

</script>