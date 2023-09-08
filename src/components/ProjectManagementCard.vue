<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
  <v-container fluid>
    <v-data-iterator
      :items="projects"
      item-key="name"
      :items-per-page.sync="itemsPerPage"
      :page.sync="page"
      hide-default-footer
    >
      <template v-slot:default="{ items }">
        <v-row>
          <v-col
            v-for="item in items"
            :key="item.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card>
              <v-img
                @click.stop="onOpenProject(item)"
                :src="getProjectPicture(item)"
                :intederminate="loading"
                :aspect-ratio="16 / 9"
                lazy-src="@/assets/home-grey_426x240.png"
              >
                <v-card-title style="color: white;">
                  {{ item.shortName }}
                </v-card-title>
                <v-chip
                  small
                  style="position: absolute; bottom: 4px; right: 4px"
                  >{{ item.projectType }}</v-chip
                >
              </v-img>
              <v-card-actions>
                <v-row align="center">
                  <v-col cols="auto" class="mr-auto">
                    <span>{{ item.fullName }}</span>
                    <br />
                    <span>{{
                      new Date(item.createdAt).toLocaleDateString()
                    }}</span>
                  </v-col>
                  <v-col cols="auto">
                    <v-icon
                      v-show="canDeleteProject(item)"
                      @click="openDeleteProjectDialog(item)"
                      color="primary"
                    >
                      {{ deleteIcon }}
                    </v-icon>
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </template>

      <template v-if="projects.length > 0" v-slot:footer>
        <v-row class="mt-2 ml-1" align="center" justify="center">
          <span class="grey--text">{{$t('itemsPerPage')}}</span>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                dark
                small
                fab
                color="primary"
                class="ml-2"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>{{ mdiChevronDoubleDown }}</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(number, index) in itemsPerPageArray"
                :key="index"
                @click="updateItemsPerPage(number)"
              >
                <v-list-item-title>{{ number }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-spacer></v-spacer>

          <span
            class="mr-4
            grey--text"
          >
            {{$t('page')}} {{ page }} of {{ numberOfPages }}
          </span>
          <v-btn
            fab
            dark
            small
            color="primary"
            class="mr-1"
            @click="formerPage"
          >
            <v-icon>{{ chevronLeftIcon }}</v-icon>
          </v-btn>
          <v-btn
            fab
            dark
            small
            color="primary"
            class="ml-1 mr-3"
            @click="nextPage"
          >
            <v-icon>{{ chevronRightIcon }}</v-icon>
          </v-btn>
        </v-row>
      </template>

      <template> </template>
    </v-data-iterator>
    <v-dialog v-model="dialogDelete" persistent scrollable width="30%">
      <ProjectDeleteDialog
        :selectedProject="selectedProject"
        :closeDeleteProjectDialog="closeDeleteProjectDialog"
        :closeDeleteProjectDialogOnConfirm="closeDeleteProjectDialogOnConfirm"
      ></ProjectDeleteDialog>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" scoped>

import Vue from 'vue';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { mdiPencil, mdiDelete, mdiChevronLeft, mdiChevronRight, mdiChevronDoubleDown } from '@mdi/js';
import { GET_CURRENT_USER, CurrentUser } from '@/store/users';
import {
  FETCH_PROJECTS,
  GET_PROJECTS,
  Project,
  SET_CURRENT_PROJECT,
  FETCH_PROJECT_PICTURE,
  GET_PROJECTS_PICTURE,
} from '@/store/project';
import {
  FETCH_MULTIPLE_ACDB,
  GET_ACDB,
  AccessControlRule,
  GetAccessControl,
} from '@/store/acdb';
import ProjectDeleteDialog from '@/components/ProjectDeleteDialog.vue';

interface VueComponent {
  // data
  loading: boolean;
  // methods
  fetchProjects: () => void;
  fetchMultipleAcdb: (rules: AccessControlRule[]) => void;
  loadProjects: () => void;
  canUpdateProject: (project: Project) => boolean;
  canDeleteProject: (project: Project) => boolean;
  // computed
  projects: Project[];
  currentUser: CurrentUser;
  getAcdb: GetAccessControl;
}

export default Vue.extend({
  name: "ProjectManagementCard",
  components: {
    ProjectDeleteDialog,
  },
  data() {
    return {
      loading: true,
      editIcon: mdiPencil,
      deleteIcon: mdiDelete,
      chevronLeftIcon: mdiChevronLeft,
      chevronRightIcon: mdiChevronRight,
      mdiChevronDoubleDown,

      itemsPerPage: 8,
      itemsPerPageArray: [4, 8, 12],
      page: 1,

      dialogDelete: false,
      selectedProject: {},
    };
  },
  methods: {
    ...mapActions({
      fetchProjects: FETCH_PROJECTS,
      fetchProjectPicture: FETCH_PROJECT_PICTURE,
      fetchMultipleAcdb: FETCH_MULTIPLE_ACDB,
    }),

    ...mapMutations({
      setCurrentProject: SET_CURRENT_PROJECT,
    }),

    async loadProjects() {
      await this.fetchProjects();
    },

    // events
    async onOpenProject(project: Project) {
      await this.setCurrentProject(project);
      this.$router.push({ name: 'Project' });
    },

    getProjectPicture(item: any) {
      if(this.projectsPicture[item.id])
      return this.projectsPicture[item.id].src
    },

    // pagination events
    nextPage(): void {
      if (this.page + 1 <= this.numberOfPages) this.page += 1;
    },
    formerPage(): void {
      if (this.page - 1 >= 1) this.page -= 1;
    },
    updateItemsPerPage(number: number): void {
      this.itemsPerPage = number;
    },

    // ACDB actions
    canUpdateProject(project: Project) {
      const fn: GetAccessControl = this.getAcdb;
      let updateProject = fn('update', 'project').hasAccess;
      let updateOwnProject = fn('update', 'ownProject').hasAccess;
      return (
        updateProject ||
        (updateOwnProject && project.owner === this.currentUser.id)
      );
    },
    canDeleteProject(project: Project) {
      const fn: GetAccessControl = this.getAcdb;
      let deleteProject = fn('update', 'project').hasAccess;
      return deleteProject;
    },

    openDeleteProjectDialog(selectedProject: Project) {
      Object.assign(this.selectedProject, {}, selectedProject);
      this.$forceUpdate();
      this.dialogDelete = true;
    },

    closeDeleteProjectDialog() {
      this.dialogDelete = false;
      this.selectedProject = ({} as unknown) as Project;
    },

    async closeDeleteProjectDialogOnConfirm() {
      (this as any).closeDeleteProjectDialog();
      await (this as any).loadProjects();
    },
  },
  computed: {
    ...mapGetters({
      projects: GET_PROJECTS,
      getAcdb: GET_ACDB,
      currentUser: GET_CURRENT_USER,
      projectsPicture: GET_PROJECTS_PICTURE,
    }),
    numberOfPages(): number {
      return Math.ceil(this.projects.length / this.itemsPerPage);
    },
  },
  async created() {
    await this.fetchMultipleAcdb([
      {
        accessType: 'update',
        resourceName: 'project',
      },
      {
        accessType: 'delete',
        resourceName: 'project',
      },
    ]);
    this.loading = true;
    await this.loadProjects();
    await Promise.all(
      this.projects.map((project: any) => this.fetchProjectPicture(project.id)),
    );
    this.loading = false;
  },
});

</script>