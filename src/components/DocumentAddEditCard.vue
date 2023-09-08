<!-- 
/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */
-->

<template>
  <v-card>
    <v-card-title>
      {{ getTitle }}
    </v-card-title>
    <v-card-subtitle>
      {{ currentProject.fullName }}
    </v-card-subtitle>
    <v-form ref="form" v-model="valid">
      <v-card-text>
        <v-text-field
          v-if="canChooseDocumentAttribute('title')"
          :label="$t('projects.document.title')"
          v-model="projectDocumentPayload.title"
          :rules="rules.required"
          counter="255"
        ></v-text-field>
        <v-textarea
          v-if="canChooseDocumentAttribute('description')"
          :label="$t('projects.document.description')"
          v-model="projectDocumentPayload.description"
          rows="4"
        ></v-textarea>
        <v-text-field
          v-if="canChooseDocumentAttribute('documentAuthor')"
          :label="$t('projects.document.author')"
          v-model="projectDocumentPayload.documentAuthor"
        ></v-text-field>
        <v-menu
          v-if="canChooseDocumentAttribute('documentDate')"
          ref="documentDatePicker"
          v-model="documentDatePicker"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="projectDocumentPayload.documentDate"
              :label="$t('projects.document.date')"
              readonly
              v-bind="attrs"
              v-on="on"
              clearable
              @click:clear="projectDocumentPayload.documentDate = null"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="projectDocumentPayload.documentDate"
            :active-picker.sync="activePicker"
          ></v-date-picker>
        </v-menu>
        <v-file-input
          v-if="canChooseDocumentAttribute('files')"
          v-model="file"
          :label="$t('projects.document.fileLabel')"
          :rules="rules.required"
        >
          <template v-slot:selection>
            <v-card max-width="75%">
              <v-card-text class="d-flex flex-column">
                <span class="text-truncate"
                  >{{ $t('projects.document.fileName') }} {{ file.name }}</span
                >
                <span class="text-truncate"
                  >{{ $t('projects.document.fileSize') }}
                  {{ formatBytes(file.size) }}</span
                >
                <span class="text-truncate"
                  >{{ $t('projects.document.fileUploadedAt') }}
                  {{ new Date() }}</span
                >
              </v-card-text>
            </v-card>
          </template>
        </v-file-input>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="primary"
          :disabled="!valid || !hasPayloadChanged"
          @click="submitDocument()"
        >
          {{ getActionName }}
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="closeUpsertDocumentForm()">
          {{ $t('cancel') }}
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import {
  GET_CURRENT_PROJECT,
  UPLOAD_PROJECT_FILE,
  ProjectFile,
  GET_PROJECT_FILE,
  UPDATE_PROJECT_FILE,
  GET_CURRENT_PROJECT_PARTICIPANTS,
} from '@/store/project';
import { clone, drop, isNil, cloneDeep, find, uniq, concat } from 'lodash-es';
import { GET_CURRENT_USER } from '@/store/users';
import i18n from '@/i18n';
import format from 'date-fns/format';
import { isSameDay } from 'date-fns';
import { GET_ACDB } from '@/store/acdb';

const BASE_SIZE = 2 ** 10;
const MAX_FILE_SIZE_KB = BASE_SIZE * 1000; // in Kb
const MAX_FILE_SIZE_MB = BASE_SIZE >> 10;

export default Vue.extend({
  name:"DocumentAddEditCard",
  props: {
    currentLocation: {
      type: Object,
      required: true,
    },
    siteAndLocation: {
      type: Array,
      required: true,
    },
    closeUpsertDocumentForm: {
      type: Function,
      required: true,
    },
    currentDocument: {
      type: Object,
      required: false,
    },
  },
  data: () => {
    return {
      projectDocumentPayload: {} as ProjectFile,
      file: undefined as File | undefined,
      originalFile: undefined as File | undefined,
      documentDatePicker: false,
      activePicker: null,
      valid: false,
      rules: {
        required: [(v: any) => !!v || i18n.t('mandatoryField')],
      },
    };
  },
  methods: {
    ...mapActions({
      updateProjectDocument: UPDATE_PROJECT_FILE,
      uploadProjectDocument: UPLOAD_PROJECT_FILE,
      getProjectFile: GET_PROJECT_FILE,
    }),
    formatBytes(a: number, b = 2, k = 1000) {
      let d = Math.floor(Math.log(a) / Math.log(k));
      return 0 == a
        ? '0 Bytes'
        : parseFloat((a / Math.pow(k, d)).toFixed(Math.max(0, b))) +
            ' ' +
            ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][d];
    },
    async submitDocument() {
      if (!!this.projectDocumentPayload.fileUid) {
        await (this as any).updateDocument();
      } else {
        await (this as any).uploadDocument();
      }
      this.closeUpsertDocumentForm();
    },
    async updateDocument() {
      await (this as any).updateProjectDocument({
        projectId: this.currentProject.id,
        file: this.file,
        metadata: {
          ...this.projectDocumentPayload,
          locationId: this.currentLocation.id,
        },
      });
    },
    async uploadDocument() {
      await (this as any).uploadProjectDocument({
        projectId: this.currentProject.id,
        file: this.file,
        metadata: {
          ...this.projectDocumentPayload,
          locationId: this.currentLocation.id,
        },
      });
    },
    hasFileChanged(): boolean {
      const isSameSize = this.file?.size == this.originalFile?.size;
      const isSameName = this.file?.name == this.originalFile?.name;
      const isSameType = this.file?.type == this.originalFile?.type;
      return !(isSameSize && isSameName && isSameType);
    },
    canUploadProjectDocumentAttribute() {
      const currentUser = this.currentUser;
      const currentParticipant = find(
        this.getProjectParticipants,
        participant => participant.userId === currentUser.id,
      );

      let attributes: string[] = this.getAcdb('create', 'projectDocument')
        .filteringAttributes;

      if (this.currentProject.owner.id === this.currentUser.id) {
        attributes = concat(
          attributes,
          this.getAcdb('create', 'ownProjectDocument').filteringAttributes,
        );
      }

      if (
        currentParticipant !== undefined &&
        currentParticipant.role === 'Contributor'
      ) {
        attributes = concat(
          attributes,
          (this.getAcdb('create', 'participatingProjectDocument')
            .filteringAttributes) as string[],
        );
      }

      return uniq(attributes);
    },
    canUpdateProjectDocumentAttribute() {
      const currentUser = this.currentUser;
      const currentParticipant = find(
        this.getProjectParticipants,
        participant => participant.userId === currentUser.id,
      );

      let attributes: string[] = this.getAcdb('update', 'projectDocument')
        .filteringAttributes;

      if (this.currentProject.owner.id === this.currentUser.id)
        attributes = concat(
          attributes,
          this.getAcdb('update', 'ownProjectDocument').filteringAttributes,
        );

      if (
        currentParticipant !== undefined &&
        currentParticipant.role === 'Contributor'
      )
        attributes = concat(
          attributes,
          this.getAcdb('update', 'participatingProjectDocument')
            .filteringAttributes,
        );

      return uniq(attributes);
    },
    canChooseDocumentAttribute(attribute: string): boolean {
      if (this.isCreationMode)
        return (this as any)
          .canUploadProjectDocumentAttribute()
          .includes(attribute);

      return (this as any)
        .canUpdateProjectDocumentAttribute()
        .includes(attribute);
    },
  },
  computed: {
    ...mapGetters({
      currentUser: GET_CURRENT_USER,
      currentProject: GET_CURRENT_PROJECT,
      getProjectParticipants: GET_CURRENT_PROJECT_PARTICIPANTS,
      getAcdb: GET_ACDB,
    }),
    formatedSiteAndLocations() {
      if (
        !!this.siteAndLocation &&
        !isNil(this.siteAndLocation) &&
        this.siteAndLocation.length > 0
      ) {
        let copiedSiteAndLocations = clone(this.siteAndLocation);
        let formatedString = (copiedSiteAndLocations[0] as any).text + '\n';
        copiedSiteAndLocations = drop(copiedSiteAndLocations);

        copiedSiteAndLocations.forEach((item: any) => {
          formatedString = formatedString + item.text + ' / ';
        });

        if (copiedSiteAndLocations.length > 0)
          return formatedString.substring(0, formatedString.length - 2);

        return formatedString;
      }
    },
    isCreationMode(): Boolean {
      return !this.projectDocumentPayload.fileUid;
    },
    getTitle() {
      if (this.isCreationMode)
        return i18n.t('projects.document.uploadDocument');
      return i18n.t('projects.document.updateDocument');
    },
    getActionName() {
      if (this.isCreationMode)
        return i18n.t('projects.document.uploadDocument');
      return i18n.t('save');
    },
    hasPayloadChanged(): boolean {
      if (!this.isCreationMode) {
        const isSameTitle =
          this.projectDocumentPayload.title === this.currentDocument.title;
        const isSameDescription =
          this.projectDocumentPayload.description ===
          this.currentDocument.description;
        const isSameAuthor =
          this.projectDocumentPayload.documentAuthor ===
          this.currentDocument.documentAuthor;
        const isSameDate = isSameDay(
          new Date(this.projectDocumentPayload.documentDate as string),
          new Date(this.currentDocument.documentDate),
        );

        return (
          !(isSameTitle && isSameDescription && isSameAuthor && isSameDate) ||
          (this as any).hasFileChanged()
        );
      }

      return true;
    },
  },
  watch: {
    currentDocument: {
      deep: true,
      immediate: true,
      handler: async function() {
        this.file = undefined;
        this.projectDocumentPayload = cloneDeep(this.currentDocument);

        if (!!this.projectDocumentPayload.documentDate)
          this.projectDocumentPayload.documentDate = format(
            new Date(this.projectDocumentPayload.documentDate),
            'yyyy-MM-dd',
          );

        if (!!this.projectDocumentPayload.fileUid) {
          this.file = new File(
            [
              await (this as any).getProjectFile({
                projectId: this.currentProject.id,
                fileId: this.projectDocumentPayload.id,
              }),
            ],
            this.projectDocumentPayload.originalName || 'document',
          );
          this.originalFile = new File([], this.file.name, {type: this.file.type });
        }
      },
    },
  },
});
</script>