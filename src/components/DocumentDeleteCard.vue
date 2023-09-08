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
      {{$t('projects.document.deleteDocument')}}
    </v-card-title>
    <v-card-text>
      <v-container>
        <h2>
          <v-row>
            <v-col cols="6">
              {{$t('projects.project')}}
            </v-col>
            <v-col cols="6">
              {{ currentProject.fullName }}
            </v-col>
          </v-row>
        </h2>
        <span>
            <v-row>
                <v-col cols="6">{{$t('projects.document.site')}}</v-col>
                <v-col cols="6">{{ site }}</v-col>
            </v-row>
        </span>
        <span>
            <v-row>
                <v-col cols="6">{{$t('projects.document.location')}}</v-col>
                <v-col cols="6">{{ formatedLocations }}</v-col>
            </v-row>
        </span>
        <v-row>
            <v-divider></v-divider>
        </v-row>
        <span>
            <v-row>
                <v-col cols="6">{{$t('projects.document.title')}}</v-col>
                <v-col cols="6">{{ currentDocument.title }}</v-col>
            </v-row>
        </span>
        <span>
            <v-row>
                <v-col cols="6">{{$t('projects.document.description')}}</v-col>
                <v-col cols="6">{{ currentDocument.description }}</v-col>
            </v-row>
        </span>
        <span>
            <v-row>
                <v-col cols="6">{{$t('projects.document.author')}}</v-col>
                <v-col cols="6">{{ currentDocument.documentAuthor }}</v-col>
            </v-row>
        </span>
        <span>
            <v-row>
                <v-col cols="6">{{$t('projects.document.date')}}</v-col>
                <v-col cols="6">{{ currentDocument.documentDate }}</v-col>
            </v-row>
        </span>
        <v-row>
            <v-divider></v-divider>
        </v-row>
        <span>
            <v-row>
                <v-col cols="6">{{$t('projects.document.fileName')}}</v-col>
                <v-col cols="6">{{ currentDocument.originalName }}</v-col>
            </v-row>
        </span>
        <span>
            <v-row>
                <v-col cols="6">{{$t('projects.document.fileSize')}}</v-col>
                <v-col cols="6">{{ formatBytes(currentDocument.size) }}</v-col>
            </v-row>
        </span>
        <span>
            <v-row>
                <v-col cols="6">{{$t('projects.document.fileUploadedAt')}}</v-col>
                <v-col cols="6">{{ currentDocument.uploadedAt }}</v-col>
            </v-row>
        </span>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-btn 
        color="error"
        @click="confirmDocumentDeletion()"
    >{{$t('delete')}}</v-btn>
      <v-spacer></v-spacer>
      <v-btn 
        color="primary"
        @click="hideDeleteDocumentDialog()"
    >{{$t('cancel')}}</v-btn>
    </v-card-actions>
  </v-card>
</template>
    
<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
import { GET_CURRENT_PROJECT, DELETE_PROJECT_FILE } from '@/store/project';
import { clone, drop, find } from 'lodash-es';
import { GET_FILTERED_USERS } from '@/store/users';
import { User } from '@/plugins/httpClient/users';
export default Vue.extend({
  name: "DocumentDeleteCard",
  props: {
    locations: {
      type: Array,
      required: true,
    },
    currentDocument: {
      type: Object,
      required: true,
    },
    hideDeleteDocumentDialog: {
        type: Function,
        required: true
    }
  },
  data: () => {
    return {};
  },
  methods: {
    ...mapActions({
      deleteDocument: DELETE_PROJECT_FILE
    }),
    formatBytes(a: number, b = 2, k = 1000) {
      let d = Math.floor(Math.log(a) / Math.log(k));
      return 0 == a
        ? '0 Bytes'
        : parseFloat((a / Math.pow(k, d)).toFixed(Math.max(0, b))) +
            ' ' +
            ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][d];
    },
    async confirmDocumentDeletion() {
      await (this as any).deleteDocument({projectId: this.currentProject.id, documentId: this.currentDocument.id});
      this.hideDeleteDocumentDialog();
    },
  },
  computed: {
    ...mapGetters({
      currentProject: GET_CURRENT_PROJECT,
      allUsers: GET_FILTERED_USERS,
    }),
    site() {
      if (this.locations.length > 0) return (this.locations[0] as any).text;
      return '';
    },
    formatedLocations() {
      if (this.locations.length > 1) {
        let copiedSiteAndLocations = clone(this.locations);
        let formatedString = '';
        copiedSiteAndLocations = drop(copiedSiteAndLocations);

        copiedSiteAndLocations.forEach((item: any) => {
          formatedString = formatedString + item.text + ' / ';
        });

        if (copiedSiteAndLocations.length > 0)
          return formatedString.substring(0, formatedString.length - 2);

        return formatedString;
      }
      return '';
    },
  },
});
</script>