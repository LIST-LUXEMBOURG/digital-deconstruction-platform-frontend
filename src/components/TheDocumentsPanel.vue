<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
  <v-container fluid>
  <v-card outlined min-height="600px">
    <v-row align="center" class="mx-5 my-5">
      <b>Location </b>
      <v-breadcrumbs v-if="locationBreadcrumbs.length > 0" density="compact" :items="locationBreadcrumbs" divider=" - "></v-breadcrumbs>
      <v-breadcrumbs v-else density="compact" :items="noneLocationBreadCrumb" divider=" - "></v-breadcrumbs>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"

        @click="displayUpsertDocumentDialog = true"
        :disabled="!canUploadProjectDocument()">
        <v-icon>{{ icons.mdiPlus }}</v-icon>
      </v-btn>
    </v-row>
    <v-row class="mx-3">
      <v-col cols="3">
        <v-treeview
          :items="formatedProjectLocations"
          item-children="subdivisions"
          item-key="id"
          hoverable
          rounded
          transition
        >
          <!-- Icons -->
          <template v-slot:prepend="{ item }">
            <v-icon color="primary">
              {{ icons[item.type] }}
            </v-icon>
          </template>
          <!-- Location name -->
          <template v-slot:label="{ item }">
            <div @click.stop="selectLocation(item)" style="cursor: pointer">
              {{ item.name }} {{ filesNumberForLocation(item) }}
            </div>
          </template>
        </v-treeview>
      </v-col>
      <v-col cols="9">
        <v-toolbar flat>
          <v-toolbar-title>Documents at current location</v-toolbar-title>
        </v-toolbar>
        <span v-if="isEmpty(selectedLocationFiles)">
          no documents here
        </span>
        <v-data-table
          v-else
          :headers="documentsHeaders"
          :items="selectedLocationFiles"
          calculate-widths
          sort-by="uploadedAt"
          dense
          :value="[]"
        >
          <template v-slot:[`item.title`]="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <div v-bind="attrs" v-on="on" class="pre-wrapped elipsed">
                  {{ item.title }}
                </div>
              </template>
              <span class="pre-wrapped">
                {{ item.title }}
              </span>
            </v-tooltip>
          </template>
          <template v-slot:[`item.description`]="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <div v-bind="attrs" v-on="on" class="pre-wrapped elipsed">
                  {{ item.description }}
                </div>
              </template>
              <span class="pre-wrapped">
                {{ item.description }}
              </span>
            </v-tooltip>
          </template>
          <template v-slot:[`item.documentDate`]="{ item }">
            {{ getFormatedDocumentDate(item.documentDate) }}
          </template>
          <template v-slot:[`item.uploadedAt`]="{ item }">
            {{ getFormatedDocumentDate(item.uploadedAt) }}
          </template>
          <template v-slot:[`item.size`]="{ item }">
            <span>{{ formatBytes(item.size) }}</span>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-menu
              v-model="contextMenuDisplayed"
              :position-x="x"
              :position-y="y"
              absolute
              offset-y
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-if="item.type !== 'project'"
                  icon
                  color="primary"
                  v-bind="attrs"
                  v-on="on"
                  @click="showContextMenu($event, item)"
                >
                  <v-icon>
                    {{ mdiDotsVertical }}
                  </v-icon>
                </v-btn>
              </template>
              <DocumentOptionMenu
                :displayUpsertDocumentDialog="
                  () => (displayUpsertDocumentDialog = true)
                "
                :downloadProjectDocument="downloadProjectDocument"
                :displayDeleteDocumentDialog="
                  () => (displayDeleteDocumentDialog = true)
                "
                :canUpdateProjectDocument="canUpdateProjectDocument"
                :canDownloadProjectDocument="canDownloadProjectDocument"
                :canDeleteProjectDocument="canDeleteProjectDocument"
              ></DocumentOptionMenu>
            </v-menu>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-dialog v-model="displayUpsertDocumentDialog" max-width="40%">
      <DocumentAddEditCard
        :currentLocation="selectedLocation"
        :siteAndLocation="locationBreadcrumbs"
        :closeUpsertDocumentForm="closeUpsertDocumentForm"
        :currentDocument="selectedDocument"
      ></DocumentAddEditCard>
    </v-dialog>
    <v-dialog v-model="displayDeleteDocumentDialog" max-width="25%">
      <DocumentDeleteCard
        :locations="locationBreadcrumbs"
        :currentDocument="selectedDocument"
        :hideDeleteDocumentDialog="hideDeleteDocumentDialog"
      ></DocumentDeleteCard>
    </v-dialog>
  </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { GET_CURRENT_USER, GET_FILTERED_USERS } from '@/store/users';
import DocumentAddEditCard from '@/components/DocumentAddEditCard.vue';
import DocumentDeleteCard from '@/components/DocumentDeleteCard.vue';
import DocumentOptionMenu from '@/components/DocumentOptionMenu.vue';
import {
  GET_CURRENT_PROJECT,
  GET_CURRENT_PROJECT_LOCATIONS,
  Location as ProjectLocation,
  FETCH_LOCATIONS_FROM_CURRENT_PROJECT,
  LIST_PROJECT_FILES,
  GET_CURRENT_PROJECT_FILES,
  ProjectFile,
  DOWNLOAD_PROJECT_FILE,
  GET_CURRENT_PROJECT_PARTICIPANTS,
  FETCH_PARTICIPANTS_LIST_FROM_CURRENT_PROJECT,
} from '@/store/project';
import { mapGetters, mapActions } from 'vuex';
import {
  mdiDecagram,
  mdiMapMarker,
  mdiHomeVariant,
  mdiOfficeBuilding,
  mdiFloorPlan,
  mdiDotsVertical,
  mdiPlus
} from '@mdi/js';
import { isNil, isEmpty, clone, reverse, find, filter } from 'lodash-es';
import format from 'date-fns/format';
import { User } from '@/plugins/httpClient/users';
import { FETCH_MULTIPLE_ACDB, GET_ACDB } from '@/store/acdb';

export default Vue.extend({
  name: "TheDocumentsPanel",
  components: {
    DocumentAddEditCard,
    DocumentDeleteCard,
    DocumentOptionMenu,
  },
  data() {
    return {
      isEmpty,
      format,
      formatedProjectLocations: [] as ProjectLocation[],
      mdiDotsVertical,
      icons: {
        project: mdiDecagram,
        site: mdiMapMarker,
        building: mdiHomeVariant,
        storey: mdiOfficeBuilding,
        space: mdiFloorPlan,
        mdiPlus
      } as any,
      documentsHeaders: [
        {
          text: 'Title',
          value: 'title',
          width: '20%',
          sortable: false,
        },
        {
          text: 'File name',
          value: 'originalName',
          width: '40%',
          sortable: false,
        },
        {
          text: 'Author',
          value: 'documentAuthor',
          width: '10%',
          sortable: false,
        },
        {
          text: 'Upload date',
          value: 'uploadedAt',
          sortable: false,
          sort: function(a: string, b: string) {
            return a < b;
          },
        },
        {
          text: 'Size',
          value: 'size',
          width: '10%',
          sortable: false,
        },
        {
          text: '',
          value: 'actions',
          width: '10%',
          sortable: false,
        },
      ],
      selectedLocationFiles: [] as ProjectFile[],
      displayUpsertDocumentDialog: false,
      selectedLocation: {} as ProjectLocation,
      locationBreadcrumbs: [] as any[],
      contextMenuDisplayed: false,
      x: (null as unknown) as number,
      y: (null as unknown) as number,
      selectedDocument: {} as ProjectFile,
      displayDeleteDocumentDialog: false,
      noneLocationBreadCrumb: [{text:"none"}]
    };
  },
  async created() {
    await this.fetchLocationsForProject(this.currentProject.id);
    await this.fetchFilesForProject(this.currentProject.id);
    await this.fetchProjectParticipants(this.currentProject.id);
    await this.fetchMultipleAcdb([
      {
        accessType: 'read',
        resourceName: 'projectDocument',
      },
      {
        accessType: 'create',
        resourceName: 'projectDocument',
      },
      {
        accessType: 'update',
        resourceName: 'projectDocument',
      },
      {
        accessType: 'delete',
        resourceName: 'projectDocument',
      },
      {
        accessType: 'read',
        resourceName: 'ownProjectDocument',
      },
      {
        accessType: 'create',
        resourceName: 'ownProjectDocument',
      },
      {
        accessType: 'update',
        resourceName: 'ownProjectDocument',
      },
      {
        accessType: 'delete',
        resourceName: 'ownProjectDocument',
      },
      {
        accessType: 'read',
        resourceName: 'participatingProjectDocument',
      },
      {
        accessType: 'create',
        resourceName: 'participatingProjectDocument',
      },
      {
        accessType: 'update',
        resourceName: 'participatingProjectDocument',
      },
      {
        accessType: 'delete',
        resourceName: 'participatingProjectDocument',
      },
    ]);
  },
  methods: {
    ...mapActions({
      fetchLocationsForProject: FETCH_LOCATIONS_FROM_CURRENT_PROJECT,
      fetchFilesForProject: LIST_PROJECT_FILES,
      downloadFile: DOWNLOAD_PROJECT_FILE,
      fetchMultipleAcdb: FETCH_MULTIPLE_ACDB,
      fetchProjectParticipants: FETCH_PARTICIPANTS_LIST_FROM_CURRENT_PROJECT,
    }),
    selectLocation(location: ProjectLocation) {
      this.selectedLocation = clone(location);
    },
    getLocationsBreadcrumbs(location: ProjectLocation) {
      if (
        location.id === null &&
        location.name === this.currentProject.shortName
      )
        return [];
      const breadcrumbs = [
        {
          text: location.name,
          disabled: true,
        },
      ];

      if (!!location.parentLocationId) {
        let currentLocation = location;
        let parentLocationId = this.findLocationInTree(
          currentLocation.parentLocationId,
        );

        while (!isEmpty(parentLocationId)) {
          breadcrumbs.push({
            text: parentLocationId?.name || '?',
            disabled: true,
          });
          if (parentLocationId?.parentLocationId !== null) {
            parentLocationId = this.findLocationInTree(
              parentLocationId?.parentLocationId,
            );
          } else parentLocationId = null;
        }
      }

      return reverse(breadcrumbs);
    },
    getparentLocationIdName(location: ProjectLocation): string {
      const foundLocation = this.findLocationInTree(location.parentLocationId);
      if (!!foundLocation && !!foundLocation.name) return foundLocation.name;

      return '';
    },
    findLocationInTree(
      id: number | undefined,
      startLocation?: ProjectLocation,
    ): ProjectLocation | null {
      if (id === undefined) return null;

      let location = this.formatedProjectLocations[0];
      if (!!startLocation) {
        location = startLocation;
      }

      if (location.id === id) {
        return location;
      } else if (location.subdivisions != null) {
        let i;
        let result = null;
        for (i = 0; result == null && i < location.subdivisions.length; i++) {
          result = this.findLocationInTree(id, location.subdivisions[i]);
          if (result !== null) {
            return result;
          }
        }
      }
      return null;
    },
    closeUpsertDocumentForm() {
      this.displayUpsertDocumentDialog = false;
      this.selectedDocument = {} as ProjectFile;
    },
    filesNumberForLocation(location: ProjectLocation): string {
      const filesNumber = filter(
        this.currentProjectFiles,
        ({ locationId }) => location.id === locationId,
      );

      if (filesNumber.length > 0) return ` [${filesNumber.length}]`;

      return '';
    },
    getUser(userId: number): User {
      return find(this.allUsers, user => user.id === userId);
    },
    getUserLogin(userId: number): string {
      const user = this.getUser(userId);
      if (!isNil(user)) return user.login;
      return '?';
    },
    getUserInfo(userId: number): string {
      const user = this.getUser(userId);

      if (!isNil(user)) {
        if (!!user.email)
          return `${user.firstName} ${user.name} <${user.email}>`;

        return `${user.firstName} ${user.name}`;
      }

      return '?';
    },

    formatBytes(a: number, b = 2, k = 1000) {
      let d = Math.floor(Math.log(a) / Math.log(k));
      return 0 == a
        ? '0 Bytes'
        : parseFloat((a / Math.pow(k, d)).toFixed(Math.max(0, b))) +
            ' ' +
            ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][d];
    },
    showContextMenu(event: MouseEvent, currentDocument: any) {
      event.preventDefault();
      this.selectedDocument = currentDocument;
      this.contextMenuDisplayed = false;
      this.x = event.clientX;
      this.y = event.clientY;
      this.$nextTick(() => {
        this.contextMenuDisplayed = true;
      });
    },
    hideDeleteDocumentDialog() {
      this.displayDeleteDocumentDialog = false;
    },
    downloadProjectDocument() {
      this.downloadFile({
        projectId: this.currentProject.id,
        fileId: this.selectedDocument?.id,
        fileName: this.selectedDocument?.originalName,
      });
    },
    canUploadProjectDocument() {
      // if owner
      if (this.currentProject.owner.id === this.getCurrentUser.id)
        return (
          this.getAcdb('create', 'ownProjectDocument').hasAccess
        );
      // if participant
      else {
        // check if the user is a participant in the current project
        let participant = this.getProjectParticipants.find((user:any) => user.userId === this.getCurrentUser.id);
        if (participant) return (
          this.getAcdb('create', 'participatingProjectDocument').hasAccess
        );
      }
      // if everything else (admin included)
      return this.getAcdb('create', 'projectDocument').hasAccess;

    },
    canUpdateProjectDocument() {
      // if owner
      if (this.currentProject.owner.id === this.getCurrentUser.id)
        return (
          this.getAcdb('update', 'ownProjectDocument').hasAccess
        );
      // if participant
      else {
        // check if the user is a participant in the current project
        let participant = this.getProjectParticipants.find((user:any) => user.userId === this.getCurrentUser.id);
        if (participant) return (
          this.getAcdb('update', 'participatingProjectDocument').hasAccess
        );
      }
      // if everything else (admin included)
      return this.getAcdb('update', 'projectDocument').hasAccess;

    },
    canDownloadProjectDocument() {
      // if owner
      if (this.currentProject.owner.id === this.getCurrentUser.id)
        return (
          this.getAcdb('read', 'ownProjectDocument').hasAccess
        );
      // if participant
      else {
        // check if the user is a participant in the current project
        let participant = this.getProjectParticipants.find((user:any) => user.userId === this.getCurrentUser.id);
        if (participant) return (
          this.getAcdb('read', 'participatingProjectDocument').hasAccess
        );
      }
      // if everything else (admin included)
      return this.getAcdb('read', 'projectDocument').hasAccess;

    },
    canDeleteProjectDocument() {
      // if owner
      if (this.currentProject.owner.id === this.getCurrentUser.id)
        return (
          this.getAcdb('delete', 'ownProjectDocument').hasAccess
        );
      // if participant
      else {
        // check if the user is a participant in the current project
        let participant = this.getProjectParticipants.find((user:any) => user.userId === this.getCurrentUser.id);
        if (participant) return (
          this.getAcdb('delete', 'participatingProjectDocument').hasAccess
        );
      }
      // if everything else (admin included)
      return this.getAcdb('delete', 'projectDocument').hasAccess;

    },
    getFormatedDocumentDate(date: Date) {
      if (date) return new Date(date).toLocaleDateString();
    },
    findFilesOnTree_Recursive(currentLocation: ProjectLocation) {
      let filesToShow = filter(
          this.currentProjectFiles,
          ({ locationId }) => locationId === currentLocation.id,
      );
      currentLocation.subdivisions?.forEach(subLocation => {
        filesToShow.push(...this.findFilesOnTree_Recursive(subLocation));
      });
      return filesToShow;
    }
  },
  computed: {
    ...mapGetters({
      getCurrentUser: GET_CURRENT_USER,
      currentProject: GET_CURRENT_PROJECT,
      currentProjectLocations: GET_CURRENT_PROJECT_LOCATIONS,
      currentProjectFiles: GET_CURRENT_PROJECT_FILES,
      allUsers: GET_FILTERED_USERS,
      getProjectParticipants: GET_CURRENT_PROJECT_PARTICIPANTS,
      getAcdb: GET_ACDB,
    }),
  },
  watch: {
    currentProjectLocations: {
      deep: true,
      handler: function(newVal, oldVal) {
        this.formatedProjectLocations = [
          {
            name: this.currentProject.shortName,
            type: 'project',
            subdivisions: newVal,
            id: null,
          },
        ];
      },
    },
    selectedLocation: {
      deep: true,
      immediate: true,
      handler: function(newVal, oldVal) {
        if (!isNil(this.selectedLocation) && !isEmpty(this.selectedLocation))
          this.locationBreadcrumbs = clone(
            this.getLocationsBreadcrumbs(this.selectedLocation),
          );
        
        let newFilesToShow:ProjectFile[] = [];
        // special case for project root node (files at this position have no LocationId)
        if (this.selectedLocation.type === "project") {
          let projectLevelFiles = filter(
            this.currentProjectFiles,
            ({ locationId }) => locationId === undefined,
          );
          newFilesToShow = projectLevelFiles;
        }
        newFilesToShow.push(...this.findFilesOnTree_Recursive(this.selectedLocation));
        this.selectedLocationFiles = newFilesToShow;
      },
    },
    currentProjectFiles: {
      deep: true,
      immediate: true,
      handler: function(newValue, oldValue) {
        if (this.selectedLocation.id) {
          this.selectedLocationFiles = filter(
            newValue,
            ({ locationId }) => locationId === this.selectedLocation.id,
          );
        }
        else this.selectedLocationFiles = newValue;

      },
    },
  },
});
</script>

<style>
</style>

<style>
.pre-wrapped {
  white-space: pre-wrap;
}
.elipsed {
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
</style>