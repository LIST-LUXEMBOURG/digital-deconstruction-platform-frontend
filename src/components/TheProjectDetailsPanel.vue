<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
  <v-form ref="manageProjectForm" v-model="valid" class="my-5">
    <v-card outlined>
      <v-card-text>
        <v-container fluid>
          <v-row class="mx-auto" justify="space-around">
            <v-col cols="4" sm="12" md="4">
              <v-select
                v-if="canChooseProjectAttribute('owner')"
                v-model="modifiedProjectPayload.owner.id"
                :items="allUsers"
                item-value="id"
                :item-text="formatUserForSelect"
                :label="$t('projects.owner') + '*'"
                :placeholder="formatCurrentUserForProjectOwner()"
                outlined
                dense
                :rules="rules.required"
              ></v-select>
              <v-select
                v-else-if="canDisplayProjectAttribute('owner')"
                v-model="modifiedProjectPayload.owner.id"
                :items="allUsers"
                item-value="id"
                :item-text="formatUserForSelect"
                readonly
                disabled
                :label="$t('projects.owner') + '*'"
                :placeholder="formatCurrentUserForProjectOwner()"
                outlined
                dense
              ></v-select>
              <!-- ShortName -->
              <v-text-field
                v-if="canChooseProjectAttribute('shortName')"
                v-model="modifiedProjectPayload.shortName"
                :label="$t('projects.shortName') + '*'"
                :placeholder="$t('projects.shortName') + '*'"
                outlined
                dense
                :rules="rules.required"
              ></v-text-field>
              <v-text-field
                v-else-if="canDisplayProjectAttribute('shortName')"
                v-model="modifiedProjectPayload.shortName"
                readonly
                disabled
                :label="$t('projects.shortName') + '*'"
                :placeholder="$t('projects.shortName') + '*'"
                outlined
                dense
              ></v-text-field>
              <!-- FullName -->
              <v-text-field
                v-if="canChooseProjectAttribute('fullName')"
                v-model="modifiedProjectPayload.fullName"
                :label="$t('projects.longName') + '*'"
                :placeholder="$t('projects.longName') + '*'"
                outlined
                dense
                :rules="rules.required"
              ></v-text-field>
              <v-text-field
                v-else-if="canDisplayProjectAttribute('fullName')"
                v-model="modifiedProjectPayload.fullName"
                readonly
                disabled
                :label="$t('projects.longName') + '*'"
                :placeholder="$t('projects.longName') + '*'"
                outlined
                dense
              ></v-text-field>
              <!-- Project Type -->
              <v-select
                v-if="canChooseProjectAttribute('projectType')"
                v-model="modifiedProjectPayload.projectType"
                :items="projectTypes"
                :label="$t('projects.typeOfProject') + '*'"
                :placeholder="$t('projects.typeOfProject')"
                outlined
                dense
                :rules="rules.required"
              ></v-select>
              <v-select
                v-else-if="canDisplayProjectAttribute('projectType')"
                v-model="modifiedProjectPayload.projectType"
                :items="projectTypes"
                readonly
                disabled
                :label="$t('projects.typeOfProject') + '*'"
                :placeholder="$t('projects.typeOfProject')"
                outlined
                dense
              ></v-select>
              <!-- Description -->
              <v-textarea
                v-if="canChooseProjectAttribute('description')"
                v-model="modifiedProjectPayload.description"
                :label="$t('projects.description')"
                :placeholder="$t('projects.description')"
                :rules="rules.maxLength"
                rows="2"
                outlined
                dense
                counter
              ></v-textarea>
              <v-textarea
                v-else-if="canDisplayProjectAttribute('description')"
                v-model="modifiedProjectPayload.description"
                :label="$t('projects.description')"
                :placeholder="$t('projects.description')"
                rows="2"
                readonly
                disabled
                outlined
                dense
                counter
              ></v-textarea>
              <!-- Footprint -->
              <v-text-field
                v-if="canChooseProjectAttribute('footprint')"
                v-model.number="modifiedProjectPayload.footprint"
                :label="$t('projects.footprint')"
                :placeholder="$t('projects.footprint')"
                :rules="rules.mustBeNumber"
                suffix="m²"
                outlined
                dense
              ></v-text-field>
              <v-text-field
                v-else-if="canDisplayProjectAttribute('footprint')"
                v-model.number="modifiedProjectPayload.footprint"
                :label="$t('projects.footprint')"
                :placeholder="$t('projects.footprint')"
                :rules="rules.mustBeNumber"
                readonly
                disabled
                suffix="m²"
                outlined
                dense
              ></v-text-field>
              <!-- Descontruction Start -->
              <v-menu
                v-if="canChooseProjectAttribute('deconstructionStart')"
                ref="dismantelementDatePicker"
                v-model="dismantelementDatePicker"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="modifiedProjectPayload.deconstructionStart"
                    :label="$t('projects.startDismantelment')"
                    :prepend-icon="mdiCalendar"
                    outlined
                    dense
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    clearable
                    @click:clear="
                      modifiedProjectPayload.deconstructionStart = null
                    "
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="modifiedProjectPayload.deconstructionStart"
                  :active-picker.sync="activePicker"
                ></v-date-picker>
              </v-menu>
              <v-text-field
                v-else-if="canDisplayProjectAttribute('deconstructionStart')"
                v-model="modifiedProjectPayload.deconstructionStart"
                :label="$t('projects.startDismantelment')"
                :prepend-icon="mdiCalendar"
                outlined
                dense
                readonly
                disabled
              >
              </v-text-field>
              <!-- Contact Info -->
              <v-textarea
                v-if="canChooseProjectAttribute('contactInfo')"
                v-model="modifiedProjectPayload.contactInfo"
                :label="$t('projects.contactInfo')"
                :placeholder="$t('projects.contactInfo')"
                outlined
                rows="2"
                dense
              ></v-textarea>
              <v-textarea
                v-else-if="canDisplayProjectAttribute('contactInfo')"
                v-model="modifiedProjectPayload.contactInfo"
                :label="$t('projects.contactInfo')"
                :placeholder="$t('projects.contactInfo')"
                readonly
                disabled
                outlined
                rows="2"
                dense
              ></v-textarea>
            </v-col>

            <v-col cols="4" sm="12" md="4">
              <!-- Address Line 1 -->
              <v-text-field
                v-if="canChooseProjectAttribute('fullAddress.addressLine1')"
                v-model="modifiedProjectPayload.fullAddress.addressLine1"
                :label="$t('projects.addressLine1')"
                :placeholder="$t('projects.addressLine1')"
                outlined
                dense
              ></v-text-field>
              <v-text-field
                v-else-if="
                  canDisplayProjectAttribute('fullAddress.addressLine1')
                "
                v-model="modifiedProjectPayload.fullAddress.addressLine1"
                :label="$t('projects.addressLine1')"
                :placeholder="$t('projects.addressLine1')"
                readonly
                disabled
                outlined
                dense
              ></v-text-field>
              <!-- Address Line 2 -->
              <v-text-field
                v-if="canChooseProjectAttribute('fullAddress.addressLine2')"
                v-model="modifiedProjectPayload.fullAddress.addressLine2"
                :label="$t('projects.addressLine2')"
                :placeholder="$t('projects.addressLine2')"
                outlined
                dense
              ></v-text-field>
              <v-text-field
                v-else-if="
                  canDisplayProjectAttribute('fullAddress.addressLine2')
                "
                v-model="modifiedProjectPayload.fullAddress.addressLine2"
                :label="$t('projects.addressLine2')"
                :placeholder="$t('projects.addressLine2')"
                readonly
                disabled
                outlined
                dense
              ></v-text-field>
              <!-- City -->
              <v-text-field
                v-if="canChooseProjectAttribute('fullAddress.city')"
                v-model="modifiedProjectPayload.fullAddress.city"
                :label="$t('projects.city')"
                :placeholder="$t('projects.city')"
                outlined
                dense
              ></v-text-field>
              <v-text-field
                v-else-if="canDisplayProjectAttribute('fullAddress.city')"
                v-model="modifiedProjectPayload.fullAddress.city"
                :label="$t('projects.city')"
                :placeholder="$t('projects.city')"
                readonly
                disabled
                outlined
                dense
              ></v-text-field>
              <!-- State or Province -->
              <v-text-field
                v-if="canChooseProjectAttribute('fullAddress.stateOrProvince')"
                v-model="modifiedProjectPayload.fullAddress.stateOrProvince"
                :label="$t('projects.stateOrProvince')"
                :placeholder="$t('projects.stateOrProvince')"
                outlined
                dense
              ></v-text-field>
              <v-text-field
                v-else-if="
                  canDisplayProjectAttribute('fullAddress.stateOrProvince')
                "
                v-model="modifiedProjectPayload.fullAddress.stateOrProvince"
                :label="$t('projects.stateOrProvince')"
                :placeholder="$t('projects.stateOrProvince')"
                readonly
                disabled
                outlined
                dense
              ></v-text-field>
              <!-- Zip or Postal Code -->
              <v-text-field
                v-if="canChooseProjectAttribute('fullAddress.zipOrPostalCode')"
                v-model="modifiedProjectPayload.fullAddress.zipOrPostalCode"
                :label="$t('projects.zipOrPostalCode')"
                :placeholder="$t('projects.zipOrPostalCode')"
                outlined
                dense
              ></v-text-field>
              <v-text-field
                v-else-if="
                  canDisplayProjectAttribute('fullAddress.zipOrPostalCode')
                "
                v-model="modifiedProjectPayload.fullAddress.zipOrPostalCode"
                :label="$t('projects.zipOrPostalCode')"
                :placeholder="$t('projects.zipOrPostalCode')"
                readonly
                disabled
                outlined
                dense
              ></v-text-field>
              <!-- Country -->
              <v-select
                v-if="canChooseProjectAttribute('fullAddress.country')"
                v-model="modifiedProjectPayload.fullAddress.country"
                :items="getCountriesName()"
                :label="$t('projects.country')"
                :placeholder="$t('projects.country')"
                outlined
                dense
              ></v-select>
              <v-select
                v-else-if="canDisplayProjectAttribute('fullAddress.country')"
                v-model="modifiedProjectPayload.fullAddress.country"
                :items="getCountriesName()"
                :label="$t('projects.country')"
                :placeholder="$t('projects.country')"
                readonly
                disabled
                outlined
                dense
              ></v-select>
            </v-col>
            <v-col v-show="!isCreationMode" cols="4" sm="12" md="4">
              <h2> Project Cover</h2> <br>

              <v-img
                class="mb-2 d-flex"
                style="
                  border: 1px solid grey;
                  border-radius: 4px;
                  max-width: 100%;
                  max-height: 100%;
                "
                :src="getProjectPicture()"
                :aspect-ratio="16 / 9"   
              >
                <!-- gradient="#e66465, #9198e5" -->
                <span
                  class="grey--text ml-2 mt-4 text-h4"
                  v-if="
                    !(currentProject.id in projectsPicture) ||
                      projectsPicture[currentProject.id] === null
                  "
                >
                  No picture
                </span>

                <span
                  v-else
                  v-show="canDeleteProjectAttribute('picture')"
                  style="position: absolute; bottom: 8px; right: 8px"
                >
                  <v-btn fab small color="primary" @click="onDelete">
                    <v-icon>{{ mdiDelete }}</v-icon>
                  </v-btn>
                </span>
              </v-img>
              <v-row v-if="
                    !(currentProject.id in projectsPicture) ||
                      projectsPicture[currentProject.id] === null
                  ">
                <v-col>
                  <v-file-input
                    :label="$t('projects.picture')"
                    :prepend-icon="mdiImageArea"
                    :rules="rules.maxSize"
                    :disabled="!canDeleteProject()"
                    accept="image/*"
                    @change="onChangeImage"
                    outlined
                    dense
                    show-size
                  ></v-file-input>
                </v-col>
                <v-col cols="3">
                  <v-btn
                    block
                    color="primary"
                    :disabled="!hasImage || exceedMaxSize"
                    :loading="loading"
                    @click="onUpload"
                    >upload</v-btn
                  >
                </v-col>
              </v-row>
              <v-row v-else>
                <v-col align="right">
                  <v-btn
                    fab
                    :disabled="!canDeleteProject()"
                    color="secondary"
                    @click="deletePicture">
                    <v-icon>{{mdiDelete}}</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-row class="py-4" align="center" justify="center">
          <slot name="cancelBtn"> </slot>
          <v-btn
            :disabled="!valid || !projectHasChanged"
            @click="validate"
            class="mx-3"
            color="primary"
          >
            {{ $t('save') }}
          </v-btn>
          <slot name="nextBtn"></slot>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import CountriesList from 'country-region-data';
import { mdiImageArea, mdiCalendar, mdiDelete } from '@mdi/js';

import i18n from '@/i18n';

import { GET_ACDB, FETCH_MULTIPLE_ACDB } from '@/store/acdb';
import {
  FETCH_FILTERED_USERS,
  GET_CURRENT_USER,
  GET_FILTERED_USERS,
} from '@/store/users';
import {
  ADD_PROJECT,
  FETCH_PROJECTS,
  GET_CURRENT_PROJECT,
  GET_PROJECTS,
  SET_CURRENT_PROJECT,
  UPDATE_PROJECT,
  Project,
  FETCH_PARTICIPANTS_LIST_FROM_CURRENT_PROJECT,
  GET_CURRENT_PROJECT_PARTICIPANTS,
  UPLOAD_PROJECT_PICTURE,
  FETCH_PROJECT_PICTURE,
  GET_PROJECTS_PICTURE,
  DELETE_PROJECT_PICTURE,
} from '@/store/project';

import { isEqual, uniq, find, cloneDeep, isEmpty } from 'lodash';
import { User } from '@/plugins/httpClient/users';

const MAX_LENGTH = 1024;
const BASE_SIZE = 2 ** 10;
const MAX_FILE_SIZE_KB = BASE_SIZE * 1000; // in Kb
const MAX_FILE_SIZE_MB = BASE_SIZE >> 10;

export default Vue.extend({
  name: "TheProjectDetailsPanel",
  async created() {
    await this.fetchMultipleAcdb([
      {
        accessType: 'create',
        resourceName: 'project',
      },
      {
        accessType: 'read',
        resourceName: 'project',
      },
      {
        accessType: 'update',
        resourceName: 'project',
      },
      {
        accessType: 'delete',
        resourceName: 'project',
      },
      {
        accessType: 'create',
        resourceName: 'ownProject',
      },
      {
        accessType: 'read',
        resourceName: 'ownProject',
      },
      {
        accessType: 'update',
        resourceName: 'ownProject',
      },
      {
        accessType: 'delete',
        resourceName: 'ownProject',
      },
      {
        accessType: 'read',
        resourceName: 'participatingProject',
      },
      {
        accessType: 'update',
        resourceName: 'participatingProject',
      },
    ]);
    await (this as any).fetchUsers({});

    if (!this.isCreationMode) {
      this.modifiedProjectPayload = cloneDeep(this.currentProject);

      // Get and display the project picture if exists
      if (!this.projectsPicture[this.currentProject.id])
        await this.fetchProjectPicture(this.currentProject.id);
    } else if (!(this as any).canChooseProjectAttribute('owner')) {
//      this.modifiedProjectPayload.owner = this.getCurrentUser.id;
      this.modifiedProjectPayload.owner = this.getCurrentUser;
    }
  },
  async mounted() {
    // It's a simple function to check what type of action is done on the page
    // performance.nagivation.types:
    // TYPE_BACK_FORWARD: ?;
    // TYPE_NAVIGATE: ?;
    // TYPE_RESERVED: ?;
    // TYPE_RELOAD: 1;
    if (
      !this.isCreationMode &&
      window.performance &&
      performance.navigation.type === 1
    ) {
      await this.fetchProjectPicture(this.currentProject.id);
    }
  },

  data() {
    return {
      loading: false,
      valid: false,
      projectHasChanged: false,
      rules: {
        required: [(v: any) => !!v || i18n.t('mandatoryField')],
        maxLength: [
          (v: string) =>
            v.length <= MAX_LENGTH ||
            i18n.t('maxLengthField', { value: MAX_LENGTH }),
        ],
        mustBeNumber: [
          (v: any) => {
            return (
              isEmpty(v) ||
              typeof v === 'number' ||
              /^\d.*$/.test(v) ||
              i18n.t('numberField')
            );
          },
        ],
        maxSize: [
          (value: { size: number }) =>
            !value ||
            value.size < MAX_FILE_SIZE_KB ||
            i18n.t('maxSizeField', { value: MAX_FILE_SIZE_MB }),
        ],
      },
      hasImage: false,
      fileRecord: null as File | null,
      modifiedProjectPayload: {
        id: null,
        shortName: null,
        fullName: null,
        description: '',
        owner: { id: null },
        projectType: null,
        footprint: null,
        deconstructionStart: null,
        contactInfo: null,
        fullAddress: {
          addressLine1: null,
          addressLine2: null,
          city: null,
          stateOrProvince: null,
          zipOrPostalCode: null,
          country: null,
        },
      },
      projectTypes: ['deconstruction', 'renovation'],
      dismantelementDatePicker: false,
      activePicker: null,
      mdiCalendar,
      mdiImageArea,
      mdiDelete,
    };
  },
  methods: {
    ...mapActions({
      fetchUsers: FETCH_FILTERED_USERS,
      createProject: ADD_PROJECT,
      updateProject: UPDATE_PROJECT,
      fetchAllProjects: FETCH_PROJECTS,
      fetchMultipleAcdb: FETCH_MULTIPLE_ACDB,
      fetchProjectParticipants: FETCH_PARTICIPANTS_LIST_FROM_CURRENT_PROJECT,
      uploadProjectPicture: UPLOAD_PROJECT_PICTURE,
      deleteProjectPicture: DELETE_PROJECT_PICTURE,
      fetchProjectPicture: FETCH_PROJECT_PICTURE,
    }),
    ...mapMutations({
      setCurrentProject: SET_CURRENT_PROJECT,
    }),
    canDisplayProjectAttribute(attribute: string): boolean {
      let attributesList: string[] = [];
      attributesList = attributesList.concat(
        this.getAcdb('read', 'project').filteringAttributes,
      );

      if (
        this.currentProject.owner === this.getCurrentUser.id ||
        this.modifiedProjectPayload.owner === this.getCurrentUser.id
      ) {
        attributesList = attributesList.concat(
          this.getAcdb('read', 'ownProject').filteringAttributes,
        );
      }

      if (this.isCurrentUserParticipatingInProject()) {
        attributesList = attributesList.concat(
          this.getAcdb('read', 'participatingProject').filteringAttributes,
        );
      }
      return uniq(attributesList).includes(attribute);
    },
    canChooseProjectAttribute(attribute: string): boolean {
      if (this.isCreationMode) {
        return this.getAcdb('create', 'project').filteringAttributes?.includes(
          attribute,
        );
      } else {
        let attributesList: string[] = [];
        attributesList = attributesList.concat(
          this.getAcdb('update', 'project').filteringAttributes,
        );

        if (this.currentProject.owner === this.getCurrentUser.id) {
          attributesList = attributesList.concat(
            this.getAcdb('update', 'ownProject').filteringAttributes,
          );
        }

        return uniq(attributesList).includes(attribute);
      }
    },
    getProjectPicture() {
      if(this.projectsPicture[this.currentProject.id])
      return this.projectsPicture[this.currentProject.id].src
    },
    deletePicture() {
      this.deleteProjectPicture(this.currentProject.id);
    },
    canDeleteProject(project: Project) {
      const fn = this.getAcdb;
      let deleteProject = fn('update', 'project').hasAccess;
      return deleteProject;
    },
    canDeleteProjectAttribute(attribute: string): boolean {
      let attributesList: string[] = [];
      attributesList = attributesList.concat(
        this.getAcdb('delete', 'project').filteringAttributes,
      );

      if (this.currentProject.owner === this.getCurrentUser.id) {
        attributesList = attributesList.concat(
          this.getAcdb('delete', 'ownProject').filteringAttributes,
        );
      }
      return uniq(attributesList).includes(attribute);
    },
    formatCurrentUserForProjectOwner() {
      const currentUser = this.getCurrentUser;
      if ('email' in currentUser && currentUser.email !== null)
        return `${currentUser.firstName} ${currentUser.name} <${currentUser.email}>`;
      return `${currentUser.firstName} ${currentUser.name} <${currentUser.email}>`;
    },
    formatUserForSelect(user: any) {
      if ('email' in user && user.email !== null)
        return `${user.firstName} ${user.name} <${user.email}>`;
      return `${user.firstName} ${user.name}`;
    },
    getCountriesName() {
      return CountriesList.map(country => country.countryName);
    },
    async validate() {
      try {
        if (this.isCreationMode)
          await (this as any).createProject(this.modifiedProjectPayload);
        else {
          await (this as any).updateProject(this.modifiedProjectPayload);
        }
        await (this as any).fetchAllProjects();
        this.setCurrentProject(
          this.allProjects.find(
            (project: Project) => project.id === this.currentProject.id,
          ),
        );
      } catch (e) {
        // ignore fetch all projects when project shortname already exists!
      } finally {
        this.projectHasChanged = false;
      }
    },
    replaceEmptyString(someObj: any) {
      const res = JSON.parse(
        JSON.stringify(someObj, (_key: string, value: any) =>
          value === '' || value === undefined ? null : value,
        ),
      );

      return res;
    },
    isCurrentUserParticipatingInProject() {
      return !!find(
        this.currentProjectParticipants,
        (participant: any) => participant.userId === this.getCurrentUser.id,
      );
    },
    onChangeImage(file: File) {
      this.hasImage = !!file;
      if (this.hasImage) {
        this.fileRecord = file;
      } else {
        this.fileRecord = null;
      }
    },
    async onUpload() {
      this.loading = true;
      /*const ok = */ await (this as any).uploadProjectPicture({
        projectId: this.currentProject.id,
        file: this.fileRecord,
        metadata: {
          title: 'cover',
          description: undefined,
          locationId: undefined,
          documentAuthor: undefined,
          documentDate: undefined,
        },
      });
      this.loading = false;
    },

    async onDelete() {
      this.loading = true;
      await this.deleteProjectPicture(this.currentProject.id);
      this.loading = false;
    },
  },
  computed: {
    ...mapGetters({
      getAcdb: GET_ACDB,
      getCurrentUser: GET_CURRENT_USER,
      getAllUsers: GET_FILTERED_USERS,
      currentProject: GET_CURRENT_PROJECT,
      allProjects: GET_PROJECTS,
      currentProjectParticipants: GET_CURRENT_PROJECT_PARTICIPANTS,
      projectsPicture: GET_PROJECTS_PICTURE,
    }),
    isCreationMode() {
      if (
        this.currentProject === null ||
        this.currentProject?.id === null ||
        this.currentProject?.id === undefined
      )
        return true;
      else return false;
    },
    exceedMaxSize() {
      if (this.fileRecord && this.fileRecord.size >= MAX_FILE_SIZE_KB)
        return true;
      return false;
    },
    allUsers(): User[] {
      const users: User[] = [...this.getAllUsers];
      users.sort((alice: User, bob: User) => {
        return (
          alice.firstName.localeCompare(bob.firstName) ||
          alice.name.localeCompare(bob.name)
        );
      });
      return users;
    },
  },
  watch: {
    dismantelementDatePicker(val) {
      val && setTimeout(() => ((this.activePicker as any) = 'YEAR'));
    },
    modifiedProjectPayload: {
      deep: true,
      handler: function(newVal, oldVal) {
        if (this.isCreationMode) this.projectHasChanged = true;

        this.projectHasChanged =
          !isEqual(
            this.replaceEmptyString(this.currentProject.fullAddress),
            this.replaceEmptyString(newVal.fullAddress),
          ) ||
          !isEqual(
            this.replaceEmptyString(this.currentProject),
            this.replaceEmptyString(newVal),
          );
        (this.$refs.manageProjectForm as any).validate();
      },
    },
    currentProject: {
      deep: true,
      handler: function(val, oldVal) {
        this.modifiedProjectPayload = cloneDeep(val);
      },
    },
  },
});
</script>